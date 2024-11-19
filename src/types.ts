export type PhonicConfigBaseUrl = `http://${string}` | `https://${string}`;

export type PhonicConfig = {
  baseUrl?: PhonicConfigBaseUrl;
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
