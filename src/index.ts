import { Result, ok, err } from './result'
export { Result, ok, Ok, err, Err, fromThrowable, safeTry } from './result'
export {
  ResultAsync,
  okAsync,
  errAsync,
  fromAsyncThrowable,
  fromPromise,
  fromSafePromise,
} from './result-async'

export function mt<T, U>(promise: Promise<T>): Promise<Result<T, U>> {
	return promise
		.then<Result<T, U>>((data: T) => ok(data))
		.catch<Result<T, U>>((error: U) => {
			return err(error);
		});
}

export const maythrow = mt;