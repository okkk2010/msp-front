import { API_ERROR_MESSAGES } from "../constants/apiErrorMessages";

export function getApiErrorMessage(error) {
  const status = error?.response?.status;

  if (status && API_ERROR_MESSAGES[status]) {
    return API_ERROR_MESSAGES[status];
  }

  return API_ERROR_MESSAGES.default;
}
