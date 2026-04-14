import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { exportBookings, getBookings } from "../../api";

const STATUS_COLORS = {
  Confirmed: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
};

const DEFAULT_FILTERS = {
  bookingId: "",
  name: "",
  email: "",
  phone: "",
  packageName: "",
  fromDate: "",
  toDate: "",
  status: "all",
};

const DEFAULT_LIMIT = 10;

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [totalBookings, setTotalBookings] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [totalPages, setTotalPages] = useState(1);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchBookings = async () => {
      setLoading(true);
      setError("");
      try {
        const params = buildParams(filters, page, limit);
        const { data } = await getBookings(params);
        if (!active) return;
        const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
        setBookings(items);
        setTotalBookings(Number.isFinite(data?.total) ? data.total : items.length);
        setPage(Number.isFinite(data?.page) ? data.page : page);
        setLimit(Number.isFinite(data?.limit) ? data.limit : limit);
        setTotalPages(Number.isFinite(data?.pages) ? data.pages : 1);
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.message || "Failed to load bookings");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchBookings();
    return () => {
      active = false;
    };
  }, [filters, page, limit]);

  const isFiltered = useMemo(() => {
    return (
      draftFilters.bookingId.trim() ||
      draftFilters.name.trim() ||
      draftFilters.email.trim() ||
      draftFilters.phone.trim() ||
      draftFilters.packageName.trim() ||
      draftFilters.fromDate.trim() ||
      draftFilters.toDate.trim() ||
      draftFilters.status !== "all"
    );
  }, [draftFilters]);

  const buildFilterParams = (current) => {
    const params = {};
    if (current.bookingId.trim()) params.bookingId = current.bookingId.trim();
    if (current.name.trim()) params.name = current.name.trim();
    if (current.email.trim()) params.email = current.email.trim();
    if (current.phone.trim()) params.phone = current.phone.trim();
    if (current.packageName.trim()) params.packageName = current.packageName.trim();
    if (current.fromDate) params.fromDate = current.fromDate;
    if (current.toDate) params.toDate = current.toDate;
    if (current.status !== "all") params.status = current.status;
    return params;
  };

  const buildParams = (current, currentPage, currentLimit) => ({
    ...buildFilterParams(current),
    page: currentPage,
    limit: currentLimit,
  });

  const handleChange = (field) => (event) => {
    setDraftFilters((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setDraftFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const handleApplyFilters = () => {
    setPage(1);
    setFilters({
      bookingId: draftFilters.bookingId.trim(),
      name: draftFilters.name.trim(),
      email: draftFilters.email.trim(),
      phone: draftFilters.phone.trim(),
      packageName: draftFilters.packageName.trim(),
      fromDate: draftFilters.fromDate,
      toDate: draftFilters.toDate,
      status: draftFilters.status,
    });
  };

  const goToPage = (nextPage) => {
    const safePage = Math.min(Math.max(1, nextPage), totalPages || 1);
    setPage(safePage);
  };

  const handleLimitChange = (event) => {
    const nextLimit = Number(event.target.value) || DEFAULT_LIMIT;
    setLimit(nextLimit);
    setPage(1);
  };

  const handleExport = async () => {
    setExporting(true);
    setError("");
    try {
      const params = { ...buildFilterParams(filters), export: "csv" };
      const response = await exportBookings(params);
      const blob = new Blob([response.data], { type: "text/csv;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const stamp = new Date().toISOString().slice(0, 10);
      link.download = `vaigai-bookings-${stamp}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to export bookings");
    } finally {
      setExporting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-2xl shadow-sm">
        <div className="p-6 border-b">
          <h2 className="font-display text-xl font-bold text-teal">Bookings</h2>
        </div>

        <div className="p-6 border-b bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            <input
              type="text"
              value={draftFilters.bookingId}
              onChange={handleChange("bookingId")}
              placeholder="Booking ID"
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
            <input
              type="text"
              value={draftFilters.name}
              onChange={handleChange("name")}
              placeholder="Customer"
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
            <input
              type="text"
              value={draftFilters.email}
              onChange={handleChange("email")}
              placeholder="Email"
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
            <input
              type="text"
              value={draftFilters.phone}
              onChange={handleChange("phone")}
              placeholder="Phone"
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
            <input
              type="text"
              value={draftFilters.packageName}
              onChange={handleChange("packageName")}
              placeholder="Package"
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
            <input
              type="date"
              value={draftFilters.fromDate}
              onChange={handleChange("fromDate")}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
            <input
              type="date"
              value={draftFilters.toDate}
              onChange={handleChange("toDate")}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
            <select
              value={draftFilters.status}
              onChange={handleChange("status")}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="mt-3 flex flex-col md:flex-row md:items-center md:justify-between text-xs text-gray-500 gap-3">
            <span>
              Showing {bookings.length}
              {totalBookings ? ` of ${totalBookings}` : ""} bookings
              {isFiltered ? " (filtered)" : ""}
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleExport}
                disabled={exporting}
                className="px-3 py-1 rounded border border-gray-200 text-xs text-teal hover:border-teal disabled:opacity-60"
              >
                {exporting ? "Exporting..." : "Export CSV"}
              </button>
              <select
                value={limit}
                onChange={handleLimitChange}
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
                onClick={handleApplyFilters}
                className="text-teal font-semibold hover:underline"
              >
                Apply filters
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="text-teal hover:underline"
              >
                Clear filters
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="p-6 text-sm text-gray-500">Loading bookings...</div>
        )}
        {error && !loading && (
          <div className="p-6 text-sm text-red-500">{error}</div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <div className="md:hidden divide-y">
              {bookings.map((booking) => (
                <div key={booking._id || booking.bookingId} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400 font-mono">{booking.bookingId}</div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        STATUS_COLORS[booking.status] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {booking.status || "Pending"}
                    </span>
                  </div>
                  <div className="font-body font-semibold text-teal">{booking.name}</div>
                  <div className="text-sm text-gray-600">{booking.email}</div>
                  <div className="text-sm text-gray-600">{booking.phone}</div>
                  <div className="text-sm text-gray-600">{booking.packageName || "-"}</div>
                  <div className="text-sm text-gray-600">
                    Travel: {booking.travelDate ? new Date(booking.travelDate).toLocaleDateString("en-IN") : "-"}
                  </div>
                  <div className="text-sm text-gray-600">People: {booking.people || 1}</div>
                  <div className="text-sm font-semibold text-teal">
                    INR {Number(booking.totalAmount || 0).toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
              {bookings.length === 0 && (
                <div className="px-6 py-6 text-center text-sm text-gray-500">
                  {isFiltered ? "No bookings match these filters." : "No bookings yet."}
                </div>
              )}
            </div>

            <table className="w-full hidden md:table">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Package</th>
                  <th className="px-6 py-4">Travel Date</th>
                  <th className="px-6 py-4">People</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id || booking.bookingId} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">{booking.bookingId}</td>
                    <td className="px-6 py-4 font-body font-medium text-teal text-sm">{booking.name}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{booking.email}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{booking.phone}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{booking.packageName || "-"}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {booking.travelDate ? new Date(booking.travelDate).toLocaleDateString("en-IN") : "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{booking.people || 1}</td>
                    <td className="px-6 py-4 font-body font-bold text-teal text-sm">
                      INR {Number(booking.totalAmount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          STATUS_COLORS[booking.status] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {booking.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-6 text-center text-sm text-gray-500">
                      {isFiltered ? "No bookings match these filters." : "No bookings yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex items-center justify-between px-6 py-4 text-sm text-gray-500">
              <span>
                Page {page} of {totalPages || 1}
              </span>
              <div className="flex items-center gap-2">
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
                  disabled={page >= totalPages}
                  className="px-3 py-1 rounded border border-gray-200 text-xs disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
