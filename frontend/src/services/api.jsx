import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,

  (error) => {

    if (
      error.response?.status === 429 ||
      error.response?.data?.error === "RATE_LIMIT_EXCEEDED"
    ) {
      toast.error(
        error.response?.data?.message ||
        "Too many requests. Please try again later."
      );
    }

    return Promise.reject(error);
  }
);

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