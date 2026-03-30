import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { GALLERY_IMAGES } from '../../api/data'

export default function GallerySection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })

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
            Travel Gallery
          </span>
          <h2 className="section-title">
            Captured <span className="text-gold italic">Moments</span>
          </h2>
          <p className="section-subtitle">
            A visual journey through the spectacular landscapes and timeless heritage of South Tamil Nadu.
          </p>
        </motion.div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4">
          {GALLERY_IMAGES.map((img, i) => (
            <motion.div
              key={img.id}
              className={`relative group overflow-hidden rounded-2xl cursor-pointer ${img.span || ''}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.01 }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white font-body font-semibold text-sm">{img.alt}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
