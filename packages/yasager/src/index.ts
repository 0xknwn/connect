import { ask6DigitPin } from "./input";
// import { submitChannelRequest } from "@0xknwn/connect-api";

const main = async () => {
  const pin = await ask6DigitPin();
  console.log(pin);
};

main();
