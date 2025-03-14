import type { Phonic } from "../phonic";
import type { DataOrError } from "../types";
import type { ConversationSuccessResponse } from "./types";

export class Conversations {
  constructor(private readonly phonic: Phonic) {}

  async get(id: string): DataOrError<ConversationSuccessResponse> {
    const response = await this.phonic.get<ConversationSuccessResponse>(
      `/conversations/${id}`,
    );

    return response;
  }

  async getByExternalId(
    externalId: string,
  ): DataOrError<ConversationSuccessResponse> {
    const response = await this.phonic.get<ConversationSuccessResponse>(
      `/conversations?external_id=${externalId}`,
    );

    return response;
  }
}
