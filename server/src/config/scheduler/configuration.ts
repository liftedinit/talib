import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('scheduler', () => ({
  cron: process.env.SCHEDULER_CRON,
  seconds: process.env.SCHEDULER_SECONDS,
  max_blocks: process.env.SCHEDULER_MAX_BLOCK,
  parallel: process.env.SCHEDULER_PARALLEL,
  parallel_sleep: process.env.SCHEDULER_PARALLEL_SLEEP,
}));
