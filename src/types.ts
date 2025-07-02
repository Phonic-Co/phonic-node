export type PhonicConfig = {
  baseUrl?: string;
  headers?: Record<string, string>; // Optional request headers for all requests
  __downstreamWebSocketUrl?: string; // Intented for internal use only
};

export type FetchOptions =
  | {
      method: "GET";
      headers?: Record<string, string>;
    }
  | {
      method: "POST";
      headers?: Record<string, string>;
      body: string;
    }
  | {
      method: "PATCH";
      headers?: Record<string, string>;
      body: string;
    }
  | {
      method: "DELETE";
      headers?: Record<string, string>;
    };

export type DataOrError<T> = Promise<
  | { data: T; error: null }
  | {
      data: null;
      error: {
        message: string;
        code?: string;
        param_errors?: Record<string, string>;
      };
    }
>;

export type ISODate = `${string}-${string}-${string}`;
export type ISODateTime = `${string}Z`;
