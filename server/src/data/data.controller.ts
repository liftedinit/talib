import {
  Controller,
  Get,
  Header,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { rxToStream } from "rxjs-stream";
import { DataSource } from "typeorm";
import { Block } from "../database/entities/block.entity";
import { Neighborhood } from "../database/entities/neighborhood.entity";
import { Transaction } from "../database/entities/transaction.entity";
import { DataExporter, Entity } from "./data-exporter";

@Controller("data")
export class DataController {
  constructor(private readonly dataSource: DataSource) {}

  @Get("export")
  @Header("Content-Type", "application/json")
  @Header("Content-Disposition", 'attachment; filename="export-data.json"')
  exportData(@Res() res) {
    const entities: Entity[] = [Neighborhood, Block, Transaction];
    const runner = new DataExporter(this.dataSource.manager, entities);
    const stream$ = runner.run();
    rxToStream(stream$).pipe(res);
  }

  @Post("import")
  @UseInterceptors(FileInterceptor("file"))
  importData(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: "json",
        })
        .addMaxSizeValidator({
          maxSize: 50 * 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: any,
  ) {
    throw new Error("not implemented");
  }
}
