import { assert as Assert } from "chai";
import { describe } from "mocha";
import { Validator } from "../../src/Validator";
import { resolve } from "path";

describe(`Validator`, () => {
    describe(`simple interface tests`, () => {
        let sut !: Validator;

        before(() => {
            sut = new Validator({
                fullTypeName: "ISimpleInterface",
                basePath: resolve("./samples"),
                absoluteFilePaths: [
                    resolve(__dirname + "/samples/simple.ts")
                ]
            });
        });

        it(`should validate simple data`, () => {
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

        it(`should not fail if optional is missing`, () => {
            sut.validate({
                stringProp: "asdf",
                numberProp: 1.22,
                arrayProp: [
                    "apple",
                    "tree"
                ],
            });
        });

        it(`should should fail if required is missing`, () => {
            let caught: any;

            try {
                sut.validate({
                    stringProp: "asdf",
                    arrayProp: [
                        "apple",
                        "tree"
                    ],
                });
            }

            catch (err: any) {
                caught = err;
            }

            finally {
                Assert.isDefined(caught);
            }

        });
    });
});
