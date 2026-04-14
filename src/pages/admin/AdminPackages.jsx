import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaTimes,
  FaCheck,
  FaStar,
  FaClock,
  FaRupeeSign,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { PACKAGES } from "../../api/data";

const EMPTY_PKG = {
  name: "",
  destination: "",
  duration: "",
  price: "",
  originalPrice: "",
  category: "Heritage",
  subtitle: "",
  badge: "",
  highlights: "",
  includes: "",
  image: "",
};

const FORM_FIELDS = [
  { name: "name", label: "Package Name", placeholder: "e.g. Munnar Tea Hills Tour", required: true },
  { name: "destination", label: "Destination", placeholder: "e.g. Munnar", required: true },
  { name: "duration", label: "Duration", placeholder: "e.g. 3 Days / 2 Nights", required: true },
  { name: "price", label: "Price", type: "number", placeholder: "8999", required: true },
  { name: "originalPrice", label: "Original Price", type: "number", placeholder: "12000" },
  { name: "subtitle", label: "Subtitle / Tagline", placeholder: "e.g. Misty Valleys and Tea Gardens" },
  { name: "badge", label: "Badge (optional)", placeholder: "e.g. Bestseller, New, Trending" },
  { name: "image", label: "Image URL (optional)", placeholder: "https://..." },
];

export default function AdminPackages() {
  const [packages, setPackages] = useState(PACKAGES);
  const [showForm, setShowForm] = useState(false);
  const [editPkg, setEditPkg] = useState(null);
  const [formData, setFormData] = useState(EMPTY_PKG);
  const [viewPkg, setViewPkg] = useState(null);

  const openAdd = () => {
    setEditPkg(null);
    setFormData(EMPTY_PKG);
    setShowForm(true);
  };

  const openEdit = (pkg) => {
    setEditPkg(pkg.id);
    setFormData({
      name: pkg.name,
      destination: pkg.destination,
      duration: pkg.duration,
      price: pkg.price,
      originalPrice: pkg.originalPrice,
      category: pkg.category,
      subtitle: pkg.subtitle || "",
      badge: pkg.badge || "",
      highlights: pkg.highlights?.join(", ") || "",
      includes: pkg.includes?.join(", ") || "",
      image: pkg.image || "",
    });
    setShowForm(true);
  };

  const handleDeletePackage = (id) => {
    setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
    toast.success("Package deleted");
  };

  const handleSave = (e) => {
    e.preventDefault();
    const parsed = {
      ...formData,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice) || Number(formData.price) * 1.3,
      highlights: formData.highlights
        ? formData.highlights
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : ["Custom highlights"],
      includes: formData.includes
        ? formData.includes
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : ["AC Transport", "Hotel Stay"],
      badge: formData.badge || null,
      image: formData.image || "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=700&q=80",
      rating: 4.5,
      reviews: 0,
    };

    if (editPkg) {
      setPackages((prev) => prev.map((pkg) => (pkg.id === editPkg ? { ...pkg, ...parsed } : pkg)));
      toast.success("Package updated!");
    } else {
      setPackages((prev) => [{ ...parsed, id: `pkg-${Date.now()}` }, ...prev]);
      toast.success("Package added!");
    }
    setShowForm(false);
    setEditPkg(null);
    setFormData(EMPTY_PKG);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-2xl shadow-sm">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="font-display text-xl font-bold text-teal">
            Manage Packages <span className="text-gray-400 text-base font-body font-normal">({packages.length} total)</span>
          </h2>
          <button onClick={openAdd} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
            <FaPlus size={11} /> Add Package
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-b"
            >
              <form onSubmit={handleSave} className="p-6 bg-gold/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-teal text-lg">
                    {editPkg ? "Edit Package" : "Add New Package"}
                  </h3>
                  <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-red-500">
                    <FaTimes size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {FORM_FIELDS.map((field) => (
                    <div key={field.name} className={field.name === "image" ? "md:col-span-2" : ""}>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{field.label}</label>
                      <input
                        type={field.type || "text"}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                        placeholder={field.placeholder}
                        required={!!field.required}
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 font-body text-sm focus:outline-none focus:border-gold"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 font-body text-sm focus:outline-none focus:border-gold"
                    >
                      {[
                        "Heritage",
                        "Spiritual",
                        "Coastal",
                        "Hill Station",
                        "Nature",
                        "Combo",
                      ].map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Highlights (comma separated)</label>
                    <input
                      type="text"
                      name="highlights"
                      value={formData.highlights}
                      onChange={(e) => setFormData((prev) => ({ ...prev, highlights: e.target.value }))}
                      placeholder="Temple Visit, Boat Ride, Sunrise Point"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 font-body text-sm focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Includes (comma separated)</label>
                    <input
                      type="text"
                      name="includes"
                      value={formData.includes}
                      onChange={(e) => setFormData((prev) => ({ ...prev, includes: e.target.value }))}
                      placeholder="AC Transport, Hotel Stay, Breakfast, Guide"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 font-body text-sm focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
                    <button type="submit" className="btn-primary text-sm py-2 px-6 flex items-center gap-2">
                      <FaCheck size={11} /> {editPkg ? "Update Package" : "Save Package"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 text-sm hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="overflow-x-auto">
          <div className="md:hidden divide-y">
            {packages.map((pkg) => (
              <div key={pkg.id} className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <img src={pkg.image} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                  <div>
                    <div className="font-body font-semibold text-teal">{pkg.name}</div>
                    <div className="text-xs text-gray-500">{pkg.destination}</div>
                  </div>
                  {pkg.badge && (
                    <span className="ml-auto text-xs bg-gold/20 text-gold-dark px-2 py-0.5 rounded-full">
                      {pkg.badge}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <FaClock size={10} className="text-gold" />
                    {pkg.duration}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-teal">
                    <FaRupeeSign size={10} />
                    {pkg.price?.toLocaleString("en-IN")}
                  </span>
                  <span className="bg-gold/15 text-gold-dark text-xs font-semibold px-2 py-0.5 rounded-full">
                    {pkg.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewPkg(pkg)}
                    className="px-3 py-1 rounded-lg bg-green-50 text-green-700 text-xs"
                  >
                    View
                  </button>
                  <button
                    onClick={() => openEdit(pkg)}
                    className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePackage(pkg.id)}
                    className="px-3 py-1 rounded-lg bg-red-50 text-red-600 text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <table className="w-full hidden md:table">
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
              {packages.map((pkg, index) => (
                <tr
                  key={pkg.id}
                  className={`border-b last:border-0 hover:bg-gray-50 ${index % 2 === 0 ? "" : "bg-gray-50/50"}`}
                >
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
                    <div className="flex items-center gap-1">
                      <FaClock size={10} className="text-gold" />
                      {pkg.duration}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-0.5 font-body font-bold text-teal text-sm">
                      <FaRupeeSign size={10} />
                      {pkg.price?.toLocaleString("en-IN")}
                    </div>
                    {pkg.originalPrice && (
                      <div className="text-xs text-gray-400 line-through">
                        {pkg.originalPrice?.toLocaleString("en-IN")}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 max-w-[180px]">
                    <div className="flex flex-wrap gap-1">
                      {pkg.highlights?.slice(0, 2).map((item) => (
                        <span key={item} className="text-xs bg-teal/5 text-teal px-1.5 py-0.5 rounded">
                          {item}
                        </span>
                      ))}
                      {pkg.highlights?.length > 2 && (
                        <span className="text-xs text-gray-400">+{pkg.highlights.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 max-w-[160px]">
                    <div className="flex flex-wrap gap-1">
                      {pkg.includes?.slice(0, 2).map((inc) => (
                        <span
                          key={inc}
                          className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded flex items-center gap-0.5"
                        >
                          <FaCheck size={7} />
                          {inc}
                        </span>
                      ))}
                      {pkg.includes?.length > 2 && (
                        <span className="text-xs text-gray-400">+{pkg.includes.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="bg-gold/15 text-gold-dark text-xs font-semibold px-2.5 py-1 rounded-full">
                      {pkg.category}
                    </span>
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
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img src={viewPkg.image} alt={viewPkg.name} className="w-full h-48 object-cover" />
                {viewPkg.badge && (
                  <span className="absolute top-3 left-3 bg-gold text-teal text-xs font-bold px-3 py-1 rounded-full">
                    {viewPkg.badge}
                  </span>
                )}
                <button
                  onClick={() => setViewPkg(null)}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
                >
                  <FaTimes size={14} />
                </button>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-teal">{viewPkg.name}</h3>
                <p className="text-gray-400 text-sm mb-3">{viewPkg.subtitle}</p>
                <div className="flex gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <FaClock size={11} className="text-gold" />
                    {viewPkg.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaStar size={11} className="text-gold" />
                    {viewPkg.rating} ({viewPkg.reviews} reviews)
                  </span>
                  <span className="flex items-center gap-1 font-bold text-teal">
                    <FaRupeeSign size={11} />
                    {viewPkg.price?.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Highlights</p>
                  <div className="flex flex-wrap gap-1.5">
                    {viewPkg.highlights?.map((item) => (
                      <span key={item} className="text-xs bg-teal/5 text-teal px-2 py-1 rounded-md border border-teal/10">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Includes</p>
                  <div className="flex flex-wrap gap-1.5">
                    {viewPkg.includes?.map((inc) => (
                      <span key={inc} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-md flex items-center gap-1">
                        <FaCheck size={8} />
                        {inc}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => {
                      setViewPkg(null);
                      openEdit(viewPkg);
                    }}
                    className="btn-primary text-sm py-2 px-5 flex items-center gap-2"
                  >
                    <FaEdit size={11} /> Edit Package
                  </button>
                  <button
                    onClick={() => setViewPkg(null)}
                    className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 text-sm hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
