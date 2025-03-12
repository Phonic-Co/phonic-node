import { version } from "../package.json";
import { SpeechToSpeech } from "./sts";
import type { DataOrError, FetchOptions, PhonicConfig } from "./types";
import { Voices } from "./voices";

const defaultBaseUrl = "https://api.phonic.co";
const defaultUserAgent = `phonic-node:${version}`;

export class Phonic {
  readonly baseUrl: string;
  readonly __downstreamWebSocketUrl: string | null;
  readonly headers: Record<string, string>;

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
      const response = await fetch(`${this.baseUrl}/v1${path}`, {
        headers: this.headers,
        ...options,
      });

      if (!response.ok) {
        const statusText = await response.text();

        console.error(response);

        return {
          data: null,
          error: {
            message: statusText,
          },
        };
      }

      const data = await response.json();

      return { data, error: null };
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
}
