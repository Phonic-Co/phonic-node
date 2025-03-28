export type PhonicConfig = {
  baseUrl?: string;
  headers?: Record<string, string>; // Optional request headers for all requests
  __downstreamWebSocketUrl?: string; // Intented for internal use only
};

type AddEvalPromptBody = {
  name: string;
  prompt: string;
};

type EvaluateConversationBody = {
  prompt_id: string;
};

export type PostBody = AddEvalPromptBody | EvaluateConversationBody;

export type FetchOptions = { method: "GET" } | { method: "POST"; body: string };

export type ErrorResponse = {
  message: string;
  code?: string;
};

export type DataOrError<T> = Promise<
  { data: T; error: null } | { data: null; error: ErrorResponse }
>;

export type ISODate = `${string}-${string}-${string}`;
export type ISODateTime = `${string}Z`;
