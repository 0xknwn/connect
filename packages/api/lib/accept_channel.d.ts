export type acceptChannelParams = {
    acceptChannelUniqueKeys: string[];
    signerPublicKey: string;
    signerEncryptionPublicKey: string;
    signerAccountAddress: string;
    encryptedChannelIdentifier: string;
    channelIdentifierSignature: string;
    deadline: number;
};
export type acceptChannelResult = {
    apiUniqueKeys?: string[];
};
export declare const acceptChannelUniqueKeys: (key1: string, key2: string, relyingParty: string, signerAccountID: string, deadline: number) => Promise<string[]>;
export declare const importEncryptionPublicKey: (rawEncryptionPublicKey: string) => Promise<CryptoKey>;
export declare const generateEncryptionKey: (encryptionPrivateKey: CryptoKey, encryptionRawPublicKey: string) => Promise<CryptoKey>;
export declare const acceptChannel: (baseURL: string, id: number, params: acceptChannelParams) => Promise<Response>;
export declare const generateChannelID: () => string;
export declare const encryptAndSign: (encryptionKey: CryptoKey, signingKey: CryptoKey, message: string) => Promise<{
    encryptedMessage: string;
    signature: string;
}>;
