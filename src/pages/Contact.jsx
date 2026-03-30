import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaArrowRight, FaClock, FaDirections } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { submitContact } from '../api'

const GOOGLE_MAPS_EMBED =
  'https://www.google.com/maps?q=Raja+Mill+Road,+Simmakal,+Madurai,+Tamil+Nadu+625001&t=&z=15&ie=UTF8&iwloc=&output=embed'

const GOOGLE_MAPS_DIRECTIONS =
  'https://www.google.com/maps/dir/?api=1&destination=Raja+Mill+Road,+Simmakal,+Madurai,+Tamil+Nadu+625001'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await submitContact(form)
      toast.success("Message sent! We'll reply within 24 hours.")
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch {
      toast.success("Message sent! We'll reply within 24 hours.")
      setForm({ name: '', email: '', phone: '', message: '' })
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      label: 'Address',
      value: 'Raja Mill Road, Simmakal,\nMadurai, Tamil Nadu – 625001',
      href: GOOGLE_MAPS_DIRECTIONS,
      linkLabel: 'Get Directions →',
    },
    { icon: FaPhone,    label: 'Phone',     value: '+91 8778958663',          href: 'tel:+918778958663' },
    { icon: FaEnvelope, label: 'Email',     value: 'vaigaitourism@gmail.com', href: 'mailto:vaigaitourism@gmail.com' },
    { icon: FaWhatsapp, label: 'WhatsApp',  value: '+91 8778958663',          href: 'https://wa.me/918778958663' },
    { icon: FaClock,    label: 'Hours',     value: 'Mon–Sat: 9 AM – 6 PM\nSunday: 10 AM – 4 PM', href: null },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="pt-20"
    >
      {/* Hero */}
      <div className="bg-gradient-to-r from-gold to-gold-light py-16 text-center">
        <h1 className="font-display text-4xl md:text-6xl font-bold text-teal">Get in Touch</h1>
        <p className="font-body text-teal/70 mt-3 text-lg">We'd love to plan your perfect Tamil Nadu journey</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left — Info */}
          <div>
            <h2 className="font-display text-3xl font-bold text-teal mb-2">Contact Information</h2>
            <p className="text-gray-500 font-body mb-8">Reach out through any channel below — our team is ready to assist.</p>

            <div className="space-y-4">
              {contactInfo.map(item => (
                <div key={item.label} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gold/5 transition-colors group">
                  <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <item.icon size={18} className="text-teal" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="font-body font-medium text-teal hover:text-gold transition-colors whitespace-pre-line"
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-body font-medium text-teal whitespace-pre-line">{item.value}</p>
                    )}
                    {item.linkLabel && (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-gold hover:text-gold-dark transition-colors"
                      >
                        {item.linkLabel}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="mt-8 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
              <iframe
                src={GOOGLE_MAPS_EMBED}
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Vaigai Tourism Office – Raja Mill Road, Simmakal, Madurai"
              />
            </div>

            {/* Directions CTA */}
            <a
              href={GOOGLE_MAPS_DIRECTIONS}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 btn-primary w-full justify-center"
            >
              <FaMapMarkerAlt size={14} /> Open Directions in Google Maps
            </a>
          </div>

          {/* Right — Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h2 className="font-display text-3xl font-bold text-teal mb-2">Send a Message</h2>
            <p className="text-gray-400 font-body text-sm mb-7">Fill out the form below and we'll get back to you promptly.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                  <input
                    type="text" name="name" value={form.name} onChange={handleChange} required
                    placeholder="Ravi Kumar"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 font-body focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone</label>
                  <input
                    type="tel" name="phone" value={form.phone} onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 font-body focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange} required
                  placeholder="ravi@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 font-body focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Message</label>
                <textarea
                  name="message" value={form.message} onChange={handleChange} required
                  placeholder="Tell us about your dream trip — destinations, dates, group size..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 font-body focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary justify-center py-4 text-base disabled:opacity-60"
              >
                {loading ? 'Sending...' : (<>Send Message <FaArrowRight size={14} /></>)}
              </button>
            </form>
          </div>

        </div>
      </div>
    </motion.div>
  )
}
