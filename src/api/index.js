import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Attach auth token if present
api.interceptors.request.use(config => {
  const admin = localStorage.getItem('vaigai_admin')
  if (admin) {
    const { token } = JSON.parse(admin)
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── Public APIs ───────────────────────────────────────────────────────────────
export const getDestinations = () => api.get('/destinations')
export const getPackages = () => api.get('/packages')
export const getPackageById = (id) => api.get(`/packages/${id}`)
export const submitContact = (data) => api.post('/contact', data)
export const submitBooking = (data) => api.post('/book-tour', data)

// ─── Admin APIs ────────────────────────────────────────────────────────────────
export const adminLogin = (data) => api.post('/admin/login', data)
export const getAdminStats = () => api.get('/admin/stats')
export const getBookings = () => api.get('/admin/bookings')
export const getMessages = () => api.get('/admin/messages')
export const createPackage = (data) => api.post('/admin/packages', data)
export const updatePackage = (id, data) => api.put(`/admin/packages/${id}`, data)
export const deletePackage = (id) => api.delete(`/admin/packages/${id}`)

export default api
