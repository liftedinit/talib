import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Logger,
  Optional,
  Param,
  ParseIntPipe,
  Put,
  Query,
} from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { Pagination } from "nestjs-typeorm-paginate";
import {
  MigrationDto,
  MigrationDetailsDto,
  UpdateMigrationDto,
  MigrationDtoPagination,
} from "../../dto/migration.dto";
import { ParseHashPipe } from "../../utils/pipes";
import { MigrationsService } from "./migrations.service";

@Controller("neighborhoods/:nid/migrations")
export class MigrationsController {
  private readonly logger = new Logger(MigrationsController.name);

  constructor(private migrations: MigrationsService) {}

  @Get(":uuid")
  @ApiOperation({
    description: "Show the details of a single migration",
  })
  @ApiOkResponse({
    type: MigrationDto,
    isArray: false,
  })
  async findOne(
    @Param("nid", ParseIntPipe) nid: number,
    @Param("uuid") uuid: string,
  ): Promise<MigrationDetailsDto> {
    const migration = await this.migrations.findOneByUuid(nid, uuid);
    if (!migration) {
      throw new NotFoundException();
    }

    return migration;
  }
  
  @Get()
  @ApiQuery({ name: 'status', required: false, description: 'The status of the migration' })
  @ApiResponse({
    status: 200,
    type: MigrationDtoPagination,
    isArray: false,
    description: "List all migrations for a neighborhood.",
  })
  async findMany(
    @Param("nid", ParseIntPipe) nid: number,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Optional() 
    @Query("status") status?: number,
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

  @Put('claim')
  @ApiOperation({
    description: "Claim migrations for a neighborhood",
  })
  @ApiOkResponse({
    type: MigrationDto,
    isArray: true,
  })
  async claimMany(
    @Param("nid", ParseIntPipe) nid: number,
  ): Promise<MigrationDto[]> {
    return await this.migrations.claimMany(nid);
  }

  @Put('claim/:uuid')
  @ApiOperation({
    description: "Claim a single migration for a neighborhood",
  })
  @ApiOkResponse({
    type: MigrationDto,
    isArray: false,
  })
  async claimOne(
    @Param("nid", ParseIntPipe) nid: number,
    @Param("uuid") uuid: string,
  ): Promise<MigrationDto> {
    const migration = await this.migrations.claimOneByUuid(nid, uuid);
    if (!migration) {
      throw new NotFoundException(`Could not claim migration with UUID ${uuid}`);
    }
    return migration
  }

  @Put(":uuid") 
  @ApiOperation({
    description: "Update the status of a migration",
  })
  @ApiOkResponse({
    type: UpdateMigrationDto,
    isArray: false,
  })
  async update(
    @Param("nid", ParseIntPipe) nid: number,
    @Param("uuid") uuid: string,
    @Body() updateMigrationDto: Partial<UpdateMigrationDto>
  ): Promise<UpdateMigrationDto> {
    const migration = await this.migrations.updateOneByUuid(nid, uuid, updateMigrationDto);
    if (!migration) {
      throw new NotFoundException(`Could not update migration with UUID ${uuid}`);
    }

    return migration;
  }
}
