import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEdit, FaTimes } from "react-icons/fa";
import {
  exportBookings,
  getBookings,
  markBookingRead,
  markBookingsRead,
  updateBookingStatus,
} from "../../api";

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
const STATUS_OPTIONS = ["Pending", "Confirmed", "Cancelled"];

export default function AdminBookings() {
  const { refreshAdminCounts } = useOutletContext();
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
  const [activeReadId, setActiveReadId] = useState(null);
  const [selectedBookingIds, setSelectedBookingIds] = useState([]);
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [statusModal, setStatusModal] = useState({
    open: false,
    bookingId: "",
    bookingName: "",
    bookingCode: "",
    currentStatus: "Pending",
    nextStatus: "Pending",
  });
  const [statusSaving, setStatusSaving] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchBookings = async () => {
      setLoading(true);
      setError("");
      try {
        const params = buildParams(filters, page, limit);
        const { data } = await getBookings(params);
        if (!active) return;
        const items = Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data)
            ? data
            : [];
        setBookings(items);
        setSelectedBookingIds([]);
        setTotalBookings(
          Number.isFinite(data?.total) ? data.total : items.length,
        );
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
    if (current.packageName.trim())
      params.packageName = current.packageName.trim();
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
      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8",
      });
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

  const handleBookingOpen = async (bookingId) => {
    const selectedBooking = bookings.find(
      (booking) => booking._id === bookingId,
    );
    if (
      !selectedBooking ||
      selectedBooking.isRead ||
      activeReadId === bookingId
    )
      return;

    setActiveReadId(bookingId);
    try {
      await markBookingRead(bookingId);
      setBookings((current) =>
        current.map((booking) =>
          booking._id === bookingId ? { ...booking, isRead: true } : booking,
        ),
      );
      setSelectedBookingIds((current) =>
        current.filter((id) => id !== bookingId),
      );
      await refreshAdminCounts();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update booking");
    } finally {
      setActiveReadId(null);
    }
  };

  const unreadVisibleBookings = useMemo(
    () => bookings.filter((booking) => !booking.isRead && booking._id),
    [bookings],
  );

  const allUnreadSelected =
    unreadVisibleBookings.length > 0 &&
    unreadVisibleBookings.every((booking) =>
      selectedBookingIds.includes(booking._id),
    );

  const toggleBookingSelection = (bookingId) => {
    setSelectedBookingIds((current) =>
      current.includes(bookingId)
        ? current.filter((id) => id !== bookingId)
        : [...current, bookingId],
    );
  };

  const toggleSelectAllUnread = () => {
    if (allUnreadSelected) {
      setSelectedBookingIds([]);
      return;
    }
    setSelectedBookingIds(unreadVisibleBookings.map((booking) => booking._id));
  };

  const handleMarkSelectedRead = async () => {
    if (selectedBookingIds.length === 0) return;

    setBulkUpdating(true);
    try {
      await markBookingsRead(selectedBookingIds);
      setBookings((current) =>
        current.map((booking) =>
          selectedBookingIds.includes(booking._id)
            ? { ...booking, isRead: true }
            : booking,
        ),
      );
      setSelectedBookingIds([]);
      await refreshAdminCounts();
      toast.success("Selected bookings marked as read");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update bookings");
    } finally {
      setBulkUpdating(false);
    }
  };

  const openStatusModal = (booking, nextStatus) => {
    setStatusModal({
      open: true,
      bookingId: booking._id,
      bookingName: booking.name || "Customer",
      bookingCode: booking.bookingId || "",
      currentStatus: booking.status || "Pending",
      nextStatus,
    });
  };

  const closeStatusModal = () => {
    if (statusSaving) return;
    setStatusModal({
      open: false,
      bookingId: "",
      bookingName: "",
      bookingCode: "",
      currentStatus: "Pending",
      nextStatus: "Pending",
    });
  };

  const confirmStatusUpdate = async () => {
    if (
      !statusModal.bookingId ||
      statusModal.currentStatus === statusModal.nextStatus
    ) {
      closeStatusModal();
      return;
    }

    setStatusSaving(true);
    try {
      const { data } = await updateBookingStatus(statusModal.bookingId, {
        status: statusModal.nextStatus,
      });
      const updatedStatus = data?.status || statusModal.nextStatus;
      setBookings((current) =>
        current.map((booking) =>
          booking._id === statusModal.bookingId
            ? { ...booking, status: updatedStatus }
            : booking,
        ),
      );
      toast.success(`Booking status changed to ${updatedStatus}`);
      closeStatusModal();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update booking status",
      );
    } finally {
      setStatusSaving(false);
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
              <button
                type="button"
                onClick={handleMarkSelectedRead}
                disabled={bulkUpdating || selectedBookingIds.length === 0}
                className="px-3 py-1 rounded border border-gray-200 text-xs text-teal hover:border-teal disabled:opacity-60"
              >
                {bulkUpdating
                  ? "Updating..."
                  : `Mark Read (${selectedBookingIds.length})`}
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
                <button
                  key={booking._id || booking.bookingId}
                  type="button"
                  onClick={() => handleBookingOpen(booking._id)}
                  className={`w-full text-left p-4 space-y-2 transition-colors ${
                    booking.isRead
                      ? "bg-white hover:bg-gray-50"
                      : "bg-slate-100 hover:bg-slate-200"
                  } focus:outline-none focus:bg-white active:bg-white`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`block w-3 h-3 rounded-full ${
                          booking.isRead ? "bg-gray-200" : "bg-slate-800"
                        }`}
                      />
                      <div className="text-xs text-gray-400 font-mono">
                        {booking.bookingId}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        openStatusModal(booking, booking.status || "Pending");
                      }}
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        STATUS_COLORS[booking.status] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {booking.status || "Pending"}
                    </button>
                  </div>
                  <div className="font-body font-semibold text-teal">
                    {booking.name}
                  </div>
                  <div className="text-sm text-gray-600">{booking.email}</div>
                  <div className="text-sm text-gray-600">{booking.phone}</div>
                  <div className="text-sm text-gray-600">
                    {booking.packageName || "-"}
                  </div>
                  <div className="text-sm text-gray-600">
                    Travel:{" "}
                    {booking.travelDate
                      ? new Date(booking.travelDate).toLocaleDateString("en-IN")
                      : "-"}
                  </div>
                  <div className="text-sm text-gray-600">
                    People: {booking.people || 1}
                  </div>
                  <div className="text-sm font-semibold text-teal">
                    INR{" "}
                    {Number(booking.totalAmount || 0).toLocaleString("en-IN")}
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      openStatusModal(booking, booking.status || "Pending");
                    }}
                    className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-teal text-white text-xs font-semibold hover:bg-teal/90 transition-colors"
                  >
                    Change Status
                  </button>
                  {activeReadId === booking._id ? (
                    <div className="text-xs text-gray-400">Updating...</div>
                  ) : null}
                </button>
              ))}
              {bookings.length === 0 && (
                <div className="px-6 py-6 text-center text-sm text-gray-500">
                  {isFiltered
                    ? "No bookings match these filters."
                    : "No bookings yet."}
                </div>
              )}
            </div>

            <table className="w-full hidden md:table">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b">
                  <th className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={allUnreadSelected}
                      onChange={toggleSelectAllUnread}
                      aria-label="Select all unread bookings"
                      className="w-4 h-4 accent-teal"
                    />
                  </th>
                  <th className="px-4 py-4">New</th>
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
                  <tr
                    key={booking._id || booking.bookingId}
                    onClick={() => handleBookingOpen(booking._id)}
                    className={`border-b last:border-0 cursor-pointer transition-colors ${
                      booking.isRead
                        ? "hover:bg-gray-50 bg-white"
                        : "bg-slate-100 hover:bg-slate-200"
                    }`}
                  >
                    <td
                      className="px-4 py-4"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedBookingIds.includes(booking._id)}
                        disabled={booking.isRead}
                        onChange={() => toggleBookingSelection(booking._id)}
                        aria-label={`Select booking ${booking.bookingId}`}
                        className="w-4 h-4 accent-teal disabled:opacity-40"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`block w-3 h-3 rounded-full ${
                          booking.isRead ? "bg-gray-200" : "bg-slate-800"
                        }`}
                        title={
                          booking.isRead ? "Read booking" : "New unread booking"
                        }
                      />
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">
                      {booking.bookingId}
                    </td>
                    <td className="px-6 py-4 font-body font-medium text-teal text-sm">
                      {booking.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {booking.email}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {booking.phone}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {booking.packageName || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {booking.travelDate
                        ? new Date(booking.travelDate).toLocaleDateString(
                            "en-IN",
                          )
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {booking.people || 1}
                    </td>
                    <td className="px-6 py-4 font-body font-bold text-teal text-sm">
                      INR{" "}
                      {Number(booking.totalAmount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openStatusModal(booking, booking.status || "Pending");
                        }}
                        className={`text-xs font-semibold px-3 py-1 rounded-full flex justify-center items-center gap-1 ${
                          STATUS_COLORS[booking.status] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {booking.status || "Pending"} <FaEdit size={11} />
                      </button>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td
                      colSpan={11}
                      className="px-6 py-6 text-center text-sm text-gray-500"
                    >
                      {isFiltered
                        ? "No bookings match these filters."
                        : "No bookings yet."}
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

      {statusModal.open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={closeStatusModal}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-label="Close status dialog"
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b bg-gradient-to-r from-teal to-teal/85 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-white/70">
                    Change Booking Status
                  </div>
                  <h3 className="font-display text-2xl font-bold mt-1">
                    {statusModal.bookingName}
                  </h3>
                  <div className="text-xs text-white/70 mt-1">
                    {statusModal.bookingCode}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeStatusModal}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-gray-200 p-4 bg-gray-50">
                  <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                    Current Status
                  </div>
                  <div
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                      STATUS_COLORS[statusModal.currentStatus] ||
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {statusModal.currentStatus}
                  </div>
                </div>
                <div className="rounded-2xl border border-gold/30 p-4 bg-gold/5">
                  <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                    New Status
                  </div>
                  <div
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                      STATUS_COLORS[statusModal.nextStatus] ||
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {statusModal.nextStatus}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-teal mb-3">
                  Select New Status
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {STATUS_OPTIONS.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() =>
                        setStatusModal((current) => ({
                          ...current,
                          nextStatus: status,
                        }))
                      }
                      className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${
                        statusModal.nextStatus === status
                          ? "border-teal bg-teal text-white shadow-md"
                          : "border-gray-200 bg-white text-gray-600 hover:border-teal/40 hover:bg-teal/5"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 text-sm text-gray-600">
                {statusModal.currentStatus === statusModal.nextStatus
                  ? "Choose a different status to update this booking."
                  : `You are about to change this booking from ${statusModal.currentStatus} to ${statusModal.nextStatus}. Please confirm to continue.`}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  type="button"
                  onClick={closeStatusModal}
                  disabled={statusSaving}
                  className="px-5 py-3 rounded-2xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmStatusUpdate}
                  disabled={
                    statusSaving ||
                    statusModal.currentStatus === statusModal.nextStatus
                  }
                  className="px-5 py-3 rounded-2xl bg-teal text-white text-sm font-semibold hover:bg-teal/90 disabled:opacity-60"
                >
                  {statusSaving ? "Updating..." : "Confirm Status Change"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </motion.div>
  );
}
