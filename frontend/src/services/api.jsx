import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 15000,
});

export function asArray(value) {
  return Array.isArray(value) ? value : [];
}

export function getApiErrorMessage(error, fallback = "Something went wrong") {
  const detail = error.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail
      .map((item) => item.msg || item.message || JSON.stringify(item))
      .join(", ");
  }

  if (typeof detail === "string") {
    return detail;
  }

  if (detail && typeof detail === "object") {
    return JSON.stringify(detail);
  }

  if (typeof error.response?.data === "string") {
    return error.response.data;
  }

  return error.message || fallback;
}

export function isCanceledRequest(error) {
  return error.code === "ERR_CANCELED" || error.name === "CanceledError";
}

export default api;
