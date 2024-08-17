export const register = async () => {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { Worker } = await import('bullmq');
    const { connection } = await import('./libs/redis');
    const { recommendationQueue } = await import('./libs/queue');
    const { dbConnectionPool } = await import('./libs/db');

    const worker = new Worker('recommendationQueue', async (job) => {
      console.log(`Processing job ${job.id}`);
      console.log(job.data);

      const trx = await dbConnectionPool.transaction();
      try {
        await trx('demo_data').insert({ message: 'asdfasdf' }, ['id']);
        await trx.commit();

        return job.data;
      } catch (error) {
        console.error(error);
        await trx.rollback();
        throw new Error('Failed to process the job');
      }
    }, {
      connection,
      concurrency: 1,
      removeOnComplete: { count: 1000 },
      removeOnFail: { count: 5000 },
    });

    worker.on("completed", async (job) => {
        console.log(`Job completed for ${job.id}`);
    });
    worker.on("failed", async (job, err) => {
        console.error(`${job?.id} has failed with ${err.message}`);
    });
    worker.on("stalled", (str) => {
        console.log(`Job stalled: ${str}`);
    });
  }
};