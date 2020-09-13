declare module 'node-wav' {
  type AudioChannels = number[][];

  interface WavData {
    sampleRate: number;
    channelData: AudioChannels;
  }

  function decode(buffer: Buffer): WavData;
  function encode(
    channelData: number[][],
    opts?: { sampleRate: number; float: boolean; bitDepth: number }
  ): Buffer;
}
