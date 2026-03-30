import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaShieldAlt, FaHeadset, FaMapMarkedAlt, FaRupeeSign, FaUsers, FaStar } from 'react-icons/fa'
import CountUp from 'react-countup'

const FEATURES = [
  {
    icon: FaRupeeSign,
    title: 'Affordable Packages',
    desc: 'Best prices guaranteed with no hidden charges. Value-packed itineraries for every budget.',
    color: 'from-yellow-400 to-orange-400',
  },
  {
    icon: FaHeadset,
    title: '24/7 Travel Support',
    desc: 'Round-the-clock assistance before, during, and after your journey. We\'re always just a call away.',
    color: 'from-blue-400 to-teal-500',
  },
  {
    icon: FaMapMarkedAlt,
    title: 'Expert Local Guides',
    desc: 'Our certified guides bring history and culture alive with their deep knowledge of Tamil Nadu.',
    color: 'from-green-400 to-emerald-500',
  },
  {
    icon: FaShieldAlt,
    title: 'Safe & Comfortable',
    desc: 'AC transport, verified accommodations, and travel insurance — your safety is our priority.',
    color: 'from-purple-400 to-pink-500',
  },
]

const STATS = [
  { end: 10000, suffix: '+', label: 'Happy Travelers' },
  { end: 50, suffix: '+', label: 'Destinations' },
  { end: 4.9, suffix: '★', label: 'Average Rating', decimals: 1 },
  { end: 5, suffix: ' Yrs', label: 'Experience' },
]

export default function WhyUsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="py-24 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 teal-gradient" />
      <div className="absolute inset-0 opacity-5"
        style={{backgroundImage: 'radial-gradient(circle, #F5C400 1px, transparent 1px)', backgroundSize: '40px 40px'}}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block bg-gold/20 text-gold font-body font-semibold text-sm px-4 py-1.5 rounded-full mb-4 tracking-wider uppercase">
            Why Vaigai Tourism
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
            Travel with <span className="text-gold italic">Confidence</span>
          </h2>
          <p className="text-white/60 font-body text-lg mt-4 max-w-2xl mx-auto">
            Five years of crafting unforgettable Tamil Nadu journeys — trusted by over 10,000 happy travelers.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-colors group"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ y: -6 }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <feat.icon size={22} className="text-white" />
              </div>
              <h3 className="font-body font-bold text-white text-lg mb-2">{feat.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          className="bg-gold rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          {STATS.map((stat, i) => (
            <div key={stat.label}>
              <div className="font-display text-3xl md:text-4xl font-black text-teal">
                {inView && (
                  <CountUp
                    end={stat.end}
                    duration={2.5}
                    decimals={stat.decimals || 0}
                    suffix={stat.suffix}
                  />
                )}
              </div>
              <div className="text-teal/70 font-body text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
