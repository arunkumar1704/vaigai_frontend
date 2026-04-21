import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaEye } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import { getMessages, markMessageRead } from "../../api";

export default function AdminMessages() {
  const { refreshAdminCounts } = useOutletContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    let active = true;

    const loadMessages = async () => {
      setLoading(true);
      try {
        const { data } = await getMessages();
        if (!active) return;
        setMessages(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!active) return;
        toast.error(err?.response?.data?.message || "Failed to load messages");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadMessages();
    return () => {
      active = false;
    };
  }, []);

  const handleOpenMessage = async (messageId) => {
    const selectedMessage = messages.find((message) => message._id === messageId);
    if (!selectedMessage || selectedMessage.isRead || activeId === messageId) return;

    setActiveId(messageId);
    try {
      await markMessageRead(messageId);
      setMessages((current) =>
        current.map((message) =>
          message._id === messageId ? { ...message, isRead: true } : message,
        ),
      );
      await refreshAdminCounts();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update message");
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
          <h2 className="font-display text-xl font-bold text-teal">Contact Messages</h2>
        </div>
        <div className="divide-y">
          {loading ? <div className="p-6 text-sm text-gray-500">Loading messages...</div> : null}

          {!loading &&
            messages.map((msg) => (
              <button
                key={msg._id}
                type="button"
                onClick={() => handleOpenMessage(msg._id)}
                className={`w-full text-left p-6 flex flex-col sm:flex-row sm:items-start gap-4 transition-colors ${
                  msg.isRead
                    ? "bg-white hover:bg-gray-50"
                    : "bg-slate-100 hover:bg-slate-200"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    msg.isRead ? "bg-gray-300" : "bg-gold"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1 gap-3">
                    <span className="font-body font-bold text-teal">{msg.name}</span>
                    <span className="text-gray-400 text-xs">
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleString("en-IN")
                        : ""}
                    </span>
                  </div>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-gold-dark text-sm hover:underline"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {msg.email}
                  </a>
                  {msg.phone ? <div className="text-xs text-gray-500 mt-1">{msg.phone}</div> : null}
                  <p className="text-gray-600 text-sm mt-2 leading-relaxed">{msg.message}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center sm:mt-1">
                  <FaEye size={12} className={activeId === msg._id ? "opacity-50" : ""} />
                </div>
              </button>
            ))}

          {!loading && messages.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">No contact messages yet.</div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
