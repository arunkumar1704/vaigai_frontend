import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaStar, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa'
import { DESTINATIONS } from '../../api/data'

const CATEGORIES = ['All', 'Heritage', 'Spiritual', 'Coastal', 'Hill Station', 'Nature', 'Kerala']

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' }
  })
}

export default function DestinationsSection({ limit }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const navigate = useNavigate()

  const KERALA_NAMES = ['Munnar','Alleppey','Varkala','Thekkady','Kovalam','Wayanad','Kumarakom','Bekal','Kochi','Thiruvananthapuram']
  const filtered = DESTINATIONS
    .filter(d => {
      if (activeCategory === 'All') return true
      if (activeCategory === 'Kerala') return KERALA_NAMES.includes(d.name)
      return d.category === activeCategory
    })
    .slice(0, limit)

  const handleViewPackages = (e, destName) => {
    e.stopPropagation()
    navigate(`/packages?destination=${encodeURIComponent(destName)}`)
  }

  return (
    <section className="py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block bg-gold/10 text-gold-dark font-body font-semibold text-sm px-4 py-1.5 rounded-full mb-4 tracking-wider uppercase">
            Explore Tamil Nadu
          </span>
          <h2 className="section-title">
            Iconic <span className="text-gold italic">Destinations</span>
          </h2>
          <p className="section-subtitle">
            From ancient temples to misty hill stations — discover the most captivating corners of South Tamil Nadu.
          </p>
        </motion.div>

        {!limit && (
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-gold text-teal shadow-md shadow-gold/30'
                    : 'bg-gray-100 text-gray-600 hover:bg-gold/10 hover:text-teal'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((dest, i) => (
            <motion.div
              key={dest.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
              onClick={() => navigate(`/packages?destination=${encodeURIComponent(dest.name)}`)}
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3 bg-gold text-teal text-xs font-semibold px-3 py-1 rounded-full">
                {dest.category}
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                <FaStar className="text-gold" size={10} />
                {dest.rating}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-center gap-1 text-gold/80 text-xs mb-1">
                  <FaMapMarkerAlt size={10} />
                  <span className="font-body">{dest.tours} tours available</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-white">{dest.name}</h3>
                <p className="text-white/60 text-xs font-body mt-1 mb-3">{dest.tagline}</p>
                <div className="h-px bg-white/20 mb-3" />
                <p className="text-white/70 text-xs leading-relaxed line-clamp-2">
                  {dest.description.slice(0, 70)}...
                </p>
                <button
                  onClick={(e) => handleViewPackages(e, dest.name)}
                  className="mt-3 flex items-center gap-2 text-gold text-sm font-semibold opacity-80 group-hover:opacity-100 transition-all group-hover:gap-3"
                >
                  View Packages <FaArrowRight size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {limit && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
          >
            <Link to="/destinations" className="btn-primary">
              View All Destinations <FaArrowRight size={14} />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
