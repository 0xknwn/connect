import "./App.css";
import SubmitChannelRequest from "./components/submit_channel_request";
import AcknowledgeChannel from "./components/acknowledge_channel";
import SendMessage from "./components/send_message";
import { AuthProvider } from "./components/authn";
import { injectSmartr } from "@0xknwn/connect-core";
import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    injectSmartr();
  });

  return (
    <>
      <h1>API Interactions</h1>
      <AuthProvider>
        <SubmitChannelRequest />
        <AcknowledgeChannel />
        <SendMessage />
      </AuthProvider>
    </>
  );
};

export default App;
