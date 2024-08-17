import { InternalServerError } from "@/utils/errors";
import { Redis } from "ioredis"


export const connection = new Redis(
  process.env.REDIS_URL as string, {
    maxRetriesPerRequest: null
  }
);

const checkIfRedisIsConnected = async () => {
  try {
    await connection.ping();
  } catch (error) {
    throw new Error('Redis is not connected');
  }
};

export const setData = async (
  key: string, 
  value: string,
  options: { expire?: number }
) => {
  await checkIfRedisIsConnected();
  try {
    await connection.set(
      key, 
      value,
      'EX', 
      options.expire || 60 * 60 * 24
    );
  } catch (error) {
    throw new InternalServerError('Failed to set data in Redis');
  }
};

export const setDataIfNotExists = async (
  key: string,
  value: string,
  options: { expire?: number }
) => {
  await checkIfRedisIsConnected();
  try {
    await connection.set(
      key,
      value,
      'EX',
      options.expire || 60 * 60 * 24,
      'NX'
    );
  } catch (error) {
    throw new InternalServerError('Failed to set data in Redis');
  }
}

export const getData = async (key: string) => {
  await checkIfRedisIsConnected();
  try {
    return await connection.get(key);
  } catch (error) {
    throw new InternalServerError('Failed to get data from Redis');
  }
};

export const deleteData = async (key: string) => {
  await checkIfRedisIsConnected();
  try {
    await connection.del(key);
  } catch (error) {
    throw new InternalServerError('Failed to delete data from Redis');
  }
};