import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { TESTIMONIALS } from '../../api/data'

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const prev = () => setCurrent(c => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  const next = () => setCurrent(c => (c + 1) % TESTIMONIALS.length)
  const t = TESTIMONIALS[current]

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <span className="inline-block bg-teal/10 text-teal font-body font-semibold text-sm px-4 py-1.5 rounded-full mb-4 tracking-wider uppercase">
            Traveler Stories
          </span>
          <h2 className="section-title">
            What They <span className="text-gold italic">Say</span>
          </h2>
          <p className="section-subtitle">Real experiences from real travelers across South Tamil Nadu.</p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="bg-white rounded-3xl shadow-xl p-8 md:p-12 relative"
            >
              <FaQuoteLeft size={48} className="text-gold/20 absolute top-6 left-6" />

              <div className="flex flex-col md:flex-row gap-8 items-start relative">
                <div className="flex-shrink-0 flex flex-col items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-20 h-20 rounded-2xl object-cover border-4 border-gold/20 shadow"
                  />
                  <div className="text-center">
                    <p className="font-body font-bold text-teal">{t.name}</p>
                    <p className="text-gray-400 text-sm">{t.location}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(t.rating)].map((_, i) => (
                      <FaStar key={i} size={14} className="text-gold" />
                    ))}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="inline-block bg-gold/10 text-gold-dark text-xs font-semibold px-3 py-1 rounded-full mb-4">
                    {t.tour}
                  </div>
                  <p className="font-body text-gray-600 text-lg leading-relaxed italic">
                    "{t.text}"
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev} className="w-10 h-10 rounded-full border-2 border-teal text-teal flex items-center justify-center hover:bg-teal hover:text-white transition-colors">
              <FaChevronLeft size={14} />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all ${i === current ? 'bg-gold w-8 h-2' : 'bg-gray-300 w-2 h-2'}`}
                />
              ))}
            </div>
            <button onClick={next} className="w-10 h-10 rounded-full border-2 border-teal text-teal flex items-center justify-center hover:bg-teal hover:text-white transition-colors">
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
