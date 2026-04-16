import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaEnvelope, FaArrowRight } from "react-icons/fa";
import toast from "react-hot-toast";
import { subscribeNewsletter } from "../../api";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    try {
      const { data } = await subscribeNewsletter({ email });
      toast.success(data?.message || "Subscribed successfully");
      setEmail("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Subscription failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-white" ref={ref}>
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <motion.div
          className="gold-gradient rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-teal/10 translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <div className="w-14 h-14 bg-teal rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FaEnvelope size={24} className="text-gold" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-teal mb-3">
              Get Travel Inspiration
            </h2>
            <p className="text-teal/70 font-body mb-8 max-w-lg mx-auto">
              Subscribe to receive exclusive travel tips, seasonal deals, and hidden gems of Tamil Nadu straight to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-5 py-3.5 rounded-full font-body bg-white/90 border-2 border-transparent focus:outline-none focus:border-teal text-teal placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-teal text-white font-body font-semibold px-6 py-3.5 rounded-full hover:bg-teal-dark transition-colors flex items-center gap-2 justify-center disabled:opacity-60"
              >
                {submitting ? "Subscribing..." : "Subscribe"} <FaArrowRight size={14} />
              </button>
            </form>
            <p className="text-teal/50 text-xs mt-4">No spam. Unsubscribe anytime.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
