import { Point } from '../../../lib'

import { Client } from "$lib/client"
import { Search, WhereField } from "$lib/search"

import { A_POINT } from '../../helpers/example-data'
import { simpleSchema } from "../helpers/test-entity-and-schema"


describe("Search", () => {
  describe("#query", () => {

    let client: Client
    let search: Search
    let where: WhereField

    const A_DEFAULT_QUERY = "(@aPoint:[0 0 1 m])"
    const A_METERS_QUERY = "(@aPoint:[12.34 56.78 42 m])"
    const A_NEGATED_METERS_QUERY = "(-@aPoint:[12.34 56.78 42 m])"
    const A_KILOMETERS_QUERY = "(@aPoint:[12.34 56.78 42 km])"
    const A_NEGATED_KILOMETERS_QUERY = "(-@aPoint:[12.34 56.78 42 km])"
    const A_FEET_QUERY = "(@aPoint:[12.34 56.78 42 ft])"
    const A_NEGATED_FEET_QUERY = "(-@aPoint:[12.34 56.78 42 ft])"
    const A_MILES_QUERY = "(@aPoint:[12.34 56.78 42 mi])"
    const A_NEGATED_MILES_QUERY = "(-@aPoint:[12.34 56.78 42 mi])"

    type GeoChecker = (search: Search) => void
    const expectToBeDefaultQuery: GeoChecker = search => expect(search.query).toBe(A_DEFAULT_QUERY)
    const expectToBeMetersQuery: GeoChecker = search => expect(search.query).toBe(A_METERS_QUERY)
    const expectToBeNegatedMetersQuery: GeoChecker = search => expect(search.query).toBe(A_NEGATED_METERS_QUERY)
    const expectToBeKilometersQuery: GeoChecker = search => expect(search.query).toBe(A_KILOMETERS_QUERY)
    const expectToBeNegatedKilometersQuery: GeoChecker = search => expect(search.query).toBe(A_NEGATED_KILOMETERS_QUERY)
    const expectToBeFeetQuery: GeoChecker = search => expect(search.query).toBe(A_FEET_QUERY)
    const expectToBeNegatedFeetQuery: GeoChecker = search => expect(search.query).toBe(A_NEGATED_FEET_QUERY)
    const expectToBeMilesQuery: GeoChecker = search => expect(search.query).toBe(A_MILES_QUERY)
    const expectToBeNegatedMilesQuery: GeoChecker = search => expect(search.query).toBe(A_NEGATED_MILES_QUERY)

    const point: Point = A_POINT
    const longitude = 12.34
    const latitude = 56.78

    beforeAll(() => {
      client = new Client()
    })

    beforeEach(() => {
      search = new Search(simpleSchema, client)
      where = search.where('aPoint')
    })

    describe("when generating a query with a point", () => {

      describe("and in a circle", () => {

        it("generates a query with default values using .inCircle",
          () => expectToBeDefaultQuery(where.inCircle(circle => circle)))
        it("generates a query with default values using .inRadius",
          () => expectToBeDefaultQuery(where.inRadius(circle => circle)))

        it("generates a query with .point(point).radius.meters",
          () => expectToBeMetersQuery(where.inCircle(circle => circle.origin(point).radius(42).meters)))
        it("generates a query with .point(lng, lat).radius.meter",
          () => expectToBeMetersQuery(where.is.inCircle(circle => circle.origin(longitude, latitude).radius(42).meter)))
        it("generates a query with .longitude.latitude.radius.m",
          () => expectToBeNegatedMetersQuery(where.is.not.inCircle(circle => circle.longitude(longitude).latitude(latitude).radius(42).m)))

        it("generates a query with .point(point).radius.kilometers",
          () => expectToBeKilometersQuery(where.inCircle(circle => circle.origin(point).radius(42).kilometers)))
        it("generates a query with .point(lng, lat).radius.kilometer",
          () => expectToBeKilometersQuery(where.is.inCircle(circle => circle.origin(longitude, latitude).radius(42).kilometer)))
        it("generates a query with .longitude.latitude.radius.km",
          () => expectToBeNegatedKilometersQuery(where.is.not.inCircle(circle => circle.longitude(longitude).latitude(latitude).radius(42).km)))

        it("generates a query with .point(point).radius.feet",
          () => expectToBeFeetQuery(where.inCircle(circle => circle.origin(point).radius(42).feet)))
        it("generates a query with .point(lng, lat).radius.foot",
          () => expectToBeFeetQuery(where.is.inCircle(circle => circle.origin(longitude, latitude).radius(42).foot)))
        it("generates a query with .longitude.latitude.radius.ft",
          () => expectToBeNegatedFeetQuery(where.is.not.inCircle(circle => circle.longitude(longitude).latitude(latitude).radius(42).ft)))

        it("generates a query with .point(point).radius.miles",
          () => expectToBeMilesQuery(where.inCircle(circle => circle.origin(point).radius(42).miles)))
        it("generates a query with .point(lng, lat).radius.mile",
          () => expectToBeMilesQuery(where.is.inCircle(circle => circle.origin(longitude, latitude).radius(42).mile)))
        it("generates a query with .longitude.latitude.radius.mi",
          () => expectToBeNegatedMilesQuery(where.is.not.inCircle(circle => circle.longitude(longitude).latitude(latitude).radius(42).mi)))
      })
    })
  })
})
