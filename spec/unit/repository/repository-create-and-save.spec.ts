import { mocked } from 'ts-jest/utils';

import Client from '../../../lib/client';
import Repository from '../../../lib/repository/repository';

import { simpleHashSchema, SimpleHashEntity, SimpleJsonEntity, simpleJsonSchema } from '../helpers/test-entity-and-schema';

jest.mock('../../../lib/client');


beforeEach(() => mocked(Client).mockReset());

describe("Repository", () => {

  let client: Client;

  describe("#createAndSave", () => {

    beforeAll(() => client = new Client());

    describe("to a hash", () => {

      let repository: Repository<SimpleHashEntity>;
      let entity: SimpleHashEntity;

      beforeAll(async () => repository = new Repository(simpleHashSchema, client));

      describe("when creating and saving a fully populated entity", () => {
        beforeEach(async () => {
          entity = await repository.createAndSave({
            aString: 'foo',
            aNumber: 42,
            aBoolean: false,
            anArray: [ 'bar', 'baz', 'qux' ]
          });
        });
  
        it("returns the populated entity", () => {
          expect(entity.aString).toBe('foo');
          expect(entity.aNumber).toBe(42);
          expect(entity.aBoolean).toBe(false);
          expect(entity.anArray).toEqual([ 'bar', 'baz', 'qux' ]);
        });

        it("saves the entity data to the key", () =>
          expect(Client.prototype.hsetall).toHaveBeenCalledWith(
            expect.stringMatching(/^SimpleHashEntity:/), {
              aString: 'foo', aNumber: '42', aBoolean: '0',
              anArray: 'bar|baz|qux' }));
      });
  
      describe("when saving an empty entity", () => {
        beforeEach(async () => entity = await repository.createAndSave({}));
  
        it("returns the empty entity", () => {
          expect(entity.aString).toBeNull();
          expect(entity.aNumber).toBeNull();
          expect(entity.aBoolean).toBeNull();
          expect(entity.anArray).toBeNull();
        });

        it("unlinks the key", () =>
          expect(Client.prototype.unlink).toHaveBeenCalledWith(
            expect.stringMatching(/^SimpleHashEntity:/)));
      });
    });

    describe("to JSON", () => {

      let repository: Repository<SimpleJsonEntity>;
      let entity: SimpleJsonEntity;

      beforeAll(async () => repository = new Repository(simpleJsonSchema, client));

      describe("when creating and saving a fully populated entity", () => {
        beforeEach(async () => {
          entity = await repository.createAndSave({
            aString: 'foo',
            aNumber: 42,
            aBoolean: false,
            anArray: [ 'bar', 'baz', 'qux' ]
          });
        });
  
        it("returns the populated entity", () => {
          expect(entity.aString).toBe('foo');
          expect(entity.aNumber).toBe(42);
          expect(entity.aBoolean).toBe(false);
          expect(entity.anArray).toEqual([ 'bar', 'baz', 'qux' ]);
        });

        it("saves the entity data to the key", () =>
          expect(Client.prototype.jsonset).toHaveBeenCalledWith(
            expect.stringMatching(/^SimpleJsonEntity:/), {
              aString: 'foo', aNumber: 42, aBoolean: false,
              anArray: [ 'bar', 'baz', 'qux' ] }));
      });
  
      describe("when saving an empty entity", () => {
        beforeEach(async () => entity = await repository.createAndSave({}));
  
        it("returns the empty entity", () => {
          expect(entity.aString).toBeNull();
          expect(entity.aNumber).toBeNull();
          expect(entity.aBoolean).toBeNull();
          expect(entity.anArray).toBeNull();
        });

        it("unlinks the key", () =>
          expect(Client.prototype.unlink).toHaveBeenCalledWith(
            expect.stringMatching(/^SimpleJsonEntity:/)));
      });
    });
  });
});
