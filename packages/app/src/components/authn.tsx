import { useState, useEffect } from "react";

import { AuthnContext } from "./authn_context";
import {
  hex2buf,
  buf2hex,
  encrypt as apiEncrypt,
  decrypt as apiDecrypt,
  sign as apiSign,
  verify as apiVerify,
} from "@0xknwn/connect-api";
import { ChannelState } from "./authn_context";
type AuthProviderProps = {
  children: React.ReactNode;
};

const store = {
  privateKey: "app_privateKey",
  sharingPrivateKey: "app_sharingPrivateKey",
  publicKey: "app_publicKey",
  sharingPublicKey: "app_sharingPublicKey",
  remotePublicKey: "app_remotePublicKey",
  remoteSharingPublicKey: "app_remoteSharingPublicKey",
  encryptionKey: "app_encryptionKey",
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const accountAddress = "0x1234567890abcdef1234567890abcdef12345678";
  const remoteAccountID = "0xabcdef1234567890abcdef1234567890abcdef12";
  const [privateKey, setPrivateKey] = useState(null as CryptoKey | null);
  const [publicKey, setPublicKey] = useState(null as CryptoKey | null);
  const [deadline, setDeadline] = useState(0);
  const [sharingPrivateKey, setSharingPrivateKey] = useState(
    null as CryptoKey | null
  );
  const [sharingPublicKey, setSharingPublicKey] = useState(
    null as CryptoKey | null
  );
  const [remotePublicKey, setRemotePublicKey] = useState(
    null as CryptoKey | null
  );
  const [remoteSharingPublicKey, setRemoteSharingPublicKey] = useState(
    null as CryptoKey | null
  );

  const [remoteAccountAddress, setRemoteAccountAddress] = useState(
    "0x0" as string
  );

  const [encryptedChannelIdentifier, setEncryptedChannelIdentifier] = useState(
    "" as string
  );

  const [_, setChannelIdentifierSignature] = useState("" as string);

  const [channelID, setChannelID] = useState("" as string);

  const [encryptionKey, setEncryptionKey] = useState(null as CryptoKey | null);

  const [channelState, setChannelState] = useState(ChannelState.initial);

  useEffect(() => {
    const init = async () => {
      if (
        !encryptedChannelIdentifier ||
        encryptedChannelIdentifier === "" ||
        !encryptionKey
      ) {
        return;
      }
      try {
        const c = await apiDecrypt(encryptionKey, encryptedChannelIdentifier);
        setChannelID(c);
      } catch (e) {
        console.error(e);
      }
    };
    init();
  }, [encryptedChannelIdentifier, encryptionKey]);

  useEffect(() => {
    if (channelID) {
      console.log("channelID:", channelID);
      setChannelState(ChannelState.channelOpened);
    }
  }, [channelID]);

  // if the channel is transition to the request pending state, set a timer
  // to reset the state back to the initial state if the channel is still in
  // the request pending state after 45 seconds
  useEffect(() => {
    if (!ChannelState.requestPending) {
      return;
    }
    const interval = setInterval(() => {
      if (channelState === ChannelState.requestPending) {
        setChannelState(ChannelState.initial);
      }
    }, 45000);
    return () => clearInterval(interval);
  }, [channelState]);

  const encrypt = async (message: string) => {
    if (!encryptionKey) {
      throw new Error("No encryption key");
    }
    return apiEncrypt(encryptionKey, message);
  };

  const decrypt = async (encryptedMessage: string) => {
    if (!encryptionKey) {
      throw new Error("No encryption key");
    }
    return apiDecrypt(encryptionKey, encryptedMessage);
  };

  const verify = async (message: string, hexSignature: string) => {
    if (!remotePublicKey) {
      throw new Error("No remote public key");
    }
    return apiVerify(remotePublicKey, message, hexSignature);
  };

  const sign = async (message: string) => {
    if (!privateKey) {
      throw new Error("No private key");
    }
    return apiSign(privateKey, message);
  };

  useEffect(() => {
    const init = async () => {
      const priv = localStorage.getItem(store.privateKey);
      const pub = localStorage.getItem(store.publicKey);
      if (priv && pub) {
        const privkey = await window.crypto.subtle.importKey(
          "pkcs8",
          hex2buf(priv),
          {
            name: "ECDSA",
            namedCurve: "P-256",
          },
          true,
          ["sign"]
        );
        const pubkey = await window.crypto.subtle.importKey(
          "raw",
          hex2buf(pub),
          {
            name: "ECDSA",
            namedCurve: "P-256",
          },
          true,
          ["verify"]
        );
        setPrivateKey(privkey);
        setPublicKey(pubkey);
        return;
      }
      const key = await window.crypto.subtle.generateKey(
        {
          name: "ECDSA",
          namedCurve: "P-256",
        },
        true,
        ["sign", "verify"]
      );
      setPrivateKey(key.privateKey);
      setPublicKey(key.publicKey);
    };
    init();
  }, []);

  useEffect(() => {
    const init = async () => {
      const priv = localStorage.getItem(store.sharingPrivateKey);
      const pub = localStorage.getItem(store.sharingPublicKey);
      if (priv && pub) {
        const privkey = await window.crypto.subtle.importKey(
          "pkcs8",
          hex2buf(priv),
          {
            name: "ECDH",
            namedCurve: "P-256",
          },
          true,
          ["deriveKey", "deriveBits"]
        );
        const pubkey = await window.crypto.subtle.importKey(
          "raw",
          hex2buf(pub),
          {
            name: "ECDH",
            namedCurve: "P-256",
          },
          true,
          []
        );
        setSharingPrivateKey(privkey);
        setSharingPublicKey(pubkey);
        return;
      }
      const key = await window.crypto.subtle.generateKey(
        {
          name: "ECDH",
          namedCurve: "P-256",
        },
        true,
        ["deriveKey", "deriveBits"]
      );
      setSharingPrivateKey(key.privateKey);
      setSharingPublicKey(key.publicKey);
    };
    init();
  }, []);

  useEffect(() => {
    const init = async () => {
      const p = localStorage.getItem(store.remoteSharingPublicKey);
      if (p) {
        const key = await window.crypto.subtle.importKey(
          "raw",
          hex2buf(p),
          {
            name: "ECDH",
            namedCurve: "P-256",
          },
          true,
          []
        );
        setRemoteSharingPublicKey(key);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const init = async () => {
      const p = localStorage.getItem(store.remotePublicKey);
      if (p) {
        const key = await window.crypto.subtle.importKey(
          "raw",
          hex2buf(p),
          {
            name: "ECDSA",
            namedCurve: "P-256",
          },
          true,
          ["verify"]
        );
        setRemotePublicKey(key);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const init = async () => {
      if (!sharingPrivateKey || !remoteSharingPublicKey) {
        return;
      }
      const eckey = await window.crypto.subtle.deriveKey(
        {
          name: "ECDH",
          public: remoteSharingPublicKey,
        },
        sharingPrivateKey,
        {
          name: "AES-GCM",
          length: 256,
        },
        true,
        ["encrypt", "decrypt"]
      );
      setEncryptionKey(eckey);
    };
    init();
  }, [remoteSharingPublicKey, sharingPrivateKey]);

  useEffect(() => {
    const init = async () => {
      if (!privateKey) {
        localStorage.removeItem(store.privateKey);
        return;
      }
      try {
        const privkey = buf2hex(
          await window.crypto.subtle.exportKey("pkcs8", privateKey)
        );
        localStorage.setItem(store.privateKey, privkey);
      } catch (e) {
        console.error(e);
      }
    };
    init();
  }, [privateKey]);

  useEffect(() => {
    const init = async () => {
      if (!publicKey) {
        localStorage.removeItem(store.publicKey);
        return;
      }
      localStorage.setItem(
        store.publicKey,
        buf2hex(await window.crypto.subtle.exportKey("raw", publicKey))
      );
    };
    init();
  }, [publicKey]);

  useEffect(() => {
    const init = async () => {
      if (!sharingPrivateKey) {
        localStorage.removeItem(store.sharingPrivateKey);
        return;
      }
      localStorage.setItem(
        store.sharingPrivateKey,
        buf2hex(
          await window.crypto.subtle.exportKey("pkcs8", sharingPrivateKey)
        )
      );
    };
    init();
  }, [sharingPrivateKey]);

  useEffect(() => {
    const init = async () => {
      if (!sharingPublicKey) {
        localStorage.removeItem(store.sharingPublicKey);
        return;
      }
      localStorage.setItem(
        store.sharingPublicKey,
        buf2hex(await window.crypto.subtle.exportKey("raw", sharingPublicKey))
      );
    };
    init();
  }, [sharingPublicKey]);

  useEffect(() => {
    const init = async () => {
      if (!remotePublicKey) {
        localStorage.removeItem(store.remotePublicKey);
        return;
      }
      localStorage.setItem(
        store.remoteSharingPublicKey,
        buf2hex(await window.crypto.subtle.exportKey("raw", remotePublicKey))
      );
    };
    init();
  }, [remotePublicKey]);

  useEffect(() => {
    const init = async () => {
      if (!remoteSharingPublicKey) {
        localStorage.removeItem(store.remoteSharingPublicKey);
        return;
      }
      localStorage.setItem(
        store.remoteSharingPublicKey,
        buf2hex(
          await window.crypto.subtle.exportKey("raw", remoteSharingPublicKey)
        )
      );
    };
    init();
  }, [remoteSharingPublicKey]);

  const value = {
    accountAddress,
    remoteAccountID,
    publicKey,
    sharingPublicKey,
    remoteAccountAddress,
    setRemoteAccountAddress,
    channelID,
    setChannelID,
    setRemoteSharingPublicKey,
    setRemotePublicKey,
    setEncryptedChannelIdentifier,
    setChannelIdentifierSignature,
    deadline,
    setDeadline,
    channelState,
    setChannelState,
    verify,
    sign,
    encrypt,
    decrypt,
  };

  return (
    <AuthnContext.Provider value={value}>{children}</AuthnContext.Provider>
  );
};
