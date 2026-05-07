import Layout from "@/components/Layout";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight, Shield, Plane, Ticket, Hotel, Globe, CheckCircle, MapPin, ChevronLeft, ChevronRight, Map, Palmtree } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useData } from "@/contexts/DataContext";
import TripCard from "@/components/TripCard";

const Index = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.3 });
  const navigate = useNavigate();
  const { voyages } = useData();
  
  const photos = [
    "/photos/3.jpg",
    "/photos/4.jpg",
    "/photos/5.jpg",
    "/photos/6.jpg",
    "/photos/8.jpg"
  ];

  // Filter only "Voyage Organisé" trips dynamically
  const organizedTrips = voyages.filter(v => v.category === "Voyage Organisé");

  // Auto-advance slides: increment by 1 every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    }, 5000); // Stay on each image for 5 seconds

    return () => clearInterval(interval);
  }, [photos.length]);

  // Auto-advance carousel: every 4 seconds (works for any number of trips)
  useEffect(() => {
    if (organizedTrips.length === 0) return;
    
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev === organizedTrips.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [organizedTrips.length]);

  // Reset carousel index if it exceeds the number of trips (handles deletions)
  useEffect(() => {
    if (carouselIndex >= organizedTrips.length && organizedTrips.length > 0) {
      setCarouselIndex(0);
    }
  }, [organizedTrips.length, carouselIndex]);

  // Animated counter hook
  const useCounter = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isStatsInView) return;

      let startTime: number | null = null;
      const startValue = 0;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOutQuart * (end - startValue) + startValue));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, [isStatsInView, end, duration]);

    return count;
  };

  const ticketsCount = useCounter(10000, 2000);
  const visasCount = useCounter(5000, 2000);
  const destinationsCount = useCounter(200, 2000);

  // Carousel navigation (handles any number of trips)
  const handlePrevTrip = () => {
    if (organizedTrips.length === 0) return;
    setCarouselIndex((prev) => (prev === 0 ? organizedTrips.length - 1 : prev - 1));
  };

  const handleNextTrip = () => {
    if (organizedTrips.length === 0) return;
    setCarouselIndex((prev) => (prev === organizedTrips.length - 1 ? 0 : prev + 1));
  };

  // Get visible trips for desktop (3 at a time, sliding window)
  const getVisibleTrips = () => {
    if (organizedTrips.length === 0) return [];
    if (organizedTrips.length <= 3) return organizedTrips;
    
    const trips = [];
    for (let i = 0; i < 3; i++) {
      const index = (carouselIndex + i) % organizedTrips.length;
      trips.push(organizedTrips[index]);
    }
    return trips;
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <Layout>
      {/* Premium Hero Section - High-Performance Cross-Fade */}
      <section className="relative py-24 sm:py-28 lg:py-32 overflow-hidden bg-primary">
        {/* Static Layer Cross-Fade Container */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.5,
                ease: "easeInOut"
              }}
              className="absolute inset-0 w-full h-full"
              style={{
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                willChange: 'opacity'
              }}
            >
              <img
                src={photos[currentIndex]}
                alt=""
                loading={currentIndex === 0 ? "eager" : "lazy"}
                className="w-full h-full object-cover object-center"
                style={{
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Fixed Dark Overlay - Above Images, Below Text */}
        <div 
          className="absolute inset-0 bg-black/50 z-[1] pointer-events-none"
          style={{
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}
        />

        <div className="container mx-auto px-6 sm:px-8 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Eyebrow */}
            <motion.p 
              variants={fadeInUp}
              className="text-xs sm:text-sm uppercase tracking-wider text-white/90 font-bold mb-3 sm:mb-4 drop-shadow-md"
            >
              HOUSE OF TRAVEL
            </motion.p>

            {/* Main Headline - Mobile Optimized Typography */}
            <motion.h1 
              variants={fadeInUp}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-white drop-shadow-lg"
            >
              Voyagez avec Expertise,<br />
              <span className="text-accent drop-shadow-lg">Réservez avec Confiance</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p 
              variants={fadeInUp}
              className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md"
            >
              Votre partenaire privilégié pour les visas, les réservations d'hôtels, la billetterie internationale et les voyages organisés.
            </motion.p>

            {/* Premium CTA Buttons - Mobile Optimized (Full Width + Stacked) */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4"
            >
              {/* Primary CTA - Yellow with Purple Text - Full Width on Mobile */}
              <Link
                to="/devis"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-accent text-primary px-8 py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-accent/90 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 min-h-[56px]"
              >
                Demander un Devis Gratuit
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Secondary CTA - Purple - Full Width on Mobile */}
              <Link
                to="/billetterie"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-primary/90 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 min-h-[56px]"
              >
                Réserver votre Billet
                <Ticket size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Airline Partners Ribbon - GPU-Accelerated for Mobile */}
      <section className="py-10 bg-white border-y border-slate-100 overflow-hidden">
        <div className="container mx-auto px-6 sm:px-8 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs uppercase tracking-wider text-primary/40 font-semibold mb-6 text-center">
              Nos Compagnies Partenaires
            </p>
            
            <div className="relative overflow-hidden">
              <motion.div
                className="flex gap-4"
                animate={{
                  x: [0, -1920]
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 40,
                    ease: "linear"
                  }
                }}
                style={{
                  width: 'max-content',
                  willChange: 'transform',
                  transform: 'translate3d(0, 0, 0)'
                }}
              >
                {[
                  "AIR ALGERIE", "AIR FRANCE", "ROYAL AIR MAROC", "TUNIS AIR", 
                  "EMIRATS", "QATAR", "TURKISH AIRLINES", "ALITALIA", 
                  "VUELING", "Aigle azur",
                  "AIR ALGERIE", "AIR FRANCE", "ROYAL AIR MAROC", "TUNIS AIR", 
                  "EMIRATS", "QATAR", "TURKISH AIRLINES", "ALITALIA", 
                  "VUELING", "Aigle azur",
                  "AIR ALGERIE", "AIR FRANCE", "ROYAL AIR MAROC", "TUNIS AIR", 
                  "EMIRATS", "QATAR", "TURKISH AIRLINES", "ALITALIA", 
                  "VUELING", "Aigle azur"
                ].map((airline, index) => (
                  <div 
                    key={`${airline}-${index}`}
                    className="flex-shrink-0 flex items-center justify-center px-6 py-4 rounded-xl border border-slate-200 bg-white shadow-sm w-[160px] h-[80px]"
                    style={{
                      transform: 'translate3d(0, 0, 0)',
                      backfaceVisibility: 'hidden'
                    }}
                  >
                    <span className="text-sm font-bold text-slate-500 text-center leading-tight">
                      {airline}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Success Statistics Bar - Slim & Mobile-Optimized */}
      <section 
        ref={statsRef}
        className="py-6 sm:py-8 bg-gradient-to-r from-primary via-primary to-primary/90 border-y border-primary/20"
      >
        <div className="container mx-auto px-6 sm:px-8 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-3 gap-4 sm:gap-8 lg:gap-12"
          >
            {/* Stat 1: Billets Émis */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
                <Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-accent">
                  +{ticketsCount.toLocaleString()}
                </h3>
              </div>
              <p className="text-white/90 text-xs sm:text-sm font-medium">
                Billets Émis
              </p>
            </div>

            {/* Stat 2: Visas Approuvés */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-accent">
                  +{visasCount.toLocaleString()}
                </h3>
              </div>
              <p className="text-white/90 text-xs sm:text-sm font-medium">
                Visas Approuvés
              </p>
            </div>

            {/* Stat 3: Destinations */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-accent">
                  +{destinationsCount}
                </h3>
              </div>
              <p className="text-white/90 text-xs sm:text-sm font-medium">
                Destinations
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works / Our Services Section - Mobile Optimized */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-6 sm:px-8 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <p className="text-xs sm:text-sm uppercase tracking-wider text-accent font-bold mb-2 sm:mb-3">
              Nos Services
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-3 sm:mb-4">
              Comment Nous Vous Accompagnons
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Quatre services professionnels pour répondre à tous vos besoins de voyage
            </p>
          </motion.div>

          {/* Service Cards - Mobile: 1 Column, Tablet: 2x2, Desktop: 4 Columns */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            {/* Card 1: Visa Assistant */}
            <motion.div
              variants={fadeInUp}
              className="group relative bg-white rounded-2xl p-6 sm:p-8 border-2 border-slate-200 hover:border-accent hover:shadow-2xl transition-all duration-300 text-center"
            >
              {/* Icon - Centered */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 mb-5 sm:mb-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto">
                <Shield size={28} className="sm:w-8 sm:h-8 text-primary" />
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold text-primary mb-2 sm:mb-3">
                Visa
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Assistance experte pour vos dossiers de visa (Schengen, Canada, USA).
              </p>

              {/* Hover Indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl" />
            </motion.div>

            {/* Card 2: Hotels */}
            <motion.div
              variants={fadeInUp}
              className="group relative bg-white rounded-2xl p-6 sm:p-8 border-2 border-slate-200 hover:border-accent hover:shadow-2xl transition-all duration-300 text-center"
            >
              {/* Icon - Centered */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 mb-5 sm:mb-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto">
                <Hotel size={28} className="sm:w-8 sm:h-8 text-primary" />
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold text-primary mb-2 sm:mb-3">
                Hôtels
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Large choix d'hébergements adaptés à votre budget et vos préférences.
              </p>

              {/* Hover Indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl" />
            </motion.div>

            {/* Card 3: Billetterie */}
            <motion.div
              variants={fadeInUp}
              className="group relative bg-white rounded-2xl p-6 sm:p-8 border-2 border-slate-200 hover:border-accent hover:shadow-2xl transition-all duration-300 text-center"
            >
              {/* Icon - Centered */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 mb-5 sm:mb-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto">
                <Plane size={28} className="sm:w-8 sm:h-8 text-primary" />
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold text-primary mb-2 sm:mb-3">
                Billetterie
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Les meilleurs tarifs pour vos vols nationaux et internationaux.
              </p>

              {/* Hover Indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl" />
            </motion.div>

            {/* Card 4: Voyage Organisé */}
            <motion.div
              variants={fadeInUp}
              className="group relative bg-white rounded-2xl p-6 sm:p-8 border-2 border-slate-200 hover:border-accent hover:shadow-2xl transition-all duration-300 text-center"
            >
              {/* Icon - Centered */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 mb-5 sm:mb-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto">
                <Globe size={28} className="sm:w-8 sm:h-8 text-primary" />
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold text-primary mb-2 sm:mb-3">
                Voyage Organisé
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Des circuits sur mesure pour explorer le monde en toute sérénité.
              </p>

              {/* Hover Indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Voyage Organisé Preview Section - Optimized with Animations */}
      <section className="relative py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-purple-50 to-white overflow-hidden">
        {/* Floating Decorative Icons - Background */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 opacity-10 pointer-events-none hidden lg:block"
        >
          <Plane size={80} className="text-primary" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-40 right-20 opacity-10 pointer-events-none hidden lg:block"
        >
          <Map size={100} className="text-accent" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-40 left-1/4 opacity-10 pointer-events-none hidden lg:block"
        >
          <Palmtree size={90} className="text-primary" />
        </motion.div>

        <div className="container mx-auto px-6 sm:px-8 lg:px-8 relative z-10">
          {/* Section Header with Fade-in Up Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-xs sm:text-sm uppercase tracking-wider text-accent font-bold mb-2 sm:mb-3"
            >
              Nos Meilleures Offres
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-3 sm:mb-4"
            >
              Voyages Organisés
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Découvrez nos destinations phares avec des tarifs exceptionnels
            </motion.p>
          </motion.div>

          {/* Carousel Container - Optimized with Swipe Gestures */}
          {organizedTrips.length > 0 ? (
            <div className="relative max-w-6xl mx-auto">
              {/* Desktop: Show 3 cards in sliding window */}
              <div className="hidden lg:block">
                <div className="relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={carouselIndex}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="grid grid-cols-3 gap-8"
                    >
                      {getVisibleTrips().map((trip, index) => (
                        <motion.div
                          key={`${trip.id}-${index}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="pointer-events-none"
                        >
                          <TripCard voyage={trip} index={index} />
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Arrows - Desktop */}
                  {organizedTrips.length > 3 && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handlePrevTrip}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-white/90 hover:bg-white text-primary p-3 rounded-full shadow-lg hover:shadow-xl transition-all z-10"
                        aria-label="Voyage précédent"
                      >
                        <ChevronLeft size={24} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleNextTrip}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-white/90 hover:bg-white text-primary p-3 rounded-full shadow-lg hover:shadow-xl transition-all z-10"
                        aria-label="Voyage suivant"
                      >
                        <ChevronRight size={24} />
                      </motion.button>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile & Tablet: Show 1 card with swipe gestures */}
              <div className="lg:hidden relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={carouselIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = Math.abs(offset.x) * velocity.x;
                      if (swipe < -10000) {
                        handleNextTrip();
                      } else if (swipe > 10000) {
                        handlePrevTrip();
                      }
                    }}
                    className="pointer-events-auto cursor-grab active:cursor-grabbing"
                  >
                    <div className="pointer-events-none">
                      <TripCard voyage={organizedTrips[carouselIndex]} index={0} />
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows - Mobile */}
                {organizedTrips.length > 1 && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handlePrevTrip}
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white text-primary p-3 rounded-full shadow-lg hover:shadow-xl transition-all z-10"
                      aria-label="Voyage précédent"
                    >
                      <ChevronLeft size={24} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleNextTrip}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white text-primary p-3 rounded-full shadow-lg hover:shadow-xl transition-all z-10"
                      aria-label="Voyage suivant"
                    >
                      <ChevronRight size={24} />
                    </motion.button>
                  </>
                )}

                {/* Carousel Indicators - Mobile */}
                {organizedTrips.length > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    {organizedTrips.map((_, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCarouselIndex(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === carouselIndex
                            ? 'w-8 bg-primary'
                            : 'w-2 bg-primary/30 hover:bg-primary/50'
                        }`}
                        aria-label={`Aller au voyage ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Carousel Indicators - Desktop */}
              {organizedTrips.length > 1 && (
                <div className="hidden lg:flex justify-center gap-2 mt-8">
                  {organizedTrips.map((_, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setCarouselIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === carouselIndex
                          ? 'w-8 bg-primary'
                          : 'w-2 bg-primary/30 hover:bg-primary/50'
                      }`}
                      aria-label={`Aller au voyage ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground text-lg">
                Aucun voyage organisé disponible pour le moment.
              </p>
            </motion.div>
          )}

          {/* CTA Button with Animation */}
          {organizedTrips.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mt-12 sm:mt-16"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/voyage-organise')}
                className="group inline-flex items-center justify-center gap-3 bg-primary text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg hover:bg-primary/90 hover:shadow-2xl transition-all duration-300 w-full sm:w-auto min-h-[56px]"
              >
                Découvrez nos Voyages Organisés
                <Globe size={20} className="group-hover:rotate-12 transition-transform" />
              </motion.button>
              <p className="text-sm text-muted-foreground mt-3 font-arabic">
                استكشف رحلاتنا المنظمة
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Final CTA Section - Mobile Optimized */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 sm:px-8 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-primary">
              Prêt à Partir ?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-primary/70 mb-8 sm:mb-10 leading-relaxed max-w-xl mx-auto">
              Demandez votre devis gratuit et recevez une proposition personnalisée sous 24h.
            </p>
            <Link
              to="/devis"
              className="group inline-flex items-center justify-center gap-3 bg-accent text-primary px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg hover:bg-accent/90 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto min-h-[56px]"
            >
              Demander un Devis Gratuit
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
