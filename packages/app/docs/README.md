## Running a test

The code below show how to run a test from the browser

```javascript
const payload = {
  jsonrpc: "2.0",
  method: "smartr_submitChannelRequest",
  params: {
    relyingParty: "http://example.com",
    agentAccountAddress: "0x1234",
    AgentPublicKey:
      "0x04ebde890ab862328bf0f368a786a1472b0480702cc7e1967c0286678d76ae43ee9a6a39810eb0a7024637e00c3803ac817abdad587c1053435fd9b6233ad46749",
    agentEncryptionPublicKey:
      "0x04187971a64ce9754fe05b4f8ed93b232dbd5c9662520f6d918b03c43992ad76e8d32bf7c32f22ce525043632232a4a7696e23bc08e25660308a29ba5a0a721363",
    signerAccountID: "0x90ab",
    channelRequestUniqueKeys: [
      "0x368e4faca5e0ec6e3354a8298757c3e584cc61bc420b0745dccb0ff86dd9b493",
      "0xd75b596d07613628f0fb3190f7286b5f3c25de97235bd3c9dbcf77ef2847acf3",
    ],
  },
  id: 1,
};

const data = await fetch("/api/sepolia", 
  { method: "POST", body: JSON.stringify(payload), headers: {"Content-type": "application/json"}}
)

await data.json()
```
