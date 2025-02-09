import { ask6DigitPin } from "./input";
import {
  channelRequestUniqueKeys,
  // acknowledgeChannelRequest,
  // acknowledgeChannelRequestParams,
} from "@0xknwn/connect-api";
const { subtle } = globalThis.crypto;

const generateKey = async (namedCurve = "P-256") => {
  const { publicKey, privateKey } = await subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve,
    },
    true,
    ["sign", "verify"]
  );

  return { publicKey, privateKey };
};

const main = async () => {
  const pin = await ask6DigitPin();
  console.log(pin);
  const keys = await channelRequestUniqueKeys(pin);
  console.log(keys);
  await generateKey();
};

main();
