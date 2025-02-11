import "./App.css";
import SubmitChannelRequest from "./components/submit_channel_request";
import AcknowledgeChannel from "./components/acknowledge_channel";
import SendMessage from "./components/send_message";
import { AuthProvider } from "./components/authn";

function App() {
  return (
    <>
      <h1>API Interactions</h1>
      <AuthProvider>
        <SubmitChannelRequest />
        <AcknowledgeChannel />
        <SendMessage />
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </AuthProvider>
    </>
  );
}

export default App;
