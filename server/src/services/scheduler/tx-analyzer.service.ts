import { Address } from "@liftedinit/many-js";
import { ManyError } from "@liftedinit/many-js/dist/message/error";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as cbor from "cbor";
import { Repository } from "typeorm";
import { Neighborhood } from "../../database/entities/neighborhood.entity";
import { TransactionDetails } from "../../database/entities/transaction-details.entity";
import { Transaction } from "../../database/entities/transaction.entity";
import { bufferToHex } from "../../utils/convert";

async function _getMethodAnalyzer(
  method: string,
): Promise<null | MethodAnalyzer<any, any>> {
  switch (method) {
    case "ledger.send":
      return new (await import("./tx/ledger.send.js")).LedgerSendAnalyzer();
    default:
      return null;
  }
}

function _getAllAddressesOf(v: any): Address[] {
  if (typeof v == "string") {
    try {
      return [Address.fromString(v)];
    } catch (_) {}
  }

  if (typeof v != "object" || v === null) {
    return [];
  }
  if (Array.isArray(v)) {
    return v.reduce((acc, item) => [...acc, ..._getAllAddressesOf(item)], []);
  } else if (v instanceof Address) {
    return [v];
  }

  return Object.getOwnPropertyNames(v).reduce((acc, key) => {
    return [...acc, ..._getAllAddressesOf(v[key])];
  }, []);
}

export abstract class MethodAnalyzer<ArgumentT, ResponseT> {
  abstract analyzeRequest(sender: Address, data: Buffer): Promise<ArgumentT>;

  abstract analyzeResponse(data: Buffer): Promise<ResponseT>;

  // Return addresses related to a transaction. This will be compounded in a
  // set of address string representations, but this method should only return
  // Addresses without worrying about distinctiveness.
  // By default, will just navigate a JS object at runtime and check if any
  // properties are addresses or address strings.
  async addresses(
    request: ArgumentT,
    response: ResponseT | null,
    error: ManyError | null,
  ): Promise<Address[]> {
    return [
      ..._getAllAddressesOf(request),
      ..._getAllAddressesOf(response),
      ..._getAllAddressesOf(error),
    ];
  }
}

export const tags = {
  10000: (value: Uint8Array) => new Address(Buffer.from(value)),
};

export function parseAddress(content: any, optional: true): Address | undefined;
export function parseAddress(content: any, optional?: false): Address;
export function parseAddress(
  content: any,
  optional = false,
): Address | undefined {
  if (content instanceof Address) {
    return content;
  } else if (typeof content == "string") {
    return Address.fromString(content);
  } else if (Buffer.isBuffer(content)) {
    return new Address(content);
  } else if (content === undefined || content === null) {
    if (optional) {
      return undefined;
    }
  }

  throw new Error(
    `Invalid content type for address: ${JSON.stringify(content)}`,
  );
}

export function parseMemo(content: any, optional: true): string[] | undefined;
export function parseMemo(content: any, optional?: false): string[];
export function parseMemo(
  content: any,
  optional = false,
): string[] | undefined {
  if (typeof content == "string") {
    return [content];
  } else if (Array.isArray(content)) {
    return content.filter((x) => typeof x == "string");
  } else if (optional) {
    return undefined;
  }

  throw new Error(`Invalid content type for memo: ${JSON.stringify(content)}`);
}

export function parseBuffer(content: any, optional: true): Buffer | undefined;
export function parseBuffer(content: any, optional?: false): Buffer;
export function parseBuffer(
  content: any,
  optional = false,
): Buffer | undefined {
  if (Buffer.isBuffer(content)) {
    return content;
  } else if (optional) {
    return undefined;
  }

  throw new Error(
    `Invalid content type for buffer: ${JSON.stringify(content)}.`,
  );
}

function parseError(maybeResult: any) {
  if (!(maybeResult instanceof Map)) {
    throw "Payload is not a map.";
  }

  const code = maybeResult.get(0);
  if (typeof code !== "number") {
    throw "Code is not a number.";
  }

  const message = maybeResult.get(1);
  if (typeof message !== "string") {
    throw "Message is not a string.";
  }

  const fields: Record<string, string> = {};
  if (maybeResult.has(2)) {
    const fs = maybeResult.get(2);
    if (fs) {
      if (!(fs instanceof Map)) {
        throw "Fields is not a map.";
      }

      for (const [k, v] of fs.entries()) {
        // Worst case we get "[object Object]" as keys, but a spec following
        // blockchain should be fine here.
        fields[k.toString()] = v.toString();
      }
    }
  }

  return { code, fields, message };
}

@Injectable()
export class TxAnalyzerService {
  private readonly logger = new Logger(TxAnalyzerService.name);

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionDetails)
    private txDetailsRepository: Repository<TransactionDetails>,
  ) {}

  async missingTransactionDetailsForNeighborhood(
    neighborhood: Neighborhood,
    limit = 1000,
  ): Promise<number[]> {
    const query = await this.transactionRepository
      .createQueryBuilder("tx")
      .select("tx.id")
      .distinct(true)
      .leftJoin("tx.block", "block")
      .where({ block: { neighborhood: neighborhood } })
      .andWhere(
        () =>
          `tx.id NOT IN (${this.txDetailsRepository
            .createQueryBuilder("td")
            .select(`"transactionId"`)
            .getQuery()})`,
      )
      .limit(limit);

    this.logger.debug(query.getQuery());
    return (await query.getMany()).map((x) => x.id);
  }

  async analyzeTransactionImpl(
    tx: Transaction,
  ): Promise<TransactionDetails | null> {
    if (!tx.request) {
      // If the request is null, something went wrong already. Don't bother
      // parsing.
      return null;
    }

    const details = new TransactionDetails();
    details.transaction = tx;
    details.hash = tx.hash;

    // Is it an error or a return value.
    try {
      // Open up the request.
      const coseRequest = await cbor.decodeFirst(tx.request, { tags });
      const request = (await cbor.decodeFirst(coseRequest[2], { tags })).value;

      const coseResponse = await cbor.decodeFirst(tx.response, { tags });
      const response = (await cbor.decodeFirst(coseResponse[2], { tags }))
        .value;

      const from = parseAddress(request.get(1), true);
      const to = parseAddress(request.get(2), true);
      const method = request.get(3).toString();
      const maybeAnalyzer = await _getMethodAnalyzer(method);
      const data = parseBuffer(request.get(4), true);
      const timestamp = new Date(Number(request.get(5)));
      const attrs = request.get(8);

      details.method = method;
      details.timestamp = timestamp;
      if (attrs && attrs.length > 0) {
        details.attributes = attrs;
      }

      if (maybeAnalyzer) {
        const argument = await maybeAnalyzer.analyzeRequest(from, data);
        let result: any = null;
        let error: any | null = null;

        const maybeResult = response.get(4);
        if (Buffer.isBuffer(maybeResult)) {
          result = await maybeAnalyzer.analyzeResponse(maybeResult);
        } else if (typeof maybeResult == "object") {
          error = parseError(maybeResult);
        }
        const addresses = [
          ...new Set(
            [
              ...(await maybeAnalyzer?.addresses(argument, result, error)),
              from,
              to,
            ]
              .filter((x) => !!x)
              .map((x) => x.toString()),
          ),
        ];

        details.argument = argument;
        details.result = result;
        details.error = error;

        // Get all addresses for the message, append from and to, remove
        // undefined, map to address strings, remove duplicates, make into
        // array.
        details.addresses = addresses;
      }
    } catch (e) {
      // If an error happens during parsing, we don't want to reparse the
      // request/response, and we might want to investigate.
      // We can easily delete all rows that have this field after we fix the
      // bug.
      details.parseError = e.toString();
    }

    return details;
  }

  async analyzeTransaction(
    tx: Transaction,
  ): Promise<TransactionDetails | null> {
    try {
      return await this.analyzeTransactionImpl(tx);
    } catch (e) {
      throw new Error(
        `${e}\nContext: id = ${tx.id}, hash = "${bufferToHex(tx.hash)}"`,
      );
    }
  }
}
