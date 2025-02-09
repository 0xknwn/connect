import { jsonRpcMethod } from "./jsonrpc";
import type { jsonRpcRequest } from "./jsonrpc";
import { hex2buf } from "./utils";
export type queryMessagesParams = {
  channelUniqueKeys: string[];
  apiUniqueKeys?: string[];
};
import { subtle } from "./subtle";

export type queryMessagesResult = {
  messages: any[];
  messageSignatures: string[];
};

export const verify = async (
  verifyingKey: CryptoKey,
  message: string,
  hexSignature: string
) => {
  return await subtle.verify(
    {
      name: "ECDSA",
      hash: { name: "SHA-256" },
    },
    verifyingKey,
    hex2buf(hexSignature),
    new TextEncoder().encode(message)
  );
};

export const queryMessages = async (
  id: number,
  params: queryMessagesParams
): Promise<Response> => {
  const response = await fetch(import.meta.env.VITE_API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: jsonRpcMethod.SmartrMethodQueryMessages,
      params: params,
      id,
    } as jsonRpcRequest),
  });
  return response;
};
