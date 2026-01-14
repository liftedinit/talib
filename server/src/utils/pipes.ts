import { Address } from "@liftedinit/many-js";
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { hexToBuffer } from "./convert";

@Injectable()
export class ParseHashPipe implements PipeTransform<string, Buffer> {
  transform(value: string, _metadata: ArgumentMetadata): Buffer {
    try {
      return hexToBuffer(value);
    } catch (e) {
      throw new BadRequestException(
        "Validation failed (hexadecimal hash value is expected)",
      );
    }
  }
}

@Injectable()
export class ParseAddressPipe implements PipeTransform<string, Address> {
  transform(value: string, _metadata: ArgumentMetadata): Address {
    try {
      return Address.fromString(value);
    } catch (e) {
      throw new BadRequestException(
        "Validation failed (MANY address is expected)",
      );
    }
  }
}

@Injectable()
export class ParseHashOrHeightPipe
  implements PipeTransform<string, Buffer | number>
{
  transform(value: string, metadata: ArgumentMetadata): Buffer | number {
    if (Number.isFinite(+value)) {
      return Number(value);
    }

    try {
      return hexToBuffer(value);
    } catch (_) {}

    throw new BadRequestException(
      `Vaidation failed (neither a height or a hexadecimal hash)`,
    );
  }
}
