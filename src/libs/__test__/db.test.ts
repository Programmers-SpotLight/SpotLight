/**
 * @jest-environment node
 */

import { describe, expect, test } from '@jest/globals';
import { dbConnectionPool } from '../db';


describe('Database connection', () => {
  test('should connect to the database', async () => {
    const DB_HOST = process.env.DB_HOST;
    expect(DB_HOST).toBeDefined();
    const DB_PORT = process.env.DB_PORT;
    expect(DB_PORT).toBeDefined();
    const DB_USER = process.env.DB_USER;
    expect(DB_USER).toBeDefined();
    const DB_PASS = process.env.DB_PASS;
    expect(DB_PASS).toBeDefined();
    const DB_NAME = process.env.DB_NAME;
    expect(DB_NAME).toBeDefined();

    // Test the connection
    const result = await dbConnectionPool.select('*').from('user');
    expect(result).toBeDefined();
    // Close the pool
    await dbConnectionPool.destroy();
  });
});