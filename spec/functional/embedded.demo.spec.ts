// import { createClient } from 'redis';

// import Client from '../../lib/client';
// import Schema from '../../lib/schema/schema';
// import Entity from '../../lib/entity/entity';
// import Repository from '../../lib/repository/repository';

// import { Point } from '../../lib';
// import { Address } from 'cluster';

describe("Embedded Demo", () => {
  it("is not done yet", () => expect(true).toBe(true));

  //   it("demos", async () => {

  //     // establish an existing connection to Redis
  //     let redis = createClient();
  //     redis.on('error', (err) => console.log('Redis Client Error', err));
  //     await redis.connect();

  //     // define the interfaces, just for TypeScript
  //     interface Address {
  //       street: string;
  //       city: string;
  //       state: string;
  //       zipCode: string;
  //       location: Point;
  //     }

  //     interface PhoneNumber {
  //       type: string;
  //       areaCode: string;
  //       exchange: string;
  //       number: string;
  //     }

  //     interface ContactInfo {
  //       email: string;
  //       address: Address;
  //       phoneNumbers: PhoneNumber[];
  //     }

  //     interface User {
  //       username: string;
  //       accountCreated: Date;
  //       firstName: string;
  //       lastName: string;
  //       contactInfo: ContactInfo;
  //     }

  //     // define the entity class and add any business logic to it
  //     class User extends Entity {}
  //     class ContactInfo extends EmbeddedEntity {}
  //     class PhoneNumber extends EmbeddedEntity {}
  //     class Address extends EmbeddedEntity {}

  //     // get a client use an existing Redis connection
  //     let client = await new Client().use(redis);
  //     await client.execute(['FLUSHALL']);
  //     await client.execute(['PING']);

  //     let addressSchema = new EmbeddedSchema(Address, {
  //       street: { type: 'string' },
  //       city: { type: 'string' },
  //       state: { type: 'string' },
  //       zipCode: { type: 'string' }
  //     });

  //     let phoneNumberSchema = new EmbeddedSchema(PhoneNumber, {
  //       type: { type: 'string' },
  //       areaCode: { type: 'string' },
  //       exchange: { type: 'string' },
  //       number: { type: 'string' }
  //     });

  //     let contactInfoSchema = new EmbeddedSchema(ContactInfo, {
  //       email: { type: 'string' },
  //       address: { type: 'object', schema: addressSchema },
  //       phoneNumbers: { type: 'object[]', schema: phoneNumberSchema }
  //     });

  //     let schema = new Schema(
  //       User, {
  //         username: { type: 'string' },
  //         accountCreated: { type: 'date' },
  //         firstName: { type: 'string' },
  //         lastName: { type: 'string' },
  //         contactInfo: { type: 'object', schema: contactInfoSchema }
  //       });

  //     let repository: Repository<User> = client.fetchRepository<User>(schema);

  //     await repository.createIndex();

  //     // create an entity
  //     let entity = await repository.createEntity();
  //     entity.username = 'luser';
  //     entity.accountCreated = new Date('1978-10-09T00:00:00.000Z');
  //     entity.firstName = "Larry";
  //     entity.lastName = "User";
  //     entity.contactInfo = new ContactInfo()

  //     entity.contactInfo.address.street = "123 Main St";
  //     entity.contactInfo.address.city = "Columbus";
  //     entity.contactInfo.address.state = "Ohio";
  //     entity.contactInfo.address.zipCode = "43210";
  //     entity.contactInfo.address.location = { longitude: 12.34, latitude: 56.78 };
  //     entity.contactInfo.phoneNumbers = [ new PhoneNumber(), new PhoneNumber() ];

  //     entity.contactInfo.phoneNumbers[0].type = "Cell"
  //     entity.contactInfo.phoneNumbers[0].areaCode = "614"
  //     entity.contactInfo.phoneNumbers[0].exchange = "555"
  //     entity.contactInfo.phoneNumbers[0].number = "1212"

  //     entity.contactInfo.phoneNumbers[1].type = "Work"
  //     entity.contactInfo.phoneNumbers[1].areaCode = "419"
  //     entity.contactInfo.phoneNumbers[1].exchange = "555"
  //     entity.contactInfo.phoneNumbers[1].number = "1212"

  //     let entityId = await repository.save(entity);

  //     // fetch an entity
  //     entity = await repository.fetch(entityId);

  //     // close the client
  //     client.close();
  //   });
});
