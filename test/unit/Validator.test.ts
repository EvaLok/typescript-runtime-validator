import { assert as Assert } from "chai";
import { describe } from "mocha";
import { Validator } from "../../src";
import { resolve } from "path";
import { IExample1 } from "./samples/dir1";
import { IExample2 } from "./samples/dir2";
import { ISimpleInterface } from "./samples/simple";

describe(`Validator`, function() {
    this.timeout(30000);

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
        let sut !: Validator<IExample1>;

        before(() => {
            sut = new Validator({
                fullTypeName: "IExample1",
                basePath: resolve("./samples"),
                absoluteFilePaths: [
                    resolve(__dirname + "/samples/dir1/index.ts")
                ]
            });
        });

        it(`should validate correct data`, () => {
            const data = sut.validate({
                simple: {
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
                }
            });

            Assert.equal(data.simple.numberProp, 1.22);
        });

        it(`should fail if optional data is incorrect type`, () => {
            let caught: any;

            try {
                const data = sut.validate({
                    simple: {
                        stringProp: "asdf",
                        numberProp: 1.22,
                        arrayProp: [
                            "apple",
                            "tree"
                        ],
                        optionalProp: {
                            fruit: "not-a-fruit", // incorrect type
                            vegetable: "carrot"
                        }
                    }
                });
            }

            catch (err: any) {
                caught = err;
            }

            finally {
                Assert.isDefined(caught);
                Assert.equal(caught.ajvErrors[0].message,
                    `must be equal to one of the allowed values`
                );
            }
        });
    });

    describe(`example2 (using union / intersect) tests`, () => {
        let sut !: Validator<IExample2>;

        before(() => {
            sut = new Validator({
                fullTypeName: "IExample2",
                basePath: resolve("./samples"),
                absoluteFilePaths: [
                    resolve(__dirname + "/samples/dir2/index.ts")
                ]
            });
        });

        it(`should validate correct data`, () => {
            const data = sut.validate({
                example1OrSimple: [{
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
                }],
                example1AndSimple: [{
                    stringProp: "asdf",
                    numberProp: 1.22,
                    arrayProp: [
                        "apple",
                        "tree"
                    ],
                    optionalProp: {
                        fruit: "tomato",
                        vegetable: "carrot"
                    },
                    simple: {
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
                    }
                }]
            });
        });

        it(`should fail if data is incorrect form`, () => {
            let caught: any;

            try {
                const data = sut.validate({
                    example1OrSimple: [{
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
                    }],
                    example1AndSimple: [{
                        stringProp: "asdf",
                        numberProp: 1.22,
                        arrayProp: [
                            "apple",
                            "tree"
                        ],
                        optionalProp: {
                            fruit: "tomato",
                            vegetable: "carrot"
                        },
                        simple: {
                            stringProp: "asdf",
                            numberProp: 1.22,
                            arrayProp: [
                                "apple",
                                "tree"
                            ],
                            optionalProp: {
                                fruit: "tomato",
                                vegetable: "not-a-veg" // incorrect type
                            }
                        }
                    }]
                });
            }

            catch (err: any) {
                caught = err;
            }

            finally {
                Assert.isDefined(caught);
                Assert.equal(caught.ajvErrors[0].message,
                    `must be equal to one of the allowed values`
                );
            }
        });
    });
});
