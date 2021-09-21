import Globals from './globals';
import Client from '../../lib/client';

const globals: Globals = (globalThis as unknown) as Globals;

beforeAll(async () => {
  globals.client = new Client();
  await globals.client.open();
});

beforeEach(async () => {
  await globals.client.execute(['FLUSHALL']);
});

afterAll(async () => {
  await globals.client.close();
});

