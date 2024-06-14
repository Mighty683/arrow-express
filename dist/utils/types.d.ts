export type IsUndefined<T> = undefined extends T ? (T extends undefined ? true : false) : false;
export type IsNever<T> = [T] extends [never] ? true : false;
export type IsUnknown<T> = unknown extends T ? (T extends unknown ? true : false) : false;
export type IsUndefinedOrNeverOrUnknown<T> = IsUndefined<T> extends true ? true : IsNever<T> extends true ? true : IsUnknown<T> extends true ? true : false;
