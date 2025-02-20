import {
  WALLET_API,
  API_VERSION_NOT_SUPPORTED as API_VERSION_NOT_SUPPORTED_ERROR,
} from "@starknet-io/types-js";
import { handlers as handlers07 } from "./0.7/methods";

const version07 = "0.7" as string;
const defaultVersion = version07 as string;

const API_VERSION_NOT_SUPPORTED: API_VERSION_NOT_SUPPORTED_ERROR = {
  code: 162,
  message: "An error occurred (API_VERSION_NOT_SUPPORTED)",
  data: "string",
};

export const supportedWalletApi = async () => {
  return [version07];
};

const versionedHandlers = {
  [version07]: {
    ...handlers07,
    wallet_supportedWalletApi: supportedWalletApi,
  },
};

export const handleMessage = <T extends WALLET_API.RpcMessage["type"]>(
  call: WALLET_API.RequestFnCall<T>
) => {
  const version = call.params?.api_version ?? defaultVersion;
  if (!versionedHandlers[version]) {
    throw API_VERSION_NOT_SUPPORTED;
  }
  const handlers = versionedHandlers[version];
  console.log("handlers", handlers);
  const handle = handlers[call.type];
  if (!handle) {
    throw new Error(`Unsupported request type: ${call.type}`);
  }
  console.log("handle", handle);
  return "params" in call
    ? handle({ ...(delete call.params?.api_version && call.params) })
    : handle();
};
