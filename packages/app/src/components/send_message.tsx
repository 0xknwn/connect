import { useAuthn } from "./authn_context";
import { ChannelState } from "./authn_context";

function SendMessage() {
  const { channelState } = useAuthn();
  return (
    <>
      {channelState === ChannelState.channelOpened && (
        <>
          <h2>Send Message</h2>
          <button
            onClick={() => {
              console.log("send message");
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
