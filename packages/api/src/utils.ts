export const buf2hex = (buffer: ArrayBuffer) => {
  return (
    "0x" +
    [...new Uint8Array(buffer)]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
  );
};

export const hex2buf = (key: string) => {
  if (!key) {
    return new Uint8Array();
  }
  if (key.startsWith("0x")) {
    key = key.slice(2);
  }
  if (!key.match(/^[0-9a-f]*$/)) {
    throw new Error("Invalid hex string");
  }
  const v = key.match(/[0-9a-f]{1,2}/g);
  if (!v) {
    throw new Error("Invalid hex string");
  }
  return new Uint8Array(v.map((byte) => parseInt(byte, 16)));
};
