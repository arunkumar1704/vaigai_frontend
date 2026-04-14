import { motion } from "framer-motion";
import { FaRupeeSign } from "react-icons/fa";
import { PACKAGES } from "../../api/data";
import { SAMPLE_BOOKINGS, SAMPLE_MESSAGES } from "./adminData";
import { useAuth } from "../../context/AuthContext";

export default function AdminHome() {
  const { admin } = useAuth();

  const stats = [
    {
      label: "Total Packages",
      value: PACKAGES.length,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Bookings",
      value: SAMPLE_BOOKINGS.length,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "New Messages",
      value: SAMPLE_MESSAGES.filter((m) => !m.read).length,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Total Revenue",
      value: SAMPLE_BOOKINGS.reduce((sum, booking) => sum + booking.total, 0),
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
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
            <div>Packages listed: {PACKAGES.length}</div>
            <div>Bookings pending: {SAMPLE_BOOKINGS.filter((b) => b.status === "Pending").length}</div>
            <div>Unread messages: {SAMPLE_MESSAGES.filter((m) => !m.read).length}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
