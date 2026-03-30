import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaYoutube, FaWhatsapp, FaTwitter, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

const socialLinks = [
  { icon: FaFacebook,  href: 'https://facebook.com',                      label: 'Facebook' },
  { icon: FaInstagram, href: 'https://instagram.com/vaigai_tourism',       label: 'Instagram' },
  { icon: FaTwitter,   href: 'https://twitter.com',                        label: 'Twitter' },
  { icon: FaYoutube,   href: 'https://youtube.com',                        label: 'YouTube' },
  { icon: FaWhatsapp,  href: 'https://wa.me/918778958663',                 label: 'WhatsApp' },
]

const quickLinks = [
  { to: '/',            label: 'Home' },
  { to: '/about',       label: 'About Us' },
  { to: '/destinations',label: 'Destinations' },
  { to: '/packages',    label: 'Tour Packages' },
  { to: '/contact',     label: 'Contact Us' },
  { to: '/admin/login', label: 'Admin Panel' },
]

const destinations = [
  'Madurai', 'Rameswaram', 'Kanyakumari',
  'Ooty', 'Kodaikanal', 'Thanjavur', 'Velankanni',
]

export default function Footer() {
  return (
    <footer className="bg-teal text-white relative overflow-hidden">

      {/* Decorative wave top */}
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0,30 C360,70 1080,-10 1440,30 L1440,0 L0,0 Z" fill="#F8F9FA" />
        </svg>
      </div>

      {/* Gold mountain decoration */}
      <div className="absolute bottom-0 left-0 right-0 opacity-10 pointer-events-none">
        <svg viewBox="0 0 1440 220" preserveAspectRatio="none" className="w-full h-40">
          <path
            d="M0,180 C120,150 300,80 500,120 C700,160 900,60 1100,80 C1250,95 1360,140 1440,130 L1440,220 L0,220 Z"
            fill="#F5C400"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-20 pb-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* ── Brand ── */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logovaigai.jpeg"
                alt="Vaigai Tourism"
                className="h-14 w-auto object-contain rounded-xl"
                onError={e => { e.target.style.display='none' }}
              />
            </div>

            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Vaigai Tourism Board — showcasing the cultural heritage, natural beauty, and
              spiritual richness of South Tamil Nadu since 2020.
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-gold hover:text-teal transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h4 className="text-gold font-body font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/60 hover:text-gold text-sm transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-gold text-xs">›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Destinations ── */}
          <div>
            <h4 className="text-gold font-body font-semibold text-sm uppercase tracking-wider mb-4">
              Destinations
            </h4>
            <ul className="space-y-2.5">
              {destinations.map(dest => (
                <li key={dest}>
                  <Link
                    to={`/packages?destination=${encodeURIComponent(dest)}`}
                    className="text-white/60 hover:text-gold text-sm transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-gold text-xs">›</span>
                    {dest}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h4 className="text-gold font-body font-semibold text-sm uppercase tracking-wider mb-4">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <FaMapMarkerAlt className="text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p>Raja Mill Road, Simmakal,</p>
                  <p>Madurai, Tamil Nadu – 625001</p>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Raja+Mill+Road,+Simmakal,+Madurai,+Tamil+Nadu+625001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold text-xs hover:underline mt-1 block"
                  >
                    Get Directions →
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <FaPhone className="text-gold flex-shrink-0" />
                <a href="tel:+918778958663" className="hover:text-gold transition-colors">
                  +91 8778958663
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <FaEnvelope className="text-gold flex-shrink-0" />
                <a href="mailto:vaigaitourism@gmail.com" className="hover:text-gold transition-colors">
                  vaigaitourism@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-white/40 text-sm">
          <p>© 2025 Vaigai Tourism Board. All rights reserved.</p>
          <p>Designed with ♥ for Tamil Nadu</p>
        </div>
      </div>
    </footer>
  )
}
