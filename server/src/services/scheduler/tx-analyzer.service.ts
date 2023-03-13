import { Address } from "@liftedinit/many-js";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as cbor from "cbor";
import { Repository } from "typeorm";
import { Neighborhood } from "../../database/entities/neighborhood.entity";
import { TransactionDetails } from "../../database/entities/transaction-details.entity";
import { Transaction } from "../../database/entities/transaction.entity";
import { LedgerSendAnalyzer } from "./tx/ledger.send";

const methodRegistry = {
  "ledger.send": new LedgerSendAnalyzer(),
};

export interface MethodAnalyzer<ArgumentT, ResponseT> {
  analyzeRequest(sender: Address, data: Buffer): Promise<ArgumentT>;

  analyzeResponse(data: Buffer): Promise<ResponseT>;
}

export const tags = {
  10000: (value: Uint8Array) => new Address(Buffer.from(value)),
};

export function parseAddress(
  content: any,
  optional = false,
): Address | undefined {
  if (typeof content == "string") {
    return Address.fromString(content);
  } else if (Buffer.isBuffer(content)) {
    return new Address(content);
  } else if (content === undefined || content === null) {
    if (optional) {
      return undefined;
    }
  }

  throw new Error(`Invalid content type: ${JSON.stringify(content)}`);
}

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

  throw new Error(`Invalid content type: ${JSON.stringify(content)}`);
}

function _parseBuffer(content: any, optional = false): Buffer | undefined {
  if (Buffer.isBuffer(content)) {
    return content;
  } else if (optional) {
    return undefined;
  }

  throw new Error(`Invalid content type: ${JSON.stringify(content)}`);
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
    if (!(fs instanceof Map)) {
      throw "Fields is not a map.";
    }

    for (const [k, v] of maybeResult.entries()) {
      // Worst case we get "[object Object]" as keys, but a spec following
      // blockchain should be fine here.
      fields[k.toString()] = v.toString();
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

    return (await query.getMany()).map((x) => x.id);
  }

  async analyzeTransaction(tx: Transaction): Promise<TransactionDetails> {
    const details = new TransactionDetails();
    details.transaction = tx;
    details.hash = tx.hash;

    let method = "";

    // Open up the request.
    if (tx.request) {
      const cose = await cbor.decodeFirst(tx.request, { tags });
      const payload = await cbor.decodeFirst(cose[2], { tags });
      const content = payload.value;

      const from = parseAddress(content.get(1), true) || Address.anonymous();
      const to = parseAddress(content.get(2), true);
      method = content.get(3).toString();
      const data = _parseBuffer(content.get(4), true);
      const timestamp = new Date(Number(content.get(5)));
      //const attrs = content.get(8) || undefined;

      details.method = method;
      details.timestamp = timestamp;

      const maybeAnalyzer = methodRegistry[method];
      if (maybeAnalyzer) {
        details.argument = await maybeAnalyzer.analyzeRequest(from, data);
      } else {
        details.argument = {};
      }
    }

    if (method && tx.response) {
      const cose = await cbor.decodeFirst(tx.response, { tags });
      const payload = await cbor.decodeFirst(cose[2], { tags });
      const content = payload.value;

      // Is it an error or a return value.
      try {
        const maybeResult = content.get(4);
        if (Buffer.isBuffer(maybeResult)) {
          const maybeAnalyzer = methodRegistry[method];
          if (maybeAnalyzer) {
            details.result = await maybeAnalyzer.analyzeResponse(maybeResult);
          } else {
            details.result = {};
          }
        } else if (typeof maybeResult == "object") {
          details.error = parseError(maybeResult);
        }
      } catch (e) {
        details.parseError = e.toString();
      }
    }

    // Dynamically load the method.
    return details;
  }
}
