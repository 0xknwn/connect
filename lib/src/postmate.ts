import Postmate from "postmate";

export const injectIFrame = async (elementId: string) => {
  const handshake = new Postmate({
    container: document.getElementById(elementId),
    url: "https://connect-0xknwn.vercel.app",
    name: "connect-0xknwn",
    classListArray: ["connectClass"],
  });

  handshake.then((child) => {
    child.get("message").then((message) => console.log(message));
    child.on("some-event", (data) => console.log(data));
  });
};
