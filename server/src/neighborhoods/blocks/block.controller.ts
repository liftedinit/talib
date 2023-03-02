import { Controller } from '@nestjs/common';
import { BlockService } from './block.service';

@Controller('api/v1/neighborhoods')
export class BlockController {
  constructor(private block: BlockService) {}
}
