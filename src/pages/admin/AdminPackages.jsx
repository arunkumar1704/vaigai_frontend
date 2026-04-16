import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaCheck } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  createPackage,
  deletePackage,
  getAdminPackages,
  resolveMediaUrl,
  uploadPackageImage,
  updatePackage,
} from "../../api";

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
  active: true,
};

const DEFAULT_FILTERS = {
  q: "",
  category: "all",
  active: "all",
};

const DEFAULT_LIMIT = 20;
const CATEGORY_OPTIONS = [
  "all",
  "Heritage",
  "Spiritual",
  "Coastal",
  "Hill Station",
  "Nature",
  "Combo",
];

const toCommaText = (value) => (Array.isArray(value) ? value.join(", ") : "");

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_PKG);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const categories = useMemo(() => {
    const fromData = new Set(
      packages.map((pkg) => pkg.category).filter(Boolean),
    );
    const merged = new Set([...CATEGORY_OPTIONS, ...Array.from(fromData)]);
    return Array.from(merged);
  }, [packages]);

  const loadPackages = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        q: filters.q || undefined,
        category: filters.category !== "all" ? filters.category : undefined,
        active: filters.active !== "all" ? filters.active : undefined,
        page,
        limit,
      };
      const { data } = await getAdminPackages(params);
      const items = Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data)
          ? data
          : [];
      setPackages(items);
      setTotal(Number.isFinite(data?.total) ? data.total : items.length);
      setPages(Number.isFinite(data?.pages) ? data.pages : 1);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, [filters, page, limit]);

  const openAdd = () => {
    setEditId(null);
    setFormData(EMPTY_PKG);
    setShowForm(true);
  };

  const openEdit = (pkg) => {
    setEditId(pkg._id);
    setFormData({
      name: pkg.name || "",
      destination: pkg.destination || "",
      duration: pkg.duration || "",
      price: pkg.price ?? "",
      originalPrice: pkg.originalPrice ?? "",
      category: pkg.category || "Heritage",
      subtitle: pkg.subtitle || "",
      badge: pkg.badge || "",
      highlights: toCommaText(pkg.highlights),
      includes: toCommaText(pkg.includes),
      image: pkg.image || "",
      active: pkg.active !== false,
    });
    setShowForm(true);
  };

  const buildPayload = () => ({
    name: formData.name.trim(),
    destination: formData.destination.trim(),
    duration: formData.duration.trim(),
    price: Number(formData.price),
    originalPrice:
      formData.originalPrice === ""
        ? undefined
        : Number(formData.originalPrice),
    category: formData.category,
    subtitle: formData.subtitle.trim(),
    badge: formData.badge.trim(),
    highlights: formData.highlights
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    includes: formData.includes
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    image: formData.image.trim(),
    active: !!formData.active,
  });

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("image", file);

    setUploadingImage(true);
    try {
      const { data } = await uploadPackageImage(form);
      const imagePath = data?.image || "";
      if (!imagePath) {
        toast.error("Image upload failed");
        return;
      }
      setFormData((prev) => ({ ...prev, image: imagePath }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = buildPayload();
      if (
        !payload.name ||
        !payload.destination ||
        !payload.duration ||
        !Number.isFinite(payload.price)
      ) {
        toast.error("Please fill all required fields");
        return;
      }

      if (editId) {
        await updatePackage(editId, payload);
        toast.success("Package updated");
      } else {
        await createPackage(payload);
        toast.success("Package created");
      }

      setShowForm(false);
      setEditId(null);
      setFormData(EMPTY_PKG);
      await loadPackages();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save package");
      toast.error(err?.response?.data?.message || "Failed to save package");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this package?");
    if (!ok) return;
    try {
      await deletePackage(id);
      toast.success("Package deleted");
      await loadPackages();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete package");
    }
  };

  const applyFilters = () => {
    setPage(1);
    setFilters({
      q: draftFilters.q.trim(),
      category: draftFilters.category,
      active: draftFilters.active,
    });
  };

  const clearFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const goToPage = (nextPage) => {
    const safe = Math.min(Math.max(1, nextPage), pages || 1);
    setPage(safe);
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
            Manage Packages
            <span className="text-gray-400 text-base font-body font-normal">
              {" "}
              ({total} total)
            </span>
          </h2>
          <button
            onClick={openAdd}
            className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
          >
            <FaPlus size={11} /> Add Package
          </button>
        </div>

        <div className="p-6 border-b bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              type="text"
              value={draftFilters.q}
              onChange={(e) =>
                setDraftFilters((prev) => ({ ...prev, q: e.target.value }))
              }
              placeholder="Search name, destination, subtitle"
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
            <select
              value={draftFilters.category}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
            <select
              value={draftFilters.active}
              onChange={(e) =>
                setDraftFilters((prev) => ({ ...prev, active: e.target.value }))
              }
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            >
              <option value="all">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={applyFilters}
                className="text-teal font-semibold hover:underline text-sm"
              >
                Apply filters
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="text-teal hover:underline text-sm"
              >
                Clear filters
              </button>
            </div>
          </div>
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
                    {editId ? "Edit Package" : "Add New Package"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Package Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Destination"
                    value={formData.destination}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        destination: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Original Price"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        originalPrice: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Subtitle"
                    value={formData.subtitle}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        subtitle: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm md:col-span-2"
                  />
                  <input
                    type="text"
                    placeholder="Badge"
                    value={formData.badge}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        badge: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm"
                  />
                  <div className="w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {uploadingImage
                        ? "Uploading image..."
                        : "Single image upload (max 5MB)"}
                    </p>
                  </div>
                  {formData.image ? (
                    <div className="w-full flex items-center gap-3">
                      <img
                        src={resolveMediaUrl(formData.image)}
                        alt="Package preview"
                        className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                      />
                      <span className="text-xs text-gray-500 break-all">
                        {formData.image}
                      </span>
                    </div>
                  ) : null}
                  <input
                    type="text"
                    placeholder="Highlights (comma separated)"
                    value={formData.highlights}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        highlights: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm md:col-span-2"
                  />
                  <input
                    type="text"
                    placeholder="Includes (comma separated)"
                    value={formData.includes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        includes: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm md:col-span-2"
                  />
                  <label className="flex items-center gap-2 text-sm text-gray-600 md:col-span-2">
                    <input
                      type="checkbox"
                      checked={!!formData.active}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          active: e.target.checked,
                        }))
                      }
                    />
                    Active Package
                  </label>
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={saving || uploadingImage}
                    className="btn-primary text-sm py-2 px-6 flex items-center gap-2 disabled:opacity-60"
                  >
                    <FaCheck size={11} />{" "}
                    {uploadingImage
                      ? "Wait for upload..."
                      : saving
                        ? "Saving..."
                        : editId
                          ? "Update Package"
                          : "Create Package"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <div className="p-6 text-sm text-gray-500">Loading packages...</div>
        )}
        {!loading && error && (
          <div className="p-6 text-sm text-red-500">{error}</div>
        )}

        {!loading && !error && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b">
                    <th className="px-5 py-4">Package</th>
                    <th className="px-5 py-4">Destination</th>
                    <th className="px-5 py-4">Duration</th>
                    <th className="px-5 py-4">Price</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr
                      key={pkg._id}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {pkg.image ? (
                            <img
                              src={resolveMediaUrl(pkg.image)}
                              alt={pkg.name}
                              className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200" />
                          )}
                          <div>
                            <div className="font-medium text-teal text-sm">
                              {pkg.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {pkg.subtitle || "-"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-600 text-sm">
                        {pkg.destination || "-"}
                      </td>
                      <td className="px-5 py-4 text-gray-600 text-sm">
                        {pkg.duration || "-"}
                      </td>
                      <td className="px-5 py-4 text-teal font-semibold text-sm">
                        INR {Number(pkg.price || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="px-5 py-4 text-gray-600 text-sm">
                        {pkg.category || "-"}
                      </td>
                      <td className="px-5 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${pkg.active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}
                        >
                          {pkg.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(pkg)}
                            className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100"
                            title="Edit"
                          >
                            <FaEdit size={11} />
                          </button>
                          <button
                            onClick={() => handleDelete(pkg._id)}
                            className="w-7 h-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100"
                            title="Delete"
                          >
                            <FaTrash size={11} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {packages.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-6 text-center text-sm text-gray-500"
                      >
                        No packages found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-6 py-4 text-sm text-gray-500">
              <span>
                Page {page} of {pages || 1}
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value) || DEFAULT_LIMIT);
                    setPage(1);
                  }}
                  className="px-2 py-1 rounded border border-gray-200 text-xs"
                >
                  {[10, 20, 50].map((size) => (
                    <option key={size} value={size}>
                      {size} / page
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className="px-3 py-1 rounded border border-gray-200 text-xs disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= pages}
                  className="px-3 py-1 rounded border border-gray-200 text-xs disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
