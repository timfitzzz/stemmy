// export type ByteSet = [string, string, number];

// export const Reads: ByteSet[] = [
//   ['riff_head', 'string', 4],
//   ['chunk_size', 'uinteger', 4],
//   ['wave_identifier', 'string', 4],
//   ['fmt_identifier', 'string', 4],
//   ['subchunk_size', 'integer', 4],
//   ['audio_format', 'integer', 2],
//   ['num_channels', 'integer', 2],
//   ['sample_rate', 'uinteger', 4],
//   ['byte_rate', 'integer', 4],
//   ['block_align', 'integer', 2],
//   ['bits_per_sample', 'integer', 2],
//   //['uhm','integer',2],
//   ['data_identifier', 'string', 4],
//   //['sub_chunk2_size', 'integer', 4],
// ];

// // type ReadResult {
// //   riff_head?: string,
// //   chunk_size?: number,
// //   wave_identifier?: string,
// //   fmt_identifier?: string,
// //   subchunk_size?: number,
// //   audio_format?: number,
// //   num_channels?: number,
// //   sample_rate?: number,
// //   byte_rate?: number,
// //   block_align?: number,
// //   bits_per_sample?: number,
// //   // uhm?: number,
// //   data_identifier?: string,
// //   // sub_chunk2_size?: number,
// // }

// export type ReadResult = {
//   chunk_size?: number;
//   [key: string]: number | string | undefined;
// };

// export type ReadError = {
//   [key: string]: any;
// };

// export class waveFileInfo {
//   public headerByteSets: ReadResult = {};
//   public read_error: ReadError = {};

//   constructor(public header: Buffer) {

//   };

//   static getInfoFromHeader = function (
//     header: Buffer,
//     cb: (result: ReadResult) => void
//   ) {
//     wfi.prototype.readByteSets(header)
//     wfi.prototype.headerByteSets.on('change', () => {
//       cb(wfi.prototype.headerByteSets);
//     });
//   };

//   public readByteSets(buffer: Buffer): void {
//     var i = 0;
//     var pointer = 0;
//     const read_wav = (): void => {
//       var read = Reads[i];

//       i++;
//       if (read[1] == 'string') {
//         this.headerByteSets[read[0]] = buffer.toString(
//           'ascii',
//           pointer,
//           pointer + read[2]
//         );
//         pointer = pointer + read[2]; // pointer = pointer plus # bytes
//       } else if (read[1] == 'integer') {
//         this.headerByteSets[read[0]] = buffer.readUInt16LE(pointer);
//         pointer = pointer + read[2];
//       } else if (read[1] == 'uinteger') {
//         this.headerByteSets[read[0]] = buffer.readInt32LE(pointer);
//         pointer = pointer + read[2];
//       }
//       if (i < Reads.length) {
//         read_wav();
//       } else {
//         this.post_process();
//       }
//     };
//     //console.log(i)
//     read_wav();
//   }

//   post_process(): void {
//     let read_result = this.headerByteSets;
//     var error = false;
//     var invalid_reasons = [];

//     if (read_result.riff_head != 'RIFF')
//       invalid_reasons.push('Expected "RIFF" string at 0');
//     if (read_result.wave_identifier != 'WAVE')
//       invalid_reasons.push('Expected "WAVE" string at 4');
//     if (read_result.fmt_identifier != 'fmt ')
//       invalid_reasons.push('Expected "fmt " string at 8');
//     if (
//       read_result.audio_format != 1 && // Wav PCM
//       read_result.audio_format != 65534 && // Extensible PCM
//       read_result.audio_format != 2 && // Wav
//       read_result.audio_format != 6 && // Wav ALAW
//       read_result.audio_format != 7 && // Wav MULAW
//       read_result.audio_format != 22127 && // Vorbis ?? (issue #11)
//       read_result.audio_format != 3
//     )
//       // Wav
//       invalid_reasons.push('Unknown format: ' + read_result.audio_format);
//     // if ((read_result.chunk_size + 8) !== stats.size) invalid_reasons.push("chunk_size does not match file size")
//     // //if ((read_result.data_identifier) != "data") invalid_reasons.push("Expected data identifier at the end of the header")

//     if (invalid_reasons.length > 0) error = true;

//     if (error)
//       this.read_error = {
//         error: true,
//         invalid_reasons: invalid_reasons,
//         header: read_result,
//         // stats: stats
//       };

//     this.headerByteSets = read_result;
//   }
// }
