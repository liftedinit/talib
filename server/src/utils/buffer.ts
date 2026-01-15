/**
 * Type representing binary data that can be either ArrayBuffer, Buffer, or Uint8Array.
 * This type is commonly needed when interfacing between Node.js Buffer operations
 * and Web API ArrayBuffer/Uint8Array types.
 */
export type BufferLike = ArrayBuffer | Buffer | Uint8Array;

/**
 * Converts any BufferLike value to a Uint8Array.
 * This is useful for consistent binary data handling across different sources.
 *
 * @param data - The buffer-like value to convert
 * @returns A Uint8Array view of the data
 * @throws TypeError if the input is not a valid BufferLike type
 */
export function toUint8Array(data: BufferLike): Uint8Array {
  // Check Buffer first since Buffer extends Uint8Array
  if (Buffer.isBuffer(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  }
  if (data instanceof Uint8Array) {
    return data;
  }
  if (data instanceof ArrayBuffer) {
    return new Uint8Array(data);
  }
  throw new TypeError(
    `Expected BufferLike (ArrayBuffer | Buffer | Uint8Array), got ${typeof data}`,
  );
}

/**
 * Converts any BufferLike value to a Node.js Buffer.
 * This is useful when you need Buffer-specific methods like compare() or equals().
 *
 * @param data - The buffer-like value to convert
 * @returns A Buffer instance
 * @throws TypeError if the input is not a valid BufferLike type
 */
export function toBuffer(data: BufferLike): Buffer {
  if (Buffer.isBuffer(data)) {
    return data;
  }
  if (data instanceof Uint8Array) {
    return Buffer.from(data.buffer, data.byteOffset, data.byteLength);
  }
  if (data instanceof ArrayBuffer) {
    return Buffer.from(data);
  }
  throw new TypeError(
    `Expected BufferLike (ArrayBuffer | Buffer | Uint8Array), got ${typeof data}`,
  );
}

/**
 * Compares two BufferLike values for equality.
 * Uses Node.js Buffer's native equals() method for optimal performance.
 *
 * @param a - First buffer
 * @param b - Second buffer
 * @returns true if the buffers contain the same bytes
 */
export function buffersEqual(a: BufferLike, b: BufferLike): boolean {
  return toBuffer(a).equals(toBuffer(b));
}
