import { submitMessage, channelUniqueKeys } from "@0xknwn/connect-api";
import { useAuthn } from "./authn_context";

function SendMessage() {
  const { channelID, sign, reset } = useAuthn();

  const url = "/api";
  const relyingParty = window.location.hostname;

  const submit = async () => {
    const message = {
      message: "hello world",
      nonce: Math.floor(Math.random() * 1000000).toString(),
    };
    const content = JSON.stringify(message);
    const messageSignature = await sign(content);
    const keys = await channelUniqueKeys(relyingParty, channelID);
    const response = await submitMessage(url, 3, {
      channelUniqueKeys: keys,
      message: content,
      messageSignature,
    });
    if (response.status !== 200) {
      throw new Error("submit message failed");
    }
    const output = await response.json();
    if (output.result) {
      console.log("message submitted");
      return;
    }
    console.error(output.error);
  };

  return (
    <>
      {channelID && (
        <>
          <h2>Send Message with {channelID}</h2>
          <button
            onClick={() => {
              submit();
            }}
          >
            submit
          </button>
          <button
            onClick={() => {
              reset();
            }}
          >
            Reset Channel
          </button>
        </>
      )}
    </>
  );
}

export default SendMessage;
