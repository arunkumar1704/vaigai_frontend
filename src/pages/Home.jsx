import { motion } from 'framer-motion'
import HeroSection from '../components/sections/HeroSection'
import DestinationsSection from '../components/sections/DestinationsSection'
import PackagesSection from '../components/sections/PackagesSection'
import WhyUsSection from '../components/sections/WhyUsSection'
import GallerySection from '../components/sections/GallerySection'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import NewsletterSection from '../components/sections/NewsletterSection'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}

export default function Home() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <HeroSection />
      <DestinationsSection limit={4} />
      <PackagesSection limit={3} />
      <WhyUsSection />
      <GallerySection />
      <TestimonialsSection />
      <NewsletterSection />
    </motion.div>
  )
}
