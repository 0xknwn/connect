export type submitMessageParams = {
    channelUniqueKeys: string[];
    apiUniqueKeys?: string[];
    message: any;
    messageSignature: string;
};
export type submitMessageResult = {};
export declare const sign: (signingKey: CryptoKey, message: string) => Promise<string>;
export declare const channelUniqueKeys: (relyingParty: string, key: string) => Promise<string[]>;
export declare const submitMessage: (id: number, params: submitMessageParams) => Promise<Response>;
