import {
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Logger,
  Optional,
  Param,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { Pagination } from "nestjs-typeorm-paginate";
import {
  MigrationDto,
  MigrationDetailsDto,
} from "../../dto/migration.dto";
import { ParseHashPipe } from "../../utils/pipes";
import { MigrationsService } from "./migrations.service";

@Controller("neighborhoods/:nid/migrations")
export class MigrationsController {
  private readonly logger = new Logger(MigrationsController.name);

  constructor(private migrations: MigrationsService) {}

  @Get(":thash")
  @ApiOperation({
    description: "Show the details of a single migration",
  })
  @ApiOkResponse({
    type: MigrationDto,
    isArray: true,
  })
  async findOne(
    @Param("nid", ParseIntPipe) nid: number,
    @Param("thash", ParseHashPipe) thash: ArrayBuffer,
  ): Promise<MigrationDetailsDto> {
    const migration = await this.migrations.findOneByHash(nid, thash);
    if (!migration) {
      throw new NotFoundException();
    }

    return migration;
  }
  
  @Get()
  @ApiQuery({ name: 'status', required: false, description: 'The status of the migration' })
  @ApiResponse({
    status: 200,
    type: MigrationDto,
    isArray: true,
    description: "List all migrations for a neighborhood.",
  })
  async findMany(
    @Param("nid", ParseIntPipe) nid: number,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Optional() 
    @Query("status") status?: string,
  ): Promise<Pagination<MigrationDto>> {
    limit = limit > 100 ? 100 : limit;

    const result = await this.migrations.findMany(
      nid,
      status,
      { page, limit },
    );

    return {
      ...result,
      items: result.items.map((m) => m.intoDto()),
    };
  }

  // @TODO PUT: put migrationDatetime, status, and perhaps related hash from opposing chain to validate completeness

}
