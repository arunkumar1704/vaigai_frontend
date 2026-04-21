import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaStar, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
import { getPackages, resolveMediaUrl } from "../../api";

const KERALA_NAMES = [
  "Munnar",
  "Alleppey",
  "Varkala",
  "Thekkady",
  "Kovalam",
  "Wayanad",
  "Kumarakom",
  "Bekal",
  "Kochi",
  "Thiruvananthapuram",
  "Kerala",
];

const toList = (value) => (Array.isArray(value) ? value : []);

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

export default function DestinationsSection({ limit }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const loadPackages = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await getPackages();
        if (!active) return;
        setPackages(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.message || "Failed to load destinations");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadPackages();
    return () => {
      active = false;
    };
  }, []);

  const destinationItems = useMemo(() => {
    const groups = new Map();

    packages.forEach((pkg) => {
      const destination = String(pkg.destination || "").trim();
      if (!destination) return;

      if (!groups.has(destination)) {
        groups.set(destination, []);
      }

      groups.get(destination).push(pkg);
    });

    return Array.from(groups.entries()).map(([destination, group]) => {
      const primary = group[0];
      const ratings = group
        .map((pkg) => Number(pkg.rating))
        .filter((value) => Number.isFinite(value));
      const avgRating = ratings.length
        ? ratings.reduce((sum, value) => sum + value, 0) / ratings.length
        : 4.5;
      const categories = Array.from(
        new Set(group.map((pkg) => String(pkg.category || "").trim()).filter(Boolean)),
      );
      const highlights = group.flatMap((pkg) => toList(pkg.highlights));

      return {
        id: primary._id || primary.id || destination,
        name: destination,
        tagline:
          primary.subtitle ||
          primary.badge ||
          `${group.length} curated package${group.length !== 1 ? "s" : ""}`,
        description:
          highlights[0] ||
          primary.subtitle ||
          `Discover curated travel experiences for ${destination}.`,
        image: resolveMediaUrl(primary.image),
        category: categories[0] || "Tour",
        rating: avgRating.toFixed(1),
        tours: group.length,
      };
    });
  }, [packages]);

  const categories = useMemo(() => {
    const dynamicCategories = destinationItems
      .map((item) => item.category)
      .filter(Boolean);
    const allCategories = ["All", ...dynamicCategories];

    if (destinationItems.some((item) => KERALA_NAMES.includes(item.name))) {
      allCategories.push("Kerala");
    }

    return Array.from(new Set(allCategories));
  }, [destinationItems]);

  const filtered = useMemo(() => {
    const items = destinationItems.filter((dest) => {
      if (activeCategory === "All") return true;
      if (activeCategory === "Kerala") return KERALA_NAMES.includes(dest.name);
      return dest.category === activeCategory;
    });

    return limit ? items.slice(0, limit) : items;
  }, [activeCategory, destinationItems, limit]);

  const handleViewPackages = (event, destName) => {
    event.stopPropagation();
    navigate(`/packages?destination=${encodeURIComponent(destName)}`);
  };

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
            Explore Live Destinations
          </span>
          <h2 className="section-title">
            Iconic <span className="text-gold italic">Destinations</span>
          </h2>
          <p className="section-subtitle">
            This page is generated from your live tour packages, so destinations stay synced with the backend.
          </p>
        </motion.div>

        {!limit && (
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-gold text-teal shadow-md shadow-gold/30"
                    : "bg-gray-100 text-gray-600 hover:bg-gold/10 hover:text-teal"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        )}

        {loading && (
          <div className="text-center py-16 text-gray-500">Loading destinations...</div>
        )}
        {!loading && error && (
          <div className="text-center py-16 text-red-500">{error}</div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">No destinations found.</div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((dest, i) => (
              <motion.div
                key={dest.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
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
                    {String(dest.description).slice(0, 70)}...
                  </p>
                  <button
                    onClick={(event) => handleViewPackages(event, dest.name)}
                    className="mt-3 flex items-center gap-2 text-gold text-sm font-semibold opacity-80 group-hover:opacity-100 transition-all group-hover:gap-3"
                  >
                    View Packages <FaArrowRight size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

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
  );
}
