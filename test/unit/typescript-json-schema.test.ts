import { assert as Assert } from "chai";
import { describe } from "mocha";
import { resolve } from "path";
import * as TJS from "typescript-json-schema";

describe(`typescript-json-schema`, () => {


    it(`should work for simple interfaces`, () => {
        const compilerOptions: TJS.CompilerOptions = {
            strictNullChecks: true,
        };

        const basePath = "./samples";

        const program = TJS.getProgramFromFiles(
            [resolve(__dirname + "/samples/simple.ts")],
            compilerOptions,
            basePath
        );

        const schema = TJS.generateSchema(program, "ISimpleInterface")!;

        Assert.isNotNull(schema);

        const jsonSchema = JSON.parse(JSON.stringify(schema));
        Assert.equal(jsonSchema.properties.stringProp.type, "string");
        Assert.equal(jsonSchema.properties.numberProp.type, "number");
        Assert.equal(jsonSchema.properties.arrayProp.type, "array");
        Assert.deepEqual(jsonSchema.properties.optionalProp.properties.fruit.enum, [
            "orange",
            "tomato",
        ]);
        Assert.deepEqual(jsonSchema.properties.optionalProp.properties.vegetable.enum, [
            "beet",
            "carrot",
        ]);
    });


});
