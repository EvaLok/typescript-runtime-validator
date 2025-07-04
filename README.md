## deprecated - use `typia` instead
thanks to @samchon we now have `typia`, which you should use instead of this library, as it's more efficient and ergonomic: https://github.com/samchon/typia

## what
validate typescript at runtime using preexisting `.ts` type definitions (no need to create schemas ahead of time!) 

## quickstart
```typescript
import { resolve } from "path";

// set your type as generic
const validator = new Validator<YourType>({
    // full name of type as string
    fullTypeName: "YourType",
    // base path of your app (needed if your type contains references to types in other files)
    // you could also put all paths in `absoluteFilePaths` but that's usually tedious
    basePath: resolve("./base_path_of_project"), 
    absoluteFilePaths: [
        // file that contains your interface / type
        resolve(__dirname + "/path/to/your/type.ts")
    ]
});

// typed object from json data or whatever
const typedConfig = validator.validate({
    some: "properties",
    would: "be here",
});
```

## install
```bash 
yarn add typescript-runtime-validator
```

## purpose 
this validator simply wraps `ajv` and `typescript-json-schema` in order to allow for relatively simple and fast runtime validation (initial schema building is fairly slow, but subsequent validations using the same schema should be fast)

### with `node-config`
i was having a bit of pain using `node-config` (https://github.com/lorenwest/node-config). there is semi-working typescript schema support (https://github.com/lorenwest/node-config/wiki/Configuration-Files#typescript---ts), but in my case i simply wanted to verify that json conformed to a given interface at runtime in order to avoid possible issues with typos or so 

### with remotely fetched data
after a `Validator` instance has been instantiated, the schema has been cached, and thus subsequent runtime validations are fairly quick. thus, if you are using remotely fetched data and need to be extra sure that it is valid, this package may be useful (there is of course always a non-zero performance cost, tho). one reasonable compromise is to only validate the first data received or validate every nth data.

## usage

### basic
instantiate validator, then use it to validate your data. see additional examples here: https://github.com/EvaLok/typescript-runtime-validator/blob/master/test/unit/Validator.test.ts

```typescript
const sut = new Validator<ISimpleInterface>({
    fullTypeName: "ISimpleInterface",
    basePath: resolve("./samples"),
    absoluteFilePaths: [
        resolve(__dirname + "/samples/simple.ts")
    ]
});

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

```

### with `node-config`

```typescript
import config from "config";
import { resolve } from "path";

const validator = new Validator<ISimpleInterface>({
    fullTypeName: "ISimpleInterface",
    basePath: resolve("./samples"), // base path of your app (needed if your type contains references to types in other files)
    absoluteFilePaths: [
        // file that contains your interface / type
        resolve(__dirname + "/samples/simple.ts")
    ]
});

// typedConfig will be of ISimpleInterface (presuming it validates)
const typedConfig = validator.validate(config);

console.log(typedConfig.stringProp); // gives a string

```

## wishlist
- performance tests (these are interesting to me, but as i'm only using this personally for single validations at startup, it's not so important in my case)

## contributing
i'm happy to merge reasonable pull requests that are within the scope of purpose, but to be sure and not waste time, please first create an issue so that we can discuss any changes. any additional functionality needs to be accompanied by corresponding tests
