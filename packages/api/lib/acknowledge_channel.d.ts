export declare const importPublicKey: (rawPublicKey: string) => Promise<CryptoKey>;
export type acknowledgeChannelParams = {
    acceptChannelUniqueKeys: string[];
    apiUniqueKeys?: string[];
};
export type acknowledgeChannelResult = {
    signerPublicKey: string;
    signerEncryptionPublicKey: string;
    signerAccountAddress: string;
    encryptedChannelIdentifier: string;
    channelIdentifierSignature: string;
    deadline: number;
};
export declare const decryptAndVerify: (encryptionKey: CryptoKey, verifyingKey: CryptoKey, encryptedMessage: string, signature: string) => Promise<{
    message: string;
    verified: boolean;
}>;
export declare const acknowledgeChannel: (baseURL: string, id: number, params: acknowledgeChannelParams) => Promise<Response>;
