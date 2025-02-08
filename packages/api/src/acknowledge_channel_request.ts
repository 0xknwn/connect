import { jsonRpcMethod, type jsonRpcRequest } from "./jsonrpc";

export type acknowledgeChannelRequestParams = {
  channelRequestUniqueKeys: string[];
};

export type acknowledgeChannelRequestResult = {
  relyingParty: string;
  agentAccountAddress?: string;
  agentPublicKey: string;
  agentEncryptionPublicKey: string;
  signerAccountID: string;
  deadline: number;
  apiUniqueKeys?: string[];
};

export const acknowledgeChannelRequest = async (
  id: number,
  params: acknowledgeChannelRequestParams
): Promise<Response> => {
  const response = await fetch(import.meta.env.VITE_API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: jsonRpcMethod.SmartrMethodAcknowledgeChannelRequest,
      params: params,
      id,
    } as jsonRpcRequest),
  });
  return response;
};
