import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import toast from "react-hot-toast";
import { getSubscriptions, markSubscriptionRead } from "../../api";

const DEFAULT_FILTERS = {
  email: "",
  status: "all",
};

const DEFAULT_LIMIT = 10;

export default function AdminSubscriptions() {
  const { refreshAdminCounts } = useOutletContext();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    let active = true;

    const loadSubscriptions = async () => {
      setLoading(true);
      setError("");
      try {
        const params = {
          email: filters.email || undefined,
          status: filters.status !== "all" ? filters.status : undefined,
          page,
          limit,
        };
        const { data } = await getSubscriptions(params);
        if (!active) return;
        const items = Array.isArray(data?.items) ? data.items : [];
        setSubscriptions(items);
        setTotal(Number.isFinite(data?.total) ? data.total : items.length);
        setPages(Number.isFinite(data?.pages) ? data.pages : 1);
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.message || "Failed to load subscriptions");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadSubscriptions();
    return () => {
      active = false;
    };
  }, [filters, page, limit]);

  const isFiltered = useMemo(
    () => draftFilters.email.trim() || draftFilters.status !== "all",
    [draftFilters],
  );

  const handleOpenSubscription = async (subscriptionId) => {
    const selected = subscriptions.find((item) => item._id === subscriptionId);
    if (!selected || selected.isRead || activeId === subscriptionId) return;

    setActiveId(subscriptionId);
    try {
      await markSubscriptionRead(subscriptionId);
      setSubscriptions((current) =>
        current.map((item) =>
          item._id === subscriptionId ? { ...item, isRead: true } : item,
        ),
      );
      await refreshAdminCounts();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update subscription");
    } finally {
      setActiveId(null);
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
          <h2 className="font-display text-xl font-bold text-teal">Newsletter Subscriptions</h2>
        </div>

        <div className="p-6 border-b bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={draftFilters.email}
              onChange={(e) => setDraftFilters((current) => ({ ...current, email: e.target.value }))}
              placeholder="Search email"
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
            <select
              value={draftFilters.status}
              onChange={(e) => setDraftFilters((current) => ({ ...current, status: e.target.value }))}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
            <div className="flex items-center gap-3 text-sm">
              <button
                type="button"
                onClick={() => {
                  setPage(1);
                  setFilters({
                    email: draftFilters.email.trim(),
                    status: draftFilters.status,
                  });
                }}
                className="text-teal font-semibold hover:underline"
              >
                Apply filters
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraftFilters(DEFAULT_FILTERS);
                  setFilters(DEFAULT_FILTERS);
                  setPage(1);
                }}
                className="text-teal hover:underline"
              >
                Clear filters
              </button>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Showing {subscriptions.length}{total ? ` of ${total}` : ""} subscriptions{isFiltered ? " (filtered)" : ""}
          </div>
        </div>

        {loading ? <div className="p-6 text-sm text-gray-500">Loading subscriptions...</div> : null}
        {error && !loading ? <div className="p-6 text-sm text-red-500">{error}</div> : null}

        {!loading && !error && (
          <>
            <div className="divide-y">
              {subscriptions.map((item) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => handleOpenSubscription(item._id)}
                  className={`w-full text-left p-6 flex items-center gap-4 transition-colors ${
                    item.isRead ? "bg-white hover:bg-gray-50" : "bg-slate-100 hover:bg-slate-200"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${item.isRead ? "bg-gray-300" : "bg-slate-800"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-teal">{item.email}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString("en-IN") : ""}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FaEye size={12} className={activeId === item._id ? "opacity-50" : ""} />
                  </div>
                </button>
              ))}
              {subscriptions.length === 0 ? (
                <div className="p-6 text-sm text-gray-500 text-center">
                  No subscriptions found.
                </div>
              ) : null}
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
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1 rounded border border-gray-200 text-xs disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(pages || 1, current + 1))}
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
