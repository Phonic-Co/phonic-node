import type { OutboundCallConfig } from "../types";

export type TwilioOutboundCallParams = {
  account_sid: string;
  api_key_sid: string;
  api_key_secret: string;
  from_phone_number: string;
  to_phone_number: string;
};

export type TwilioOutboundCallConfig = OutboundCallConfig;

export type TwilioOutboundCallSuccessResponse = {
  callSid: string;
};
