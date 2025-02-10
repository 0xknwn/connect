import { buf2hex } from "./utils";
import { jsonRpcMethod } from "./jsonrpc";
import type { jsonRpcRequest } from "./jsonrpc";
import { subtle } from "./subtle";

export type submitMessageParams = {
  channelUniqueKeys: string[];
  apiUniqueKeys?: string[];
  message: any;
  messageSignature: string;
};

export type submitMessageResult = {};

export const sign = async (signingKey: CryptoKey, message: string) => {
  const signature = await subtle.sign(
    {
      name: "ECDSA",
      hash: { name: "SHA-256" },
    },
    signingKey,
    new TextEncoder().encode(message)
  );
  return buf2hex(signature);
};

export const channelUniqueKeys = async (relyingParty: string, key: string) => {
  const enc = new TextEncoder();
  const root = enc.encode(`${key}`);
  const material = await subtle.importKey(
    "raw",
    root,
    "HKDF",
    false,
    ["deriveBits", "deriveKey"]
  );
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

export const submitMessage = async (
  baseURL: string,
  id: number,
  params: submitMessageParams
): Promise<Response> => {
  const response = await fetch(baseURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: jsonRpcMethod.SmartrMethodSubmitMessage,
      params: params,
      id,
    } as jsonRpcRequest),
  });
  return response;
};
