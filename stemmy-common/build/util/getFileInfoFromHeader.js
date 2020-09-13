"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileInfoFromHeader = exports.Reads = void 0;
exports.Reads = [
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
];
function getFileInfoFromHeader(header) {
    var ReadResult = {};
    return readByteSets(header);
}
exports.getFileInfoFromHeader = getFileInfoFromHeader;
function readByteSets(buffer) {
    var i = 0;
    var pointer = 0;
    var rawResult = {};
    var read_wav = function () {
        var read = exports.Reads[i];
        i++;
        if (read[1] == 'string') {
            rawResult[read[0]] = buffer.toString('ascii', pointer, pointer + read[2]);
            pointer = pointer + read[2]; // pointer = pointer plus # bytes
        }
        else if (read[1] == 'integer') {
            rawResult[read[0]] = buffer.readUInt16LE(pointer);
            pointer = pointer + read[2];
        }
        else if (read[1] == 'uinteger') {
            rawResult[read[0]] = buffer.readInt32LE(pointer);
            pointer = pointer + read[2];
        }
        if (i >= exports.Reads.length) {
            return refineReadResult(rawResult);
        }
        else {
            return read_wav();
        }
    };
    //console.log(i)
    return read_wav();
}
function refineReadResult(rawResult) {
    var read_result = rawResult;
    var error = false;
    var invalid_reasons = [];
    if (read_result.riff_head != 'RIFF')
        invalid_reasons.push('Expected "RIFF" string at 0');
    if (read_result.wave_identifier != 'WAVE')
        invalid_reasons.push('Expected "WAVE" string at 4');
    if (read_result.fmt_identifier != 'fmt ')
        invalid_reasons.push('Expected "fmt " string at 8');
    if (read_result.audio_format != 1 && // Wav PCM
        read_result.audio_format != 65534 && // Extensible PCM
        read_result.audio_format != 2 && // Wav
        read_result.audio_format != 6 && // Wav ALAW
        read_result.audio_format != 7 && // Wav MULAW
        read_result.audio_format != 22127 && // Vorbis ?? (issue #11)
        read_result.audio_format != 3)
        // Wav
        invalid_reasons.push('Unknown format: ' + read_result.audio_format);
    // if ((read_result.chunk_size + 8) !== stats.size) invalid_reasons.push("chunk_size does not match file size")
    // //if ((read_result.data_identifier) != "data") invalid_reasons.push("Expected data identifier at the end of the header")
    if (invalid_reasons.length > 0)
        error = true;
    if (error) {
        read_result = {
            error: true,
            invalid_reasons: invalid_reasons,
            header: read_result,
        };
    }
    return read_result;
}
