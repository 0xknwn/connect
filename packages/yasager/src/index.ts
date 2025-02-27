import { ask6DigitPin } from "./input";
import {
  channelRequestUniqueKeys,
  acknowledgeChannelRequest,
  acknowledgeChannelRequestResult,
  acknowledgeChannelRequestParams,
  acceptChannel,
  acceptChannelUniqueKeys,
  acceptChannelParams,
  exportPublicKeyToHex,
  generateChannelID,
  encryptAndSign,
  generateEncryptionKey,
  queryMessages,
  channelUniqueKeys,
  queryMessagesResult,
  verify,
  hex2buf,
} from "@0xknwn/connect-api";
import "dotenv/config";

const baseURL = process.env.API_BASE_URL || "http://localhost:8080";

const accountAddress = "0x1";
const { subtle } = globalThis.crypto;
const generateKey = async (namedCurve = "P-256") => {
  const { publicKey, privateKey } = await subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve,
    },
    true,
    ["sign", "verify"]
  );
  return { publicKey, privateKey };
};

const generateECDHKey = async (namedCurve = "P-256") => {
  const { publicKey, privateKey } = await subtle.generateKey(
    {
      name: "ECDH",
      namedCurve,
    },
    true,
    ["deriveKey", "deriveBits"]
  );
  return { publicKey, privateKey };
};

const sleep = async (ms: number) => {
  return await new Promise((resolve) => setTimeout(resolve, ms));
};

const ackChannelRequest = async (pin: string) => {
  const keys = await channelRequestUniqueKeys(pin);
  const params: acknowledgeChannelRequestParams = {
    channelRequestUniqueKeys: keys,
  };
  for (let i = 0; i < 30; i++) {
    const result = await acknowledgeChannelRequest(baseURL, 1, params);
    if (!result.ok) {
      console.error(await result.json());
      return;
    }
    const output = await result.json();
    if (output.error && output.error.code === -32001) {
      process.stdout.write(".");
      await sleep(5000);
      continue;
    }
    if (output.error) {
      console.error(output.error);
      return;
    }
    const {
      relyingParty,
      agentAccountAddress,
      agentPublicKey,
      agentEncryptionPublicKey,
      signerAccountID,
      deadline,
    } = output.result as acknowledgeChannelRequestResult;
    return {
      relyingParty,
      agentAccountAddress,
      agentPublicKey,
      agentEncryptionPublicKey,
      signerAccountID,
      deadline,
    };
  }
};

const accChannel = async (
  sixDigitPin: string,
  fourDigitPin: string,
  relyingParty: string,
  signerAccountID: string,
  deadline: number,
  remoteEncryptionPublicKey: string
) => {
  const ackChannelKeys = await acceptChannelUniqueKeys(
    sixDigitPin,
    fourDigitPin,
    relyingParty,
    signerAccountID,
    deadline
  );
  const { publicKey, privateKey } = await generateKey();
  const { publicKey: publicECDHKey, privateKey: privateECDHKey } =
    await generateECDHKey();
  const channelID = generateChannelID();
  const encryptionKey = await generateEncryptionKey(
    privateECDHKey,
    remoteEncryptionPublicKey
  );
  const { encryptedMessage, signature } = await encryptAndSign(
    encryptionKey,
    privateKey,
    channelID
  );

  const acceptChannelResult = await acceptChannel(baseURL, 1, {
    acceptChannelUniqueKeys: ackChannelKeys,
    signerPublicKey: await exportPublicKeyToHex(publicKey),
    signerEncryptionPublicKey: await exportPublicKeyToHex(publicECDHKey),
    signerAccountAddress: accountAddress,
    encryptedChannelIdentifier: encryptedMessage,
    channelIdentifierSignature: signature,
    deadline,
  } as acceptChannelParams);
  if (acceptChannelResult.ok) {
    console.log("Channel accepted");
  }
  const output = await acceptChannelResult.json();
  if (output.error) {
    console.error(output.error);
    return;
  }
  return {
    publicKey,
    privateKey,
    channelID,
    encryptionKey,
  };
};

const isReceived: { [nonce: string]: boolean } = {};

const query = async (
  relyingParty: string,
  channelID: string,
  remotePublicKey: CryptoKey,
  deadline: number
) => {
  while (Math.floor(Date.now() / 1000) < deadline) {
    const keys = await channelUniqueKeys(relyingParty, channelID);
    const response = await queryMessages(baseURL, 1, {
      channelUniqueKeys: keys,
    });
    if (!response.ok) {
      console.error(await response.json());
      return;
    }
    const payload = await response.json();
    if (payload.error && payload.error.code === -32003) {
      process.stdout.write(".");
      await sleep(5000);
      continue;
    }
    if (payload.error) {
      console.error(payload.error);
      return;
    }
    const result = payload.result as queryMessagesResult;
    if (Array.isArray(result.messages)) {
      let found = false;
      for (let [idx, _] of result.messages.entries()) {
        const message = result.messages[idx];
        const signature = result.messageSignatures[idx];
        const verified = await verify(remotePublicKey, message, signature);
        const jsonMessage = JSON.parse(message);
        if (isReceived[jsonMessage.nonce]) {
          continue;
        }
        found = true;
        isReceived[jsonMessage.nonce] = true;
        console.log("");
        console.log("message:", message);
        console.log("verified:", verified);
      }
      if (!found) process.stdout.write(".");
    }
    await sleep(5000);
  }
  console.log("Deadline reached, channel has expired");
};

const main = async () => {
  console.log("Starting...");
  const sixDigitPin = await ask6DigitPin();

  const output = await ackChannelRequest(sixDigitPin);
  if (!output) {
    console.error("Failed to acknowledge channel request");
    return;
  }
  const {
    relyingParty,
    agentAccountAddress,
    agentPublicKey,
    agentEncryptionPublicKey,
    signerAccountID,
    deadline,
  } = output;
  const remotePublicKey = await subtle.importKey(
    "raw",
    hex2buf(agentPublicKey),
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["verify"]
  );
  const fourDigitPin = String(Math.floor(Math.random() * 10000)).padStart(
    4,
    "0"
  );
  console.log("4-digit pin:", fourDigitPin);

  const accOutput = await accChannel(
    sixDigitPin,
    fourDigitPin,
    relyingParty,
    signerAccountID,
    deadline,
    agentEncryptionPublicKey
  );
  if (!accOutput) {
    console.error("Failed to accept channel request");
    return;
  }
  const { channelID } = accOutput;
  console.log("channelID:", channelID);

  await query(relyingParty, channelID, remotePublicKey, deadline);
};

main();
