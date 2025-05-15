import { Injectable, Logger } from '@nestjs/common';
import {
  register,
  Gauge,
  Counter,
  Metric,
} from 'prom-client';
import { MetricsService } from '../metrics.service';

export const METRIC_PREFIX = 'talib_';

type MetricType = 'gauge' | 'counter';

type MetricInstance =
  | Gauge<string>
  | Counter<string>;

type MetricValue =
  | { value: number; labels?: Record<string, string> }

interface MetricDefinition {
  type: MetricType;
  name: string;
  help: string;
  labels?: string[];
  getValue: () => Promise<MetricValue>;
}

function isValueMetric(val: MetricValue): val is { value: number; labels?: Record<string, string> } {
  return 'value' in val;
}

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);
  private readonly metrics: Record<string, MetricInstance> = {};

  // Define the metrics to be monitored
  // Each metric has a type, name, help text, optional labels, and a function to get its value
  private readonly metricDefinitions: MetricDefinition[] = [
    {
      type: 'gauge',
      name: 'mfx_power_conversion',
      help: 'The current MFX-to-power conversion rate',
      getValue: async () => {
        const res = await this.metricsService.getCurrent('mfxpowerconversion');
        return {
          value: res ? Number(res.data) : 0,
          labels: { test: 'someValue' },
        };
      },
    },
  ];

  constructor(private readonly metricsService: MetricsService) {
    // Initialize the Prometheus registry
    register.clear();
    register.setDefaultLabels({ app: 'talib' });
    this.registerMetrics();
    this.logger.log('MonitoringService initialized');
  }

  // Register metrics with Prometheus
  private registerMetrics(): void {
    for (const def of this.metricDefinitions) {
      let metric: MetricInstance;
      const metricName = METRIC_PREFIX + def.name;

    switch (def.type) {
      case 'gauge':
        metric = new Gauge({
          name: metricName,
          help: def.help,
          labelNames: def.labels || [],
        });
        break;
      case 'counter':
        metric = new Counter({
          name: metricName,
          help: def.help,
          labelNames: def.labels || [],
        });
        break;
    }

      register.registerMetric(metric);
      this.metrics[def.name] = metric;
    }

    this.logger.log(`Registered ${this.metricDefinitions.length} metrics`);
  }

  // Update metrics
  async updateMetrics(): Promise<void> {
    for (const def of this.metricDefinitions) {
      const metric = this.metrics[def.name];
      if (!metric) continue;

      try {
        const result = await def.getValue();
        const labels = result.labels || {};

        switch (def.type) {
          case 'gauge':
            if (isValueMetric(result)) {
              def.labels?.length
                ? (metric as Gauge<string>).set(labels, result.value)
                : (metric as Gauge<string>).set(result.value);
            }
            break;

          case 'counter':
            if (isValueMetric(result)) {
              def.labels?.length
                ? (metric as Counter<string>).inc(labels, result.value)
                : (metric as Counter<string>).inc(result.value);
            }
            break;
        }
      } catch (err) {
        this.logger.error(`Error updating metric ${def.name}:`, err);
      }
    }
  }
}
