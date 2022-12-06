import { Message } from './../../../node_modules/esbuild/lib/main.d';
import '../helpers/mock-client'
import { Client } from '$lib/client';
import { JsonRepository, HashRepository } from '$lib/repository';

import { simpleHashSchema, simpleJsonSchema, SimpleHashEntity, SimpleJsonEntity } from '../helpers/test-entity-and-schema';


describe("Repository", () => {
    let client: Client;
    let entityId = 'foo';
    let secondsBeforeExpire: number = 60;
    let expireAtDate = new Date(Date.now() + (secondsBeforeExpire * 1000));

    describe("#expire", () => {

        beforeAll(() => {
            client = new Client()
        });

        it("expire a hash - invalid expire date throws an error", async () => {
            let repository = new HashRepository<SimpleHashEntity>(simpleHashSchema, client);
            const referenceDate = new Date(Date.now() - (secondsBeforeExpire * 1000));
            let expectedKey = `SimpleHashEntity:${entityId}`;
            try {
                await repository.expireAt(expectedKey, referenceDate)
            } catch (e: any) {
                expect(e.message).toEqual(`Expiration date must be set in the future. expirationDate ${referenceDate.toString()} comes before ${new Date().toString()}`)
            }
        })

        it("expires a hash", async () => {
            let repository = new HashRepository<SimpleHashEntity>(simpleHashSchema, client);
            let expectedKey = `SimpleHashEntity:${entityId}`;
            await repository.expireAt(entityId, expireAtDate);
            expect(client.expire).toHaveBeenCalledWith(expectedKey, secondsBeforeExpire);
        });

        it("expire a JSON - invalid expire date throws an error", async () => {
            let repository = new HashRepository<SimpleJsonEntity>(simpleJsonSchema, client);
            const referenceDate = new Date(Date.now() - (secondsBeforeExpire * 1000));
            let expectedKey = `SimpleJsonEntity:${entityId}`;
            try {
                await repository.expireAt(expectedKey, referenceDate)
            } catch (e: any) {
                expect(e.message).toEqual(`Expiration date must be set in the future. expirationDate ${referenceDate.toString()} comes before ${new Date().toString()}`)
            }
        })

        it("expires a JSON", async () => {
            let repository = new JsonRepository<SimpleJsonEntity>(simpleJsonSchema, client);
            let expectedKey = `SimpleJsonEntity:${entityId}`;
            await repository.expireAt(entityId, expireAtDate);
            expect(client.expire).toHaveBeenCalledWith(expectedKey, secondsBeforeExpire);
        });
    });
})