import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/block_info')
  getBlockInfo() {
    return this.appService.getBlockInfo();
  }
}
