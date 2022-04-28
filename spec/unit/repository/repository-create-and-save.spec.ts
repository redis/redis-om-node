import { mocked } from 'jest-mock';

import Client from '../../../lib/client';
import Repository from '../../../lib/repository/repository';
import { JsonRepository, HashRepository } from '../../../lib/repository/repository';

import {
  A_NUMBER, A_NUMBER_STRING,
  A_STRING,
  SOME_TEXT,
  SOME_STRINGS, SOME_STRINGS_JOINED,
  A_DATE, A_DATE_EPOCH, A_DATE_EPOCH_STRING,
  A_POINT, A_POINT_STRING } from '../../helpers/example-data';

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
          entity = await repository.createAndSave({ aString: A_STRING, aNumber: A_NUMBER, aBoolean: false,
            someText: SOME_TEXT, aPoint: A_POINT, aDate: A_DATE, someStrings: SOME_STRINGS });
        });

        it("returns the populated entity", () => {
          expect(entity.aString).toBe(A_STRING);
          expect(entity.aNumber).toBe(A_NUMBER);
          expect(entity.aBoolean).toBe(false);
          expect(entity.someText).toBe(SOME_TEXT);
          expect(entity.aPoint).toEqual(A_POINT);
          expect(entity.aDate).toEqual(A_DATE);
          expect(entity.someStrings).toEqual(SOME_STRINGS);
        });

        it("saves the entity data to the key", () =>
          expect(Client.prototype.hsetall).toHaveBeenCalledWith(
            expect.stringMatching(/^SimpleHashEntity:/), {
              aString: A_STRING, aNumber: A_NUMBER_STRING, aBoolean: '0', someText: SOME_TEXT,
              aPoint: A_POINT_STRING, aDate: A_DATE_EPOCH_STRING, someStrings: SOME_STRINGS_JOINED }));
      });

      describe("when saving an empty entity", () => {
        beforeEach(async () => entity = await repository.createAndSave({}));

        it("returns the empty entity", () => {
          expect(entity.aString).toBeNull();
          expect(entity.aNumber).toBeNull();
          expect(entity.aBoolean).toBeNull();
          expect(entity.someText).toBeNull();
          expect(entity.aPoint).toBeNull();
          expect(entity.aDate).toBeNull();
          expect(entity.someStrings).toBeNull();
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
          entity = await repository.createAndSave({ aString: A_STRING, aNumber: A_NUMBER, aBoolean: false,
            someText: SOME_TEXT, aPoint: A_POINT, aDate: A_DATE, someStrings: SOME_STRINGS });
        });

        it("returns the populated entity", () => {
          expect(entity.aString).toBe(A_STRING);
          expect(entity.aNumber).toBe(A_NUMBER);
          expect(entity.aBoolean).toBe(false);
          expect(entity.someText).toBe(SOME_TEXT);
          expect(entity.aPoint).toEqual(A_POINT);
          expect(entity.aDate).toEqual(A_DATE);
          expect(entity.someStrings).toEqual(SOME_STRINGS);
        });

        it("saves the entity data to the key", () =>
          expect(Client.prototype.jsonset).toHaveBeenCalledWith(
            expect.stringMatching(/^SimpleJsonEntity:/), {
              aString: A_STRING, aNumber: A_NUMBER, aBoolean: false, someText: SOME_TEXT,
              aPoint: A_POINT_STRING, aDate: A_DATE_EPOCH, someStrings: SOME_STRINGS }));
      });

      describe("when saving an empty entity", () => {
        beforeEach(async () => entity = await repository.createAndSave({}));

        it("returns the empty entity", () => {
          expect(entity.aString).toBeNull();
          expect(entity.aNumber).toBeNull();
          expect(entity.aBoolean).toBeNull();
          expect(entity.someText).toBeNull();
          expect(entity.aPoint).toBeNull();
          expect(entity.aDate).toBeNull();
          expect(entity.someStrings).toBeNull();
        });

        it("unlinks the key", () =>
          expect(Client.prototype.jsonset).toHaveBeenCalledWith(
            expect.stringMatching(/^SimpleJsonEntity:/), {}));
      });
    });
  });
});
