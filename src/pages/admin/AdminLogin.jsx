import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { adminLogin } from '../../api'

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await adminLogin(form)
      login(data)
      navigate('/admin')
    } catch {
      // Demo fallback — allow admin@vaigai.com / admin123
      if (form.email === 'admin@vaigai.com' && form.password === 'admin123') {
        login({ email: form.email, token: 'demo-token', name: 'Admin' })
        navigate('/admin')
      } else {
        toast.error('Invalid credentials. Try admin@vaigai.com / admin123')
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen teal-gradient flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 gold-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="font-display font-black text-teal text-2xl">V</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-teal">Admin Portal</h1>
          <p className="text-gray-400 font-body text-sm mt-1">Vaigai Tourism Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
            <input
              type="email" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="admin@vaigai.com" required
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 font-body focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••" required
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 font-body focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all pr-12"
              />
              <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showPw ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full btn-primary justify-center py-4 text-base mt-2 disabled:opacity-60"
          >
            <FaLock size={14} />
            {loading ? 'Signing in...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-xs mt-6">
          Demo: admin@vaigai.com / admin123
        </p>
      </motion.div>
    </div>
  )
}
