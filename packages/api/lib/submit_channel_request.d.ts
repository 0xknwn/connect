export type submitChannelRequestParams = {
    relyingParty: string;
    agentAccountAddress?: string;
    agentPublicKey: string;
    agentEncryptionPublicKey: string;
    signerAccountID: string;
    channelRequestUniqueKeys: string[];
    ttl?: number;
};
export type submitChannelRequestResult = {
    apiUniqueKeys?: string[];
    deadline: number;
};
export declare const channelRequestUniqueKeys: (key: string) => Promise<string[]>;
export declare const submitChannelRequest: (baseURL: string, id: number, params: submitChannelRequestParams) => Promise<Response>;
