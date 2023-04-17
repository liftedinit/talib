import { Address } from "@liftedinit/many-js";
import {
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { Pagination } from "nestjs-typeorm-paginate";
import { AddressDto } from "../../dto/address.dto";
import { ParseAddressPipe } from "../../utils/pipes";
import { AddressesService } from "./addresses.service";

@Controller("neighborhoods/:nid/addresses")
export class AddressesController {
  constructor(private address: AddressesService) {}

  @Get()
  @ApiResponse({
    status: 200,
  })
  async findAll(
    @Param("nid", ParseIntPipe) nid: number,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(100), ParseIntPipe) limit = 100,
  ): Promise<Pagination<string>> {
    limit = limit > 100 ? 100 : limit;
    return await this.address.findMany(nid, { page, limit });
  }

  @Get(":address")
  @ApiResponse({
    status: 200,
    type: AddressDto,
  })
  async findOne(
    @Param("nid", ParseIntPipe) nid: number,
    @Param("address", ParseAddressPipe) address: Address,
  ): Promise<AddressDto> {
    const a = await this.address.findOne(nid, address);

    if (!a) {
      throw new NotFoundException();
    }

    return a;
  }
}
