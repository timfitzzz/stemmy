export type ByteSet = [string, string, number];

export const Reads: ByteSet[] = [
  ['riff_head', 'string', 4],
  ['chunk_size', 'uinteger', 4],
  ['wave_identifier', 'string', 4],
  ['fmt_identifier', 'string', 4],
  ['subchunk_size', 'integer', 4],
  ['audio_format', 'integer', 2],
  ['num_channels', 'integer', 2],
  ['sample_rate', 'uinteger', 4],
  ['byte_rate', 'integer', 4],
  ['block_align', 'integer', 2],
  ['bits_per_sample', 'integer', 2],
  //['uhm','integer',2],
  ['data_identifier', 'string', 4],
  //['sub_chunk2_size', 'integer', 4],
];

// type ReadResult {
//   riff_head?: string,
//   chunk_size?: number,
//   wave_identifier?: string,
//   fmt_identifier?: string,
//   subchunk_size?: number,
//   audio_format?: number,
//   num_channels?: number,
//   sample_rate?: number,
//   byte_rate?: number,
//   block_align?: number,
//   bits_per_sample?: number,
//   // uhm?: number,
//   data_identifier?: string,
//   // sub_chunk2_size?: number,
// }

export interface ReadResult {
  // 'invalid_reasons' = 'string',
  // 'error' = 'boolean',
  // 'chunk_size' = 'number',
  // 'wave_identifier' = 'string',
  // 'fmt_identifier' = 'string',
  // 'subchunk_size' = 'number',
  // 'audio_format' = 'number',
  // 'num_channels' = 'number',
  // 'sample_rate' = 'number',
  // 'byte_rate' = 'number',
  // 'block_align' = 'number',
  // 'bits_per_sample' = 'number',
  // 'data_identifier' = 'string',
  //
  // | 'chunk_size'
  // | 'header'
  // | 'wave_identifier'
  // | 'fmt_identifier'
  // | 'subchunk_size'
  // | 'audio_format'
  // | 'num_channels'
  // | 'sample_rate'
  // | 'byte_rate'
  // | 'block_align'
  // | 'bites_per_sample'
  // | 'data_identifier'
  // | ''
  invalid_reasons?: string[];
  error?: boolean;
  riff_head?: string;
  chunk_size?: number;
  header?: ReadResult;
  wave_identifier?: string;
  fmt_identifier?: string;
  subchunk_size?: number;
  audio_format?: number;
  num_channels?: number;
  sample_rate?: number;
  byte_rate?: number;
  block_align?: number;
  bits_per_sample?: number;
  // uhm?: number,
  data_identifier?: string;
  [key: string]: any;
  // sub_chunk2_size?: number,
}

// export type ReadResult = {
//   [key: keyof typeof ReadResultProps]: ReadResultProps[key];
// };

export type ReadError = {
  [key: string]: any;
};

export function getFileInfoFromHeader(header: Buffer): ReadResult {
  let ReadResult = {};

  return readByteSets(header);
}

function readByteSets(buffer: Buffer): ReadResult {
  var i = 0;
  var pointer = 0;
  let rawResult: ReadResult = {};

  const read_wav = (): ReadResult => {
    var read = Reads[i];

    i++;
    if (read[1] == 'string') {
      rawResult[read[0]] = buffer.toString('ascii', pointer, pointer + read[2]);
      pointer = pointer + read[2]; // pointer = pointer plus # bytes
    } else if (read[1] == 'integer') {
      rawResult[read[0]] = buffer.readUInt16LE(pointer);
      pointer = pointer + read[2];
    } else if (read[1] == 'uinteger') {
      rawResult[read[0]] = buffer.readInt32LE(pointer);
      pointer = pointer + read[2];
    }
    if (i >= Reads.length) {
      return refineReadResult(rawResult);
    } else {
      return read_wav();
    }
  };
  //console.log(i)
  return read_wav();
}

function refineReadResult(rawResult: ReadResult): ReadResult {
  let read_result = rawResult;
  var error = false;
  var invalid_reasons = [];

  if (read_result.riff_head != 'RIFF')
    invalid_reasons.push('Expected "RIFF" string at 0');
  if (read_result.wave_identifier != 'WAVE')
    invalid_reasons.push('Expected "WAVE" string at 4');
  if (read_result.fmt_identifier != 'fmt ')
    invalid_reasons.push('Expected "fmt " string at 8');
  if (
    read_result.audio_format != 1 && // Wav PCM
    read_result.audio_format != 65534 && // Extensible PCM
    read_result.audio_format != 2 && // Wav
    read_result.audio_format != 6 && // Wav ALAW
    read_result.audio_format != 7 && // Wav MULAW
    read_result.audio_format != 22127 && // Vorbis ?? (issue #11)
    read_result.audio_format != 3
  )
    // Wav
    invalid_reasons.push('Unknown format: ' + read_result.audio_format);
  // if ((read_result.chunk_size + 8) !== stats.size) invalid_reasons.push("chunk_size does not match file size")
  // //if ((read_result.data_identifier) != "data") invalid_reasons.push("Expected data identifier at the end of the header")

  if (invalid_reasons.length > 0) error = true;

  if (error) {
    read_result = {
      error: true,
      invalid_reasons: invalid_reasons,
      header: read_result,
      // stats: stats
    };
  }

  return read_result;
}
