import {
  NOT_ERC20 as NOT_ERC20_ERROR,
  UNLISTED_NETWORK as UNLISTED_NETWORK_ERROR,
  USER_REFUSED_OP as USER_REFUSED_OP_ERROR,
  INVALID_REQUEST_PAYLOAD as INVALID_REQUEST_PAYLOAD_ERROR,
  ACCOUNT_ALREADY_DEPLOYED as ACCOUNT_ALREADY_DEPLOYED_ERROR,
  UNKNOWN_ERROR as UNKNOWN_ERROR_ERROR,
} from "@starknet-io/types-js";

export const NOT_ERC20: NOT_ERC20_ERROR = {
  code: 111,
  message: "An error occurred (NOT_ERC20)",
};

export const UNLISTED_NETWORK: UNLISTED_NETWORK_ERROR = {
  code: 112,
  message: "An error occurred (UNLISTED_NETWORK)",
};

export const USER_REFUSED_OP: USER_REFUSED_OP_ERROR = {
  code: 113,
  message: "An error occurred (USER_REFUSED_OP)",
};

export const INVALID_REQUEST_PAYLOAD: INVALID_REQUEST_PAYLOAD_ERROR = {
  code: 114,
  message: "An error occurred (INVALID_REQUEST_PAYLOAD)",
};

export const ACCOUNT_ALREADY_DEPLOYED: ACCOUNT_ALREADY_DEPLOYED_ERROR = {
  code: 115,
  message: "An error occurred (ACCOUNT_ALREADY_DEPLOYED)",
};

export const UNKNOWN_ERROR: UNKNOWN_ERROR_ERROR = {
  code: 163,
  message: "An error occurred (UNKNOWN_ERROR)",
};
