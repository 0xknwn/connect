import { buf2hex } from "./utils";

export type submitChannelRequestParams = {
  relyingParty: string;
  agentAccountAddress?: string;
  AgentPublicKey: string;
  agentEncryptionPublicKey: string;
  signerAccountID: string;
  channelRequestUniqueKeys: string[];
  ttl?: number;
};

export const channelRequestID = async (key: string) => {
  const rely_party = "smartr.network";
  const enc = new TextEncoder();
  const root = enc.encode(`${rely_party}/${key}`);
  const material = await window.crypto.subtle.importKey(
    "raw",
    root,
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );
  const unixtimestamp = Math.floor(Date.now() / 30000) * 30;

  const key1 = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: enc.encode(String(unixtimestamp)),
      iterations: 65536,
      hash: "SHA-256",
    },
    material,
    256
  );

  const key2 = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: enc.encode(String(unixtimestamp + 30)),
      iterations: 65536,
      hash: "SHA-256",
    },
    material,
    256
  );

  return [buf2hex(key1), buf2hex(key2)];
};
