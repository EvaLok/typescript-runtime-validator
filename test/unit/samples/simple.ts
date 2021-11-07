export interface ISimpleInterface {
    stringProp: string,
    numberProp: number,
    arrayProp: Array<string>,
    optionalProp ?: {
        fruit: "tomato" | "orange",
        vegetable: "carrot" | "beet"
    }
}
