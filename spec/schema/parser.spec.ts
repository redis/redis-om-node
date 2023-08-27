import { Schema } from "../../src"

describe("Test if parser is throwing errors when fields are passed in wrong", () => {
    test("Object as string", () => {
        expect(() => new Schema({
            //@ts-expect-error This is on purpose to see if the parser is throwing or not
            objectField: "object"
        })).toThrow();
    });
})