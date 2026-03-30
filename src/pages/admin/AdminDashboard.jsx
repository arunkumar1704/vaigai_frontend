import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaBox, FaBookmark, FaEnvelope, FaSignOutAlt, FaPlus, FaEdit,
  FaTrash, FaEye, FaTimes, FaCheck, FaStar, FaClock, FaRupeeSign
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { PACKAGES } from '../../api/data'
import toast from 'react-hot-toast'

const SAMPLE_BOOKINGS = [
  { id: 'BK001', name: 'Priya Sharma', tour: 'Madurai Temple Tour', date: '2025-03-15', people: 2, total: 9998, status: 'Confirmed' },
  { id: 'BK002', name: 'Rahul Verma', tour: 'Ooty Hill Station Package', date: '2025-04-01', people: 4, total: 31996, status: 'Pending' },
  { id: 'BK003', name: 'Meena K', tour: 'Rameswaram Spiritual Tour', date: '2025-03-20', people: 3, total: 22497, status: 'Confirmed' },
  { id: 'BK004', name: 'Suresh Nair', tour: 'Kanyakumari Sunset Tour', date: '2025-04-10', people: 2, total: 10998, status: 'Cancelled' },
  { id: 'BK005', name: 'Divya Menon', tour: 'Alleppey Houseboat Cruise', date: '2025-04-20', people: 2, total: 18998, status: 'Confirmed' },
  { id: 'BK006', name: 'Arun Pillai', tour: 'Kerala Grand Tour', date: '2025-05-01', people: 3, total: 89997, status: 'Pending' },
]

const SAMPLE_MESSAGES = [
  { id: 'M001', name: 'Anjali Singh', email: 'anjali@example.com', message: 'Looking for a honeymoon package to Munnar and Alleppey...', date: '2025-01-10', read: false },
  { id: 'M002', name: 'David Thomas', email: 'david@example.com', message: 'What is the availability for Rameswaram in April?', date: '2025-01-09', read: true },
  { id: 'M003', name: 'Kavitha R', email: 'kavitha@example.com', message: 'Need a custom itinerary for 8 people group tour to Kerala.', date: '2025-01-08', read: true },
]

const TABS = [
  { id: 'packages', label: 'Packages', icon: FaBox },
  { id: 'bookings', label: 'Bookings', icon: FaBookmark },
  { id: 'messages', label: 'Messages', icon: FaEnvelope },
]

const STATUS_COLORS = {
  Confirmed: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Cancelled: 'bg-red-100 text-red-700',
}

const EMPTY_PKG = {
  name: '', destination: '', duration: '', price: '', originalPrice: '',
  category: 'Heritage', subtitle: '', badge: '',
  highlights: '', includes: '', image: '',
}

export default function AdminDashboard() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('packages')
  const [packages, setPackages] = useState(PACKAGES)
  const [showForm, setShowForm] = useState(false)
  const [editPkg, setEditPkg] = useState(null)
  const [formData, setFormData] = useState(EMPTY_PKG)
  const [viewPkg, setViewPkg] = useState(null)

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const openAdd = () => {
    setEditPkg(null)
    setFormData(EMPTY_PKG)
    setShowForm(true)
  }

  const openEdit = (pkg) => {
    setEditPkg(pkg.id)
    setFormData({
      name: pkg.name,
      destination: pkg.destination,
      duration: pkg.duration,
      price: pkg.price,
      originalPrice: pkg.originalPrice,
      category: pkg.category,
      subtitle: pkg.subtitle || '',
      badge: pkg.badge || '',
      highlights: pkg.highlights?.join(', ') || '',
      includes: pkg.includes?.join(', ') || '',
      image: pkg.image || '',
    })
    setShowForm(true)
  }

  const handleDeletePackage = (id) => {
    setPackages(p => p.filter(pkg => pkg.id !== id))
    toast.success('Package deleted')
  }

  const handleSave = (e) => {
    e.preventDefault()
    const parsed = {
      ...formData,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice) || Number(formData.price) * 1.3,
      highlights: formData.highlights ? formData.highlights.split(',').map(s => s.trim()).filter(Boolean) : ['Custom highlights'],
      includes: formData.includes ? formData.includes.split(',').map(s => s.trim()).filter(Boolean) : ['AC Transport', 'Hotel Stay'],
      badge: formData.badge || null,
      image: formData.image || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=700&q=80',
      rating: 4.5,
      reviews: 0,
    }

    if (editPkg) {
      setPackages(p => p.map(pkg => pkg.id === editPkg ? { ...pkg, ...parsed } : pkg))
      toast.success('Package updated!')
    } else {
      setPackages(p => [{ ...parsed, id: `pkg-${Date.now()}` }, ...p])
      toast.success('Package added!')
    }
    setShowForm(false)
    setEditPkg(null)
    setFormData(EMPTY_PKG)
  }

  const stats = [
    { label: 'Total Packages', value: packages.length, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Bookings', value: SAMPLE_BOOKINGS.length, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'New Messages', value: SAMPLE_MESSAGES.filter(m => !m.read).length, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Total Revenue', value: '₹' + SAMPLE_BOOKINGS.reduce((s, b) => s + b.total, 0).toLocaleString('en-IN'), color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  const FORM_FIELDS = [
    { name: 'name', label: 'Package Name', placeholder: 'e.g. Munnar Tea Hills Tour', required: true },
    { name: 'destination', label: 'Destination', placeholder: 'e.g. Munnar', required: true },
    { name: 'duration', label: 'Duration', placeholder: 'e.g. 3 Days / 2 Nights', required: true },
    { name: 'price', label: 'Price (₹)', type: 'number', placeholder: '8999', required: true },
    { name: 'originalPrice', label: 'Original Price (₹)', type: 'number', placeholder: '12000' },
    { name: 'subtitle', label: 'Subtitle / Tagline', placeholder: 'e.g. Misty Valleys and Tea Gardens' },
    { name: 'badge', label: 'Badge (optional)', placeholder: 'e.g. Bestseller, New, Trending' },
    { name: 'image', label: 'Image URL (optional)', placeholder: 'https://...' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-teal text-white flex flex-col fixed inset-y-0 left-0 z-30">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center font-display font-bold text-teal text-lg">V</div>
            <div>
              <div className="font-display font-bold text-lg">Vaigai Admin</div>
              <div className="text-gold text-xs">{admin?.email}</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-body font-medium transition-colors ${
                activeTab === tab.id ? 'bg-gold text-teal' : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {tab.id === 'messages' && SAMPLE_MESSAGES.filter(m => !m.read).length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {SAMPLE_MESSAGES.filter(m => !m.read).length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 font-body transition-colors">
            <FaSignOutAlt size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-teal">Dashboard</h1>
          <p className="text-gray-400 font-body text-sm mt-1">Welcome back, {admin?.name || 'Admin'}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-5`}>
              <div className={`font-display text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-gray-500 font-body text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >

            {/* ── PACKAGES ── */}
            {activeTab === 'packages' && (
              <div className="bg-white rounded-2xl shadow-sm">
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="font-display text-xl font-bold text-teal">
                    Manage Packages <span className="text-gray-400 text-base font-body font-normal">({packages.length} total)</span>
                  </h2>
                  <button onClick={openAdd} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
                    <FaPlus size={11} /> Add Package
                  </button>
                </div>

                {/* Add / Edit Form */}
                <AnimatePresence>
                  {showForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden border-b"
                    >
                      <form onSubmit={handleSave} className="p-6 bg-gold/5">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-display font-bold text-teal text-lg">
                            {editPkg ? 'Edit Package' : 'Add New Package'}
                          </h3>
                          <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-red-500">
                            <FaTimes size={16} />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {FORM_FIELDS.map(f => (
                            <div key={f.name} className={f.name === 'image' ? 'col-span-2' : ''}>
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{f.label}</label>
                              <input
                                type={f.type || 'text'} name={f.name}
                                value={formData[f.name]}
                                onChange={e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }))}
                                placeholder={f.placeholder} required={!!f.required}
                                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 font-body text-sm focus:outline-none focus:border-gold"
                              />
                            </div>
                          ))}
                          {/* Category */}
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                            <select
                              value={formData.category}
                              onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 font-body text-sm focus:outline-none focus:border-gold"
                            >
                              {['Heritage', 'Spiritual', 'Coastal', 'Hill Station', 'Nature', 'Combo'].map(c => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </div>
                          {/* Highlights */}
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Highlights (comma separated)</label>
                            <input
                              type="text" name="highlights"
                              value={formData.highlights}
                              onChange={e => setFormData(p => ({ ...p, highlights: e.target.value }))}
                              placeholder="Temple Visit, Boat Ride, Sunrise Point"
                              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 font-body text-sm focus:outline-none focus:border-gold"
                            />
                          </div>
                          {/* Includes */}
                          <div className="col-span-2">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Includes (comma separated)</label>
                            <input
                              type="text" name="includes"
                              value={formData.includes}
                              onChange={e => setFormData(p => ({ ...p, includes: e.target.value }))}
                              placeholder="AC Transport, Hotel Stay, Breakfast, Guide"
                              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 font-body text-sm focus:outline-none focus:border-gold"
                            />
                          </div>
                          <div className="col-span-2 flex gap-3 pt-2">
                            <button type="submit" className="btn-primary text-sm py-2 px-6 flex items-center gap-2">
                              <FaCheck size={11} /> {editPkg ? 'Update Package' : 'Save Package'}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
                              Cancel
                            </button>
                          </div>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b">
                        <th className="px-5 py-4">Package</th>
                        <th className="px-5 py-4">Destination</th>
                        <th className="px-5 py-4">Duration</th>
                        <th className="px-5 py-4">Price</th>
                        <th className="px-5 py-4">Highlights</th>
                        <th className="px-5 py-4">Includes</th>
                        <th className="px-5 py-4">Category</th>
                        <th className="px-5 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {packages.map((pkg, i) => (
                        <tr key={pkg.id} className={`border-b last:border-0 hover:bg-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <img src={pkg.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                              <div>
                                <div className="font-body font-medium text-teal text-sm">{pkg.name}</div>
                                {pkg.badge && (
                                  <span className="text-xs bg-gold/20 text-gold-dark px-2 py-0.5 rounded-full">{pkg.badge}</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-gray-600 text-sm">{pkg.destination}</td>
                          <td className="px-5 py-4 text-gray-600 text-sm whitespace-nowrap">
                            <div className="flex items-center gap-1"><FaClock size={10} className="text-gold" />{pkg.duration}</div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-0.5 font-body font-bold text-teal text-sm">
                              <FaRupeeSign size={10} />{pkg.price?.toLocaleString('en-IN')}
                            </div>
                            {pkg.originalPrice && (
                              <div className="text-xs text-gray-400 line-through">₹{pkg.originalPrice?.toLocaleString('en-IN')}</div>
                            )}
                          </td>
                          <td className="px-5 py-4 max-w-[180px]">
                            <div className="flex flex-wrap gap-1">
                              {pkg.highlights?.slice(0, 2).map(h => (
                                <span key={h} className="text-xs bg-teal/5 text-teal px-1.5 py-0.5 rounded">{h}</span>
                              ))}
                              {pkg.highlights?.length > 2 && (
                                <span className="text-xs text-gray-400">+{pkg.highlights.length - 2}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4 max-w-[160px]">
                            <div className="flex flex-wrap gap-1">
                              {pkg.includes?.slice(0, 2).map(inc => (
                                <span key={inc} className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                  <FaCheck size={7} />{inc}
                                </span>
                              ))}
                              {pkg.includes?.length > 2 && (
                                <span className="text-xs text-gray-400">+{pkg.includes.length - 2}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="bg-gold/15 text-gold-dark text-xs font-semibold px-2.5 py-1 rounded-full">{pkg.category}</span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setViewPkg(pkg)}
                                className="w-7 h-7 rounded-lg bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors"
                                title="View Details"
                              >
                                <FaEye size={11} />
                              </button>
                              <button
                                onClick={() => openEdit(pkg)}
                                className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                                title="Edit"
                              >
                                <FaEdit size={11} />
                              </button>
                              <button
                                onClick={() => handleDeletePackage(pkg.id)}
                                className="w-7 h-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                                title="Delete"
                              >
                                <FaTrash size={11} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── BOOKINGS ── */}
            {activeTab === 'bookings' && (
              <div className="bg-white rounded-2xl shadow-sm">
                <div className="p-6 border-b">
                  <h2 className="font-display text-xl font-bold text-teal">Bookings</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b">
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Tour</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">People</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SAMPLE_BOOKINGS.map(b => (
                        <tr key={b.id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="px-6 py-4 font-mono text-xs text-gray-400">{b.id}</td>
                          <td className="px-6 py-4 font-body font-medium text-teal text-sm">{b.name}</td>
                          <td className="px-6 py-4 text-gray-600 text-sm">{b.tour}</td>
                          <td className="px-6 py-4 text-gray-600 text-sm">{b.date}</td>
                          <td className="px-6 py-4 text-gray-600 text-sm">{b.people}</td>
                          <td className="px-6 py-4 font-body font-bold text-teal text-sm">₹{b.total.toLocaleString('en-IN')}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── MESSAGES ── */}
            {activeTab === 'messages' && (
              <div className="bg-white rounded-2xl shadow-sm">
                <div className="p-6 border-b">
                  <h2 className="font-display text-xl font-bold text-teal">Contact Messages</h2>
                </div>
                <div className="divide-y">
                  {SAMPLE_MESSAGES.map(m => (
                    <div key={m.id} className={`p-6 flex items-start gap-4 hover:bg-gray-50 transition-colors ${!m.read ? 'bg-gold/5' : ''}`}>
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!m.read ? 'bg-gold' : 'bg-gray-300'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-body font-bold text-teal">{m.name}</span>
                          <span className="text-gray-400 text-xs">{m.date}</span>
                        </div>
                        <a href={`mailto:${m.email}`} className="text-gold-dark text-sm hover:underline">{m.email}</a>
                        <p className="text-gray-600 text-sm mt-2 leading-relaxed">{m.message}</p>
                      </div>
                      <button className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100">
                        <FaEye size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Package Detail Modal */}
      <AnimatePresence>
        {viewPkg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setViewPkg(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative">
                <img src={viewPkg.image} alt={viewPkg.name} className="w-full h-48 object-cover" />
                {viewPkg.badge && (
                  <span className="absolute top-3 left-3 bg-gold text-teal text-xs font-bold px-3 py-1 rounded-full">{viewPkg.badge}</span>
                )}
                <button onClick={() => setViewPkg(null)} className="absolute top-3 right-3 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70">
                  <FaTimes size={14} />
                </button>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-teal">{viewPkg.name}</h3>
                <p className="text-gray-400 text-sm mb-3">{viewPkg.subtitle}</p>
                <div className="flex gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><FaClock size={11} className="text-gold" />{viewPkg.duration}</span>
                  <span className="flex items-center gap-1"><FaStar size={11} className="text-gold" />{viewPkg.rating} ({viewPkg.reviews} reviews)</span>
                  <span className="flex items-center gap-1 font-bold text-teal"><FaRupeeSign size={11} />{viewPkg.price?.toLocaleString('en-IN')}</span>
                </div>
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Highlights</p>
                  <div className="flex flex-wrap gap-1.5">
                    {viewPkg.highlights?.map(h => (
                      <span key={h} className="text-xs bg-teal/5 text-teal px-2 py-1 rounded-md border border-teal/10">{h}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Includes</p>
                  <div className="flex flex-wrap gap-1.5">
                    {viewPkg.includes?.map(inc => (
                      <span key={inc} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-md flex items-center gap-1">
                        <FaCheck size={8} />{inc}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <button onClick={() => { setViewPkg(null); openEdit(viewPkg) }} className="btn-primary text-sm py-2 px-5 flex items-center gap-2">
                    <FaEdit size={11} /> Edit Package
                  </button>
                  <button onClick={() => setViewPkg(null)} className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 text-sm hover:bg-gray-50">
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
