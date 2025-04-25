import WebSocket from "ws";
import type { Phonic } from "../phonic";
import type { DataOrError } from "../types";
import type {
  OutboundCallSuccessResponse,
  PhonicSTSConfig,
  PhonicSTSOutboundCallConfig,
} from "./types";
import { PhonicSTSWebSocket } from "./websocket";

export class SpeechToSpeech {
  constructor(private readonly phonic: Phonic) {}

  websocket(config: PhonicSTSConfig): PhonicSTSWebSocket {
    const wsBaseUrl = this.phonic.baseUrl.replace(/^http/, "ws");
    const queryString = new URLSearchParams({
      ...(this.phonic.__downstreamWebSocketUrl !== null && {
        downstream_websocket_url: this.phonic.__downstreamWebSocketUrl,
      }),
    }).toString();
    const phonicApiWsUrl = `${wsBaseUrl}/v1/sts/ws?${queryString}`;
    const ws = new WebSocket(phonicApiWsUrl, {
      headers: this.phonic.headers,
    });

    return new PhonicSTSWebSocket(ws, config);
  }

  async outboundCall(
    toPhoneNumber: string,
    config: PhonicSTSOutboundCallConfig,
  ): DataOrError<OutboundCallSuccessResponse> {
    const response = await this.phonic.post<OutboundCallSuccessResponse>(
      "/sts/outbound_call",
      {
        to_phone_number: toPhoneNumber,
        config,
      },
    );

    return response;
  }
}
