export type ErrorState<T> = Partial<Record<keyof T, string[]>>;
export type Nullable<T> = T | null;
export type ActionResult =
  | { success: true; message: string }
  | { success: false; message: string };
