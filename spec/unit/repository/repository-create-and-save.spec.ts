import { mocked } from 'ts-jest/utils';

import Client from '../../../lib/client';
import Repository from '../../../lib/repository/repository';
import HashRepository from '../../../lib/repository/hash-repository';
import JsonRepository from '../../../lib/repository/json-repository';

import {
  AN_ARRAY, AN_ARRAY_JOINED,
  A_DATE, A_DATE_EPOCH, A_DATE_EPOCH_STRING,
  A_GEOPOINT, A_GEOPOINT_STRING } from '../helpers/test-data';

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

      beforeAll(async () => repository = new HashRepository(simpleHashSchema, client));

      describe("when creating and saving a fully populated entity", () => {
        beforeEach(async () => {
          entity = await repository.createAndSave({ aString: 'foo', aNumber: 42, aBoolean: false,
            aGeoPoint: A_GEOPOINT, aDate: A_DATE, anArray: AN_ARRAY });
        });
  
        it("returns the populated entity", () => {
          expect(entity.aString).toBe('foo');
          expect(entity.aNumber).toBe(42);
          expect(entity.aBoolean).toBe(false);
          expect(entity.aGeoPoint).toEqual(A_GEOPOINT);
          expect(entity.aDate).toEqual(A_DATE);
          expect(entity.anArray).toEqual(AN_ARRAY);
        });

        it("saves the entity data to the key", () =>
          expect(Client.prototype.hsetall).toHaveBeenCalledWith(
            expect.stringMatching(/^SimpleHashEntity:/), {
              aString: 'foo', aNumber: '42', aBoolean: '0',
              aGeoPoint: A_GEOPOINT_STRING, aDate: A_DATE_EPOCH_STRING, anArray: AN_ARRAY_JOINED }));
      });
  
      describe("when saving an empty entity", () => {
        beforeEach(async () => entity = await repository.createAndSave({}));
  
        it("returns the empty entity", () => {
          expect(entity.aString).toBeNull();
          expect(entity.aNumber).toBeNull();
          expect(entity.aBoolean).toBeNull();
          expect(entity.aGeoPoint).toBeNull();
          expect(entity.aDate).toBeNull();
          expect(entity.anArray).toBeNull();
        });

        it("unlinks the key", () =>
          expect(Client.prototype.unlink).toHaveBeenCalledWith(expect.stringMatching(/^SimpleHashEntity:/)));
      });
    });

    describe("to JSON", () => {

      let repository: Repository<SimpleJsonEntity>;
      let entity: SimpleJsonEntity;

      beforeAll(async () => repository = new JsonRepository(simpleJsonSchema, client));

      describe("when creating and saving a fully populated entity", () => {
        beforeEach(async () => {
          entity = await repository.createAndSave({ aString: 'foo', aNumber: 42, aBoolean: false,
            aGeoPoint: A_GEOPOINT, aDate: A_DATE, anArray: AN_ARRAY });
        });
  
        it("returns the populated entity", () => {
          expect(entity.aString).toBe('foo');
          expect(entity.aNumber).toBe(42);
          expect(entity.aBoolean).toBe(false);
          expect(entity.aGeoPoint).toEqual(A_GEOPOINT);
          expect(entity.aDate).toEqual(A_DATE);
          expect(entity.anArray).toEqual(AN_ARRAY);
        });

        it("saves the entity data to the key", () =>
          expect(Client.prototype.jsonset).toHaveBeenCalledWith(
            expect.stringMatching(/^SimpleJsonEntity:/), {
              aString: 'foo', aNumber: 42, aBoolean: false,
              aGeoPoint: A_GEOPOINT_STRING, aDate: A_DATE_EPOCH, anArray: AN_ARRAY }));
      });
  
      describe("when saving an empty entity", () => {
        beforeEach(async () => entity = await repository.createAndSave({}));
  
        it("returns the empty entity", () => {
          expect(entity.aString).toBeNull();
          expect(entity.aNumber).toBeNull();
          expect(entity.aBoolean).toBeNull();
          expect(entity.aGeoPoint).toBeNull();
          expect(entity.aDate).toBeNull();
          expect(entity.anArray).toBeNull();
        });

        it("unlinks the key", () =>
          expect(Client.prototype.unlink).toHaveBeenCalledWith(
            expect.stringMatching(/^SimpleJsonEntity:/)));
      });
    });
  });
});
