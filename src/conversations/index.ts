import type { Phonic } from "../phonic";
import type { DataOrError, ISODate, ISODateTime } from "../types";
import type {
  ConversationSuccessResponse,
  ConversationsSuccessResponse,
} from "./types";

export class Conversations {
  constructor(private readonly phonic: Phonic) {}

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
}
