import Postmate from "postmate";

const handshake = new Postmate.Model({
  message: () => "Hello, Parent!",
});

handshake.then((parent) => {
  parent.emit("some-event", "Hello, World!");
});

console.log("Child is alive!");
