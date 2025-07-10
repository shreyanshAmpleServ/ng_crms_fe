// src/utils/axiosConfig.js
import axios from "axios";

// Configure Axios
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "233", // Set your API base URL
  withCredentials: true,
});

// 🔐 Add a request interceptor to attach the token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Or sessionStorage, or a context
    const dbName = localStorage.getItem("DBName"); // Or sessionStorage, or a context
    // const decodedDbName = dbName ? atob(dbName) : null;

      // const BLApiUrl = localStorage.getItem("BLApiUrl");
      // const decodedBLApiUrl = BLApiUrl ? atob(BLApiUrl) : null;


      const domain = localStorage.getItem("domain")
      const decodedDomain = domain ? atob(domain) : null;
      const parseDomain = JSON.parse(decodedDomain)?.[0]?.SubDomain
      const parseBLApiUrl = JSON.parse(decodedDomain)?.[0]?.BLApiUrl

      config.headers.BLApiUrl = parseBLApiUrl;
      config.headers.domain = parseDomain || "mowara";
      config.headers.dbName = dbName;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle unauthorized errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      window.location.pathname !== "/crms/login"
    ) {
      // localStorage.removeItem("crmspermissions");
      // window.location.href = "https://mowara.dcclogsuite.com/";

    }
    return Promise.reject(error);
  }
);

export default apiClient;
