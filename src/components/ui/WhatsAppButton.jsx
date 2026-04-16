import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { useSiteSettings } from "../../context/SiteSettingsContext";

export default function WhatsAppButton() {
  const { settings } = useSiteSettings();

  if (!settings.socialLinks?.whatsapp) return null;

  return (
    <motion.a
      href={settings.socialLinks.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xl shadow-green-400/40"
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: "spring", stiffness: 300 }}
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={28} />
    </motion.a>
  );
}
