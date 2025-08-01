import { version } from "../package.json";
import { Agents } from "./agents";
import { Conversations } from "./conversations";
import { Projects } from "./projects";
import { SpeechToSpeech } from "./sts";
import { Tools } from "./tools";
import type { DataOrError, FetchOptions, PhonicConfig } from "./types";
import { Voices } from "./voices";

const defaultBaseUrl = "https://api.phonic.co";
const defaultUserAgent = `phonic-node:${version}`;

export class Phonic {
  readonly baseUrl: string;
  readonly __downstreamWebSocketUrl: string | null;
  readonly headers: Record<string, string>;

  readonly agents = new Agents(this);
  readonly conversations = new Conversations(this);
  readonly projects = new Projects(this);
  readonly tools = new Tools(this);
  readonly voices = new Voices(this);
  readonly sts = new SpeechToSpeech(this);

  constructor(
    readonly apiKey: string,
    config?: PhonicConfig,
  ) {
    if (typeof process === "undefined") {
      throw new Error(
        "Phonic SDK is intended to be used in Node.js environment.",
      );
    }

    if (!this.apiKey) {
      throw new Error(
        'API key is missing. Pass it to the constructor: `new Phonic("ph_...")`',
      );
    }

    this.baseUrl = (config?.baseUrl ?? defaultBaseUrl).replace(/\/$/, ""); // Remove trailing slash, if exists
    this.__downstreamWebSocketUrl = config?.__downstreamWebSocketUrl || null;

    this.headers = {
      Authorization: `Bearer ${this.apiKey}`,
      "User-Agent": process.env.PHONIC_USER_AGENT || defaultUserAgent,
      "Content-Type": "application/json",
      ...config?.headers,
    };
  }

  async fetchRequest<T>(path: string, options: FetchOptions): DataOrError<T> {
    try {
      const { headers, ...restOptions } = options;
      const response = await fetch(`${this.baseUrl}/v1${path}`, {
        headers: {
          ...this.headers,
          ...headers,
        },
        ...restOptions,
      });

      if (response.ok) {
        const data = await response.json();

        return { data, error: null };
      }

      try {
        const data = await response.json();

        return {
          data: null,
          error: {
            message: data.error.message || response.statusText,
            param_errors: data.param_errors,
          },
        };
      } catch (error) {
        return {
          data: null,
          error: {
            message: response.statusText,
          },
        };
      }
    } catch (error) {
      console.error(error);

      return {
        data: null,
        error: {
          message: "Fetch request failed",
        },
      };
    }
  }

  async get<T>(path: string) {
    return this.fetchRequest<T>(path, { method: "GET" });
  }

  async post<T>(
    path: string,
    body: Record<string, unknown>,
    headers?: Record<string, string>,
  ) {
    return this.fetchRequest<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
      headers,
    });
  }

  async patch<T>(
    path: string,
    body: Record<string, unknown>,
    headers?: Record<string, string>,
  ) {
    return this.fetchRequest<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers,
    });
  }

  async put<T>(
    path: string,
    body: Record<string, unknown>,
    headers?: Record<string, string>,
  ) {
    return this.fetchRequest<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
      headers,
    });
  }

  async delete<T>(path: string, headers?: Record<string, string>) {
    return this.fetchRequest<T>(path, {
      method: "DELETE",
      headers,
    });
  }
}
