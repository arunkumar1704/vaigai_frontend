import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaCheck } from 'react-icons/fa'
import { Link } from 'react-router-dom'

// ─── DATA ────────────────────────────────────────────────────────────────────

const STATS = [
  { number: '2020', label: 'Founded' },
  { number: '50+',  label: 'Destinations' },
  { number: '25K+', label: 'Travellers' },
  { number: '4.9★', label: 'Avg Rating' },
]

const MV_BOXES = [
  {
    icon: '🏔️',
    title: 'Our Mission',
    text: 'To promote Tamil Nadu as a world-class tourist destination through responsible tourism, innovation, and genuine community engagement.',
  },
  {
    icon: '👁️',
    title: 'Our Vision',
    text: 'To become the most trusted tourism brand connecting travellers with authentic cultural, spiritual, and natural experiences across Tamil Nadu.',
  },
  {
    icon: '🌿',
    title: 'Sustainability',
    // NOTE: Use double quotes to avoid apostrophe conflict
    text: "Committed to eco-friendly tourism that protects Tamil Nadu's heritage, wildlife, and natural landscapes for future generations.",
  },
  {
    icon: '🤝',
    title: 'Community',
    text: 'Empowering local guides, artisans, and small businesses — ensuring tourism benefits every community we visit.',
  },
]

const HIGHLIGHTS = [
  { label: 'Heritage & Temple Tours' },
  { label: 'Eco & Nature Tourism' },
  { label: 'Coastal Beach Experiences' },
  { label: 'Curated Travel Trails' },
  { label: 'Wellness & Ayurveda' },
  { label: 'Photography Tours' },
  { label: 'Culinary Experiences' },
  { label: 'Adventure Tourism' },
]

// Place one.jpeg and two.jpeg in frontend/public/
const LEADERSHIP = [
  {
    name: 'Sanjay',
    role: 'Founder & Chairman',
    img: '/two.jpeg',
    fallback: 'https://i.pravatar.cc/200?img=33',
    desc: 'A visionary leader with 20+ years of experience in tourism and heritage conservation. He founded Vaigai Tourism to promote Tamil Nadu globally.',
    socials: [
      { icon: 'linkedin', href: '#' },
      { icon: 'twitter',  href: '#' },
    ],
  },
  {
    name: 'Ilayaraja',
    role: 'Co-Founder & Managing Director',
    img: '/one.jpeg',
    fallback: 'https://i.pravatar.cc/200?img=52',
    desc: 'An expert in travel planning and sustainable tourism, he ensures every journey with Vaigai Tourism is authentic and memorable.',
    socials: [
      { icon: 'linkedin',  href: '#' },
      { icon: 'instagram', href: '#' },
    ],
  },
]

// ─── ANIMATION VARIANTS ──────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: 'easeOut' },
  }),
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function About() {
  const [heroRef,      heroIn]      = useInView({ triggerOnce: true, threshold: 0.1 })
  const [storyRef,     storyIn]     = useInView({ triggerOnce: true, threshold: 0.1 })
  const [mvRef,        mvIn]        = useInView({ triggerOnce: true, threshold: 0.05 })
  const [highlightRef, highlightIn] = useInView({ triggerOnce: true, threshold: 0.05 })
  const [leaderRef,    leaderIn]    = useInView({ triggerOnce: true, threshold: 0.05 })

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="pt-20"
    >

      {/* ══════════════════ HERO ══════════════════ */}
      <div className="bg-gradient-to-r from-gold to-gold-light py-16 text-center" ref={heroRef}>
        <motion.div initial="hidden" animate={heroIn ? 'visible' : 'hidden'} variants={fadeUp}>
          <span className="inline-block bg-teal/10 text-teal text-xs font-semibold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">
            Our Story
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-teal">About Vaigai Tourism</h1>
          <p className="font-body text-teal/70 mt-3 text-lg">Exploring the Heart of Tamil Nadu since 2020</p>
        </motion.div>
      </div>

      {/* ══════════════════ WHO WE ARE ══════════════════ */}
      <section className="py-20 bg-white" ref={storyRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* Text column */}
            <motion.div initial="hidden" animate={storyIn ? 'visible' : 'hidden'} variants={fadeUp}>
              <span className="inline-block bg-gold/10 text-gold-dark font-body font-semibold text-sm px-4 py-1.5 rounded-full mb-4 tracking-wider uppercase">
                Who We Are
              </span>
              <h2 className="font-display text-4xl font-bold text-teal leading-tight mb-6">
                Dedicated to Showcasing<br />Tamil Nadu&apos;s Soul
              </h2>
              <p className="font-body text-gray-500 leading-relaxed mb-4">
                Vaigai Tourism Board is a premier tourism organization dedicated to showcasing the
                cultural heritage, natural beauty, and spiritual richness of Tamil Nadu. Inspired
                by the historic Vaigai River, we promote sustainable tourism while preserving the
                traditions and values of our land.
              </p>
              <p className="font-body text-gray-500 leading-relaxed mb-8">
                Established in{' '}
                <strong className="text-teal">2020</strong>, Vaigai Tourism operates as a
                collaborative initiative between the Government of Tamil Nadu and private tourism
                stakeholders to create truly memorable travel experiences.
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-0 border border-gray-100 rounded-2xl overflow-hidden">
                {STATS.map((s, i) => (
                  <div
                    key={i}
                    className={`py-5 px-3 text-center ${i < 3 ? 'border-r border-gray-100' : ''}`}
                  >
                    <p className="font-display text-2xl font-bold text-gold">{s.number}</p>
                    <p className="text-xs text-gray-400 font-body mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Image collage */}
            <motion.div
              initial="hidden"
              animate={storyIn ? 'visible' : 'hidden'}
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.7 } } }}
              className="relative h-[420px] hidden lg:block"
            >
              <img
                src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=640&q=80"
                alt="Meenakshi Temple"
                className="absolute top-0 left-0 w-[72%] h-[290px] object-cover rounded-2xl shadow-xl"
              />
              <img
                src="https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=400&q=80"
                alt="Kanyakumari"
                className="absolute bottom-0 right-0 w-[52%] h-[210px] object-cover rounded-2xl shadow-xl border-4 border-white"
              />
              <img
                src="https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=400&q=80"
                alt="Ooty"
                className="absolute bottom-16 left-2 w-[42%] h-[170px] object-cover rounded-2xl shadow-xl border-4 border-white"
              />
              <div className="absolute top-4 right-4 bg-gold text-teal text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                ★ Top Rated 2024
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════ MISSION & VISION ══════════════════ */}
      <section className="py-20 bg-gray-50" ref={mvRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <motion.div
            className="text-center mb-14"
            initial="hidden" animate={mvIn ? 'visible' : 'hidden'} variants={fadeUp}
          >
            <span className="inline-block bg-gold/10 text-gold-dark font-body font-semibold text-sm px-4 py-1.5 rounded-full mb-4 tracking-wider uppercase">
              What Drives Us
            </span>
            <h2 className="section-title">Our Mission &amp; Vision</h2>
            <p className="section-subtitle">The principles that guide every journey we craft.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MV_BOXES.map((box, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate={mvIn ? 'visible' : 'hidden'}
                className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="text-4xl mb-5">{box.icon}</div>
                <h3 className="font-display text-xl font-bold text-teal mb-3">{box.title}</h3>
                <p className="font-body text-gray-500 text-sm leading-relaxed">{box.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ WHY CHOOSE US ══════════════════ */}
      <section className="py-20 bg-white" ref={highlightRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <motion.div
            className="text-center mb-14"
            initial="hidden" animate={highlightIn ? 'visible' : 'hidden'} variants={fadeUp}
          >
            <span className="inline-block bg-gold/10 text-gold-dark font-body font-semibold text-sm px-4 py-1.5 rounded-full mb-4 tracking-wider uppercase">
              Why Choose Vaigai
            </span>
            <h2 className="section-title">What We Offer</h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {HIGHLIGHTS.map((h, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate={highlightIn ? 'visible' : 'hidden'}
                className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-4 hover:bg-gold/10 hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-8 h-8 bg-gold/15 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gold transition-colors">
                  <FaCheck size={12} className="text-gold group-hover:text-teal" />
                </div>
                <span className="font-body text-sm font-medium text-gray-700">{h.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ LEADERSHIP ══════════════════ */}
      <section className="py-20 bg-gray-50" ref={leaderRef}>
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          <motion.div
            className="text-center mb-14"
            initial="hidden" animate={leaderIn ? 'visible' : 'hidden'} variants={fadeUp}
          >
            <span className="inline-block bg-gold/10 text-gold-dark font-body font-semibold text-sm px-4 py-1.5 rounded-full mb-4 tracking-wider uppercase">
              Leadership
            </span>
            <h2 className="section-title">Meet Our Leadership</h2>
            <p className="section-subtitle">
              The passionate people who built Vaigai Tourism from the ground up.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row justify-center gap-10 flex-wrap">
            {LEADERSHIP.map((person, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate={leaderIn ? 'visible' : 'hidden'}
                className="bg-white rounded-2xl shadow-lg p-8 text-center w-full sm:w-72 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 flex flex-col items-center"
              >
                {/* Circular gold-bordered image */}
                <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-gold shadow-lg mb-5 flex-shrink-0">
                  <img
                    src={person.img}
                    alt={person.name}
                    onError={e => { e.target.onerror = null; e.target.src = person.fallback }}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <h3 className="font-display text-xl font-bold text-gray-900 mb-1">{person.name}</h3>
                <span className="text-gold-dark font-body font-bold text-sm mb-4 block">{person.role}</span>
                <p className="font-body text-gray-500 text-sm leading-relaxed mb-5">{person.desc}</p>

                <div className="flex justify-center gap-3">
                  {person.socials.map((s, si) => (
                    <a
                      key={si}
                      href={s.href}
                      className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gold flex items-center justify-center transition-colors text-gray-600 hover:text-teal"
                    >
                      <i className={`fa-brands fa-${s.icon} text-sm`}></i>
                    </a>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ CTA ══════════════════ */}
      <section className="py-20 bg-gradient-to-r from-teal to-teal/80 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
            Ready to Explore Tamil Nadu?
          </h2>
          <p className="font-body text-white/70 text-lg mb-8 max-w-xl mx-auto">
            Book your dream trip today. We handle every detail so you can simply enjoy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/packages" className="btn-primary">Browse All Packages</Link>
            <Link to="/contact"  className="btn-outline">Contact Us</Link>
          </div>
        </motion.div>
      </section>

    </motion.div>
  )
}
