export type ErrorState<T> = Partial<Record<keyof T, string[]>>;
export type Nullable<T> = T | null;
