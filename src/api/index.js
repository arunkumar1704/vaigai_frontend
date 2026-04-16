import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

export const resolveMediaUrl = (value) => {
  const url = String(value || "").trim();
  if (!url) return "";
  if (/^https?:\/\//i.test(url) || url.startsWith("data:")) return url;
  return `${BACKEND_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

const api = axios.create({
  baseURL: API_BASE_URL,
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
export const getSiteSettings = () => api.get("/site-settings");
export const subscribeNewsletter = (data) => api.post("/subscriptions", data);
export const submitContact = (data) => api.post("/contact", data); //ok
export const submitBooking = (data) => api.post("/book-tour", data); // ok

// ─── Admin APIs ────────────────────────────────────────────────────────────────
export const adminLoginApi = (data) => api.post("/admin/login", data);
export const getAdminStats = () => api.get("/admin/stats");
export const getAdminSiteSettings = () => api.get("/admin/site-settings");
export const updateAdminSiteSettings = (data) => api.put("/admin/site-settings", data);
export const uploadSiteSettingsLogo = (formData) =>
  api.post("/admin/site-settings/upload-logo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getSubscriptions = (params) => api.get("/admin/subscriptions", { params });
export const markSubscriptionRead = (id) => api.patch(`/admin/subscriptions/${id}/read`);
export const getAdminPackages = (params) => api.get("/admin/packages", { params });
export const getBookings = (params) => api.get("/admin/bookings", { params });
export const updateBookingStatus = (id, data) => api.patch(`/admin/bookings/${id}/status`, data);
export const markBookingRead = (id) => api.patch(`/admin/bookings/${id}/read`);
export const markBookingsRead = (ids) => api.patch("/admin/bookings/read", { ids });
export const exportBookings = (params) =>
  api.get("/admin/bookings", { params, responseType: "blob" });
export const getMessages = () => api.get("/admin/messages");
export const markMessageRead = (id) => api.patch(`/admin/messages/${id}/read`);
export const createPackage = (data) => api.post("/admin/packages", data);
export const updatePackage = (id, data) =>
  api.put(`/admin/packages/${id}`, data);
export const deletePackage = (id) => api.delete(`/admin/packages/${id}`);
export const uploadPackageImage = (formData) =>
  api.post("/admin/packages/upload-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const CheckAdminApi = () => api.get("/admin/is-admin");

export default api;
