export function bufferToHex(buffer: ArrayBuffer | Buffer | Uint8Array): string {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function hexToBuffer(hex: string): Buffer {
  return Buffer.from(hex, "hex");
}
