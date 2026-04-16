import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaRupeeSign } from "react-icons/fa";
import { getAdminStats } from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function AdminHome() {
  const { admin } = useAuth();
  const [stats, setStats] = useState({
    packages: 0,
    bookings: 0,
    unreadBookings: 0,
    unreadMessages: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadStats = async () => {
      setLoading(true);
      try {
        const { data } = await getAdminStats();
        if (!active) return;
        setStats({
          packages: Number(data?.packages || 0),
          bookings: Number(data?.bookings || 0),
          unreadBookings: Number(data?.unreadBookings || 0),
          unreadMessages: Number(data?.unreadMessages || 0),
          revenue: Number(data?.revenue || 0),
        });
      } catch {
        if (!active) return;
      } finally {
        if (active) setLoading(false);
      }
    };

    loadStats();
    return () => {
      active = false;
    };
  }, []);

  const cards = useMemo(
    () => [
      { label: "Total Packages", value: stats.packages, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Total Bookings", value: stats.bookings, color: "text-green-600", bg: "bg-green-50" },
      { label: "New Bookings", value: stats.unreadBookings, color: "text-amber-700", bg: "bg-amber-50" },
      { label: "New Messages", value: stats.unreadMessages, color: "text-yellow-600", bg: "bg-yellow-50" },
      { label: "Total Revenue", value: stats.revenue, color: "text-purple-600", bg: "bg-purple-50" },
    ],
    [stats],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-teal">Dashboard</h1>
        <p className="text-gray-400 font-body text-sm mt-1">
          Welcome back, {admin?.name || "Admin"}
        </p>
      </div>

      {loading ? <div className="text-sm text-gray-500 mb-6">Loading dashboard...</div> : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
        {cards.map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-2xl p-5 border border-white/60 shadow-sm`}>
            <div className={`font-display text-3xl font-bold ${stat.color}`}>
              {stat.label === "Total Revenue" ? (
                <span className="flex items-center gap-1">
                  <FaRupeeSign size={16} />
                  {stat.value.toLocaleString("en-IN")}
                </span>
              ) : (
                stat.value
              )}
            </div>
            <div className="text-gray-500 font-body text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-display text-lg font-bold text-teal mb-4">Quick Notes</h2>
          <ul className="text-gray-600 text-sm space-y-2">
            <li>Review new bookings and update statuses daily.</li>
            <li>Keep package prices aligned with seasonal offers.</li>
            <li>Respond to new messages within 24 hours.</li>
          </ul>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-display text-lg font-bold text-teal mb-4">Today Snapshot</h2>
          <div className="text-sm text-gray-600 space-y-2">
            <div>Packages listed: {stats.packages}</div>
            <div>Total bookings: {stats.bookings}</div>
            <div>Unread bookings: {stats.unreadBookings}</div>
            <div>Unread messages: {stats.unreadMessages}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
