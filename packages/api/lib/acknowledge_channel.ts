import { hex2buf } from "./utils";
import { jsonRpcMethod } from "./jsonrpc";
import type { jsonRpcRequest } from "./jsonrpc";
import { subtle } from "./subtle";
import { verify } from "./query_messages";

export const importPublicKey = async (rawPublicKey: string) => {
  const encryptionKey = await subtle.importKey(
    "raw",
    hex2buf(rawPublicKey),
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["verify"]
  );
  return encryptionKey;
};

export type acknowledgeChannelParams = {
  acceptChannelUniqueKeys: string[];
  apiUniqueKeys?: string[];
};

export type acknowledgeChannelResult = {
  signerPublicKey: string;
  signerEncryptionPublicKey: string;
  signerAccountAddress: string;
  encryptedChannelIdentifier: string;
  channelIdentifierSignature: string;
  deadline: number;
};

export const decrypt = async (
  encryptionKey: CryptoKey,
  encryptedMessage: string
) => {
  if (!encryptionKey) {
    throw new Error("No encryption key");
  }
  const [iv, data] = encryptedMessage.split(":").map((x) => hex2buf(x));
  const decryptedMessage = await subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    encryptionKey,
    data
  );
  return new TextDecoder().decode(decryptedMessage);
};

export const decryptAndVerify = async (
  encryptionKey: CryptoKey,
  verifyingKey: CryptoKey,
  encryptedMessage: string,
  signature: string
) => {
  const decryptedMessage = await decrypt(encryptionKey, encryptedMessage);
  const verified = await verify(verifyingKey, decryptedMessage, signature);
  return { message: decryptedMessage, verified };
};

export const acknowledgeChannel = async (
  baseURL: string,
  id: number,
  params: acknowledgeChannelParams
): Promise<Response> => {
  const response = await fetch(baseURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: jsonRpcMethod.SmartrMethodAcknowledgeChannel,
      params: params,
      id,
    } as jsonRpcRequest),
  });
  return response;
};
