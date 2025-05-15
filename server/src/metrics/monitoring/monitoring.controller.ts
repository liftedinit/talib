import { Controller, Get, Logger, Res } from '@nestjs/common';
import { Response } from 'express';
import { Registry, collectDefaultMetrics, register } from 'prom-client';
import { METRIC_PREFIX } from './monitoring.service';

@Controller('monitoring')
export class MonitoringController {
  private readonly logger = new Logger(MonitoringController.name);

  constructor() {
    // Initialize the Prometheus registry
    collectDefaultMetrics({ register, prefix: METRIC_PREFIX  });
  }

  @Get('metrics')
  async getMetrics(@Res() res: Response): Promise<void> {
    const metrics = await register.metrics(); 
    res.set('Content-Type', register.contentType);
    res.send(metrics);
  }
}
