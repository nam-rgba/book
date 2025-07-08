import axios from "axios";

const api = axios.create({
    baseURL: "https://shop.staging.bmdapp.store:3249/v1/customer",
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token"); // hoặc document.cookie
    if (token) {
      config.headers["token"] = token; // Thêm token vào header
    }
    config.headers["namespace"] = "hoangphuc"; // Thêm namespace vào headerx
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;