import { bufferToHex, hexToBuffer } from "./convert";

describe("hexToBuffer", () => {
  it("should convert hex to buffer", () => {
    expect(hexToBuffer("000102030405060708090a0b0c0d0e0f")).toEqual(
      Buffer.from("000102030405060708090a0b0c0d0e0f", "hex"),
    );
  });
});

describe("bufferToHex", () => {
  it("should convert buffer to hex", () => {
    expect(
      bufferToHex(Buffer.from("000102030405060708090a0b0c0d0e0f", "hex")),
    ).toEqual("000102030405060708090a0b0c0d0e0f");
  });
});
