import { Queue } from 'bullmq';
import { connection } from './redis';

export const recommendationQueue = new Queue('recommendationQueue', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    }
  }
});