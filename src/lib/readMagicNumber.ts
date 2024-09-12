import { magicNumbers } from "./magicNumbers";

export const detectFileTypeFromMagicNumber = (arrayBuffer: ArrayBuffer) => {
  const uint = new Uint8Array(arrayBuffer).subarray(0, 4); // Get first 4 bytes
  let hex = "";
  for (let i = 0; i < uint.length; i++) {
    hex += uint[i].toString(16).toUpperCase().padStart(2, "0"); // Convert to hex
  }
  // Match with known magic numbers
  for (const [magic, mime] of Object.entries(magicNumbers)) {
    if (hex.startsWith(magic)) {
      return mime;
    }
  }
  return "application/octet-stream"; // Unknown file type
};

export const getMimeTypeFromBlob = async (blob: Blob) => {
  const arrayBuffer = await blob.arrayBuffer();
  return detectFileTypeFromMagicNumber(arrayBuffer);
};
