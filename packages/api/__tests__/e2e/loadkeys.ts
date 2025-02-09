import {
  hex2buf,
  generateEncryptionKey,
  importPublicKey,
  importEncryptionPublicKey,
} from "../../lib";
import { subtle } from "../../lib/subtle";

const importEncryptionPrivateKey = async (
  EncryptionPkcs8PrivateKey: string
) => {
  const encryptionKey = await subtle.importKey(
    "pkcs8",
    hex2buf(EncryptionPkcs8PrivateKey),
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey", "deriveBits"]
  );
  return encryptionKey;
};

const importPrivateKey = async (Pkcs8PrivateKey: string) => {
  const encryptionKey = await subtle.importKey(
    "pkcs8",
    hex2buf(Pkcs8PrivateKey),
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["sign"]
  );
  return encryptionKey;
};

export const loadKeys = async ({
  hexAgentPublicKey,
  hexAgentPrivateKey,
  hexSignerPublicKey,
  hexSignerPrivateKey,
  hexAgentEncryptionPublicKey,
  hexAgentEncryptionPrivateKey,
  hexSignerEncryptionPublicKey,
  hexSignerEncryptionPrivateKey,
}) => {
  const agentPublicKey = await importPublicKey(hexAgentPublicKey);
  const agentPrivateKey = await importPrivateKey(hexAgentPrivateKey);
  const AgentKeyPair = {
    publicKey: agentPublicKey,
    privateKey: agentPrivateKey,
  };
  const signerPublicKey = await importPublicKey(hexSignerPublicKey);
  const signerPrivateKey = await importPrivateKey(hexSignerPrivateKey);
  const SignerKeyPair = {
    publicKey: signerPublicKey,
    privateKey: signerPrivateKey,
  };
  const agentEncryptionPublicKey = await importEncryptionPublicKey(
    hexAgentEncryptionPublicKey
  );
  const agentEncryptionPrivateKey = await importEncryptionPrivateKey(
    hexAgentEncryptionPrivateKey
  );
  const AgentEncryptionKeyPair = {
    publicKey: agentEncryptionPublicKey,
    privateKey: agentEncryptionPrivateKey,
  };
  const signerEncryptionPublicKey = await importEncryptionPublicKey(
    hexSignerEncryptionPublicKey
  );
  const signerEncryptionPrivateKey = await importEncryptionPrivateKey(
    hexSignerEncryptionPrivateKey
  );
  const SignerEncryptionKeyPair = {
    publicKey: signerEncryptionPublicKey,
    privateKey: signerEncryptionPrivateKey,
  };
  const encryptionKey = await generateEncryptionKey(
    AgentEncryptionKeyPair.privateKey,
    hexSignerEncryptionPublicKey
  );
  return {
    AgentKeyPair,
    SignerKeyPair,
    AgentEncryptionKeyPair,
    SignerEncryptionKeyPair,
    encryptionKey,
  };
};
