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
