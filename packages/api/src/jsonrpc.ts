import { submitChannelRequestParams } from "./submit_channel_request";

export enum jsonRpcMethod {
  SmartrMethodSubmitChannelRequest = "smartr_submitChannelRequest",
  SmartrMethodAcknowledgeChannelRequest = "smartr_acknowledgeChannelRequest",
  SmartrMethodAcceptChannel = "smartr_acceptChannel",
  SmartrMethodAcknowledgeChannel = "smartr_acknowledgeChannel",
  SmartrMethodSubmitMessage = "smartr_submitMessage",
  SmartrMethodQueryMessages = "smartr_queryMessages",
}

type jsonRpc = {
  jsonrpc: string;
  method: jsonRpcMethod;
  params: submitChannelRequestParams;
  id: number;
};

export const submitChannelRequest = async (
  id: number,
  params: submitChannelRequestParams
): Promise<Response> => {
  const response = await fetch(import.meta.env.VITE_API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: jsonRpcMethod.SmartrMethodSubmitChannelRequest,
      params: params,
      id,
    } as jsonRpc),
  });
  return response;
};
