export const redis = {
  connect: jest.fn(),
  quit: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
  hGetAll: jest.fn(),
  expire: jest.fn(),
  sendCommand: jest.fn(),
  executeIsolated: jest.fn(),
  unlink: jest.fn(),
}

export const createClient = jest.fn(() => redis)

jest.mock('redis', () => ({ createClient }))