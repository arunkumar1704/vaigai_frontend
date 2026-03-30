import { motion } from 'framer-motion'
import PackagesSection from '../components/sections/PackagesSection'

export default function Packages() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="pt-20"
    >
      <div className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=1400&q=80"
          alt="Packages"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-teal/80 to-teal/60" />
        <div className="relative text-center text-white">
          <span className="inline-block bg-gold/30 text-gold text-sm font-semibold px-4 py-1.5 rounded-full mb-3 tracking-wider uppercase">
            Curated
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold">Tour Packages</h1>
          <p className="font-body text-white/70 mt-2 text-lg">Handcrafted journeys for every traveler</p>
        </div>
      </div>
      <PackagesSection />
    </motion.div>
  )
}
