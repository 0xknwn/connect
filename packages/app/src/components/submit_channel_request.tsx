import { useState } from "react";

function SubmitChannelRequest() {
  const [channelID, setChannelID] = useState("");

  return (
    <>
      <h2>submit Channel Request</h2>
      <input
        type="text"
        placeholder="channelID"
        value={channelID}
        onChange={(e) => setChannelID(e.target.value)}
      />
      <button
        onClick={() => {
          console.log(channelID);
        }}
      >
        submit
      </button>
    </>
  );
}

export default SubmitChannelRequest;
