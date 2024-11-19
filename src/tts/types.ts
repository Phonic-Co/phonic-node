export type PhonicWebSocketMessage = {
  type: "generate";
  script: string;
  output_format: "pcm_44100" | "mulaw_8000";
};

export type PhonicWebSocketResponseMessage = {
  type: "stream-ended";
  error?: {
    message: string;
    code?: string;
  };
};

export type OnMessageCallback = (
  data: PhonicWebSocketResponseMessage | Buffer,
) => void;
