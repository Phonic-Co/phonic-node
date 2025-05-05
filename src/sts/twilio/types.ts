import type { PhonicSTSOutboundCallConfig } from "../types";

export type PhonicSTSTwilioOutboundCallParams = {
  account_sid: string;
  api_key_sid: string;
  api_key_secret: string;
  from_phone_number: string;
  to_phone_number: string;
};

export type PhonicSTSTwilioOutboundCallConfig = PhonicSTSOutboundCallConfig;

export type TwilioOutboundCallSuccessResponse = {
  success: true;
  callSid: string;
};
