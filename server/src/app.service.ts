import { Injectable } from '@nestjs/common';
import { BLOCK_INFO } from './mock/blocks.mock';

@Injectable()
export class AppService {
  block_info = BLOCK_INFO;

  async getBlockInfo() {
    return await this.block_info;
  }
}
