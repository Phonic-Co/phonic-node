type Voice = {
  id: string;
  name: string;
};

export type VoicesSuccessResponse = {
  voices: Array<Voice>;
};

export type VoiceSuccessResponse = {
  voice: Voice;
};
