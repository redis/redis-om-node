export type Narrow<T = unknown> =
    | _Narrow<T, 0 | number & {}>
    | _Narrow<T, 0n | bigint & {}>
    | _Narrow<T, "" | string & {}>
    | _Narrow<T, boolean>
    | _Narrow<T, symbol>
    | _Narrow<T, []>
    | _Narrow<T, { [_: PropertyKey]: Narrow }>
    | (T extends object ? { [K in keyof T]: Narrow<T[K]> } : never)
    | Extract<{} | null | undefined, T>;

// eslint-disable-next-line @typescript-eslint/naming-convention
type _Narrow<T, U> = [U] extends [T] ? U : Extract<T, U>;

export type Expand<T> = T extends T ? { [K in keyof T]: T[K] } : never;