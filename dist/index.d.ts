interface ErrorConfig {
    withStackTrace: boolean;
}

declare class ResultAsync<T, E> implements PromiseLike<Result<T, E>> {
    private _promise;
    constructor(res: Promise<Result<T, E>>);
    static fromSafePromise<T, E = never>(promise: PromiseLike<T>): ResultAsync<T, E>;
    static fromPromise<T, E>(promise: PromiseLike<T>, errorFn: (e: unknown) => E): ResultAsync<T, E>;
    static fromThrowable<A extends readonly any[], R, E>(fn: (...args: A) => Promise<R>, errorFn?: (err: unknown) => E): (...args: A) => ResultAsync<R, E>;
    static combine<T extends readonly [ResultAsync<unknown, unknown>, ...ResultAsync<unknown, unknown>[]]>(asyncResultList: T): CombineResultAsyncs<T>;
    static combine<T extends readonly ResultAsync<unknown, unknown>[]>(asyncResultList: T): CombineResultAsyncs<T>;
    static combineWithAllErrors<T extends readonly [ResultAsync<unknown, unknown>, ...ResultAsync<unknown, unknown>[]]>(asyncResultList: T): CombineResultsWithAllErrorsArrayAsync<T>;
    static combineWithAllErrors<T extends readonly ResultAsync<unknown, unknown>[]>(asyncResultList: T): CombineResultsWithAllErrorsArrayAsync<T>;
    map<A>(f: (t: T) => A | Promise<A>): ResultAsync<A, E>;
    mapErr<U>(f: (e: E) => U | Promise<U>): ResultAsync<T, U>;
    andThen<R extends Result<unknown, unknown>>(f: (t: T) => R): ResultAsync<InferOkTypes<R>, InferErrTypes<R> | E>;
    andThen<R extends ResultAsync<unknown, unknown>>(f: (t: T) => R): ResultAsync<InferAsyncOkTypes<R>, InferAsyncErrTypes<R> | E>;
    andThen<U, F>(f: (t: T) => Result<U, F> | ResultAsync<U, F>): ResultAsync<U, E | F>;
    orElse<R extends Result<T, unknown>>(f: (e: E) => R): ResultAsync<T, InferErrTypes<R>>;
    orElse<R extends ResultAsync<T, unknown>>(f: (e: E) => R): ResultAsync<T, InferAsyncErrTypes<R>>;
    orElse<A>(f: (e: E) => Result<T, A> | ResultAsync<T, A>): ResultAsync<T, A>;
    match<A>(ok: (t: T) => A, _err: (e: E) => A): Promise<A>;
    unwrapOr<A>(t: A): Promise<T | A>;
    /**
     * Emulates Rust's `?` operator in `safeTry`'s body. See also `safeTry`.
     */
    safeUnwrap(): AsyncGenerator<Err<never, E>, T>;
    then<A, B>(successCallback?: (res: Result<T, E>) => A | PromiseLike<A>, failureCallback?: (reason: unknown) => B | PromiseLike<B>): PromiseLike<A | B>;
}
declare const okAsync: <T, E = never>(value: T) => ResultAsync<T, E>;
declare const errAsync: <T = never, E = unknown>(err: E) => ResultAsync<T, E>;
declare const fromPromise: typeof ResultAsync.fromPromise;
declare const fromSafePromise: typeof ResultAsync.fromSafePromise;
declare const fromAsyncThrowable: typeof ResultAsync.fromThrowable;
declare type CombineResultAsyncs<T extends readonly ResultAsync<unknown, unknown>[]> = IsLiteralArray<T> extends 1 ? TraverseAsync<UnwrapAsync<T>> : ResultAsync<ExtractOkAsyncTypes<T>, ExtractErrAsyncTypes<T>[number]>;
declare type CombineResultsWithAllErrorsArrayAsync<T extends readonly ResultAsync<unknown, unknown>[]> = IsLiteralArray<T> extends 1 ? TraverseWithAllErrorsAsync<UnwrapAsync<T>> : ResultAsync<ExtractOkAsyncTypes<T>, ExtractErrAsyncTypes<T>[number][]>;
declare type UnwrapAsync<T> = IsLiteralArray<T> extends 1 ? Writable<T> extends [infer H, ...infer Rest] ? H extends PromiseLike<infer HI> ? HI extends Result<unknown, unknown> ? [Dedup<HI>, ...UnwrapAsync<Rest>] : never : never : [] : T extends Array<infer A> ? A extends PromiseLike<infer HI> ? HI extends Result<infer L, infer R> ? Ok<L, R>[] : never : never : never;
declare type TraverseAsync<T, Depth extends number = 5> = IsLiteralArray<T> extends 1 ? Combine<T, Depth> extends [infer Oks, infer Errs] ? ResultAsync<EmptyArrayToNever<Oks>, MembersToUnion<Errs>> : never : T extends Array<infer I> ? Combine<MemberListOf<I>, Depth> extends [infer Oks, infer Errs] ? Oks extends unknown[] ? Errs extends unknown[] ? ResultAsync<EmptyArrayToNever<Oks[number][]>, MembersToUnion<Errs[number][]>> : ResultAsync<EmptyArrayToNever<Oks[number][]>, Errs> : Errs extends unknown[] ? ResultAsync<Oks, MembersToUnion<Errs[number][]>> : ResultAsync<Oks, Errs> : never : never;
declare type TraverseWithAllErrorsAsync<T, Depth extends number = 5> = IsLiteralArray<T> extends 1 ? Combine<T, Depth> extends [infer Oks, infer Errs] ? ResultAsync<EmptyArrayToNever<Oks>, EmptyArrayToNever<Errs>> : never : Writable<T> extends Array<infer I> ? Combine<MemberListOf<I>, Depth> extends [infer Oks, infer Errs] ? Oks extends unknown[] ? Errs extends unknown[] ? ResultAsync<EmptyArrayToNever<Oks[number][]>, EmptyArrayToNever<Errs[number][]>> : ResultAsync<EmptyArrayToNever<Oks[number][]>, Errs> : Errs extends unknown[] ? ResultAsync<Oks, EmptyArrayToNever<Errs[number][]>> : ResultAsync<Oks, Errs> : never : never;
declare type Writable<T> = T extends ReadonlyArray<unknown> ? [...T] : T;

declare type ExtractOkTypes<T extends readonly Result<unknown, unknown>[]> = {
    [idx in keyof T]: T[idx] extends Result<infer U, unknown> ? U : never;
};
declare type ExtractOkAsyncTypes<T extends readonly ResultAsync<unknown, unknown>[]> = {
    [idx in keyof T]: T[idx] extends ResultAsync<infer U, unknown> ? U : never;
};
declare type ExtractErrTypes<T extends readonly Result<unknown, unknown>[]> = {
    [idx in keyof T]: T[idx] extends Result<unknown, infer E> ? E : never;
};
declare type ExtractErrAsyncTypes<T extends readonly ResultAsync<unknown, unknown>[]> = {
    [idx in keyof T]: T[idx] extends ResultAsync<unknown, infer E> ? E : never;
};
declare type InferOkTypes<R> = R extends Result<infer T, unknown> ? T : never;
declare type InferErrTypes<R> = R extends Result<unknown, infer E> ? E : never;
declare type InferAsyncOkTypes<R> = R extends ResultAsync<infer T, unknown> ? T : never;
declare type InferAsyncErrTypes<R> = R extends ResultAsync<unknown, infer E> ? E : never;

declare namespace Result {
    /**
     * Wraps a function with a try catch, creating a new function with the same
     * arguments but returning `Ok` if successful, `Err` if the function throws
     *
     * @param fn function to wrap with ok on success or err on failure
     * @param errorFn when an error is thrown, this will wrap the error result if provided
     */
    function fromThrowable<Fn extends (...args: readonly any[]) => any, E>(fn: Fn, errorFn?: (e: unknown) => E): (...args: Parameters<Fn>) => Result<ReturnType<Fn>, E>;
    function combine<T extends readonly [Result<unknown, unknown>, ...Result<unknown, unknown>[]]>(resultList: T): CombineResults<T>;
    function combine<T extends readonly Result<unknown, unknown>[]>(resultList: T): CombineResults<T>;
    function combineWithAllErrors<T extends readonly [Result<unknown, unknown>, ...Result<unknown, unknown>[]]>(resultList: T): CombineResultsWithAllErrorsArray<T>;
    function combineWithAllErrors<T extends readonly Result<unknown, unknown>[]>(resultList: T): CombineResultsWithAllErrorsArray<T>;
}
declare type Result<T, E> = Ok<T, E> | Err<T, E>;
declare const ok: <T, E = never>(value: T) => Ok<T, E>;
declare const err: <T = never, E = unknown>(err: E) => Err<T, E>;
/**
 * Evaluates the given generator to a Result returned or an Err yielded from it,
 * whichever comes first.
 *
 * This function, in combination with `Result.safeUnwrap()`, is intended to emulate
 * Rust's ? operator.
 * See `/tests/safeTry.test.ts` for examples.
 *
 * @param body - What is evaluated. In body, `yield* result.safeUnwrap()` works as
 * Rust's `result?` expression.
 * @returns The first occurence of either an yielded Err or a returned Result.
 */
declare function safeTry<T, E>(body: () => Generator<Err<never, E>, Result<T, E>>): Result<T, E>;
/**
 * Evaluates the given generator to a Result returned or an Err yielded from it,
 * whichever comes first.
 *
 * This function, in combination with `Result.safeUnwrap()`, is intended to emulate
 * Rust's ? operator.
 * See `/tests/safeTry.test.ts` for examples.
 *
 * @param body - What is evaluated. In body, `yield* result.safeUnwrap()` and
 * `yield* resultAsync.safeUnwrap()` work as Rust's `result?` expression.
 * @returns The first occurence of either an yielded Err or a returned Result.
 */
declare function safeTry<T, E>(body: () => AsyncGenerator<Err<never, E>, Result<T, E>>): Promise<Result<T, E>>;
interface IResult<T, E> {
    /**
     * Used to check if a `Result` is an `OK`
     *
     * @returns `true` if the result is an `OK` variant of Result
     */
    isOk(): this is Ok<T, E>;
    /**
     * Used to check if a `Result` is an `Err`
     *
     * @returns `true` if the result is an `Err` variant of Result
     */
    isErr(): this is Err<T, E>;
    /**
     * Maps a `Result<T, E>` to `Result<U, E>`
     * by applying a function to a contained `Ok` value, leaving an `Err` value
     * untouched.
     *
     * @param f The function to apply an `OK` value
     * @returns the result of applying `f` or an `Err` untouched
     */
    map<A>(f: (t: T) => A): Result<A, E>;
    /**
     * Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a
     * contained `Err` value, leaving an `Ok` value untouched.
     *
     * This function can be used to pass through a successful result while
     * handling an error.
     *
     * @param f a function to apply to the error `Err` value
     */
    mapErr<U>(f: (e: E) => U): Result<T, U>;
    /**
     * Similar to `map` Except you must return a new `Result`.
     *
     * This is useful for when you need to do a subsequent computation using the
     * inner `T` value, but that computation might fail.
     * Additionally, `andThen` is really useful as a tool to flatten a
     * `Result<Result<A, E2>, E1>` into a `Result<A, E2>` (see example below).
     *
     * @param f The function to apply to the current value
     */
    andThen<R extends Result<unknown, unknown>>(f: (t: T) => R): Result<InferOkTypes<R>, InferErrTypes<R> | E>;
    andThen<U, F>(f: (t: T) => Result<U, F>): Result<U, E | F>;
    /**
     * Takes an `Err` value and maps it to a `Result<T, SomeNewType>`.
     *
     * This is useful for error recovery.
     *
     *
     * @param f  A function to apply to an `Err` value, leaving `Ok` values
     * untouched.
     */
    orElse<R extends Result<unknown, unknown>>(f: (e: E) => R): Result<T, InferErrTypes<R>>;
    orElse<A>(f: (e: E) => Result<T, A>): Result<T, A>;
    /**
     * Similar to `map` Except you must return a new `Result`.
     *
     * This is useful for when you need to do a subsequent async computation using
     * the inner `T` value, but that computation might fail. Must return a ResultAsync
     *
     * @param f The function that returns a `ResultAsync` to apply to the current
     * value
     */
    asyncAndThen<U, F>(f: (t: T) => ResultAsync<U, F>): ResultAsync<U, E | F>;
    /**
     * Maps a `Result<T, E>` to `ResultAsync<U, E>`
     * by applying an async function to a contained `Ok` value, leaving an `Err`
     * value untouched.
     *
     * @param f An async function to apply an `OK` value
     */
    asyncMap<U>(f: (t: T) => Promise<U>): ResultAsync<U, E>;
    /**
     * Unwrap the `Ok` value, or return the default if there is an `Err`
     *
     * @param v the default value to return if there is an `Err`
     */
    unwrapOr<A>(v: A): T | A;
    /**
     *
     * Given 2 functions (one for the `Ok` variant and one for the `Err` variant)
     * execute the function that matches the `Result` variant.
     *
     * Match callbacks do not necessitate to return a `Result`, however you can
     * return a `Result` if you want to.
     *
     * `match` is like chaining `map` and `mapErr`, with the distinction that
     * with `match` both functions must have the same return type.
     *
     * @param ok
     * @param err
     */
    match<A>(ok: (t: T) => A, err: (e: E) => A): A;
    /**
     * Emulates Rust's `?` operator in `safeTry`'s body. See also `safeTry`.
     */
    safeUnwrap(): Generator<Err<never, E>, T>;
    /**
     * **This method is unsafe, and should only be used in a test environments**
     *
     * Takes a `Result<T, E>` and returns a `T` when the result is an `Ok`, otherwise it throws a custom object.
     *
     * @param config
     */
    _unsafeUnwrap(config?: ErrorConfig): T;
    /**
     * **This method is unsafe, and should only be used in a test environments**
     *
     * takes a `Result<T, E>` and returns a `E` when the result is an `Err`,
     * otherwise it throws a custom object.
     *
     * @param config
     */
    _unsafeUnwrapErr(config?: ErrorConfig): E;
}
declare class Ok<T, E> implements IResult<T, E> {
    readonly value: T;
    constructor(value: T);
    isOk(): this is Ok<T, E>;
    isErr(): this is Err<T, E>;
    map<A>(f: (t: T) => A): Result<A, E>;
    mapErr<U>(_f: (e: E) => U): Result<T, U>;
    andThen<R extends Result<unknown, unknown>>(f: (t: T) => R): Result<InferOkTypes<R>, InferErrTypes<R> | E>;
    andThen<U, F>(f: (t: T) => Result<U, F>): Result<U, E | F>;
    orElse<R extends Result<unknown, unknown>>(_f: (e: E) => R): Result<T, InferErrTypes<R>>;
    orElse<A>(_f: (e: E) => Result<T, A>): Result<T, A>;
    asyncAndThen<U, F>(f: (t: T) => ResultAsync<U, F>): ResultAsync<U, E | F>;
    asyncMap<U>(f: (t: T) => Promise<U>): ResultAsync<U, E>;
    unwrapOr<A>(_v: A): T | A;
    match<A>(ok: (t: T) => A, _err: (e: E) => A): A;
    safeUnwrap(): Generator<Err<never, E>, T>;
    _unsafeUnwrap(_?: ErrorConfig): T;
    _unsafeUnwrapErr(config?: ErrorConfig): E;
}
declare class Err<T, E> implements IResult<T, E> {
    readonly error: E;
    constructor(error: E);
    isOk(): this is Ok<T, E>;
    isErr(): this is Err<T, E>;
    map<A>(_f: (t: T) => A): Result<A, E>;
    mapErr<U>(f: (e: E) => U): Result<T, U>;
    andThen<R extends Result<unknown, unknown>>(_f: (t: T) => R): Result<InferOkTypes<R>, InferErrTypes<R> | E>;
    andThen<U, F>(_f: (t: T) => Result<U, F>): Result<U, E | F>;
    orElse<R extends Result<unknown, unknown>>(f: (e: E) => R): Result<T, InferErrTypes<R>>;
    orElse<A>(f: (e: E) => Result<T, A>): Result<T, A>;
    asyncAndThen<U, F>(_f: (t: T) => ResultAsync<U, F>): ResultAsync<U, E | F>;
    asyncMap<U>(_f: (t: T) => Promise<U>): ResultAsync<U, E>;
    unwrapOr<A>(v: A): T | A;
    match<A>(_ok: (t: T) => A, err: (e: E) => A): A;
    safeUnwrap(): Generator<Err<never, E>, T>;
    _unsafeUnwrap(config?: ErrorConfig): T;
    _unsafeUnwrapErr(_?: ErrorConfig): E;
}
declare const fromThrowable: typeof Result.fromThrowable;
declare type Prev = [
    never,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    ...0[]
];
declare type CollectResults<T, Collected extends unknown[] = [], Depth extends number = 50> = [
    Depth
] extends [never] ? [] : T extends [infer H, ...infer Rest] ? H extends Result<infer L, infer R> ? CollectResults<Rest, [
    ...Collected,
    [L, R]
], Prev[Depth]> : never : Collected;
declare type Transpose<A, Transposed extends unknown[][] = [], Depth extends number = 10> = A extends [infer T, ...infer Rest] ? T extends [infer L, infer R] ? Transposed extends [infer PL, infer PR] ? PL extends unknown[] ? PR extends unknown[] ? Transpose<Rest, [[...PL, L], [...PR, R]], Prev[Depth]> : never : never : Transpose<Rest, [[L], [R]], Prev[Depth]> : Transposed : Transposed;
declare type Combine<T, Depth extends number = 5> = Transpose<CollectResults<T>, [], Depth> extends [
    infer L,
    infer R
] ? [UnknownMembersToNever<L>, UnknownMembersToNever<R>] : Transpose<CollectResults<T>, [], Depth> extends [] ? [[], []] : never;
declare type Dedup<T> = T extends Result<infer RL, infer RR> ? [unknown] extends [RL] ? Err<RL, RR> : Ok<RL, RR> : T;
declare type MemberListOf<T> = ((T extends unknown ? (t: T) => T : never) extends infer U ? (U extends unknown ? (u: U) => unknown : never) extends (v: infer V) => unknown ? V : never : never) extends (_: unknown) => infer W ? [...MemberListOf<Exclude<T, W>>, W] : [];
declare type EmptyArrayToNever<T, NeverArrayToNever extends number = 0> = T extends [] ? never : NeverArrayToNever extends 1 ? T extends [never, ...infer Rest] ? [EmptyArrayToNever<Rest>] extends [never] ? never : T : T : T;
declare type UnknownMembersToNever<T> = T extends [infer H, ...infer R] ? [[unknown] extends [H] ? never : H, ...UnknownMembersToNever<R>] : T;
declare type MembersToUnion<T> = T extends unknown[] ? T[number] : never;
declare type IsLiteralArray<T> = T extends {
    length: infer L;
} ? L extends number ? number extends L ? 0 : 1 : 0 : 0;
declare type Traverse<T, Depth extends number = 5> = Combine<T, Depth> extends [infer Oks, infer Errs] ? Result<EmptyArrayToNever<Oks, 1>, MembersToUnion<Errs>> : never;
declare type TraverseWithAllErrors<T, Depth extends number = 5> = Combine<T, Depth> extends [
    infer Oks,
    infer Errs
] ? Result<EmptyArrayToNever<Oks>, EmptyArrayToNever<Errs>> : never;
declare type CombineResults<T extends readonly Result<unknown, unknown>[]> = IsLiteralArray<T> extends 1 ? Traverse<T> : Result<ExtractOkTypes<T>, ExtractErrTypes<T>[number]>;
declare type CombineResultsWithAllErrorsArray<T extends readonly Result<unknown, unknown>[]> = IsLiteralArray<T> extends 1 ? TraverseWithAllErrors<T> : Result<ExtractOkTypes<T>, ExtractErrTypes<T>[number][]>;

declare function mt<T, U>(promise: Promise<T>): Promise<Result<T, U>>;
declare const maythrow: typeof mt;

export { Err, Ok, Result, ResultAsync, err, errAsync, fromAsyncThrowable, fromPromise, fromSafePromise, fromThrowable, maythrow, mt, ok, okAsync, safeTry };
