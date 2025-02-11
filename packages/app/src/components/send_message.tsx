import { useAuthn } from "./authn_context";

function SendMessage() {
  const { channelID } = useAuthn();
  return (
    <>
      {channelID && (
        <>
          <h2>Send Message with {channelID}</h2>
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
