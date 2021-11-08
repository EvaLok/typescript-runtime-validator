import Ajv, { ValidateFunction } from "ajv";
import * as TJS from "typescript-json-schema";
import { ValidationError } from "./errors/ValidationError";
import { SchemaGenerator } from "./SchemaGenerator";

export class Validator<T> {
    private schema: any;
    private validateFunction: ValidateFunction;
    private fullTypeName: string;
    private ajv: Ajv;

    constructor( params: IValidatorParams ) {
        this.fullTypeName = params.fullTypeName;
        this.ajv = new Ajv();

        this.schema = SchemaGenerator.GenerateSchema(
            params.fullTypeName,
            params.absoluteFilePaths,
            params.compilerOptions || {
                strictNullChecks: true,
                allowSyntheticDefaultImports: true,
            },
            params.tjsSettings || {
                required: true,
            },
            params.basePath
        );

        this.validateFunction = this.generateValidateFunction();
    }

    public validate( data: any ): T {
        const valid = this.validateFunction(data);

        if ( ! valid ) {
            throw new ValidationError(
                `data does not validate based on [${this.fullTypeName}]`,
                this.validateFunction.errors || []
            );
        }

        return data as T;
    }

    private generateValidateFunction(): ValidateFunction {
        return this.ajv.compile(this.schema);
    }
}

export interface IValidatorParams {
    fullTypeName: string,
    absoluteFilePaths: Array<string>,


    compilerOptions ?: TJS.CompilerOptions,
    tjsSettings ?: TJS.PartialArgs,
    basePath ?: string,
}
