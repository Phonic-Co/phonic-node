import type {
  PhonicSTSConfigWithAgent,
  PhonicSTSConfigWithProject,
} from "../sts/types";
import type { Conversation } from "../types";

export type ConversationSuccessResponse = {
  conversation: Conversation;
};

export type ConversationsSuccessResponse = {
  conversations: Array<Conversation>;
};

export type OutboundCallConfig =
  | Omit<PhonicSTSConfigWithAgent, "input_format" | "output_format">
  | Omit<PhonicSTSConfigWithProject, "input_format" | "output_format">;

export type OutboundCallSuccessResponse = {
  conversation_id: string;
};
