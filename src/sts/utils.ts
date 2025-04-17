export const generateSilentAudio = (
  input_format: "pcm_44100" | "mulaw_8000",
  lengthMs: number,
): string => {
  const format = {
    pcm_44100: {
      sampleRate: 44100,
      bytesPerSample: 2,
      silentValue: 0,
    },
    mulaw_8000: {
      sampleRate: 8000,
      bytesPerSample: 1,
      silentValue: 127, // 0x7F
    },
  };

  const params = format[input_format];

  const bytesPerMs = (params.sampleRate * params.bytesPerSample) / 1000;
  const totalBytes = Math.ceil(bytesPerMs * lengthMs);

  const buffer = new Uint8Array(totalBytes).fill(params.silentValue);

  const binaryString = Array.from(buffer)
    .map((byte) => String.fromCharCode(byte))
    .join("");

  return btoa(binaryString);
};
