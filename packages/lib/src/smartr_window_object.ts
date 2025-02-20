import { WALLET_API } from "@starknet-io/types-js";
import { handleMessage } from "./methods";

declare global {
  interface Window {
    starknet_smartr: WALLET_API.StarknetWindowObject;
  }
}

export class SmartrWindowObject implements WALLET_API.StarknetWindowObject {
  readonly id: string = "smartR";
  readonly version: string = "0.0.1";
  readonly icon: string =
    "data:image/svg+xml;base64,PHN2ZyBpZD0iZW1vamkiIHZpZXdCb3g9IjAgMCA3MiA3MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBpZD0iY29sb3IiPgogICAgPHBhdGggZmlsbD0iIzNGM0YzRiIgZD0iTTM5LjQsNTEuOWMwLjgsMy42LDUuNCw5LjUsNy4zLDEwLjNIMzZIMjUuM2MxLjktMC44LDYuNi02LjgsNy4zLTEwLjNMMzYsNDhMMzkuNCw1MS45eiIvPgogICAgPHBhdGggZmlsbD0iIzNGM0YzRiIgZD0iTTEyLjMsNDJjMCw3LDUuNiwxMi42LDEyLjYsMTIuNmM0LjgsMCw5LTIuNywxMS4xLTYuNmMyLjEsMy45LDYuMyw2LjYsMTEuMSw2LjZjNywwLDEyLjYtNS42LDEyLjYtMTIuNiBjMC0zLTEtNS43LTIuOC03LjlsMCwwTDM2LDguMWwtMjAuOSwyNmwwLDBDMTMuMywzNi4yLDEyLjMsMzksMTIuMyw0MnoiLz4KICA8L2c+CiAgPGcgaWQ9ImxpbmUiPgogICAgPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTM5LjQsNTIuMSBjMC44LDMuNiw1LjQsOS4zLDcuMywxMC4xSDM2SDI1LjNjMS45LTAuOCw2LjYtNi42LDcuMy0xMC4xIi8+CiAgICA8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNMTIuMyw0MiBjMCw3LDUuNiwxMi42LDEyLjYsMTIuNmM0LjgsMCw5LTIuNywxMS4xLTYuNmMyLjEsMy45LDYuMyw2LjYsMTEuMSw2LjZjNywwLDEyLjYtNS42LDEyLjYtMTIuNmMwLTMtMS01LjctMi44LTcuOWwwLDBMMzYsOC4xIGwtMjAuOSwyNmwwLDBDMTMuMywzNi4yLDEyLjMsMzksMTIuMyw0MnoiLz4KICA8L2c+Cjwvc3ZnPgo=";
  readonly name: string = "smartR";
  request: (request: any) => Promise<any>;
  // on = (event: string, callback: (data: any) => void) => {};
  // off = (event: string, callback: (data: any) => void) => {};
  on = () => {};
  off = () => {};
  constructor() {
    this.request = handleMessage;
  }
}

export const injectSmartr = () => {
  window.starknet_smartr = new SmartrWindowObject();
};
