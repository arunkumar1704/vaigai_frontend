import { motion } from "framer-motion";
import { FaEye } from "react-icons/fa";
import { SAMPLE_MESSAGES } from "./adminData";

export default function AdminMessages() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-2xl shadow-sm">
        <div className="p-6 border-b">
          <h2 className="font-display text-xl font-bold text-teal">Contact Messages</h2>
        </div>
        <div className="divide-y">
          {SAMPLE_MESSAGES.map((msg) => (
            <div
              key={msg.id}
              className={`p-6 flex flex-col sm:flex-row sm:items-start gap-4 hover:bg-gray-50 transition-colors ${!msg.read ? "bg-gold/5" : ""}`}
            >
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!msg.read ? "bg-gold" : "bg-gray-300"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-body font-bold text-teal">{msg.name}</span>
                  <span className="text-gray-400 text-xs">{msg.date}</span>
                </div>
                <a href={`mailto:${msg.email}`} className="text-gold-dark text-sm hover:underline">
                  {msg.email}
                </a>
                <p className="text-gray-600 text-sm mt-2 leading-relaxed">{msg.message}</p>
              </div>
              <button className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 sm:mt-1">
                <FaEye size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
