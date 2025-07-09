import axios from "axios";

const api = axios.create({
    baseURL: "https://shop.staging.bmdapp.store:3249/v1/customer",
})

import useCookie from "../hooks/useCookie";

api.interceptors.request.use(
  (config) => {
    const token = useCookie("access_token").getCookie(); // Lấy token từ cookie
    if (token) {
      config.headers["token"] = token; // Thêm token vào header
    }
    config.headers["namespace"] = "hoangphuc"; // Thêm namespace vào headerx
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;