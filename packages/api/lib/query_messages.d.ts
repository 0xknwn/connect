export type queryMessagesParams = {
    channelUniqueKeys: string[];
    apiUniqueKeys?: string[];
};
export type queryMessagesResult = {
    messages: any[];
    messageSignatures: string[];
};
export declare const verify: (verifyingKey: CryptoKey, message: string, hexSignature: string) => Promise<boolean>;
export declare const queryMessages: (id: number, params: queryMessagesParams) => Promise<Response>;
