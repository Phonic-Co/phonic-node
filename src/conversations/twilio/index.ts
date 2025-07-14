import type { Phonic } from "../../phonic";
import type { DataOrError } from "../../types";
import type {
  TwilioOutboundCallConfig,
  TwilioOutboundCallParams,
  TwilioOutboundCallSuccessResponse,
} from "./types";

export class Twilio {
  constructor(private readonly phonic: Phonic) {}

  async outboundCall(
    params: TwilioOutboundCallParams,
    config: TwilioOutboundCallConfig,
  ): DataOrError<TwilioOutboundCallSuccessResponse> {
    const response = await this.phonic.post<TwilioOutboundCallSuccessResponse>(
      "/conversations/twilio/outbound_call",
      {
        from_phone_number: params.from_phone_number,
        to_phone_number: params.to_phone_number,
        config,
      },
      {
        "X-Twilio-Account-Sid": params.account_sid,
        "X-Twilio-Api-Key-Sid": params.api_key_sid,
        "X-Twilio-Api-Key-Secret": params.api_key_secret,
      },
    );

    return response;
  }
}
