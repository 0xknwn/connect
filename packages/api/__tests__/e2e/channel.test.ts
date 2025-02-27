import { describe, it, expect, beforeAll } from "vitest";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api/api";

import { loadKeys } from "./loadkeys";
import {
  submitChannelRequest,
  channelRequestUniqueKeys,
  channelUniqueKeys,
  acknowledgeChannelRequest,
  acknowledgeChannelRequestResult,
  acceptChannel,
  acknowledgeChannel,
  acknowledgeChannelResult,
  encryptAndSign,
  decryptAndVerify,
  acceptChannelUniqueKeys,
  generateChannelID,
  queryMessages,
  sign,
  submitMessage,
  queryMessagesResult,
  verify,
} from "../../lib";

describe("use connect channels", () => {
  const sixdigitpin = "000000";
  const fourdigitpin = "0000";
  const hexAgentPrivateKey =
    "0x308187020100301306072a8648ce3d020106082a8648ce3d030107046d306b0201010420b69c7ef48c764db9df61e178e13b7027bd5d1502ce05b5d58fbfa0799d2d29eca14403420004ebde890ab862328bf0f368a786a1472b0480702cc7e1967c0286678d76ae43ee9a6a39810eb0a7024637e00c3803ac817abdad587c1053435fd9b6233ad46749";
  const hexAgentPublicKey =
    "0x04ebde890ab862328bf0f368a786a1472b0480702cc7e1967c0286678d76ae43ee9a6a39810eb0a7024637e00c3803ac817abdad587c1053435fd9b6233ad46749";
  const hexAgentEncryptionPrivateKey =
    "0x308187020100301306072a8648ce3d020106082a8648ce3d030107046d306b0201010420a8585d7164a0eef2c3198c1549263eb0e49fbb832f7482310aa98e7f220c3a56a14403420004187971a64ce9754fe05b4f8ed93b232dbd5c9662520f6d918b03c43992ad76e8d32bf7c32f22ce525043632232a4a7696e23bc08e25660308a29ba5a0a721363";
  const hexAgentEncryptionPublicKey =
    "0x04187971a64ce9754fe05b4f8ed93b232dbd5c9662520f6d918b03c43992ad76e8d32bf7c32f22ce525043632232a4a7696e23bc08e25660308a29ba5a0a721363";
  const hexSignerPrivateKey =
    "0x308187020100301306072a8648ce3d020106082a8648ce3d030107046d306b0201010420ac4b76269c1a5e8055c7caebb443e960f7fe2b2f71ddf1d06bc9452e4ff6a1b0a14403420004b204e992469e82927a1efcf3e970505445d77169b6c4dbfdcaad4bce473369563b0d2377b0356f4bb4a83241744c1665fa21bc096705a6725a995853f81c2c55";
  const hexSignerPublicKey =
    "0x04b204e992469e82927a1efcf3e970505445d77169b6c4dbfdcaad4bce473369563b0d2377b0356f4bb4a83241744c1665fa21bc096705a6725a995853f81c2c55";
  const hexSignerEncryptionPrivateKey =
    "0x308187020100301306072a8648ce3d020106082a8648ce3d030107046d306b02010104204fdebd481a0dc5d316b0423b34aec5b2c27fcabd344ef62d6e0793e86e97dfd0a1440342000443163678b618d1eb16022c4ebfb8a36717fcc934759d3bab2020082c13c3e16abfa092dc4b90476136c05cace195885c095c0cad8d7fda54f71abf37aef9f014";
  const hexSignerEncryptionPublicKey =
    "0x0443163678b618d1eb16022c4ebfb8a36717fcc934759d3bab2020082c13c3e16abfa092dc4b90476136c05cace195885c095c0cad8d7fda54f71abf37aef9f014";
  let AgentKeyPair: CryptoKeyPair;
  let AgentEncryptionKeyPair: CryptoKeyPair;
  let SignerKeyPair: CryptoKeyPair;
  let SignerEncryptionKeyPair: CryptoKeyPair;
  let encryptionKey: CryptoKey;
  let deadline: number;
  let channelID: string;

  const relyingParty = "http://example.com";
  const agentAccountAddress = "0x1234";
  const signerAccountAddress = "0x5678";
  const signerAccountID = "0x90ab";

  beforeAll(async () => {
    const output = await loadKeys({
      hexAgentPrivateKey,
      hexAgentPublicKey,
      hexAgentEncryptionPrivateKey,
      hexAgentEncryptionPublicKey,
      hexSignerPrivateKey,
      hexSignerPublicKey,
      hexSignerEncryptionPrivateKey,
      hexSignerEncryptionPublicKey,
    });
    AgentKeyPair = output.AgentKeyPair;
    AgentEncryptionKeyPair = output.AgentEncryptionKeyPair;
    SignerKeyPair = output.SignerKeyPair;
    SignerEncryptionKeyPair = output.SignerEncryptionKeyPair;
    encryptionKey = output.encryptionKey;
  });

  it("submit channel request", async () => {
    const keys = await channelRequestUniqueKeys(sixdigitpin);
    const response = await submitChannelRequest(baseURL, 1, {
      relyingParty: "http://example.com",
      agentAccountAddress,
      agentPublicKey: hexAgentPublicKey,
      agentEncryptionPublicKey: hexAgentEncryptionPublicKey,
      signerAccountID,
      channelRequestUniqueKeys: keys,
    });
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload?.result).toBeTruthy();
    const unixtimestamp = Math.floor(Date.now() / 1000);
    expect(payload.result.deadline).toBeGreaterThan(unixtimestamp + 895);
    expect(payload.result.deadline).toBeLessThanOrEqual(unixtimestamp + 905);
  });

  it("acknowlege channel request", async () => {
    const keys = await channelRequestUniqueKeys(sixdigitpin);
    const response = await acknowledgeChannelRequest(baseURL, 1, {
      channelRequestUniqueKeys: keys,
    });
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload?.result).toBeTruthy();
    const result: acknowledgeChannelRequestResult = payload.result;
    const unixtimestamp = Math.floor(Date.now() / 1000);
    expect(result.deadline).toBeGreaterThan(unixtimestamp + 895);
    expect(result.deadline).toBeLessThanOrEqual(unixtimestamp + 905);
    deadline = result.deadline;
    expect(result.relyingParty).toBe("http://example.com");
    expect(result.agentAccountAddress).toBe(agentAccountAddress);
    expect(result.agentPublicKey).toBe(hexAgentPublicKey);
    expect(result.agentEncryptionPublicKey).toBe(hexAgentEncryptionPublicKey);
    expect(result.signerAccountID).toBe(signerAccountID);
  });

  it("accept channel", async () => {
    channelID = generateChannelID();
    const { encryptedMessage, signature } = await encryptAndSign(
      encryptionKey,
      SignerKeyPair.privateKey,
      channelID
    );
    const response = await acceptChannel(baseURL, 1, {
      acceptChannelUniqueKeys: await acceptChannelUniqueKeys(
        sixdigitpin,
        fourdigitpin,
        relyingParty,
        signerAccountID,
        deadline
      ),
      signerPublicKey: hexSignerPublicKey,
      signerEncryptionPublicKey: hexSignerEncryptionPublicKey,
      signerAccountAddress,
      encryptedChannelIdentifier: encryptedMessage,
      channelIdentifierSignature: signature,
      deadline,
    });
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload?.result).toBeTruthy();
  });

  it("acknowledge channel", async () => {
    const keys = await acceptChannelUniqueKeys(
      sixdigitpin,
      fourdigitpin,
      relyingParty,
      signerAccountID,
      deadline
    );

    const response = await acknowledgeChannel(baseURL, 1, {
      acceptChannelUniqueKeys: keys,
    });
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload?.result).toBeTruthy();
    const result: acknowledgeChannelResult = payload.result;
    expect(result.signerPublicKey).toBe(hexSignerPublicKey);
    expect(result.signerEncryptionPublicKey).toBe(hexSignerEncryptionPublicKey);
    expect(result.signerAccountAddress).toBe(signerAccountAddress);
    const { message, verified } = await decryptAndVerify(
      encryptionKey,
      SignerKeyPair.publicKey,
      result.encryptedChannelIdentifier,
      result.channelIdentifierSignature
    );
    expect(message).toBe(channelID);
    expect(verified).toBe(true);
  });

  it("submit message", async () => {
    const keys = await channelUniqueKeys(relyingParty, channelID);
    const message = JSON.stringify({ hello: "world" });
    const messageSignature = await sign(AgentKeyPair.privateKey, message);
    const response = await submitMessage(baseURL, 1, {
      channelUniqueKeys: keys,
      message,
      messageSignature,
    });
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload?.result).toBeTruthy();
  });

  it("query message", async () => {
    const keys = await channelUniqueKeys(relyingParty, channelID);
    const response = await queryMessages(baseURL, 1, {
      channelUniqueKeys: keys,
    });
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload?.result).toBeTruthy();
    const result: queryMessagesResult = payload.result;
    expect(result.messages.length).toBe(1);
    expect(result.messages[0]).toBe(JSON.stringify({ hello: "world" }));
    expect(result.messageSignatures.length).toBe(1);
    const verified = await verify(
      AgentKeyPair.publicKey,
      result.messages[0],
      result.messageSignatures[0]
    );
    expect(verified).toBe(true);
  });
});
