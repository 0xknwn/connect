import {
  submitChannelRequestParams,
  submitChannelRequestResult,
} from "./submit_channel_request";
import {
  acknowledgeChannelRequestParams,
  acknowledgeChannelRequestResult,
} from "./acknowledge_channel_request";

export enum jsonRpcMethod {
  SmartrMethodSubmitChannelRequest = "smartr_submitChannelRequest",
  SmartrMethodAcknowledgeChannelRequest = "smartr_acknowledgeChannelRequest",
  SmartrMethodAcceptChannel = "smartr_acceptChannel",
  SmartrMethodAcknowledgeChannel = "smartr_acknowledgeChannel",
  SmartrMethodSubmitMessage = "smartr_submitMessage",
  SmartrMethodQueryMessages = "smartr_queryMessages",
}

export type jsonRpcRequest = {
  jsonrpc: string;
  method: jsonRpcMethod;
  params: submitChannelRequestParams | acknowledgeChannelRequestParams;
  id: number;
};

export type RpcError = {
  code: number;
  message: string;
  data?: any;
};

export type jsonRpcResponse = {
  jsonrpc: string;
  result?: submitChannelRequestResult | acknowledgeChannelRequestResult;
  error?: RpcError;
  id: number;
};
