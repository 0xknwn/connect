import {
  WALLET_API,
  ChainId,
  Permission,
  SpecVersion,
} from "@starknet-io/types-js";

const notImplemented = async () => {
  throw new Error("Not implemented");
};

const emptyImplementation = async () => {
  throw new Error("Should be replaced by the wallet");
};
export const requestChainId = async (): Promise<ChainId> => {
  return "0x534e5f5345504f4c4941";
};

// @todo: check what are the permissions when the wallet is not connected
export const getPermissions = async (): Promise<Permission[]> => {
  return [Permission.ACCOUNTS];
};

export const supportedSpecs = async (): Promise<SpecVersion[]> => {
  return ["0.7"];
};

export const handlers = {
  wallet_addStarknetChain: notImplemented,
  wallet_switchStarknetChain: notImplemented,
  wallet_watchAsset: notImplemented,
  wallet_requestAccounts: notImplemented,
  wallet_getPermissions: getPermissions,
  wallet_requestChainId: requestChainId,
  wallet_deploymentData: notImplemented,
  wallet_addDeclareTransaction: notImplemented,
  wallet_addInvokeTransaction: notImplemented,
  wallet_signTypedData: notImplemented,
  wallet_supportedSpecs: supportedSpecs,
  wallet_supportedWalletApi: emptyImplementation,
} as Record<WALLET_API.RpcMessage["type"], (params?: any) => Promise<any>>;
