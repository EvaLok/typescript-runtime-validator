import { assert as Assert } from "chai";
import { describe } from "mocha";
import { Validator } from "../../src/Validator";
import { resolve } from "path";

describe(`Validator`, () => {
    it(`should validate simple data`, () => {
        const sut = new Validator({
            fullTypeName: "ISimpleInterface",
            basePath: resolve("./samples"),
            absoluteFilePaths: [
                resolve(__dirname + "/samples/simple.ts")
            ]
        });

        sut.validate({
            stringProp: "asdf",
            numberProp: 1.22,
            arrayProp: [
                "apple",
                "tree"
            ],
            optionalProp: {
                fruit: "tomato",
                vegetable: "carrot"
            }
        });
    });
});
