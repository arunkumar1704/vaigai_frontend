import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiArrowDown } from 'react-icons/hi'
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa'

const HERO_SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1600&q=85',
    city: 'Madurai',
    title: 'Temple City of India',
    subtitle: 'Walk where gods walk',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=1600&q=85',
    city: 'Kanyakumari',
    title: 'Where Oceans Embrace',
    subtitle: 'Sunsets that touch the soul',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=1600&q=85',
    city: 'Ooty',
    title: 'Queen of the Hills',
    subtitle: 'Breathe in the mountain mist',
  },
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % HERO_SLIDES.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [])

  const slide = HERO_SLIDES[current]

  return (
    <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
      {/* Background images */}
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        >
          <img
            src={slide.image}
            alt={slide.city}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Grain texture */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            {/* Location badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-gold/20 backdrop-blur-sm border border-gold/30 text-gold px-4 py-2 rounded-full text-sm font-body font-semibold mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <FaMapMarkerAlt size={12} />
              {slide.city}, Tamil Nadu
            </motion.div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-none mb-4">
              Explore the<br />
              <span className="text-gold italic">Beauty</span> of<br />
              South Tamil Nadu
            </h1>

            <p className="font-body text-white/80 text-xl mt-6 mb-2 font-light">{slide.title}</p>
            <p className="font-body text-white/50 text-base italic">{slide.subtitle}</p>

            <div className="flex flex-wrap items-center gap-4 mt-10">
              <Link to="/packages" className="btn-primary text-base px-8 py-4 shadow-xl shadow-gold/20">
                Explore Packages
              </Link>
              <Link to="/contact" className="btn-outline text-base px-8 py-4">
                Book a Tour
              </Link>
            </div>

            {/* Stats strip */}
            <div className="flex flex-wrap gap-8 mt-12">
              {[
                { val: '50+', label: 'Destinations' },
                { val: '10K+', label: 'Happy Travelers' },
                { val: '4.9', label: 'Average Rating', icon: <FaStar className="text-gold" size={10} /> },
              ].map(stat => (
                <div key={stat.label} className="text-white">
                  <div className="flex items-center gap-1.5 font-display text-2xl font-bold">
                    {stat.icon}{stat.val}
                  </div>
                  <div className="text-white/50 text-xs font-body">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-20 right-8 flex flex-col gap-2 z-10">
        {HERO_SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? 'bg-gold w-2 h-8' : 'bg-white/40 w-2 h-2'}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span className="text-xs font-body tracking-widest uppercase">Scroll</span>
        <HiArrowDown size={18} />
      </motion.div>
    </section>
  )
}
