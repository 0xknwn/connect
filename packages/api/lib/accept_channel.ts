import { buf2hex, hex2buf } from "./utils";
import { jsonRpcMethod } from "./jsonrpc";
import type { jsonRpcRequest } from "./jsonrpc";
import { v4 as uuidv4 } from "uuid";
import { subtle } from "./subtle";

export type acceptChannelParams = {
  acceptChannelUniqueKeys: string[];
  signerPublicKey: string;
  signerEncryptionPublicKey: string;
  signerAccountAddress: string;
  encryptedChannelIdentifier: string;
  channelIdentifierSignature: string;
  deadline: number;
};

export type acceptChannelResult = {
  apiUniqueKeys?: string[];
};

export const acceptChannelUniqueKeys = async (
  key1: string,
  key2: string,
  relyingParty: string,
  signerAccountID: string,
  deadline: number
) => {
  const enc = new TextEncoder();
  const root = enc.encode(`${key1}/${signerAccountID}/${deadline}/${key2}`);
  const material = await subtle.importKey("raw", root, "HKDF", false, [
    "deriveBits",
    "deriveKey",
  ]);
  const unixtimestamp = Math.floor(Date.now() / 30000) * 30;

  const output1 = await subtle.deriveBits(
    {
      name: "HKDF",
      salt: enc.encode(String(unixtimestamp)),
      info: new TextEncoder().encode(`${relyingParty}`),
      hash: "SHA-256",
    },
    material,
    256
  );

  const output2 = await subtle.deriveBits(
    {
      name: "HKDF",
      salt: enc.encode(String(unixtimestamp)),
      info: new TextEncoder().encode(`${relyingParty}`),
      hash: "SHA-256",
    },
    material,
    256
  );

  return [buf2hex(output1), buf2hex(output2)];
};

export const importEncryptionPublicKey = async (
  rawEncryptionPublicKey: string
) => {
  const encryptionKey = await subtle.importKey(
    "raw",
    hex2buf(rawEncryptionPublicKey),
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    []
  );
  return encryptionKey;
};

export const generateEncryptionKey = async (
  encryptionPrivateKey: CryptoKey,
  encryptionRawPublicKey: string
) => {
  const encryptionPublicKey = await importEncryptionPublicKey(
    encryptionRawPublicKey
  );
  const encryptionKey = await subtle.deriveKey(
    {
      name: "ECDH",
      public: encryptionPublicKey,
    },
    encryptionPrivateKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
  return encryptionKey;
};

export const acceptChannel = async (
  id: number,
  params: acceptChannelParams
): Promise<Response> => {
  const response = await fetch(import.meta.env.VITE_API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: jsonRpcMethod.SmartrMethodAcceptChannel,
      params: params,
      id,
    } as jsonRpcRequest),
  });
  return response;
};

export const generateChannelID = () => {
  return uuidv4();
};

export const encryptAndSign = async (
  encryptionKey: CryptoKey,
  signingKey: CryptoKey,
  message: string
) => {
  // @todo: generate a random IV and share it with the receiver
  const encryptedMessage = await subtle.encrypt(
    {
      name: "AES-GCM",
      iv: new Uint8Array(12),
    },
    encryptionKey,
    new TextEncoder().encode(message)
  );
  const signature = await subtle.sign(
    {
      name: "ECDSA",
      hash: { name: "SHA-256" },
    },
    signingKey,
    new TextEncoder().encode(message)
  );
  return {
    encryptedMessage: buf2hex(encryptedMessage),
    signature: buf2hex(signature),
  };
};
