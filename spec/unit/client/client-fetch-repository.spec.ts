import '../../helpers/custom-matchers'

import { Client } from '$lib/client'
import { RedisOmError } from '$lib/error'
import { Repository } from '$lib/repository'
import { Schema } from '$lib/schema/schema'

vi.mock('$lib/repository')

describe("Client", () => {

  let client: Client

  beforeEach(() => { client = new Client() })
  afterEach(() => { client.close() })

  it("passes", () => expect(true).toBe(true))

  describe("#fetchRepository", () => {

    let repository: Repository
    let schema: Schema

    describe("when fetching a Repository", () => {
      beforeAll(() => {
        schema = new Schema("TestEntity", {})
      })

      describe("when called on an open client", () => {

        beforeEach(async () => {
          await client.open()
          repository = client.fetchRepository(schema)
        })

        it("creates a repository with the schema and client", () => {
          expect(Repository).toHaveBeenCalledWith(schema, client)
        })

        it("returns a repository", async () => {
          expect(repository).toBeInstanceOf(Repository)
        })
      })

      describe("when called on a closed client", () => {
        beforeEach(async () => {
          await client.open()
          await client.close()
        })

        it("errors when called on a closed client", () =>
          expect(() => client.fetchRepository(schema))
            .toThrowErrorOfType(RedisOmError, "Redis connection needs to be open."))
      })

      it("errors when called on a new client", () =>
        expect(() => client.fetchRepository(schema))
          .toThrowErrorOfType(RedisOmError, "Redis connection needs to be open."))
    })
  })
})
