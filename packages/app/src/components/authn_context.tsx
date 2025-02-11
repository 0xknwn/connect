import { useContext, createContext } from "react";

export enum ChannelState {
  initial = 0,
  requestPending,
  channelOpened,
}

export const AuthnContext = createContext<{
  accountAddress: string;
  remoteAccountID: string;
  publicKey: CryptoKey | null;
  sharingPublicKey: CryptoKey | null;
  remoteAccountAddress: string;
  setRemoteAccountAddress: (address: string) => void;
  channelID: string;
  setChannelID: (id: string) => void;
  setRemoteSharingPublicKey: (key: CryptoKey) => void;
  setRemotePublicKey: (key: CryptoKey) => void;
  setEncryptedChannelIdentifier: (identifier: string) => void;
  setChannelIdentifierSignature: (signature: string) => void;
  deadline: number;
  setDeadline: (deadline: number) => void;
  channelState: ChannelState;
  setChannelState: (state: ChannelState) => void;
  verify: (data: string, signature: string) => Promise<boolean>;
  sign: (message: string) => Promise<string>;
  encrypt: (data: string) => Promise<string>;
  decrypt: (message: string) => Promise<string>;
}>({
  accountAddress: "0x0",
  remoteAccountID: "0x0",
  publicKey: null,
  sharingPublicKey: null,
  remoteAccountAddress: "0x0",
  channelID: "",
  setRemoteAccountAddress: () => {},
  setChannelID: () => {},
  setRemoteSharingPublicKey: () => {},
  setRemotePublicKey: () => {},
  setEncryptedChannelIdentifier: () => {},
  setChannelIdentifierSignature: () => {},
  deadline: 0,
  setDeadline: () => {},
  channelState: ChannelState.initial,
  setChannelState: () => {},
  verify: async () => false,
  sign: async () => "",
  encrypt: async () => "",
  decrypt: async () => "",
});

export const useAuthn = () => {
  return useContext(AuthnContext);
};
