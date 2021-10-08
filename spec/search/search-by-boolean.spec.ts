import { mocked } from 'ts-jest/utils';

import Client from "../../lib/client";
import Search from "../../lib/search/search";
import WhereField from '../../lib/search/where-field';

import { simpleSchema, SimpleEntity } from "../helpers/test-entity-and-schema";

jest.mock('../../lib/client');


beforeEach(() => mocked(Client).mockReset());

describe("Search", () => {
  describe("#query", () => {

    let client: Client;
    let search: Search<SimpleEntity>;
    let where: WhereField<SimpleEntity>;

    const A_TRUE_QUERY = "(@aBoolean:{1})";
    const A_FALSE_QUERY = "(@aBoolean:{0})";
    const A_NEGATED_TRUE_QUERY = "(-@aBoolean:{1})";
    const A_NEGATED_FALSE_QUERY = "(-@aBoolean:{0})";

    beforeAll(() => client = new Client());
  
    beforeEach(() => {
      search = new Search<SimpleEntity>(simpleSchema, client);
      where = search.where('aBoolean');
    });  

    describe("when generating a query with a boolean", () => {

      type BooleanChecker = (search: Search<SimpleEntity>) => void;
      const expectToBeTrueQuery: BooleanChecker = search => expect(search.query).toBe(A_TRUE_QUERY);
      const expectToBeFalseQuery: BooleanChecker = search => expect(search.query).toBe(A_FALSE_QUERY);
      const expectToBeNegatedTrueQuery: BooleanChecker = search => expect(search.query).toBe(A_NEGATED_TRUE_QUERY);
      const expectToBeNegatedFalseQuery: BooleanChecker = search => expect(search.query).toBe(A_NEGATED_FALSE_QUERY);

      it("generates a query with .eq", () => expectToBeTrueQuery(where.eq(true)));
      it("generates a query with .not.eq", () => expectToBeNegatedTrueQuery(where.not.eq(true)));
      it("generates a query with .equals", () => expectToBeTrueQuery(where.equals(true)));
      it("generates a query with .does.equal", () => expectToBeTrueQuery(where.does.equal(true)));
      it("generates a query with .does.not.equal", () => expectToBeNegatedTrueQuery(where.does.not.equal(true)));
      it("generates a query with .is.equalTo", () => expectToBeTrueQuery(where.is.equalTo(true)));
      it("generates a query with .is.not.equalTo", () => expectToBeNegatedTrueQuery(where.is.not.equalTo(true)));

      it("generates a query with .true", () => expectToBeTrueQuery(where.true()));
      it("generates a query with .is.true", () => expectToBeTrueQuery(where.is.true()));
      it("generates a query with .is.not.true", () => expectToBeNegatedTrueQuery(where.is.not.true()));

      it("generates a query with .false", () => expectToBeFalseQuery(where.false()));
      it("generates a query with .is.false", () => expectToBeFalseQuery(where.is.false()));
      it("generates a query with .is.not.false", () => expectToBeNegatedFalseQuery(where.is.not.false()));
    });
  });
});
