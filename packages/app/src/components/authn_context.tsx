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
  setRemoteSharingPublicKey: (key: CryptoKey) => void;
  setRemotePublicKey: (key: CryptoKey) => void;
  deadline: number;
  setDeadline: (deadline: number) => void;
  channelState: ChannelState;
  setChannelState: (state: ChannelState) => void;
  verify: (data: Uint8Array, signature: Uint8Array) => Promise<boolean>;
  sign: (data: Uint8Array) => Promise<ArrayBuffer>;
  encrypt: (data: string) => Promise<{ iv: Uint8Array; data: Uint8Array }>;
}>({
  accountAddress: "0x0",
  remoteAccountID: "0x0",
  publicKey: null,
  sharingPublicKey: null,
  setRemoteSharingPublicKey: () => {},
  setRemotePublicKey: () => {},
  deadline: 0,
  setDeadline: () => {},
  channelState: ChannelState.initial,
  setChannelState: () => {},
  verify: async () => false,
  sign: async () => new ArrayBuffer(0),
  encrypt: async () => ({ iv: new Uint8Array(0), data: new Uint8Array(0) }),
});

export const useAuthn = () => {
  return useContext(AuthnContext);
};
