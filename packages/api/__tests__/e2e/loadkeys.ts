import { hex2buf } from "../../src";

const loadKeys = async ({
  hexAgentPublicKey,
  hexAgentPrivateKey,
  hexSignerPublicKey,
  hexSignerPrivateKey,
  hexAgentEncryptionPublicKey,
  hexAgentEncryptionPrivateKey,
  hexSignerEncryptionPublicKey,
  hexSignerEncryptionPrivateKey,
}) => {
  const agentPublicKey = await window.crypto.subtle.importKey(
    "raw",
    hex2buf(hexAgentPublicKey),
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["verify"]
  );
  const agentPrivateKey = await window.crypto.subtle.importKey(
    "pkcs8",
    hex2buf(hexAgentPrivateKey),
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["sign"]
  );
  const AgentKeyPair = {
    publicKey: agentPublicKey,
    privateKey: agentPrivateKey,
  };
  const signerPublicKey = await window.crypto.subtle.importKey(
    "raw",
    hex2buf(hexSignerPublicKey),
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["verify"]
  );
  const signerPrivateKey = await window.crypto.subtle.importKey(
    "pkcs8",
    hex2buf(hexSignerPrivateKey),
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["sign"]
  );
  const SignerKeyPair = {
    publicKey: signerPublicKey,
    privateKey: signerPrivateKey,
  };
  const agentEncryptionPublicKey = await window.crypto.subtle.importKey(
    "raw",
    hex2buf(hexAgentEncryptionPublicKey),
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    []
  );
  const agentEncryptionPrivateKey = await window.crypto.subtle.importKey(
    "pkcs8",
    hex2buf(hexAgentEncryptionPrivateKey),
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey"]
  );
  const AgentEncryptionKeyPair = {
    publicKey: agentEncryptionPublicKey,
    privateKey: agentEncryptionPrivateKey,
  };
  const signerEncryptionPublicKey = await window.crypto.subtle.importKey(
    "raw",
    hex2buf(hexSignerEncryptionPublicKey),
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    []
  );
  const signerEncryptionPrivateKey = await window.crypto.subtle.importKey(
    "pkcs8",
    hex2buf(hexSignerEncryptionPrivateKey),
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey"]
  );
  const SignerEncryptionKeyPair = {
    publicKey: signerEncryptionPublicKey,
    privateKey: signerEncryptionPrivateKey,
  };
  return {
    AgentKeyPair,
    SignerKeyPair,
    AgentEncryptionKeyPair,
    SignerEncryptionKeyPair,
  };
};

export default loadKeys;
