import { ask6DigitPin } from "./input";
import {
  channelRequestUniqueKeys,
  acknowledgeChannelRequest,
  acknowledgeChannelRequestParams,
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

const sleep = async (ms: number) => {
  return await new Promise((resolve) => setTimeout(resolve, ms));
};

const main = async () => {
  const pin = await ask6DigitPin();
  const keys = await channelRequestUniqueKeys(pin);

  const params: acknowledgeChannelRequestParams = {
    channelRequestUniqueKeys: keys,
  };
  for (let i = 0; i < 10; i++) {
    const result = await acknowledgeChannelRequest(1, params);
    if (!result.ok) {
      console.error(await result.json());
      return;
    }
    const output = await result.json();
    if (output.error && output.error.code === -32001) {
      process.stdout.write(".");
      await sleep(5000);
      continue;
    }
    if (output.error) {
      console.error(output.error);
      return;
    }
    console.log("");
    console.log("result:", output.result);
    return;
  }
  console.log("");
};

main();
