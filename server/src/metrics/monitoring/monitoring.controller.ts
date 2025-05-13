import { Controller, Get, Logger, Res } from '@nestjs/common';
import { Response } from 'express';
import { Registry, collectDefaultMetrics, register } from 'prom-client';

@Controller('monitoring')
export class MonitoringController {
  private readonly logger = new Logger(MonitoringController.name);

  constructor() {
    // Initialie the Prometheus registry
    collectDefaultMetrics({ register }); // Collect default metrics
  }

  @Get('metrics')
  async getMetrics(@Res() res: Response): Promise<void> {
    const metrics = await register.metrics(); 
    res.set('Content-Type', register.contentType);
    res.send(metrics);
    this.logger.log('Metrics endpoint hit');
  }
}