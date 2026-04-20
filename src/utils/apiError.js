import { API_ERROR_MESSAGES } from "../constants/apiErrorMessages";

export function getApiErrorMessage(error) {
  const apiMessage = error?.response?.data?.message || error?.message;
  const status = error?.response?.status;

  if (apiMessage && apiMessage !== "Request failed.") {
    return apiMessage;
  }

  if (status && API_ERROR_MESSAGES[status]) {
    return API_ERROR_MESSAGES[status];
  }

  return API_ERROR_MESSAGES.default;
}
