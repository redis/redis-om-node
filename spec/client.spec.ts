import { mocked } from 'ts-jest/utils';

import RedisShim from '../lib/redis/redis-shim';
import Client from '../lib/client';
import Repository from '../lib/repository/repository';
import Entity from '../lib/entity/entity';
import Schema from '../lib/schema/schema';

jest.mock('../lib/redis/redis-shim');
jest.mock('../lib/repository/repository');


beforeEach(() => mocked(RedisShim).mockReset());

describe("Client", () => {

  let client: Client;

  beforeEach(async () => client = new Client());

  describe("#open", () => {
    describe("when called without a url", () => {
      beforeEach(async () => await client.open());

      it("constructs a new RedisShim", () => expect(RedisShim).toHaveBeenCalled());
      it("opens the shim with the default url", async () =>
        expect(RedisShim.prototype.open).toHaveBeenCalledWith('redis://localhost:6379'));
    });

    describe("when called with a url", () => {
      beforeEach(async () => await client.open('foo'));

      it("constructs a new RedisShim", () => expect(RedisShim).toHaveBeenCalled());
      it("opens the shim with the default url", async () =>
        expect(RedisShim.prototype.open).toHaveBeenCalledWith('foo'));
    });

    describe("when called on an already open client", () => {
      beforeEach(async () => await client.open('foo'));

      it("errors when called on an open client", async () =>
        expect(async () => await client.open())
          .rejects.toThrow("Redis connection is already open."));
    });
  });

  describe("#close", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open();
        await client.close();
      });
      
      it("closes the shim", () => expect(RedisShim.prototype.close).toHaveBeenCalled());
    });

    describe("when called on an already closed client", () => {
      beforeEach(async () => {
        await client.open();
        await client.close();
      });
      
      it("errors when called on a closed client", () => 
        expect(async () => await client.close())
          .rejects.toThrow("Redis connection needs opened."));
    });
    
    it("errors when called on a new client", async () =>
      expect(async () => await client.close())
        .rejects.toThrow("Redis connection needs opened."));
  });
  
  describe("#execute", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open();
      });

      it("passes the command to the shim", async () => {
        await client.execute([ 'foo', 'bar', 'baz' ]);
        expect(RedisShim.prototype.execute).toHaveBeenCalledWith([ 'foo', 'bar', 'baz' ]);
      });

      it("transforms numbers to strings before giving them to the shim", async () => {
        await client.execute([ 1, 2, 3 ]);
        expect(RedisShim.prototype.execute).toHaveBeenCalledWith([ '1', '2', '3' ]);
      });

      it("transforms booleans to strings before giving them to the shim", async () => {
        await client.execute([ true, false, true ]);
        expect(RedisShim.prototype.execute).toHaveBeenCalledWith([ '1', '0', '1' ]);
      });
    });

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open();
        await client.close();
      });
      
      it("errors when called on a closed client", () => 
      expect(async () => await client.execute([ 'foo', 'bar', 'baz' ]))
        .rejects.toThrow("Redis connection needs opened."));
    });
    
    it("errors when called on a new client", async () =>
      expect(async () => await client.execute([ 'foo', 'bar', 'baz' ]))
        .rejects.toThrow("Redis connection needs opened."));
  });

  describe("#unlink", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open();
      });

      it("passes the command to the shim", async () => {
        await client.unlink('foo');
        expect(RedisShim.prototype.unlink).toHaveBeenCalledWith('foo');
      });
    });

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open();
        await client.close();
      });
      
      it("errors when called on a closed client", () => 
      expect(async () => await client.unlink('foo'))
        .rejects.toThrow("Redis connection needs opened."));
    });
    
    it("errors when called on a new client", async () =>
      expect(async () => await client.unlink('foo'))
        .rejects.toThrow("Redis connection needs opened."));
  });

  describe("#hgetall", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open();
      });

      it("passes the command to the shim", async () => {
        await client.hgetall('foo');
        expect(RedisShim.prototype.hgetall).toHaveBeenCalledWith('foo');
      });
    });

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open();
        await client.close();
      });
      
      it("errors when called on a closed client", () => 
        expect(async () => await client.hgetall('foo'))
          .rejects.toThrow("Redis connection needs opened."));
    });
    
    it("errors when called on a new client", async () =>
      expect(async () => await client.hgetall('foo'))
        .rejects.toThrow("Redis connection needs opened."));
  });

  describe("#hsetall", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open();
      });

      it("passes the command to the shim", async () => {
        await client.hsetall('foo', { foo: 'bar', baz: 'qux' });
        expect(RedisShim.prototype.hsetall).toHaveBeenCalledWith('foo', { foo: 'bar', baz: 'qux' });
      });
    });

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open();
        await client.close();
      });
      
      it("errors when called on a closed client", () => 
      expect(async () => await client.hsetall('foo', { foo: 'bar', baz: 'qux' }))
        .rejects.toThrow("Redis connection needs opened."));
    });
    
    it("errors when called on a new client", async () =>
      expect(async () => await client.hsetall('foo', { foo: 'bar', baz: 'qux' }))
        .rejects.toThrow("Redis connection needs opened."));
  });

  describe("#createIndex", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open();
      });

      it("passes the command to the shim", async () => {
        await client.createIndex('index', 'HASH', 'prefix', [ 'foo', 'bar', 'baz' ]);
        expect(RedisShim.prototype.execute).toHaveBeenCalledWith([
          'FT.CREATE', 'index',
            'ON', 'HASH',
            'PREFIX', '1', 'prefix',
            'SCHEMA', 'foo', 'bar', 'baz'
        ]);
      });
    });

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open();
        await client.close();
      });
      
      it("errors when called on a closed client", () => 
        expect(async () => await client.createIndex('index', 'HASH', 'prefix', [ 'foo', 'bar', 'baz' ]))
          .rejects.toThrow("Redis connection needs opened."));
    });
    
    it("errors when called on a new client", async () =>
      expect(async () => await client.createIndex('index', 'HASH', 'prefix', [ 'foo', 'bar', 'baz' ]))
        .rejects.toThrow("Redis connection needs opened."));
  });

  describe("#dropIndex", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open();
      });

      it("passes the command to the shim", async () => {
        await client.dropIndex('index');
        expect(RedisShim.prototype.execute).toHaveBeenCalledWith([ 'FT.DROPINDEX', 'index' ]);
      });
    });

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open();
        await client.close();
      });
      
      it("errors when called on a closed client", () => 
        expect(async () => await client.dropIndex('index'))
          .rejects.toThrow("Redis connection needs opened."));
    });
    
    it("errors when called on a new client", async () =>
      expect(async () => await client.dropIndex('index'))
        .rejects.toThrow("Redis connection needs opened."));
  });

  describe("#search", () => {
    describe("when called on an open client", () => {
      beforeEach(async () => {
        await client.open();
      });

      it("passes the command to the shim", async () => {
        await client.search('index', 'query');
        expect(RedisShim.prototype.execute).toHaveBeenCalledWith([ 'FT.SEARCH', 'index', 'query' ]);
      });
    });

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open();
        await client.close();
      });
      
      it("errors when called on a closed client", () => 
        expect(async () => await client.search('index', 'query'))
          .rejects.toThrow("Redis connection needs opened."));
    });
    
    it("errors when called on a new client", async () =>
      expect(async () => await client.search('index', 'query'))
        .rejects.toThrow("Redis connection needs opened."));
  });

  describe("#fetchRepository", () => {

    class TestEntity extends Entity {};

    let repository: Repository<TestEntity>;
    let schema: Schema<TestEntity>;

    beforeAll(() => {
      schema = new Schema(TestEntity, {});
    });

    describe("when called on an open client", () => {

      beforeEach(async () => {
        await client.open();
        repository = await client.fetchRepository(schema);
      });
      
      it("creates a repository with the schema and client", async () => {
        expect(Repository).toHaveBeenCalledWith(schema, client);
      });

      it("returns a repository", async () => {
        expect(repository).toBeInstanceOf(Repository);
      });
    });

    describe("when called on a closed client", () => {
      beforeEach(async () => {
        await client.open();
        await client.close();
      });
      
      it("errors when called on a closed client", () => 
        expect(async () => await client.fetchRepository(schema))
          .rejects.toThrow("Redis connection needs opened."));
    });
    
    it("errors when called on a new client", async () =>
      expect(async () => await client.fetchRepository(schema))
        .rejects.toThrow("Redis connection needs opened."));
  });
});
