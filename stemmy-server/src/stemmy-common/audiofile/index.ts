import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { constructorOf } from '@tsed/core';

interface DecodedAudioFile {
  channels: Float32Array[];
  length: number;
  sampleRate: number;
  bitDepth: number;
}

interface ChunkHeader {
  name: string;
  length: number;
}

export class AudioFileRequest {
  extension: string;

  constructor(public url: string, public async: boolean = true) {
    var splitURL = url.split('.');
    this.extension = splitURL[splitURL.length - 1].toLowerCase();
  }

  onSuccess = function (decoded: DecodedAudioFile | null): void {};

  onFailure = function (): void {};

  send(): void {
    if (
      this.extension != 'wav' &&
      this.extension != 'aiff' &&
      this.extension != 'aif'
    ) {
      this.onFailure();
      return;
    }

    const request = new XMLHttpRequest();
    request.open('GET', this.url, this.async);
    request.overrideMimeType('text/plain; charset=x-user-defined');
    request.onreadystatechange = function (event: Event) {
      if (request.readyState == 4) {
        if (request.status == 200 || request.status == 0) {
          this.handleResponse(request.responseText);
        } else {
          this.onFailure();
        }
      }
    }.bind(this);
    request.send(null);
  }

  handleResponse(data: string): void {
    if (this.extension === 'wav') {
      let decoder = new WAVDecoder();
      let decodedData = decoder.decode(data);
      if (decodedData) {
        this.onSuccess(decodedData);
      } else {
        this.onFailure();
      }
    } else if (this.extension === 'aiff' || this.extension === 'aif') {
      let decoder = new AIFFDecoder();
      let decodedData = decoder.decode(data);
      if (decodedData) {
        this.onSuccess(decodedData);
      } else {
        this.onFailure();
      }
    }
  }
}

export class Decoder {
  readString(data: string, offset: number, length: number): string {
    return data.slice(offset, offset + length);
  }

  readIntL(data: string, offset: number, length: number): number {
    let value: number = 0;
    for (var i = 0; i < length; i++) {
      value = value + (data.charCodeAt(offset + i) & 0xff) * Math.pow(2, 8 * i);
    }
    return value;
  }

  readChunkHeaderL(data: string, offset: number): ChunkHeader {
    const chunkHeader: ChunkHeader = {
      name: this.readString(data, offset, 4),
      length: this.readIntL(data, offset + 4, 4),
    };
    return chunkHeader;
  }

  readIntB(data: string, offset: number, length: number): number {
    var value = 0;
    for (var i = 0; i < length; i++) {
      value =
        value +
        (data.charCodeAt(offset + i) & 0xff) *
          Math.pow(2, 8 * (length - i - 1));
    }
    return value;
  }

  readChunkHeaderB(data: string, offset: number): ChunkHeader {
    const chunk: ChunkHeader = {
      name: this.readString(data, offset, 4),
      length: this.readIntB(data, offset + 4, 4),
    };
    return chunk;
  }

  readFloatB(data: string, offset: number): number {
    var expon: number = this.readIntB(data, offset, 2);
    var range = 1 << (16 - 1);
    if (expon >= range) {
      expon |= ~(range - 1);
    }

    var sign = 1;
    if (expon < 0) {
      sign = -1;
      expon += range;
    }

    var himant: number = this.readIntB(data, offset + 2, 4);
    var lomant: number = this.readIntB(data, offset + 6, 4);
    var value;
    if (expon == 0 && himant == 0 && lomant == 0) {
      value = 0;
    } else if (expon == 0x7fff) {
      value = Number.MAX_VALUE;
    } else {
      expon -= 16383;
      value = (himant * 0x100000000 + lomant) * Math.pow(2, expon - 63);
    }
    return sign * value;
  }
}

export class WAVDecoder extends Decoder {
  decode(data: string): DecodedAudioFile | null {
    const decoded: DecodedAudioFile = {
      length: 0,
      sampleRate: 0,
      bitDepth: 0,
      channels: [new Float32Array(), new Float32Array()],
    };

    let sampleRate = 0;
    let numberOfChannels: number = 0;
    let bitDepth = 0;
    let bytesPerSample = 0;
    let length = 0;
    let offset = 0;
    // Header
    var chunk = this.readChunkHeaderL(data, offset);
    offset += 8;
    if (chunk.name != 'RIFF') {
      console.error('File is not a WAV');
      return null;
    }

    var fileLength = chunk.length;
    fileLength += 8;

    var wave = this.readString(data, offset, 4);
    offset += 4;
    if (wave != 'WAVE') {
      console.error('File is not a WAV');
      return null;
    }

    while (offset < fileLength) {
      var chunk = this.readChunkHeaderL(data, offset);
      offset += 8;
      if (chunk.name == 'fmt ') {
        // File encoding
        var encoding = this.readIntL(data, offset, 2);
        offset += 2;

        if (encoding != 0x0001) {
          // Only support PCM
          console.error('Cannot decode non-PCM encoded WAV file');
          return null;
        }

        // Number of channels
        numberOfChannels = this.readIntL(data, offset, 2);
        offset += 2;

        // Sample rate
        sampleRate = this.readIntL(data, offset, 4);
        offset += 4;

        // Ignore bytes/sec - 4 bytes
        offset += 4;

        // Ignore block align - 2 bytes
        offset += 2;

        // Bit depth
        bitDepth = this.readIntL(data, offset, 2);
        bytesPerSample = bitDepth / 8;
        offset += 2;
      } else if (chunk.name == 'data') {
        // Data must come after fmt, so we are okay to use it's variables
        // here
        length = chunk.length / (bytesPerSample * numberOfChannels);
        for (var i = 0; i < numberOfChannels; i++) {
          decoded.channels.push(new Float32Array(length));
        }

        for (var i = 0; i < numberOfChannels; i++) {
          var channel = decoded.channels[i];
          for (var j = 0; j < length; j++) {
            var index = offset;
            index += (j * numberOfChannels + i) * bytesPerSample;
            // Sample
            var value = this.readIntL(data, index, bytesPerSample);
            // Scale range from 0 to 2**bitDepth -> -2**(bitDepth-1) to
            // 2**(bitDepth-1)
            var range = 1 << (bitDepth - 1);
            if (value >= range) {
              value |= ~(range - 1);
            }
            // Scale range to -1 to 1
            channel[j] = value / range;
          }
        }
        offset += chunk.length;
      } else {
        offset += chunk.length;
      }
    }
    decoded.sampleRate = sampleRate;
    decoded.bitDepth = bitDepth;
    decoded.length = length;
    return decoded;
  }
}

export class AIFFDecoder extends Decoder {
  decode(data: string): DecodedAudioFile | null {
    const decoded: DecodedAudioFile = {
      length: 0,
      sampleRate: 0,
      bitDepth: 0,
      channels: [],
    };

    let sampleRate = 0;
    let numberOfChannels: number = 0;
    let bitDepth = 0;
    let bytesPerSample = 0;
    let length = 0;
    let offset = 0;

    // Header
    var chunk = this.readChunkHeaderB(data, offset);
    offset += 8;
    if (chunk.name != 'FORM') {
      console.error('File is not an AIFF');
      return null;
    }

    var fileLength = chunk.length;
    fileLength += 8;
    // ('file length: ', fileLength);

    var aiff = this.readString(data, offset, 4);
    offset += 4;
    if (aiff != 'AIFF') {
      console.error('File is not an AIFF');
      return null;
    }

    while (offset < fileLength) {
      // console.log('starting while loop at offset ', offset);
      // console.log('reading data chunk');
      var chunk = this.readChunkHeaderB(data, offset);
      // console.log(chunk);
      offset += 8;
      if (chunk.name == 'COMM') {
        // Number of channels
        numberOfChannels = this.readIntB(data, offset, 2);
        offset += 2;
        // console.log('number of channels: ', numberOfChannels);

        // Number of samples
        length = this.readIntB(data, offset, 4);
        offset += 4;
        // console.log('number of samples: ', length);

        for (var i = 0; i < numberOfChannels; i++) {
          decoded.channels.push(new Float32Array(length));
        }

        // // console.log(
        //   'added float32arrays to decoded.channels: ',
        //   decoded.channels.length
        // );

        // Bit depth
        bitDepth = this.readIntB(data, offset, 2);
        bytesPerSample = bitDepth / 8;
        offset += 2;

        // console.log('bit depth: ', bitDepth);

        // Sample rate
        sampleRate = this.readFloatB(data, offset);
        offset += 10;

        // console.log('sample rate: ', sampleRate);
      } else if (chunk.name == 'SSND') {
        // Data offset
        var dataOffset = this.readIntB(data, offset, 4);
        offset += 4;

        // Ignore block size
        offset += 4;

        // Skip over data offset
        offset += dataOffset;

        for (var i = 0; i < numberOfChannels; i++) {
          var channel = decoded.channels[i];
          for (var j = 0; j < length; j++) {
            var index = offset;
            index += (j * numberOfChannels + i) * bytesPerSample;
            // Sample
            var value = this.readIntB(data, index, bytesPerSample);
            // Scale range from 0 to 2**bitDepth -> -2**(bitDepth-1) to
            // 2**(bitDepth-1)
            var range = 1 << (bitDepth - 1);
            if (value >= range) {
              value |= ~(range - 1);
            }
            // console.log(value, range, value / range);
            // Scale range to -1 to 1
            channel[j] = value / range;
          }
        }
        offset += chunk.length - dataOffset - 8;
      } else {
        offset += chunk.length;
      }
    }
    decoded.sampleRate = sampleRate;
    decoded.bitDepth = bitDepth;
    decoded.length = length;
    return decoded;
  }
}
