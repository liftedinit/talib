import { Address } from "@liftedinit/many-js";
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { AddressDto } from "../../dto/address.dto";
import { ParseAddressPipe } from "../../utils/pipes";
import { AddressesService } from "./addresses.service";

@Controller("neighborhoods/:nid/addresses")
export class AddressesController {
  constructor(private address: AddressesService) {}

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
