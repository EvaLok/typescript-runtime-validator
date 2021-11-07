import { assert as Assert } from "chai";
import { describe } from "mocha";
import { Validator } from "../../src";
import { resolve } from "path";
import { ISimpleInterface } from "./samples/simple";

describe(`Validator`, () => {
    describe(`simple interface tests`, () => {
        let sut !: Validator<ISimpleInterface>;

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
            let caught !: any;

            try {
                sut.validate({
                    stringProp: "asdf",
                    // missing numberProp
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
                Assert.equal(caught.ajvErrors[0].message,
                    `must have required property 'numberProp'`
                );
            }
        });

        it(`should should fail if type is incorrect`, () => {
            let caught: any;

            try {
                sut.validate({
                    stringProp: "asdf",
                    numberProp: 1.22,
                    arrayProp: [
                        "apple",
                        "tree",
                        123 // not a string
                    ],
                });
            }

            catch (err: any) {
                caught = err;
            }

            finally {
                Assert.isDefined(caught);
                Assert.equal(caught.ajvErrors[0].message,
                    `must be string`
                );
            }
        });
    });

    describe(`example1 (using simple as a property) tests`, () => {

    })
});
