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
} from "@0xknwn/connect-api";

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
    console.log("");
    const {
      relyingParty,
      agentAccountAddress,
      agentPublicKey,
      agentEncryptionPublicKey,
      signerAccountID,
      deadline,
    } = output.result as acknowledgeChannelRequestResult;
    console.log("result:", output.result);
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

const accChannel = async (pin: string) => {};

const main = async () => {
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
  console.log("relyingParty:", relyingParty);
  console.log("agentAccountAddress:", agentAccountAddress);
  console.log("agentPublicKey:", agentPublicKey);
  console.log("agentEncryptionPublicKey:", agentEncryptionPublicKey);
  console.log("signerAccountID:", signerAccountID);
  console.log("deadline:", deadline);

  const fourDigitPin = String(Math.floor(Math.random() * 10000)).padStart(
    4,
    "0"
  );
  console.log("4-digit pin:", fourDigitPin);
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
    agentEncryptionPublicKey
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
  console.log(acceptChannelResult);

  for (let i = 0; i < 30; i++) {
    const keys = await channelUniqueKeys(relyingParty, channelID);
    const response = await queryMessages(baseURL, 1, {
      channelUniqueKeys: keys,
    });
    if (!response.ok) {
      console.error(await response.json());
      return;
    }
    const payload = await response.json();
    if (payload.error && payload.error.code === -32001) {
      process.stdout.write(".");
      await sleep(5000);
      continue;
    }
    if (payload.error) {
      console.error(payload.error);
      return;
    }
    console.log("");
    const result = payload.result as queryMessagesResult;
    if (Array.isArray(result.messages)) {
      for (let [idx, _] of result.messages.entries()) {
        const message = result.messages[idx];
        const signature = result.messageSignatures[idx];
        const verified = await verify(publicKey, message, signature);
        console.log("message:", message);
        console.log("verified:", verified);
      }
    }
  }
};

main();
