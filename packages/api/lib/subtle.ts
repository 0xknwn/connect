let subtle: SubtleCrypto;
if (typeof window !== "undefined") {
  subtle = window.crypto.subtle;
}
if (typeof window === "undefined") {
  subtle = globalThis.crypto.subtle;
}
export { subtle };
