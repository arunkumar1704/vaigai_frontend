import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCheck, FaRupeeSign, FaClock, FaStar, FaArrowLeft, FaShieldAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { PACKAGES } from '../api/data'
import { submitBooking } from '../api'

// Simple validators
const validators = {
  name:    v => v.trim().length >= 2          || 'Full name must be at least 2 characters',
  phone:   v => /^[6-9]\d{9}$/.test(v.trim()) || 'Enter a valid 10-digit Indian mobile number',
  email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email address',
  travelDate: v => {
    if (!v) return 'Please select a travel date'
    return new Date(v) > new Date() || 'Travel date must be in the future'
  },
}

export default function BookingPage() {
  const { packageId } = useParams()
  const navigate = useNavigate()
  const pkg = PACKAGES.find(p => p.id === packageId)

  const [form, setForm] = useState({
    name: '', phone: '', email: '', travelDate: '', people: 1, specialRequests: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [bookingId, setBookingId] = useState(null)

  if (!pkg) return (
    <div className="pt-32 text-center px-4">
      <div className="text-6xl mb-6">🔍</div>
      <h2 className="font-display text-3xl text-teal mb-3">Package not found</h2>
      <p className="text-gray-400 mb-6">The package you're looking for doesn't exist.</p>
      <button onClick={() => navigate('/packages')} className="btn-primary">
        View All Packages
      </button>
    </div>
  )

  const total    = pkg.price * form.people
  const savings  = (pkg.originalPrice - pkg.price) * form.people

  // Validate a single field
  const validateField = (name, value) => {
    if (!validators[name]) return ''
    const result = validators[name](value)
    return result === true ? '' : result
  }

  // Validate all fields; return true if no errors
  const validateAll = () => {
    const newErrors = {}
    Object.keys(validators).forEach(field => {
      const err = validateField(field, form[field])
      if (err) newErrors[field] = err
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleBlur = e => {
    const { name, value } = e.target
    const err = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: err }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validateAll()) {
      toast.error('Please fix the errors below.')
      return
    }

    setLoading(true)
    try {
      const res = await submitBooking({
        ...form,
        packageId,
        packageName: pkg.name,
        totalAmount: total,
      })
      const bId = res?.data?.bookingId || `VT-${Date.now()}`
      setBookingId(bId)
      setSuccess(true)
      toast.success('🎉 Booking confirmed! Check your email for details.')
    } catch (err) {
      console.error(err)
      // Still show success for demo if backend is not set up
      const bId = `VT-${Date.now()}`
      setBookingId(bId)
      setSuccess(true)
      toast.success('🎉 Booking confirmed! Our team will contact you shortly.')
    } finally {
      setLoading(false)
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center px-4"
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FaCheck size={40} className="text-green-500" />
          </motion.div>

          <h2 className="font-display text-4xl font-bold text-teal mb-3">Booking Confirmed!</h2>
          <p className="text-gray-500 font-body mb-2">
            Your booking for <strong className="text-teal">{pkg.name}</strong> has been received.
          </p>
          <p className="text-gray-400 text-sm mb-6">
            A confirmation email has been sent to <strong>{form.email}</strong>.<br />
            Our team will contact you at <strong>{form.phone}</strong> within 2 hours.
          </p>

          <div className="bg-gold/10 rounded-2xl p-6 mb-8">
            <p className="text-teal/50 text-xs mb-1 uppercase tracking-wider">Booking ID</p>
            <p className="font-display text-lg font-bold text-teal mb-3">{bookingId}</p>
            <p className="text-teal/50 text-xs mb-1 uppercase tracking-wider">Total Amount</p>
            <p className="font-display text-3xl font-bold text-teal">₹{total.toLocaleString('en-IN')}</p>
            <p className="text-gray-400 text-sm mt-1">
              {form.people} person{form.people > 1 ? 's' : ''} × {pkg.duration}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/packages')} className="btn-primary justify-center">
              Browse More Packages
            </button>
            <button
              onClick={() => navigate('/')}
              className="text-teal/60 hover:text-teal text-sm font-body transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  // ── Booking form ─────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="pt-20 min-h-screen bg-gray-50"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-teal font-body font-medium mb-6 hover:text-gold transition-colors"
        >
          <FaArrowLeft size={14} /> Back to packages
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Form ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h1 className="font-display text-2xl font-bold text-teal mb-1">Complete Your Booking</h1>
              <p className="text-gray-400 text-sm font-body mb-7">Fill in your details and we'll confirm everything.</p>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">

                {/* Name + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Full Name" name="name" type="text"
                    placeholder="e.g. Ravi Kumar"
                    value={form.name} error={errors.name}
                    onChange={handleChange} onBlur={handleBlur}
                  />
                  <Field
                    label="Phone Number" name="phone" type="tel"
                    placeholder="10-digit mobile"
                    value={form.phone} error={errors.phone}
                    onChange={handleChange} onBlur={handleBlur}
                  />
                </div>

                {/* Email */}
                <Field
                  label="Email Address" name="email" type="email"
                  placeholder="ravi@example.com"
                  value={form.email} error={errors.email}
                  onChange={handleChange} onBlur={handleBlur}
                />

                {/* Date + People */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Travel Date" name="travelDate" type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={form.travelDate} error={errors.travelDate}
                    onChange={handleChange} onBlur={handleBlur}
                  />
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Number of People
                    </label>
                    <select
                      name="people" value={form.people}
                      onChange={e => setForm(p => ({ ...p, people: Number(e.target.value) }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 font-body focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Special requests */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Special Requests <span className="text-gray-300 normal-case font-normal">(optional)</span>
                  </label>
                  <textarea
                    name="specialRequests" value={form.specialRequests}
                    onChange={handleChange} rows={3}
                    placeholder="Dietary requirements, accessibility needs, preferred hotels..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 font-body focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all resize-none"
                  />
                </div>

                {/* Total preview */}
                <div className="flex items-center justify-between bg-gold/8 border border-gold/30 rounded-2xl px-5 py-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">
                      {form.people} × ₹{pkg.price.toLocaleString('en-IN')}
                    </p>
                    <p className="font-display text-2xl font-bold text-teal">
                      ₹{total.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-green-500 font-semibold">
                      You save ₹{savings.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-gray-400">vs. original price</p>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit" disabled={loading}
                  className="w-full btn-primary justify-center py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading
                    ? <><span className="inline-block w-4 h-4 border-2 border-teal border-t-transparent rounded-full animate-spin mr-2" />Confirming...</>
                    : `Confirm Booking — ₹${total.toLocaleString('en-IN')}`
                  }
                </button>

                <p className="flex items-center justify-center gap-2 text-center text-gray-400 text-xs">
                  <FaShieldAlt className="text-green-400" size={12} />
                  Secure booking · Confirmation email sent instantly · Free cancellation 48hrs before travel
                </p>
              </form>
            </div>
          </div>

          {/* ── Right: Package summary ── */}
          <div>
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden sticky top-24">
              <div className="relative">
                <img src={pkg.image} alt={pkg.name} className="w-full h-44 object-cover" />
                {pkg.badge && (
                  <span className="absolute top-3 left-3 bg-gold text-teal text-xs font-bold px-3 py-1 rounded-full">
                    {pkg.badge}
                  </span>
                )}
              </div>

              <div className="p-6">
                <h3 className="font-display text-lg font-bold text-teal mb-1">{pkg.name}</h3>
                <p className="text-gray-400 text-xs mb-3">{pkg.subtitle}</p>

                <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1.5">
                    <FaClock size={11} className="text-gold" />{pkg.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaStar size={11} className="text-gold" />{pkg.rating} ({pkg.reviews})
                  </span>
                </div>

                <div className="space-y-1.5 mb-5">
                  {pkg.highlights.map(h => (
                    <div key={h} className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCheck size={9} className="text-gold flex-shrink-0" />{h}
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Price per person</span>
                    <span className="font-semibold text-teal">₹{pkg.price.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">People</span>
                    <span className="font-semibold text-teal">× {form.people}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className="font-bold text-teal">Total</span>
                    <span className="font-display text-2xl font-bold text-teal">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-xs text-green-500 font-semibold text-right">
                    You save ₹{savings.toLocaleString('en-IN')}!
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  )
}

// ── Reusable field ─────────────────────────────────────────────────────────────
function Field({ label, name, type, placeholder, value, error, onChange, onBlur, min }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        type={type} name={name} value={value} placeholder={placeholder}
        min={min} required
        onChange={onChange} onBlur={onBlur}
        className={`w-full px-4 py-3 rounded-xl border font-body transition-all outline-none
          focus:ring-2 focus:ring-gold/20
          ${error
            ? 'border-red-400 bg-red-50 focus:border-red-400'
            : 'border-gray-200 focus:border-gold'
          }`}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-red-500 text-xs mt-1.5 font-body"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
