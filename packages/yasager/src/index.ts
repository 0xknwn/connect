import { ask6DigitPin } from "./input";

const main = async () => {
  const pin = await ask6DigitPin();
  console.log(pin);
};

main();
