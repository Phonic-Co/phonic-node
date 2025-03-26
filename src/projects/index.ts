import type { Phonic } from "../phonic";
import type { DataOrError } from "../types";
import type {
  AddConversationEvalPromptSuccessResponse,
  ConversationEvalPromptsSuccessResponse,
} from "./types";

export class Projects {
  constructor(private readonly phonic: Phonic) {}

  async listEvalPrompts(
    projectId: string,
  ): DataOrError<ConversationEvalPromptsSuccessResponse> {
    const response =
      await this.phonic.get<ConversationEvalPromptsSuccessResponse>(
        `/projects/${projectId}/conversation_eval_prompts`,
      );

    return response;
  }

  async addEvalPrompt(
    projectId: string,
    promptName: string,
    prompt: string,
  ): DataOrError<AddConversationEvalPromptSuccessResponse> {
    const response =
      await this.phonic.post<AddConversationEvalPromptSuccessResponse>(
        `/projects/${projectId}/conversation_eval_prompts`,
        {
          name: promptName,
          prompt,
        },
      );
    return response;
  }
}
