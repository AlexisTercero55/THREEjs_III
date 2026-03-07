/** 07/03/2026 - CDMX|México
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */
// Buffer polyfill for browser environment
// Based on the Node.js Buffer API but simplified for browser use

const base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function encodeBase64(bytes) {
  let result = '';
  let i;
  const l = bytes.length;
  for (i = 2; i < l; i += 3) {
    result += base64[bytes[i - 2] >> 2];
    result += base64[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
    result += base64[((bytes[i - 1] & 0x0f) << 2) | (bytes[i] >> 6)];
    result += base64[bytes[i] & 0x3f];
  }
  if (i === l + 1) {
    result += base64[bytes[i - 2] >> 2];
    result += base64[(bytes[i - 2] & 0x03) << 4];
    result += '==';
  }
  if (i === l) {
    result += base64[bytes[i - 2] >> 2];
    result += base64[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
    result += base64[(bytes[i - 1] & 0x0f) << 2];
    result += '=';
  }
  return result;
}

function decodeBase64(str) {
  const len = str.length;
  let bytes = [];
  let i, j, k;
  for (i = 0; i < len; i += 4) {
    j = base64.indexOf(str[i]);
    k = base64.indexOf(str[i + 1]);
    bytes.push((j << 2) | (k >> 4));
    j = base64.indexOf(str[i + 2]);
    if (j !== 64) {
      bytes.push(((k & 15) << 4) | (j >> 2));
      k = base64.indexOf(str[i + 3]);
      if (k !== 64) {
        bytes.push(((j & 3) << 6) | k);
      }
    }
  }
  return bytes;
}

class Buffer extends Uint8Array {
  constructor(value, encoding) {
    if (typeof value === 'number') {
      super(value);
    } else if (typeof value === 'string') {
      if (encoding === 'base64') {
        const bytes = decodeBase64(value);
        super(bytes);
      } else {
        // Assume utf8
        const encoder = new TextEncoder();
        super(encoder.encode(value));
      }
    } else if (value instanceof ArrayBuffer) {
      super(value);
    } else if (Array.isArray(value)) {
      super(value);
    } else {
      super(0);
    }
  }

  static from(value, encoding) {
    return new Buffer(value, encoding);
  }

  static alloc(size) {
    return new Buffer(size);
  }

  static allocUnsafe(size) {
    return new Buffer(size);
  }

  toString(encoding) {
    if (encoding === 'base64') {
      return encodeBase64(this);
    } else {
      // Default to utf8
      const decoder = new TextDecoder();
      return decoder.decode(this);
    }
  }

  static isBuffer(obj) {
    return obj instanceof Buffer;
  }
}

export { Buffer };
export default Buffer;