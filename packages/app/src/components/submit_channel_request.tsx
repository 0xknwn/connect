import { useState } from "react";
import {
  buf2hex,
  submitChannelRequest,
  channelRequestUniqueKeys,
  submitChannelRequestParams,
} from "@0xknwn/connect-api";
import { useAuthn } from "./authn_context";
import { ChannelState } from "./authn_context";

function SubmitChannelRequest() {
  const {
    accountAddress,
    remoteAccountID,
    publicKey,
    sharingPublicKey,
    channelState,
    setDeadline,
    setChannelState,
  } = useAuthn();
  const [pin, _] = useState("123456");
  const url = "/api";
  const relyingParty = window.location.hostname;

  const request = async () => {
    // export public key from CryptoKey
    if (!publicKey || !sharingPublicKey) {
      throw new Error("missing public keys");
    }

    const agentPublicKey = buf2hex(
      await window.crypto.subtle.exportKey("raw", publicKey)
    );
    const agentEncryptionPublicKey = buf2hex(
      await window.crypto.subtle.exportKey("raw", sharingPublicKey)
    );

    const uniqueKeys = await channelRequestUniqueKeys(pin);
    const response = await submitChannelRequest(url, 1, {
      relyingParty,
      channelRequestUniqueKeys: uniqueKeys,
      agentAccountAddress: accountAddress,
      agentPublicKey,
      agentEncryptionPublicKey,
      signerAccountID: remoteAccountID,
    } as submitChannelRequestParams);
    if (response.status !== 200) {
      throw new Error("submit channel request failed");
    }
    const output = await response.json();
    if (output.result) {
      console.log("channel request submitted");
      const { deadline } = output.result;
      if (!deadline) {
        throw new Error("missing deadline");
      }
      setDeadline(deadline);
      setChannelState(ChannelState.requestPending);
      return;
    }
    console.error("channel request failed", output);
  };

  return (
    <>
      {channelState === ChannelState.initial && (
        <>
          <h2>Submit a new Channel Request</h2>
          <input type="text" placeholder="pin" value={pin} readOnly />
          <button onClick={request}>submit</button>
        </>
      )}
    </>
  );
}

export default SubmitChannelRequest;
