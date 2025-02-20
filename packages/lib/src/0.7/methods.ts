import { WALLET_API } from "@starknet-io/types-js";

const notImplemented = async () => {
  throw new Error("Not implemented");
};

export const requestChainId = async () => {
  console.log("requestChainId");
  return "0x534e5f5345504f4c4941";
};

export const handlers = {
  wallet_addStarknetChain: notImplemented,
  wallet_switchStarknetChain: notImplemented,
  wallet_watchAsset: notImplemented,
  wallet_requestAccounts: notImplemented,
  wallet_getPermissions: notImplemented,
  wallet_requestChainId: requestChainId,
  wallet_deploymentData: notImplemented,
  wallet_addDeclareTransaction: notImplemented,
  wallet_addInvokeTransaction: notImplemented,
  wallet_signTypedData: notImplemented,
  wallet_supportedSpecs: notImplemented,
  wallet_supportedWalletApi: notImplemented,
} as Record<WALLET_API.RpcMessage["type"], (params?: any) => Promise<any>>;
