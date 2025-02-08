import { injectUI } from "./ui";
export { injectUI };

declare global {
  interface Window {
    starknet_smartr: StarknetWindowObject | undefined;
  }
}

class StarknetWindowObject {
  getContractAddress: () => Promise<string> = async () => {
    return "0x1234567890";
  };

  sendMessage: (
    application: string,
    domain: string,
    contractAddress: string,
    entrypoint: string,
    calldata: string[]
  ) => Promise<void> = async (
    application: string,
    domain: string,
    contractAddress: string,
    entrypoint: string,
    calldata: string[]
  ) => {
    const response = await fetch("/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        calls: [
          {
            contractAddress,
            entrypoint,
            calldata,
          },
        ],
        type: "request",
        application,
        domain,
      }),
    });
    console.log(
      "sending transaction to /message",
      contractAddress,
      entrypoint,
      calldata
    );
    console.log("response", response.status, await response.json());
  };

  injectSmartr: (elementId: string) => Promise<void> = async (
    elementId: string
  ) => {
    console.log("injecting smartr on", elementId);
  };
}

export const injectSmartr = async () => {
  console.log("injecting smartr");
  if (window.starknet_smartr) {
    return window.starknet_smartr;
  }

  const proxy = new StarknetWindowObject();
  window.starknet_smartr = proxy;

  return proxy;
};

injectSmartr();
