import { Address } from "@liftedinit/many-js";
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { hexToBuffer } from "./convert";

@Injectable()
export class ParseHashPipe implements PipeTransform<string, ArrayBuffer> {
  transform(value: string, _metadata: ArgumentMetadata): ArrayBuffer {
    try {
      return hexToBuffer(value);
    } catch (e) {
      throw new BadRequestException("Validation failed");
    }
  }
}

@Injectable()
export class ParseAddressPipe implements PipeTransform<string, Address> {
  transform(value: string, _metadata: ArgumentMetadata): Address {
    try {
      return Address.fromString(value);
    } catch (e) {
      throw new BadRequestException("Validation failed");
    }
  }
}

@Injectable()
export class ParseAlternatePipe<T, U> implements PipeTransform<string, T | U> {
  constructor(
    private readonly t: PipeTransform<string, T>,
    private readonly u: PipeTransform<string, U>,
  ) {}

  transform(value: string, metadata: ArgumentMetadata): T | U {
    try {
      console.log(1);
      return this.t.transform(value, metadata);
    } catch (e) {
      console.log(e);
    }

    try {
      console.log(2);
      return this.u.transform(value, metadata);
    } catch (e) {
      console.log(e);
    }
  }
}
