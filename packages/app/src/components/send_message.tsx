import { submitMessage, channelUniqueKeys } from "@0xknwn/connect-api";
import { useAuthn } from "./authn_context";

function SendMessage() {
  const { channelID, sign } = useAuthn();

  const url = "/api";
  const relyingParty = window.location.hostname;

  const message = `{"hello":"world"}`;
  const submit = async () => {
    const messageSignature = await sign(message);
    const keys = await channelUniqueKeys(relyingParty, channelID);
    const response = await submitMessage(url, 3, {
      channelUniqueKeys: keys,
      message,
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
        </>
      )}
    </>
  );
}

export default SendMessage;
