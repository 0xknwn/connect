import { useEffect, useState } from "react";
import {
  acceptChannelUniqueKeys,
  acknowledgeChannel,
  hex2buf,
  subtle,
} from "@0xknwn/connect-api";
import { useAuthn } from "./authn_context";
import { ChannelState } from "./authn_context";
function AcknowledgeChannel() {
  const {
    remoteAccountID,
    publicKey,
    sharingPublicKey,
    channelState,
    deadline,
    setRemotePublicKey,
    setRemoteAccountAddress,
    setRemoteSharingPublicKey,
    setEncryptedChannelIdentifier,
    setChannelIdentifierSignature,
  } = useAuthn();
  const sixDigitPin = "123456";
  const [pin, setPin] = useState("");

  useEffect(() => {}, []);

  const url = "/api";
  const relyingParty = window.location.hostname;

  const request = async () => {
    if (!publicKey || !sharingPublicKey) {
      throw new Error("missing public keys");
    }
    const keys = await acceptChannelUniqueKeys(
      sixDigitPin,
      pin,
      relyingParty,
      remoteAccountID,
      deadline
    );
    console.log("keys", keys);
    const response = await acknowledgeChannel(url, 2, {
      acceptChannelUniqueKeys: keys,
    });
    if (response.status !== 200) {
      throw new Error("accept channel failed");
    }
    const output = await response.json();
    if (output.result) {
      console.log("channel acknowledged");
      const {
        signerPublicKey,
        signerEncryptionPublicKey,
        signerAccountAddress,
        encryptedChannelIdentifier,
        channelIdentifierSignature,
        deadline: receivedDeadline,
      } = output.result;
      if (!deadline || receivedDeadline !== deadline) {
        throw new Error("missing deadline");
      }
      const pubkey = await subtle.importKey(
        "raw",
        hex2buf(signerPublicKey),
        { name: "ECDSA", namedCurve: "P-256" },
        true,
        []
      );
      const ecpubkey = await subtle.importKey(
        "raw",
        hex2buf(signerEncryptionPublicKey),
        { name: "ECDH", namedCurve: "P-256" },
        true,
        []
      );
      setRemotePublicKey(pubkey);
      setRemoteSharingPublicKey(ecpubkey);
      setRemoteAccountAddress(signerAccountAddress);
      setEncryptedChannelIdentifier(encryptedChannelIdentifier);
      setChannelIdentifierSignature(channelIdentifierSignature);
      return;
    }
    console.error("channel acknowledged failed", output);
  };

  return (
    <>
      {channelState === ChannelState.requestPending && (
        <>
          <h2>Acknowledge Channel</h2>
          <input
            type="text"
            placeholder="pin"
            onChange={(e) => {
              setPin(e.target.value);
            }}
            value={pin}
          />
          <button onClick={request}>submit</button>
        </>
      )}
    </>
  );
}

export default AcknowledgeChannel;
