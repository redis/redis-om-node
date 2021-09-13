import Globals from './globals';
import Client from '../lib/client';

const globals: Globals = (globalThis as unknown) as Globals;

beforeAll(async () => {
  globals.client = new Client();
  await globals.client.open();
});

afterAll(async () => {
  await globals.client.close();
});
