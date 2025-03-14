type ISODateTime = `${string}Z`;

type ConversationItem =
  | {
      role: "user";
      item_idx: number;
      text: string;
      duration_ms: number;
      started_at: string;
    }
  | {
      role: "assistant";
      item_idx: number;
      text: string;
      voice_id: string;
      system_prompt: string;
      output_audio_speed: number;
      duration_ms: number;
      started_at: string;
    };

type Conversation = {
  id: string;
  external_id: string | null;
  model: string;
  welcome_message: string | null;
  input_format: "pcm_44100" | "mulaw_8000";
  output_format: "pcm_44100" | "mulaw_8000";
  text: string;
  duration_ms: number;
  started_at: ISODateTime;
  ended_at: ISODateTime;
  items: Array<ConversationItem>;
};

export type ConversationSuccessResponse = {
  conversation: Conversation;
};
