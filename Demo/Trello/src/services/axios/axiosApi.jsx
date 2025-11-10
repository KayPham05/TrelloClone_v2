import axios from "axios";
import { toast } from "react-toastify";

const instance = axios.create({
  baseURL: import.meta.env.VITE_URL_API,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
  withCredentials: false, // để true nếu dùng cookie JWT
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý response và lỗi toàn cục
instance.interceptors.response.use(
  (response) => {
    return response.data; // Trả trực tiếp dữ liệu, không cần response.data ở component
  },
  (error) => {
    // Nếu token hết hạn hoặc bị từ chối
    if (error.response?.status === 401 || error.response?.status === 403) {
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/"; 
    }

    console.error(" API Error:", error.response || error.message);
    throw error;
  }
);

export default instance;
