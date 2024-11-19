import type { Phonic } from "../phonic";
import type { DataOrError } from "../types";
import type { VoiceSuccessResponse, VoicesSuccessResponse } from "./types";

export class Voices {
  constructor(private readonly phonic: Phonic) {}

  async list(): DataOrError<VoicesSuccessResponse> {
    const response = await this.phonic.get<VoicesSuccessResponse>("/voices");

    return response;
  }

  async get(id: string): DataOrError<VoiceSuccessResponse> {
    const response = await this.phonic.get<VoiceSuccessResponse>(
      `/voices/${id}`,
    );

    return response;
  }
}
