import { mocked } from 'ts-jest/utils';

import Client from '../../../lib/client';
import Repository from '../../../lib/repository/repository';
import { JsonRepository, HashRepository } from '../../../lib/repository/repository';

import {
  A_STRING_ARRAY, A_STRING_ARRAY_JOINED,
  A_DATE, A_DATE_EPOCH, A_DATE_EPOCH_STRING,
  A_POINT, A_POINT_STRING } from '../../helpers/example-data';

import { simpleHashSchema, SimpleHashEntity, SimpleJsonEntity, simpleJsonSchema } from '../helpers/test-entity-and-schema';

jest.mock('../../../lib/client');


beforeEach(() => mocked(Client).mockReset());

describe("Repository", () => {

  let client: Client;
  let entityId: string;
  let expectedKey: string;

  describe("#save", () => {

    beforeAll(() => client = new Client());

    describe("to a hash", () => {

      let repository: Repository<SimpleHashEntity>;
      let entity: SimpleHashEntity;

      beforeAll(async () => repository = new HashRepository(simpleHashSchema, client));
      beforeEach(async () => entity = repository.createEntity());

      describe.each([

        ["when saving a fully populated entity", {
          providedString: 'foo', providedNumber: 42, providedBoolean: false,
          providedPoint: A_POINT, providedDate: A_DATE, providedArray: A_STRING_ARRAY,
          expectedData: { aString: 'foo', aNumber: '42', aBoolean: '0',
            aPoint: A_POINT_STRING, aDate: A_DATE_EPOCH_STRING, someStrings: A_STRING_ARRAY_JOINED }
        }],
  
        [ "when saving a partially populated entity", {
          providedString: 'foo', providedNumber: 42, providedBoolean: null,
          providedPoint: null, providedDate: null, providedArray: null,
          expectedData: { aString: 'foo', aNumber: '42' }
        }]
  
      ])("%s", (_, data) => {
  
        beforeEach(async () => {
          entity.aString = data.providedString;
          entity.aNumber = data.providedNumber;
          entity.aBoolean = data.providedBoolean;
          entity.aPoint = data.providedPoint;
          entity.aDate = data.providedDate;
          entity.someStrings = data.providedArray;
          entityId = await repository.save(entity);
          expectedKey = `SimpleHashEntity:${entityId}`;
        });
  
        it("returns the entity id", () => expect(entityId).toBe(entity.entityId));
        it("saves the entity data to the key", () =>
          expect(Client.prototype.hsetall).toHaveBeenCalledWith(expectedKey, data.expectedData));
      });
  
      describe("when saving an empty entity", () => {
        beforeEach(async () => {
          entity.aString = null;
          entity.aNumber = null;
          entity.aBoolean = null;
          entity.aPoint = null;
          entity.aDate = null;
          entity.someStrings = null;
          entityId = await repository.save(entity);
          expectedKey = `SimpleHashEntity:${entityId}`;
        });
  
        it("returns the entity id", () => expect(entityId).toBe(entity.entityId));
        it("unlinks the key", () =>
          expect(Client.prototype.unlink).toHaveBeenCalledWith(expectedKey));
      });
    });

    describe("to JSON", () => {

      let repository: Repository<SimpleJsonEntity>;
      let entity: SimpleJsonEntity;

      beforeAll(async () => repository = new JsonRepository(simpleJsonSchema, client));
      beforeEach(async () => entity = repository.createEntity());

      describe.each([

        ["when saving a fully populated entity", {
          providedString: 'foo', providedNumber: 42, providedBoolean: false,
          providedPoint: A_POINT, providedDate: A_DATE, providedArray: A_STRING_ARRAY,
          expectedData: { aString: 'foo', aNumber: 42, aBoolean: false,
            aPoint: A_POINT_STRING, aDate: A_DATE_EPOCH, someStrings: A_STRING_ARRAY }
        }],
  
        [ "when saving a partially populated entity", {
          providedString: 'foo', providedNumber: 42, providedBoolean: null,
          providedPoint: null, providedDate: null, providedArray: null,
          expectedData: { aString: 'foo', aNumber: 42 }
        }]

      ])("%s", (_, data) => {
  
        beforeEach(async () => {
          entity.aString = data.providedString;
          entity.aNumber = data.providedNumber;
          entity.aBoolean = data.providedBoolean;
          entity.aPoint = data.providedPoint
          entity.aDate = data.providedDate;
          entity.someStrings = data.providedArray;
          entityId = await repository.save(entity);
          expectedKey = `SimpleJsonEntity:${entityId}`;
        });
  
        it("returns the entity id", () => expect(entityId).toBe(entity.entityId));
        it("saves the entity data to the key", () =>
          expect(Client.prototype.jsonset).toHaveBeenCalledWith(expectedKey, data.expectedData));
      });

      describe("when saving an empty entity", () => {
        beforeEach(async () => {
          entity.aString = null;
          entity.aNumber = null;
          entity.aBoolean = null;
          entity.aPoint = null;
          entity.aDate = null;
          entity.someStrings = null;
          entityId = await repository.save(entity);
          expectedKey = `SimpleJsonEntity:${entityId}`;
        });
  
        it("returns the entity id", () => expect(entityId).toBe(entity.entityId));
        it("unlinks the key", () =>
          expect(Client.prototype.unlink).toHaveBeenCalledWith(expectedKey));
      });
    });
  });
});
