export {};

class StarknetWindowObject {
  getContractAddress: () => Promise<string> = async () => {
    return "0x1234567890";
  };
}

declare global {
  interface Window {
    starknet_smartr: StarknetWindowObject | undefined;
  }
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

