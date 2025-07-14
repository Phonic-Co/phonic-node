import type { Phonic } from "../phonic";
import type { DataOrError, ISODate, ISODateTime } from "../types";
import { Twilio } from "./twilio";
import type {
  ConversationSuccessResponse,
  ConversationsSuccessResponse,
  OutboundCallConfig,
  OutboundCallSuccessResponse,
} from "./types";

export class Conversations {
  readonly twilio: Twilio;

  constructor(private readonly phonic: Phonic) {
    this.twilio = new Twilio(phonic);
  }

  async list({
    project,
    durationMin,
    durationMax,
    startedAtMin,
    startedAtMax,
  }: {
    project?: string;
    durationMin?: number;
    durationMax?: number;
    startedAtMin?: ISODate | ISODateTime;
    startedAtMax?: ISODate | ISODateTime;
  }): DataOrError<ConversationsSuccessResponse> {
    const queryString = new URLSearchParams({
      ...(project !== undefined && { project }),
      ...(durationMin !== undefined && { duration_min: String(durationMin) }),
      ...(durationMax !== undefined && { duration_max: String(durationMax) }),
      ...(startedAtMin !== undefined && { started_at_min: startedAtMin }),
      ...(startedAtMax !== undefined && { started_at_max: startedAtMax }),
    }).toString();
    const response = await this.phonic.get<ConversationsSuccessResponse>(
      `/conversations?${queryString}`,
    );

    return response;
  }

  async get(id: string): DataOrError<ConversationSuccessResponse> {
    const response = await this.phonic.get<ConversationSuccessResponse>(
      `/conversations/${id}`,
    );

    return response;
  }

  async getByExternalId({
    project,
    externalId,
  }: {
    project?: string;
    externalId: string;
  }): DataOrError<ConversationSuccessResponse> {
    const queryString = new URLSearchParams({
      ...(project !== undefined && { project }),
      external_id: externalId,
    }).toString();
    const response = await this.phonic.get<ConversationSuccessResponse>(
      `/conversations?${queryString}`,
    );

    return response;
  }

  async outboundCall(
    toPhoneNumber: string,
    config: OutboundCallConfig,
  ): DataOrError<OutboundCallSuccessResponse> {
    const response = await this.phonic.post<OutboundCallSuccessResponse>(
      "/conversations/outbound_call",
      {
        to_phone_number: toPhoneNumber,
        config,
      },
    );

    return response;
  }
}
