let subtle: SubtleCrypto;
let getRandomValues: (array: Uint8Array) => Uint8Array;
if (typeof window !== "undefined") {
  subtle = window.crypto.subtle;
  getRandomValues = (array: Uint8Array) => {
    return window.crypto.getRandomValues(array);
  };
}
if (typeof window === "undefined") {
  subtle = globalThis.crypto.subtle;
  getRandomValues = (array: Uint8Array) => {
    return crypto.getRandomValues(array);
  };
}
export { subtle, getRandomValues };
