import { assert as Assert } from "chai";
import { describe } from "mocha";
import { resolve } from "path";
import * as TJS from "typescript-json-schema";

describe(`typescript-json-schema`, () => {
    const compilerOptions: TJS.CompilerOptions = {
        strictNullChecks: true,
    };
    const basePath = "./samples";

    it(`should work for simple interfaces`, () => {
        const program = TJS.getProgramFromFiles(
            [resolve(__dirname + "/samples/simple.ts")],
            compilerOptions,
            basePath
        );

        const schema = TJS.generateSchema(program, "ISimpleInterface")!;

        Assert.isNotNull(schema);

        const jsonSchema = JSON.parse(JSON.stringify(schema));
        assertSimpleJsonSchemaCorrect(jsonSchema);
    });

    it(`should work for example1 (using simple as property)`, () => {
        const program = TJS.getProgramFromFiles(
            [resolve(__dirname + "/samples/dir1/index.ts")],
            compilerOptions,
            basePath
        );

        const schema = TJS.generateSchema(program, "IExample1")!;

        Assert.isNotNull(schema);
        const jsonSchema = JSON.parse(JSON.stringify(schema));
        Assert.equal(jsonSchema.properties.simple['$ref'], "#/definitions/ISimpleInterface");
        assertSimpleJsonSchemaCorrect(jsonSchema.definitions.ISimpleInterface)
    });

    it(`should work for example2 (using union / intersect)`, () => {
        const program = TJS.getProgramFromFiles(
            [resolve(__dirname + "/samples/dir2/index.ts")],
            compilerOptions,
            basePath
        );

        const schema = TJS.generateSchema(program, "IExample2")!;

        Assert.isNotNull(schema);
        const jsonSchema = JSON.parse(JSON.stringify(schema));
        Assert.isArray(jsonSchema.properties.example1OrSimple.items.anyOf);
        Assert.deepEqual(jsonSchema.properties.example1OrSimple.items.anyOf, [
            {
                "$ref": "#/definitions/ISimpleInterface"
            },
            {
                "$ref": "#/definitions/IExample1"
            }
        ]);

        Assert.isArray(jsonSchema.properties.example1AndSimple.items.allOf);
        Assert.deepEqual(jsonSchema.properties.example1AndSimple.items.allOf, [
            {
                "$ref": "#/definitions/IExample1"
            },
            {
                "$ref": "#/definitions/ISimpleInterface"
            }
        ]);
    });
});

function assertSimpleJsonSchemaCorrect( jsonSchema: any ) {
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
}
