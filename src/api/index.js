import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Attach auth token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// ─── Public APIs ───────────────────────────────────────────────────────────────
export const getDestinations = () => api.get("/destinations");
export const getPackages = () => api.get("/packages");
export const getPackageById = (id) => api.get(`/packages/${id}`);
export const submitContact = (data) => api.post("/contact", data); //ok
export const submitBooking = (data) => api.post("/book-tour", data); // ok

// ─── Admin APIs ────────────────────────────────────────────────────────────────
export const adminLoginApi = (data) => api.post("/admin/login", data);
export const getAdminStats = () => api.get("/admin/stats");
export const getBookings = (params) => api.get("/admin/bookings", { params });
export const exportBookings = (params) =>
  api.get("/admin/bookings", { params, responseType: "blob" });
export const getMessages = () => api.get("/admin/messages");
export const createPackage = (data) => api.post("/admin/packages", data);
export const updatePackage = (id, data) =>
  api.put(`/admin/packages/${id}`, data);
export const deletePackage = (id) => api.delete(`/admin/packages/${id}`);
export const CheckAdminApi = () => api.get("/admin/is-admin");

export default api;
