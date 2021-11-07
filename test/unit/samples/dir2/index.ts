import { IExample1 } from "../dir1";
import { ISimpleInterface } from "../simple";

export interface IExample2 {
    example1OrSimple: Array<IExample1 | ISimpleInterface>,
    example1AndSimple: Array<IExample1 & ISimpleInterface>,
}
