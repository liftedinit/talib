
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';

@Injectable()
export class MonitoringMiddleware implements NestMiddleware {
  private readonly logger = new Logger(MonitoringMiddleware.name);

  constructor(private readonly monitoringService: MonitoringService) {
    this.logger.log('MonitoringMiddleware initialized');
  }

  async use(req: any, res: any, next: () => void) {
    if (req.originalUrl.includes('/monitoring/metrics')) {

      // Update all custom metrics before serving the metrics endpoint
      this.monitoringService.updateMetrics();
    }
    next();
  }
}