import * as TJS from "typescript-json-schema";
import { SchemaGenerationError } from "./errors/SchemaGenerationError";

export class SchemaGenerator {
    public static GenerateSchema(
        fullTypeName: string,
        absoluteFilePaths: Array<string>,
        compilerOptions: TJS.CompilerOptions,
        basePath ?: string
    ) {
        const program = TJS.getProgramFromFiles(
            absoluteFilePaths,
            compilerOptions,
            basePath
        );

        const schema = TJS.generateSchema(program, fullTypeName);

        if ( ! schema ) {
            throw new SchemaGenerationError(
                `error generating schema for [${fullTypeName}]`
            );
        }

        return schema;
    }
}
