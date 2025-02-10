import { hex2buf } from "./utils";
import { jsonRpcMethod } from "./jsonrpc";
import type { jsonRpcRequest } from "./jsonrpc";
import { subtle } from "./subtle";

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

export const decryptAndVerify = async (
  encryptionKey: CryptoKey,
  verifyingKey: CryptoKey,
  encryptedMessage: string,
  signature: string
) => {
  // @todo: share the IV and use it to decrypt the message content
  const decryptedMessage = await subtle.decrypt(
    {
      name: "AES-GCM",
      iv: new Uint8Array(12),
    },
    encryptionKey,
    hex2buf(encryptedMessage)
  );
  const message = new TextDecoder().decode(decryptedMessage);
  const verified = await subtle.verify(
    {
      name: "ECDSA",
      hash: { name: "SHA-256" },
    },
    verifyingKey,
    hex2buf(signature),
    decryptedMessage
  );
  return { message, verified };
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
