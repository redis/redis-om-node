import { mocked } from 'ts-jest/utils';

import Client from "../../../lib/client";
import Search from "../../../lib/search/search";
import WhereField from '../../../lib/search/where-field';

import {
  A_DATE, A_DATE_EPOCH,
  ANOTHER_DATE, ANOTHER_DATE_EPOCH } from '../../helpers/example-data';

import { simpleSchema, SimpleEntity } from "../helpers/test-entity-and-schema";

jest.mock('../../../lib/client');


beforeEach(() => mocked(Client).mockReset());

describe("Search", () => {
  describe("#query", () => {

    let client: Client;
    let search: Search<SimpleEntity>;
    let where: WhereField<SimpleEntity>;

    const AN_EQUAL_QUERY = `(@aDate:[${A_DATE_EPOCH} ${A_DATE_EPOCH}])`;
    const A_NEGATED_EQUAL_QUERY = `(-@aDate:[${A_DATE_EPOCH} ${A_DATE_EPOCH}])`;
    const A_GT_QUERY = `(@aDate:[(${A_DATE_EPOCH} +inf])`;
    const A_NEGATED_GT_QUERY = `(-@aDate:[(${A_DATE_EPOCH} +inf])`;
    const A_GTE_QUERY = `(@aDate:[${A_DATE_EPOCH} +inf])`;
    const A_NEGATED_GTE_QUERY = `(-@aDate:[${A_DATE_EPOCH} +inf])`;
    const AN_LT_QUERY = `(@aDate:[-inf (${A_DATE_EPOCH}])`;
    const A_NEGATED_LT_QUERY = `(-@aDate:[-inf (${A_DATE_EPOCH}])`;
    const AN_LTE_QUERY = `(@aDate:[-inf ${A_DATE_EPOCH}])`;
    const A_NEGATED_LTE_QUERY = `(-@aDate:[-inf ${A_DATE_EPOCH}])`;
    const A_BETWEEN_QUERY = `(@aDate:[${ANOTHER_DATE_EPOCH} ${A_DATE_EPOCH}])`;
    const A_NEGATED_BETWEEN_QUERY = `(-@aDate:[${ANOTHER_DATE_EPOCH} ${A_DATE_EPOCH}])`;

    beforeAll(() => client = new Client());

    beforeEach(() => {
      search = new Search<SimpleEntity>(simpleSchema, client);
      where = search.where('aDate');
    });

    describe("when generating a query with a date", () => {

      type RangeChecker = (search: Search<SimpleEntity>) => void;
      const expectToBeEqualQuery: RangeChecker = search => expect(search.query).toBe(AN_EQUAL_QUERY);
      const expectToBeNegatedEqualQuery: RangeChecker = search => expect(search.query).toBe(A_NEGATED_EQUAL_QUERY);
      const expectToBeGTQuery: RangeChecker = search => expect(search.query).toBe(A_GT_QUERY);
      const expectToBeNegatedGTQuery: RangeChecker = search => expect(search.query).toBe(A_NEGATED_GT_QUERY);
      const expectToBeGTEQuery: RangeChecker = search => expect(search.query).toBe(A_GTE_QUERY);
      const expectToBeNegatedGTEQuery: RangeChecker = search => expect(search.query).toBe(A_NEGATED_GTE_QUERY);
      const expectToBeLTQuery: RangeChecker = search => expect(search.query).toBe(AN_LT_QUERY);
      const expectToBeNegatedLTQuery: RangeChecker = search => expect(search.query).toBe(A_NEGATED_LT_QUERY);
      const expectToBeLTEQuery: RangeChecker = search => expect(search.query).toBe(AN_LTE_QUERY);
      const expectToBeNegatedLTEQuery: RangeChecker = search => expect(search.query).toBe(A_NEGATED_LTE_QUERY);
      const expectToBeBetweenQuery: RangeChecker = search => expect(search.query).toBe(A_BETWEEN_QUERY);
      const expectToBeNegatedBetweenQuery: RangeChecker = search => expect(search.query).toBe(A_NEGATED_BETWEEN_QUERY);

      it("generates a query with .eq", () => expectToBeEqualQuery(where.eq(A_DATE)));
      it("generates a query with .not.eq", () => expectToBeNegatedEqualQuery(where.not.eq(A_DATE)));
      it("generates a query with .equals", () => expectToBeEqualQuery(where.equals(A_DATE)));
      it("generates a query with .does.equal", () => expectToBeEqualQuery(where.does.equal(A_DATE)));
      it("generates a query with .does.not.equal", () => expectToBeNegatedEqualQuery(where.does.not.equal(A_DATE)));
      it("generates a query with .is.equalTo", () => expectToBeEqualQuery(where.is.equalTo(A_DATE)));
      it("generates a query with .is.not.equalTo", () => expectToBeNegatedEqualQuery(where.is.not.equalTo(A_DATE)));

      it("generates a query with .gt", () => expectToBeGTQuery(where.gt(A_DATE)));
      it("generates a query with .not.gt", () => expectToBeNegatedGTQuery(where.not.gt(A_DATE)));
      it("generates a query with .greaterThan", () => expectToBeGTQuery(where.greaterThan(A_DATE)));
      it("generates a query with .is.greaterThan", () => expectToBeGTQuery(where.is.greaterThan(A_DATE)));
      it("generates a query with .is.not.greaterThan", () => expectToBeNegatedGTQuery(where.is.not.greaterThan(A_DATE)));
      
      it("generates a query with .gte", () => expectToBeGTEQuery(where.gte(A_DATE)));
      it("generates a query with .not.gte", () => expectToBeNegatedGTEQuery(where.not.gte(A_DATE)));
      it("generates a query with .greaterThanOrEqualTo", () => expectToBeGTEQuery(where.greaterThanOrEqualTo(A_DATE)));
      it("generates a query with .is.greaterThanOrEqualTo", () => expectToBeGTEQuery(where.is.greaterThanOrEqualTo(A_DATE)));
      it("generates a query with .is.not.greaterThanOrEqualTo", () => expectToBeNegatedGTEQuery(where.is.not.greaterThanOrEqualTo(A_DATE)));

      it("generates a query with .lt", () => expectToBeLTQuery(where.lt(A_DATE)));
      it("generates a query with .not.lt", () => expectToBeNegatedLTQuery(where.not.lt(A_DATE)));
      it("generates a query with .lessThan", () => expectToBeLTQuery(where.lessThan(A_DATE)));
      it("generates a query with .is.lessThan", () => expectToBeLTQuery(where.is.lessThan(A_DATE)));
      it("generates a query with .is.not.lessThan", () => expectToBeNegatedLTQuery(where.is.not.lessThan(A_DATE)));
      
      it("generates a query with .lte", () => expectToBeLTEQuery(where.lte(A_DATE)));
      it("generates a query with .not.lte", () => expectToBeNegatedLTEQuery(where.not.lte(A_DATE)));
      it("generates a query with .lessThanOrEqualTo", () => expectToBeLTEQuery(where.lessThanOrEqualTo(A_DATE)));
      it("generates a query with .is.lessThanOrEqualTo", () => expectToBeLTEQuery(where.is.lessThanOrEqualTo(A_DATE)));
      it("generates a query with .is.not.lessThanOrEqualTo", () => expectToBeNegatedLTEQuery(where.is.not.lessThanOrEqualTo(A_DATE)));

      it("generates a query with .on", () => expectToBeEqualQuery(where.on(A_DATE)));
      it("generates a query with .not.on", () => expectToBeNegatedEqualQuery(where.not.on(A_DATE)));
      it("generates a query with .is.on", () => expectToBeEqualQuery(where.is.on(A_DATE)));
      it("generates a query with .is.not.on", () => expectToBeNegatedEqualQuery(where.is.not.on(A_DATE)));

      it("generates a query with .before", () => expectToBeLTQuery(where.before(A_DATE)));
      it("generates a query with .not.before", () => expectToBeNegatedLTQuery(where.not.before(A_DATE)));
      it("generates a query with .is.before", () => expectToBeLTQuery(where.is.before(A_DATE)));
      it("generates a query with .is.not.before", () => expectToBeNegatedLTQuery(where.is.not.before(A_DATE)));

      it("generates a query with .onOrBefore", () => expectToBeLTEQuery(where.onOrBefore(A_DATE)));
      it("generates a query with .not.onOrBefore", () => expectToBeNegatedLTEQuery(where.not.onOrBefore(A_DATE)));
      it("generates a query with .is.onOrBefore", () => expectToBeLTEQuery(where.is.onOrBefore(A_DATE)));
      it("generates a query with .is.not.onOrBefore", () => expectToBeNegatedLTEQuery(where.is.not.onOrBefore(A_DATE)));

      it("generates a query with .after", () => expectToBeGTQuery(where.after(A_DATE)));
      it("generates a query with .not.after", () => expectToBeNegatedGTQuery(where.not.after(A_DATE)));
      it("generates a query with .is.after", () => expectToBeGTQuery(where.is.after(A_DATE)));
      it("generates a query with .is.not.after", () => expectToBeNegatedGTQuery(where.is.not.after(A_DATE)));

      it("generates a query with .onOrAfter", () => expectToBeGTEQuery(where.onOrAfter(A_DATE)));
      it("generates a query with .not.onOrAfter", () => expectToBeNegatedGTEQuery(where.not.onOrAfter(A_DATE)));
      it("generates a query with .is.onOrAfter", () => expectToBeGTEQuery(where.is.onOrAfter(A_DATE)));
      it("generates a query with .is.not.onOrAfter", () => expectToBeNegatedGTEQuery(where.is.not.onOrAfter(A_DATE)));

      it("generates a query with .between", () => expectToBeBetweenQuery(where.between(ANOTHER_DATE, A_DATE)));
      it("generates a query with .not.between", () => expectToBeNegatedBetweenQuery(where.not.between(ANOTHER_DATE, A_DATE)));
      it("generates a query with .is.between", () => expectToBeBetweenQuery(where.is.between(ANOTHER_DATE, A_DATE)));
      it("generates a query with .is.not.between", () => expectToBeNegatedBetweenQuery(where.is.not.between(ANOTHER_DATE, A_DATE)));
    });
  });
});