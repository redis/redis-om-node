import { PrettyError } from "@infinite-fansub/logger";

import { Client, Model } from "../src";
import { ModelOptions } from "../src/typings";

/*
This module allows you to define tables to use with normal redis operations
However it doesn't affect the `Search` functionality since it doesn't have suffix constrains

Keep in mind that this could be way simpler but it is written this way to try and showcase
the different features and some other possibilities
*/
class Table<T extends Model<any>> {
    readonly #oldSuffix: ModelOptions["suffix"];

    constructor(name: string, public model: T) {
        const { suffix } = model.options;
        this.#oldSuffix = suffix;

        if (typeof suffix !== "undefined") {
            if (typeof suffix === "function") throw new PrettyError("Using tables is not allowed with dynamic suffixes");

            model.options = {
                suffix: `${suffix}:${name}`
            }
        } else {
            model.options = {
                suffix: name
            }
        }
    }

    /** @internal */
    public _cleanUp(): void {
        this.model.options = {
            suffix: this.#oldSuffix
        }
    }
}

type TableFunction = ((table: Table<any>) => Table<any> | Promise<Table<any>>) | Table<any>;

const client = new Client({
    inject: {
        schema: {
            methods: {
                withTable: async function (name: string, table: TableFunction) {
                    if (typeof table === "function") (await table(new Table(name, <never>this)))._cleanUp();
                    else table._cleanUp();
                }
            }
        }
    }
});

// IIFE
(async () => {

    await client.connect().then(() => console.log("Connected!"));

    const simpleSchema = client.schema({
        name: "string",
        age: "number"
    })

    const exampleModel = client.model("test", simpleSchema);
    await exampleModel.createIndex();

    await exampleModel.createAndSave({
        $id: 1,
        name: "DidaS",
        age: 18
    });

    //#region No Tables
    const result1 = await exampleModel.get(1);

    console.log(result1)
    /*
    Expected Redis log:
    
    "JSON.GET" "redis-om:V1:test:1"
    
    Expected result:
     
    JSONDocument {
        '$global_prefix': 'redis-om',
        '$prefix': 'V1',
        '$model_name': 'test',
        '$suffix': undefined,
        '$id': '1',
        '$record_id': 'redis-om:V1:test:1',
        name: 'DidaS',
        age: 18
    }
    */

    //#endregion No Tables

    //#region With Tables

    // For some reason typescript is not passing generics around so this is a temporary solution until i figure out how to get generics working
    type ExampleTable = Table<typeof exampleModel>;
    await exampleModel.withTable("table1", async (table: ExampleTable) => {
        await table.model.createAndSave({
            $id: 1,
            name: "DidaS",
            age: 21
        })

        return table;
    });

    // This could be done in the same `withTable` call but its just to show that you can do it anywhere in the project
    await exampleModel.withTable("table1", async (table: ExampleTable) => {
        const result2 = await table.model.get(1);
        console.log(result2)
        /*
        Expected Redis log:
        
        "JSON.GET" "redis-om:V1:test:table1:1"
        
        Expected result:
        
        JSONDocument {
            '$global_prefix': 'redis-om',
            '$prefix': 'V1',
            '$model_name': 'test',
            '$suffix': 'table1',
            '$id': '1',
            '$record_id': 'redis-om:V1:test:table1:1',
            name: undefined,
            age: 21
        }
*/
        return table;
    });

    //#endregion With Tables

    await client.disconnect();

})()