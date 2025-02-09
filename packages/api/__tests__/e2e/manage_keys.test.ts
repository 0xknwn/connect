import { describe, it, expect, beforeAll } from "vitest";
import { buf2hex, hex2buf } from "../../lib";
import { subtle } from "../../lib/subtle";

describe("channel request", () => {
  let AgentKeyPair: CryptoKeyPair;
  const messageToSign = "hello";
  let signature: ArrayBuffer;
  let AgentEncryptionKeyPair: CryptoKeyPair;
  let SignerKeyPair: CryptoKeyPair;
  let SignerEncryptionKeyPair: CryptoKeyPair;
  let exportedAgentPrivateKey: string;
  let exportedAgentPublicKey: string;
  let exportedAgentEncryptionPrivateKey: string;
  let exportedAgentEncryptionPublicKey: string;
  let exportedSignerPrivateKey: string;
  let exportedSignerPublicKey: string;
  let exportedSignerEncryptionPrivateKey: string;
  let exportedSignerEncryptionPublicKey: string;

  beforeAll(async () => {
    AgentKeyPair = await subtle.generateKey(
      {
        name: "ECDSA",
        namedCurve: "P-256",
      },
      true,
      ["sign", "verify"]
    );
    AgentEncryptionKeyPair = await subtle.generateKey(
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      ["deriveKey"]
    );
    SignerKeyPair = await subtle.generateKey(
      {
        name: "ECDSA",
        namedCurve: "P-256",
      },
      true,
      ["sign", "verify"]
    );
    SignerEncryptionKeyPair = await subtle.generateKey(
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      ["deriveKey"]
    );
  });

  it("check agent keypair is ecdsa key", async () => {
    expect(AgentKeyPair.privateKey.algorithm).toStrictEqual({
      name: "ECDSA",
      namedCurve: "P-256",
    });
  });

  it("sign message with agent keypair", async () => {
    signature = await subtle.sign(
      {
        name: "ECDSA",
        hash: { name: "SHA-256" },
      },
      AgentKeyPair.privateKey,
      new TextEncoder().encode(messageToSign)
    );
  });

  it("export agent private key to raw hex", async () => {
    const rawKey = await subtle.exportKey(
      "pkcs8",
      AgentKeyPair.privateKey
    );
    exportedAgentPrivateKey = buf2hex(rawKey);
    expect(exportedAgentPrivateKey).not.toBe("");
  });

  it("export agent public key to raw hex", async () => {
    const rawKey = await subtle.exportKey(
      "raw",
      AgentKeyPair.publicKey
    );
    exportedAgentPublicKey = buf2hex(rawKey);
    expect(exportedAgentPublicKey).not.toBe("");
  });

  it("check agent encryption keypair is ecdh key", async () => {
    expect(AgentEncryptionKeyPair.privateKey.algorithm).toStrictEqual({
      name: "ECDH",
      namedCurve: "P-256",
    });
  });

  it("export agent encryption private key to raw hex", async () => {
    const rawKey = await subtle.exportKey(
      "pkcs8",
      AgentEncryptionKeyPair.privateKey
    );
    exportedAgentEncryptionPrivateKey = buf2hex(rawKey);
    expect(exportedAgentEncryptionPrivateKey).not.toBe("");
  });

  it("export agent encryption public key to raw hex", async () => {
    const rawKey = await subtle.exportKey(
      "raw",
      AgentEncryptionKeyPair.publicKey
    );
    exportedAgentEncryptionPublicKey = buf2hex(rawKey);
    expect(exportedAgentEncryptionPublicKey).not.toBe("");
  });

  it("check signer keypair is ecdsa key", async () => {
    expect(AgentKeyPair.privateKey.algorithm).toStrictEqual({
      name: "ECDSA",
      namedCurve: "P-256",
    });
  });

  it("export signer private key to raw hex", async () => {
    const rawKey = await subtle.exportKey(
      "pkcs8",
      SignerKeyPair.privateKey
    );
    exportedSignerPrivateKey = buf2hex(rawKey);
    expect(exportedSignerPrivateKey).not.toBe("");
  });

  it("export signer public key to raw hex", async () => {
    const rawKey = await subtle.exportKey(
      "raw",
      SignerKeyPair.publicKey
    );
    exportedSignerPublicKey = buf2hex(rawKey);
    expect(exportedSignerPublicKey).not.toBe("");
  });

  it("check signer encryption keypair is ecdh key", async () => {
    expect(SignerEncryptionKeyPair.privateKey.algorithm).toStrictEqual({
      name: "ECDH",
      namedCurve: "P-256",
    });
  });

  it("export signer encryption private key to raw hex", async () => {
    const rawKey = await subtle.exportKey(
      "pkcs8",
      SignerEncryptionKeyPair.privateKey
    );
    exportedSignerEncryptionPrivateKey = buf2hex(rawKey);
    expect(exportedSignerEncryptionPrivateKey).not.toBe("");
  });

  it("export signer encryption public key to raw hex", async () => {
    const rawKey = await subtle.exportKey(
      "raw",
      SignerEncryptionKeyPair.publicKey
    );
    exportedSignerEncryptionPublicKey = buf2hex(rawKey);
    expect(exportedSignerEncryptionPublicKey).not.toBe("");
  });

  it("import agent public key from raw and check signature with success", async () => {
    const key = await subtle.importKey(
      "raw",
      hex2buf(exportedAgentPublicKey),
      {
        name: "ECDSA",
        namedCurve: "P-256",
      },
      true,
      ["verify"]
    );
    const test = await subtle.verify(
      {
        name: "ECDSA",
        hash: { name: "SHA-256" },
      },
      key,
      signature,
      new TextEncoder().encode(messageToSign)
    );
    expect(test).toBe(true);
  });

  it("import signer public key from raw and check signature with failure", async () => {
    const key = await subtle.importKey(
      "raw",
      hex2buf(exportedAgentEncryptionPublicKey),
      {
        name: "ECDSA",
        namedCurve: "P-256",
      },
      true,
      ["verify"]
    );
    const test = await subtle.verify(
      {
        name: "ECDSA",
        hash: { name: "SHA-256" },
      },
      key,
      signature,
      new TextEncoder().encode(messageToSign)
    );
    expect(test).toBe(false);
  });

  it("derivekey from agent and signer and check they can encrypt/decrypt", async () => {
    const signerEncryptionKey = await subtle.importKey(
      "pkcs8",
      hex2buf(exportedSignerEncryptionPrivateKey),
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      ["deriveKey"]
    );
    const agentEncryptionPublicKey = await subtle.importKey(
      "raw",
      hex2buf(exportedAgentEncryptionPublicKey),
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      []
    );
    const signerKey = await subtle.deriveKey(
      {
        name: "ECDH",
        public: agentEncryptionPublicKey,
      },
      signerEncryptionKey,
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
    const agentEncryptionKey = await subtle.importKey(
      "pkcs8",
      hex2buf(exportedAgentEncryptionPrivateKey),
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      ["deriveKey"]
    );
    const signerEncryptionPublicKey = await subtle.importKey(
      "raw",
      hex2buf(exportedSignerEncryptionPublicKey),
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      []
    );
    const agentKey = await subtle.deriveKey(
      {
        name: "ECDH",
        public: signerEncryptionPublicKey,
      },
      agentEncryptionKey,
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
    const encryptedMessage = await subtle.encrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(12),
      },
      agentKey,
      new TextEncoder().encode("hello")
    );
    const decryptedMessage = await subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(12),
      },
      signerKey,
      encryptedMessage
    );
    expect(new TextDecoder().decode(decryptedMessage)).toBe("hello");
  });

  it.skip("export a set of const for other tests", async () => {
    console.log(`const exportedAgentPrivateKey="${exportedAgentPrivateKey}"`);
    console.log(`const exportedSignerPrivateKey="${exportedSignerPrivateKey}"`);
    console.log(
      `const exportedAgentEncryptionPrivateKey="${exportedAgentEncryptionPrivateKey}"`
    );
    console.log(
      `const exportedSignerEncryptionPrivateKey="${exportedSignerEncryptionPrivateKey}"`
    );
    console.log(`const exportedAgentPublicKey="${exportedAgentPublicKey}"`);
    console.log(`const exportedSignerPublicKey="${exportedSignerPublicKey}"`);
    console.log(
      `const exportedAgentEncryptionPublicKey="${exportedAgentEncryptionPublicKey}"`
    );
    console.log(
      `const exportedSignerEncryptionPublicKey="${exportedSignerEncryptionPublicKey}"`
    );
  });
});
