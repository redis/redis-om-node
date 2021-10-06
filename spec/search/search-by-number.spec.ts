import Client from "../../lib/client";
import Entity from "../../lib/entity/entity";
import Schema from "../../lib/schema/schema";
import Search from "../../lib/search/search";
import WhereField from '../../lib/search/where-field';

interface TestEntity {
  aNumber: number;
}

class TestEntity extends Entity {}

describe("Search", () => {
  let client: Client;
  let schema: Schema<TestEntity>;

  beforeAll(async () => {
    client = new Client();
    schema = new Schema<TestEntity>(
      TestEntity, {
        aNumber: { type: 'number' }
      });
  });

  describe("#query", () => {
    let search: Search<TestEntity>;
    let where: WhereField<TestEntity>;

    const AN_EQUAL_QUERY = "(@aNumber:[42 42])";
    const A_NEGATED_EQUAL_QUERY = "(-@aNumber:[42 42])";
    const A_GT_QUERY = "(@aNumber:[(42 +inf])";
    const A_NEGATED_GT_QUERY = "(-@aNumber:[(42 +inf])";
    const A_GTE_QUERY = "(@aNumber:[42 +inf])";
    const A_NEGATED_GTE_QUERY = "(-@aNumber:[42 +inf])";
    const AN_LT_QUERY = "(@aNumber:[-inf (42])";
    const A_NEGATED_LT_QUERY = "(-@aNumber:[-inf (42])";
    const AN_LTE_QUERY = "(@aNumber:[-inf 42])";
    const A_NEGATED_LTE_QUERY = "(-@aNumber:[-inf 42])";
    const A_BETWEEN_QUERY = "(@aNumber:[23 42])";
    const A_NEGATED_BETWEEN_QUERY = "(-@aNumber:[23 42])";

    beforeEach(() => {
      search = new Search<TestEntity>(schema, client);
      where = search.where('aNumber');
    });

    describe("when generating a query with a number", () => {

      type RangeChecker = (search: Search<TestEntity>) => void;
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

      it("generates a query with .eq", () => expectToBeEqualQuery(where.eq(42)));
      it("generates a query with .not.eq", () => expectToBeNegatedEqualQuery(where.not.eq(42)));
      it("generates a query with .equals", () => expectToBeEqualQuery(where.equals(42)));
      it("generates a query with .does.equal", () => expectToBeEqualQuery(where.does.equal(42)));
      it("generates a query with .does.not.equal", () => expectToBeNegatedEqualQuery(where.does.not.equal(42)));
      it("generates a query with .is.equalTo", () => expectToBeEqualQuery(where.is.equalTo(42)));
      it("generates a query with .is.not.equalTo", () => expectToBeNegatedEqualQuery(where.is.not.equalTo(42)));

      it("generates a query with .gt", () => expectToBeGTQuery(where.gt(42)));
      it("generates a query with .not.gt", () => expectToBeNegatedGTQuery(where.not.gt(42)));
      it("generates a query with .greaterThan", () => expectToBeGTQuery(where.greaterThan(42)));
      it("generates a query with .is.greaterThan", () => expectToBeGTQuery(where.is.greaterThan(42)));
      it("generates a query with .is.not.greaterThan", () => expectToBeNegatedGTQuery(where.is.not.greaterThan(42)));
      
      it("generates a query with .gte", () => expectToBeGTEQuery(where.gte(42)));
      it("generates a query with .not.gte", () => expectToBeNegatedGTEQuery(where.not.gte(42)));
      it("generates a query with .greaterThanOrEqualTo", () => expectToBeGTEQuery(where.greaterThanOrEqualTo(42)));
      it("generates a query with .is.greaterThanOrEqualTo", () => expectToBeGTEQuery(where.is.greaterThanOrEqualTo(42)));
      it("generates a query with .is.not.greaterThanOrEqualTo", () => expectToBeNegatedGTEQuery(where.is.not.greaterThanOrEqualTo(42)));

      it("generates a query with .lt", () => expectToBeLTQuery(where.lt(42)));
      it("generates a query with .not.lt", () => expectToBeNegatedLTQuery(where.not.lt(42)));
      it("generates a query with .lessThan", () => expectToBeLTQuery(where.lessThan(42)));
      it("generates a query with .is.lessThan", () => expectToBeLTQuery(where.is.lessThan(42)));
      it("generates a query with .is.not.lessThan", () => expectToBeNegatedLTQuery(where.is.not.lessThan(42)));
      
      it("generates a query with .lte", () => expectToBeLTEQuery(where.lte(42)));
      it("generates a query with .not.lte", () => expectToBeNegatedLTEQuery(where.not.lte(42)));
      it("generates a query with .lessThanOrEqualTo", () => expectToBeLTEQuery(where.lessThanOrEqualTo(42)));
      it("generates a query with .is.lessThanOrEqualTo", () => expectToBeLTEQuery(where.is.lessThanOrEqualTo(42)));
      it("generates a query with .is.not.lessThanOrEqualTo", () => expectToBeNegatedLTEQuery(where.is.not.lessThanOrEqualTo(42)));

      it("generates a query with .between", () => expectToBeBetweenQuery(where.between(23, 42)));
      it("generates a query with .not.between", () => expectToBeNegatedBetweenQuery(where.not.between(23, 42)));
      it("generates a query with .is.between", () => expectToBeBetweenQuery(where.is.between(23, 42)));
      it("generates a query with .is.not.between", () => expectToBeNegatedBetweenQuery(where.is.not.between(23, 42)));
    });
  });
});
