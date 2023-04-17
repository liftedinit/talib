import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as cbor from "cbor";
import { Repository } from "typeorm";
import { Neighborhood } from "../../database/entities/neighborhood.entity";
import { TransactionDetails } from "../../database/entities/transaction-details.entity";
import { Transaction } from "../../database/entities/transaction.entity";
import {
  parseAddress,
  parseBuffer,
  parseError,
} from "../../utils/cbor-parsers";
import { bufferToHex } from "../../utils/convert";
import { tags } from "../../utils/protocol/analyzer";
import { getAnalyzerClass } from "../../utils/protocol/attributes";

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
    limit = 100,
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
            .where("td.argument IS NOT NULL")
            .orWhere("td.result IS NOT NULL")
            .orWhere("td.error IS NOT NULL")
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
      const maybeAnalyzerClass = getAnalyzerClass(method);
      const maybeAnalyzer = maybeAnalyzerClass && new maybeAnalyzerClass();
      const data = parseBuffer(request.get(4), true);
      const timestamp = new Date(Number(request.get(5)));
      const attrs = request.get(8);

      details.method = method;
      details.timestamp = timestamp;
      details.sender = from;
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
      this.logger.debug(`Error during parsing: ${e}`);
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
