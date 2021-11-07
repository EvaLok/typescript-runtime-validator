import Ajv, { ValidateFunction } from "ajv";
import * as TJS from "typescript-json-schema";
import { SchemaValidationError } from "./errors/SchemaValidationError";
import { SchemaGenerator } from "./SchemaGenerator";

export class Validator {
    private schema: any;
    private validateFunction: ValidateFunction;
    private fullTypeName: string;

    constructor( params: IValidatorParams ) {
        this.fullTypeName = params.fullTypeName;

        this.schema = SchemaGenerator.GenerateSchema(
            params.fullTypeName,
            params.absoluteFilePaths,
            params.compilerOptions || {
                strictNullChecks: true,
            },
            params.tjsSettings || {
                required: true,
            },
            params.basePath
        );

        this.validateFunction = this.generateValidateFunction();
    }

    public validate( data: any ) {
        const valid = this.validateFunction(data);

        if ( ! valid ) {
            throw new SchemaValidationError(
                `data does not validate based on [${this.fullTypeName}]`
            );
        }
    }

    private generateValidateFunction(): ValidateFunction {
        const ajv = new Ajv();

        return ajv.compile(this.schema);
    }
}

export interface IValidatorParams {
    fullTypeName: string,
    absoluteFilePaths: Array<string>,


    compilerOptions ?: TJS.CompilerOptions,
    tjsSettings ?: TJS.PartialArgs,
    basePath ?: string,
}
