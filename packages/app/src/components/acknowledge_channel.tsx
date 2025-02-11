import { useState } from "react";
import {
  acceptChannelUniqueKeys,
  acknowledgeChannel,
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
    setChannelState,
  } = useAuthn();
  const dixDigitPin = "123456";
  const [pin, setPin] = useState("123456");
  const url = "/api";
  const relyingParty = window.location.hostname;

  const request = async () => {
    // export public key from CryptoKey
    if (!publicKey || !sharingPublicKey) {
      throw new Error("missing public keys");
    }
    const keys = await acceptChannelUniqueKeys(
      dixDigitPin,
      pin,
      relyingParty,
      remoteAccountID,
      deadline
    );

    const response = await acknowledgeChannel(url, 2, {
      acceptChannelUniqueKeys: keys,
    });
    if (response.status !== 200) {
      throw new Error("accept channel failed");
    }
    const output = await response.json();
    if (output.result) {
      console.log("channel acknowledged");
      //   {
      //     "signerPublicKey": "0x043c5013b7724a0250374945461726f9fc8ee75fbf6a29c455634f5daf5aa26cdbf4200a6b8659ff3d6b856042a7465f83216b0e27a26213d45a457b2d700a719e",
      //     "signerEncryptionPublicKey": "0x0406d070c199dba1a92da016447e669e66b1b87d7ef9db6995341eb20fb7e813ef23a63bcc1f874d12afe8664aeda44e0308368853e4f31e4fac8171e2ad4c68bf",
      //     "signerAccountAddress": "0x1",
      //     "encryptedChannelIdentifier": "0x6ef592afbda0479d876e71cd63e774228af945183a830f759991be21d36400006ffa7ec9ef1f5b7486573c26bbab97f53415b9e6",
      //     "channelIdentifierSignature": "0x36fd6656f9e4539753e4e1341ea5404e59a1483f0e24ef3658f7d2348cbb293958f64f1ffad7b99507b771730c0a02290bdea67cb47edbf10d0817c87ddadf8d",
      //     "deadline": 1739269593
      // }
      console.log("output result:", output.result);
      setChannelState(ChannelState.channelOpened);
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
