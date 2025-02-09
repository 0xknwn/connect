let subtle: SubtleCrypto;
if (typeof window !== "undefined") {
  console.log(typeof window);
  subtle = window.crypto.subtle;
}
if (typeof window === "undefined") {
  console.log(typeof window);
  subtle = globalThis.crypto.subtle;
}
export { subtle };
