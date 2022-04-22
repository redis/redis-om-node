import Point from "./entity/point";

interface Map {
    string: string;
    number: number;
    boolean: boolean;
    text: string;
    date: Date;
    point: Point;
    array: Array<string | number | boolean>
}

export type MapSchema<T extends Record<string, Record<string, keyof Map>>> = {
    [K in keyof T]: Map[T[K]["type"]]
}

export function mapSchema<T extends Record<string, Record<string, keyof Map>>>(options: T): MapSchema<typeof options> {
    return <any>options
}