export type PhonicConfig = {
  baseUrl?: string;
};

export type FetchOptions = {
  method: "GET";
};

export type ErrorResponse = {
  message: string;
  code?: string;
};

export type DataOrError<T> = Promise<
  { data: T; error: null } | { data: null; error: ErrorResponse }
>;
