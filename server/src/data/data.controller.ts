import { Controller, Delete } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TransactionDetails } from "../database/entities/transaction-details.entity";

@ApiExcludeController()
@Controller("data")
export class DataController {
  constructor(
    @InjectRepository(TransactionDetails)
    private txDetailsRepository: Repository<TransactionDetails>,
  ) {}

  @Delete("clear-details")
  async clearDetails(): Promise<""> {
    await this.txDetailsRepository.delete({});
    return "";
  }
}
