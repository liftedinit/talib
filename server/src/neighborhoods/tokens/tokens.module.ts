import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Token } from "../../database/entities/token.entity";
import { TokensController } from "./tokens.controller";
import { TokensService } from "./tokens.service";

@Module({
  imports: [TypeOrmModule.forFeature([Token])],
  providers: [TokensService],
  controllers: [TokensController],
  exports: [TokensService],
})
export class TokensModule {}
