import { useState } from "react";
import "./App.css";
import SubmitChannelRequest from "./components/submit_channel_request";

function App() {
  return (
    <>
      <h1>API Interactions</h1>
      <SubmitChannelRequest />
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
