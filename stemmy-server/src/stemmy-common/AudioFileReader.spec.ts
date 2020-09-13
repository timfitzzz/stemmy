import { AudioFileReader } from './AudioFileReader';

describe('AudioFileReader', () => {
  // beforeEach(PlatformTest.create);
  // afterEach(PlatformTest.reset);

  it('should load a test aiff file', async () => {
    const reader = new AudioFileReader('./testData/Track 0.aiff');
    await reader.read();
    expect(reader.output.format);
    if (reader.output.format) {
      expect(reader.output.format.formatID).toBe('lpcm');
    }
  });
});
