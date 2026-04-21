import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCheck, FaArrowLeft, FaShieldAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { getPackageById, resolveMediaUrl, submitBooking } from '../api'

const validators = {
  name: (v) => v.trim().length >= 2 || 'Full name must be at least 2 characters',
  phone: (v) => /^[6-9]\d{9}$/.test(v.trim()) || 'Enter a valid 10-digit Indian mobile number',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email address',
  travelDate: (v) => {
    if (!v) return 'Please select a travel date'
    return new Date(v) > new Date() || 'Travel date must be in the future'
  },
}

export default function BookingPage() {
  const { packageId } = useParams()
  const navigate = useNavigate()

  const [pkg, setPkg] = useState(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [pageError, setPageError] = useState('')

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    travelDate: '',
    people: 1,
    specialRequests: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [bookingId, setBookingId] = useState(null)

  useEffect(() => {
    let active = true
    const loadPackage = async () => {
      setPageLoading(true)
      setPageError('')
      try {
        const { data } = await getPackageById(packageId)
        if (!active) return
        setPkg(data || null)
      } catch (err) {
        if (!active) return
        setPageError(err?.response?.data?.message || 'Package not found')
      } finally {
        if (active) setPageLoading(false)
      }
    }

    loadPackage()
    return () => {
      active = false
    }
  }, [packageId])

  const validateField = (name, value) => {
    if (!validators[name]) return ''
    const result = validators[name](value)
    return result === true ? '' : result
  }

  const validateAll = () => {
    const next = {}
    Object.keys(validators).forEach((field) => {
      const err = validateField(field, form[field])
      if (err) next[field] = err
    })
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    const err = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: err }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!pkg) return

    if (!validateAll()) {
      toast.error('Please fix the errors below.')
      return
    }

    const total = Number(pkg.price || 0) * Number(form.people || 1)
    setLoading(true)

    try {
      const res = await submitBooking({
        ...form,
        packageId: pkg._id || packageId,
        packageName: pkg.name,
        totalAmount: total,
      })
      setBookingId(res?.data?.bookingId || `VT-${Date.now()}`)
      setSuccess(true)
      toast.success('Booking confirmed! Check your email for details.')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return <div className="pt-32 text-center px-4 text-gray-500">Loading package details...</div>
  }

  if (pageError || !pkg) {
    return (
      <div className="pt-32 text-center px-4">
        <h2 className="font-display text-3xl text-teal mb-3">Package not found</h2>
        <p className="text-gray-400 mb-6">{pageError || "The package you're looking for doesn't exist."}</p>
        <button onClick={() => navigate('/packages')} className="btn-primary">
          View All Packages
        </button>
      </div>
    )
  }

  const total = Number(pkg.price || 0) * Number(form.people || 1)
  const savings = Math.max((Number(pkg.originalPrice || pkg.price || 0) - Number(pkg.price || 0)) * Number(form.people || 1), 0)

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center px-4"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheck size={40} className="text-green-500" />
          </div>

          <h2 className="font-display text-4xl font-bold text-teal mb-3">Booking Confirmed!</h2>
          <p className="text-gray-500 font-body mb-2">
            Your booking for <strong className="text-teal">{pkg.name}</strong> has been received.
          </p>
          <p className="text-gray-400 text-sm mb-6">
            A confirmation email has been sent to <strong>{form.email}</strong>.
          </p>

          <div className="bg-gold/10 rounded-2xl p-6 mb-8">
            <p className="text-teal/50 text-xs mb-1 uppercase tracking-wider">Booking ID</p>
            <p className="font-display text-lg font-bold text-teal mb-3">{bookingId}</p>
            <p className="text-teal/50 text-xs mb-1 uppercase tracking-wider">Total Amount</p>
            <p className="font-display text-3xl font-bold text-teal">INR {total.toLocaleString('en-IN')}</p>
          </div>

          <button onClick={() => navigate('/packages')} className="btn-primary justify-center w-full">
            Browse More Packages
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-20 min-h-screen bg-gray-50"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-teal font-body font-medium mb-6 hover:text-gold transition-colors"
        >
          <FaArrowLeft size={14} /> Back to packages
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h1 className="font-display text-2xl font-bold text-teal mb-1">Complete Your Booking</h1>
              <p className="text-gray-400 text-sm font-body mb-7">Fill in your details and we will confirm everything.</p>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name" name="name" type="text" value={form.name} error={errors.name} onChange={handleChange} onBlur={handleBlur} />
                  <Field label="Phone Number" name="phone" type="tel" value={form.phone} error={errors.phone} onChange={handleChange} onBlur={handleBlur} />
                </div>

                <Field label="Email Address" name="email" type="email" value={form.email} error={errors.email} onChange={handleChange} onBlur={handleBlur} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Travel Date"
                    name="travelDate"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={form.travelDate}
                    error={errors.travelDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Number of People</label>
                    <select
                      name="people"
                      value={form.people}
                      onChange={(e) => setForm((p) => ({ ...p, people: Number(e.target.value) }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 font-body focus:outline-none focus:border-gold"
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Special Requests</label>
                  <textarea
                    name="specialRequests"
                    value={form.specialRequests}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 font-body focus:outline-none focus:border-gold resize-none"
                  />
                </div>

                <div className="flex items-center justify-between bg-gold/8 border border-gold/30 rounded-2xl px-5 py-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">{form.people} x INR {Number(pkg.price || 0).toLocaleString('en-IN')}</p>
                    <p className="font-display text-2xl font-bold text-teal">INR {total.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-green-500 font-semibold">You save INR {savings.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-400">vs original price</p>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-4 text-base disabled:opacity-60">
                  {loading ? 'Confirming...' : `Confirm Booking - INR ${total.toLocaleString('en-IN')}`}
                </button>

                <p className="flex items-center justify-center gap-2 text-center text-gray-400 text-xs">
                  <FaShieldAlt className="text-green-400" size={12} />
                  Secure booking and instant confirmation email.
                </p>
              </form>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden sticky top-24">
              <img src={resolveMediaUrl(pkg.image)} alt={pkg.name} className="w-full h-44 object-cover" />
              <div className="p-6">
                <h3 className="font-display text-lg font-bold text-teal mb-1">{pkg.name}</h3>
                <p className="text-gray-400 text-xs mb-3">{pkg.subtitle}</p>
                <p className="text-sm text-gray-600 mb-2">{pkg.duration}</p>
                <p className="text-sm text-gray-600 mb-4">Destination: {pkg.destination}</p>
                <div className="space-y-1.5 mb-5">
                  {(Array.isArray(pkg.highlights) ? pkg.highlights : []).map((h) => (
                    <div key={h} className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCheck size={9} className="text-gold flex-shrink-0" />{h}
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-teal">Total</span>
                    <span className="font-display text-2xl font-bold text-teal">INR {total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function Field({ label, name, type, value, error, onChange, onBlur, min }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        min={min}
        required
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-4 py-3 rounded-xl border font-body transition-all outline-none ${
          error ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-gold'
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
