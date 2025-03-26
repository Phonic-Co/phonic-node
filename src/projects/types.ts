type ConversationEvalPrompt = {
  id: string;
  name: string;
  prompt: string;
};

export type ConversationEvalPromptsSuccessResponse = {
  conversation_eval_prompts: Array<ConversationEvalPrompt>;
};

export type AddConversationEvalPromptSuccessResponse = {
  id: string;
};
