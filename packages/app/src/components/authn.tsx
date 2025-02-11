import { useState, useEffect } from "react";

import { AuthnContext } from "./authn_context";
import { hex2buf, buf2hex } from "@0xknwn/connect-api";

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
  const [encryptionKey, setEncryptionKey] = useState(null as CryptoKey | null);

  const [channelRequestPending, setChannelRequestPending] = useState(false);
  useEffect(() => {
    if (!channelRequestPending) {
      return;
    }
    const interval = setInterval(() => {
      setChannelRequestPending(false);
    }, 45000);
    return () => clearInterval(interval);
  }, [channelRequestPending]);

  const encrypt = async (data: string) => {
    if (!encryptionKey) {
      throw new Error("No encryption key");
    }
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      encryptionKey,
      new TextEncoder().encode(data)
    );
    return { iv, data: new Uint8Array(encrypted) };
  };

  const verify = async (data: Uint8Array, signature: Uint8Array) => {
    if (!remotePublicKey) {
      throw new Error("No remote public key");
    }
    return await window.crypto.subtle.verify(
      {
        name: "ECDSA",
        hash: { name: "SHA-256" },
      },
      remotePublicKey,
      signature,
      data
    );
  };

  const sign = async (data: Uint8Array) => {
    if (!privateKey) {
      throw new Error("No private key");
    }
    return await window.crypto.subtle.sign(
      {
        name: "ECDSA",
        hash: { name: "SHA-256" },
      },
      privateKey,
      data
    );
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
    setRemoteSharingPublicKey,
    setRemotePublicKey,
    channelRequestPending,
    setChannelRequestPending,
    verify,
    sign,
    encrypt,
  };

  return (
    <AuthnContext.Provider value={value}>{children}</AuthnContext.Provider>
  );
};
