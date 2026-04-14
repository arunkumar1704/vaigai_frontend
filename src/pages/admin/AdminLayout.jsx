import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaBox,
  FaBookmark,
  FaEnvelope,
  FaHome,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { SAMPLE_MESSAGES } from "./adminData";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: FaHome, end: true },
  { to: "/admin/packages", label: "Packages", icon: FaBox },
  { to: "/admin/bookings", label: "Bookings", icon: FaBookmark },
  { to: "/admin/messages", label: "Messages", icon: FaEnvelope },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("auth_token");
    navigate("/admin/login");
  };

  const unreadCount = SAMPLE_MESSAGES.filter((m) => !m.read).length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-teal"
          >
            <FaBars size={16} />
          </button>
          <div className="font-display font-bold text-teal">Vaigai Admin</div>
          <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center text-teal font-bold">
            V
          </div>
        </div>
      </header>

      {sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          aria-label="Close menu"
        />
      )}

      <aside
        className={`w-64 bg-teal text-white flex flex-col fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center font-display font-bold text-teal text-lg">
              V
            </div>
            <div>
              <div className="font-display font-bold text-lg">Vaigai Admin</div>
              <div className="text-gold text-xs">{admin?.email}</div>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="ml-auto md:hidden text-white/70 hover:text-white"
            >
              <FaTimes size={16} />
            </button>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-body font-medium transition-colors ${
                  isActive
                    ? "bg-gold text-teal"
                    : "text-white/70 hover:bg-white/10"
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
              {item.label === "Messages" && unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 font-body transition-colors"
          >
            <FaSignOutAlt size={16} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 md:ml-64 pt-20 md:pt-8">
        <Outlet />
      </main>
    </div>
  );
}
