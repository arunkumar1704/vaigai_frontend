import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FaStar,
  FaClock,
  FaRupeeSign,
  FaArrowRight,
  FaCheck,
  FaFilter,
} from "react-icons/fa";
import { getPackages, resolveMediaUrl } from "../../api";

const TN_DESTINATIONS = [
  "Madurai",
  "Rameswaram",
  "Kanyakumari",
  "Ooty",
  "Kodaikanal",
  "Thanjavur",
  "Velankanni",
  "Courtallam",
  "Multiple Cities",
];
const KL_DESTINATIONS = [
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

export default function PackagesSection({ limit }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const queryDest = searchParams.get("destination") || "All";
  const [activeFilter, setActiveFilter] = useState(queryDest);

  useEffect(() => {
    const d = searchParams.get("destination") || "All";
    setActiveFilter(d);
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await getPackages();
        if (!active) return;
        setPackages(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.message || "Failed to load packages");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const allDestinations = useMemo(() => {
    const names = packages
      .map((pkg) => String(pkg.destination || "").trim())
      .filter(Boolean);

    return Array.from(new Set(["All", "Tamil Nadu", "Kerala", ...names]));
  }, [packages]);

  const handleFilter = (dest) => {
    setActiveFilter(dest);
    if (dest === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ destination: dest });
    }
  };

  const filteredPackages = useMemo(() => {
    const filtered = packages.filter((p) => {
      if (activeFilter === "All") return true;
      if (activeFilter === "Tamil Nadu")
        return TN_DESTINATIONS.includes(p.destination);
      if (activeFilter === "Kerala")
        return KL_DESTINATIONS.includes(p.destination);
      return String(p.destination || "")
        .toLowerCase()
        .includes(activeFilter.toLowerCase());
    });
    return limit ? filtered.slice(0, limit) : filtered;
  }, [packages, activeFilter, limit]);

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block bg-teal/10 text-teal font-body font-semibold text-sm px-4 py-1.5 rounded-full mb-4 tracking-wider uppercase">
            Curated Experiences
          </span>
          <h2 className="section-title">
            Tour <span className="text-gold italic">Packages</span>
          </h2>
          <p className="section-subtitle">
            Handcrafted itineraries that blend culture, adventure, and comfort
            for every traveler.
          </p>
        </motion.div>

        {!limit && (
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25 }}
          >
            {allDestinations.map((dest) => (
              <button
                key={dest}
                onClick={() => handleFilter(dest)}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 ${
                  activeFilter === dest
                    ? "bg-gold text-teal shadow-md shadow-gold/30"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gold/10 hover:text-teal hover:border-gold/30"
                }`}
              >
                {dest === "All" && <FaFilter size={10} />}
                {dest}
              </button>
            ))}
          </motion.div>
        )}

        {!limit && !loading && !error && (
          <p className="text-center text-gray-400 text-sm mb-8 font-body">
            Showing{" "}
            <strong className="text-teal">{filteredPackages.length}</strong>{" "}
            package{filteredPackages.length !== 1 ? "s" : ""}
            {activeFilter !== "All" ? ` for "${activeFilter}"` : ""}
          </p>
        )}

        {loading && (
          <div className="text-center py-16 text-gray-500">
            Loading packages...
          </div>
        )}
        {!loading && error && (
          <div className="text-center py-16 text-red-500">{error}</div>
        )}

        {!loading && !error && filteredPackages.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">No packages found</p>
            <button
              onClick={() => handleFilter("All")}
              className="mt-4 btn-primary text-sm"
            >
              View All Packages
            </button>
          </div>
        )}

        {!loading && !error && filteredPackages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg, i) => (
              <motion.div
                key={pkg._id || pkg.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-400 flex flex-col"
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <div className="relative overflow-hidden h-52">
                  <img
                    src={resolveMediaUrl(pkg.image)}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {pkg.badge && (
                    <div className="absolute top-3 left-3 bg-gold text-teal text-xs font-bold px-3 py-1 rounded-full shadow">
                      {pkg.badge}
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-teal text-white text-xs font-medium px-3 py-1 rounded-full">
                    {pkg.category || "Tour"}
                  </div>
                  <div className="absolute bottom-3 left-3 text-white font-body text-sm">
                    <span className="text-gold font-semibold">
                      {pkg.destination}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col flex-1 p-5">
                  <h3 className="font-display text-xl font-bold text-teal">
                    {pkg.name}
                  </h3>
                  <p className="text-gray-400 text-xs font-body mt-0.5 mb-3">
                    {pkg.subtitle}
                  </p>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <FaClock size={12} className="text-gold" />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <FaStar size={12} className="text-gold" />
                      <span>
                        {pkg.rating || 4.5} ({pkg.reviews || 0})
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-2">
                      Highlights
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {toList(pkg.highlights)
                        .slice(0, 3)
                        .map((h) => (
                          <span
                            key={h}
                            className="flex items-center gap-1 text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-md"
                          >
                            <FaCheck size={8} className="text-gold" />
                            {h}
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {toList(pkg.includes)
                      .slice(0, 3)
                      .map((inc) => (
                        <span
                          key={inc}
                          className="text-xs bg-teal/5 text-teal px-2 py-1 rounded-md border border-teal/10"
                        >
                          {inc}
                        </span>
                      ))}
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div>
                      <div className="flex items-center gap-1 text-teal">
                        <FaRupeeSign size={14} />
                        <span className="font-display font-bold text-2xl">
                          {Number(pkg.price || 0).toLocaleString("en-IN")}
                        </span>
                      </div>
                      {pkg.originalPrice ? (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-xs line-through">
                            INR{" "}
                            {Number(pkg.originalPrice).toLocaleString("en-IN")}
                          </span>
                          <span className="text-green-500 text-xs font-semibold">
                            {Math.round(
                              (1 -
                                Number(pkg.price || 0) /
                                  Number(pkg.originalPrice || 1)) *
                                100,
                            )}
                            % off
                          </span>
                        </div>
                      ) : null}
                      <div className="text-gray-400 text-xs">per person</div>
                    </div>

                    <Link
                      to={`/book/${pkg._id || pkg.id}`}
                      className="btn-primary text-sm py-2.5 px-5"
                    >
                      Book Now <FaArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {limit && (
          <div className="text-center mt-12">
            <Link to="/packages" className="btn-primary text-base px-8 py-4">
              View All Packages <FaArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
