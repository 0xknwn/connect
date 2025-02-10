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
export declare const acknowledgeChannelRequest: (baseURL: string, id: number, params: acknowledgeChannelRequestParams) => Promise<Response>;
