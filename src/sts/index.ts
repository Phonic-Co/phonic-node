import WebSocket from "ws";
import type { Phonic } from "../phonic";
import type { DataOrError } from "../types";
import type {
  PhonicSTSConfig,
  PhonicSTSWebSocketResponseMessage,
} from "./types";
import { PhonicSTSWebSocket } from "./websocket";

export const phonicApiCloseCodes = {
  insuffucientCapacityAvailable: 4004,
} as const;

export class SpeechToSpeech {
  constructor(private readonly phonic: Phonic) {}

  private async connectToPhonicAPI(
    phonicApiWsUrl: string,
    config: PhonicSTSConfig,
  ): DataOrError<{ phonicWebSocket: PhonicSTSWebSocket }> {
    return new Promise((resolve) => {
      const ws = new WebSocket(phonicApiWsUrl, {
        headers: this.phonic.headers,
      });

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            type: "config",
            ...config,
          }),
        );
      };

      ws.onmessage = (event) => {
        if (typeof event.data !== "string") {
          throw new Error("Received non-string message");
        }

        const dataObj = JSON.parse(
          event.data,
        ) as PhonicSTSWebSocketResponseMessage;

        if (dataObj.type === "ready_to_start_conversation") {
          resolve({
            data: {
              phonicWebSocket: new PhonicSTSWebSocket(ws),
            },
            error: null,
          });
        }
      };

      ws.onerror = (error) => {
        resolve({
          data: null,
          error: {
            message: error.message,
          },
        });
      };

      ws.onclose = (event) => {
        if (event.code === phonicApiCloseCodes.insuffucientCapacityAvailable) {
          resolve({
            data: null,
            error: {
              message: event.reason,
              code: "insuffucient_capacity_available",
            },
          });
        }
      };
    });
  }

  async websocket(
    config: PhonicSTSConfig,
  ): DataOrError<{ phonicWebSocket: PhonicSTSWebSocket }> {
    const wsBaseUrl = this.phonic.baseUrl.replace(/^http/, "ws");
    const queryString = new URLSearchParams({
      ...(this.phonic.__downstreamWebSocketUrl !== null && {
        downstream_websocket_url: this.phonic.__downstreamWebSocketUrl,
      }),
    }).toString();
    const phonicApiWsUrl = `${wsBaseUrl}/v1/sts/ws?${queryString}`;

    /*
      ----+-----15sec-----+-----retryDelay-----+-----15sec-----+-----retryDelay-----+------...----
          |               |                    |               |                    |
      websocket      insufficient          websocket      insufficient          websocket
      opened         capacity              opened         capacity              opened
      and            available             and            available             and
      config         and                   config         and                   config
      sent           websocket             sent           websocket             sent
                     closed                (retry 1)      closed                (retry 2)
    */
    let retryNumber = 0;
    const maxRetries = 14;
    const retryDelay = 15000;

    while (true) {
      const connectResult = await this.connectToPhonicAPI(
        phonicApiWsUrl,
        config,
      );

      if (connectResult.data !== null) {
        return connectResult;
      }

      if (connectResult.error.code === "insuffucient_capacity_available") {
        if (retryNumber >= maxRetries) {
          return connectResult;
        }

        console.info(
          `${connectResult.error.message}, will retry in ${retryDelay / 1000}sec`,
        );

        await new Promise((resolve) => setTimeout(resolve, retryDelay));

        retryNumber += 1;

        console.info(`Retrying... ${retryNumber}/${maxRetries}`);

        continue;
      }

      return connectResult;
    }
  }
}
