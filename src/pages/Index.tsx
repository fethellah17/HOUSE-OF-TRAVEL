import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Plane, Ticket, Hotel, Globe } from "lucide-react";

const Index = () => {
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
      {/* Premium Hero Section - Mobile Optimized */}
      <section className="relative py-16 sm:py-20 lg:py-32 overflow-hidden bg-white">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #4B2C7F 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container mx-auto px-6 sm:px-8 lg:px-8 relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Eyebrow */}
            <motion.p 
              variants={fadeInUp}
              className="text-xs sm:text-sm uppercase tracking-wider text-accent font-bold mb-3 sm:mb-4"
            >
              HOUSE OF TRAVEL
            </motion.p>

            {/* Main Headline - Mobile Optimized Typography */}
            <motion.h1 
              variants={fadeInUp}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-primary"
            >
              Voyagez avec Expertise,<br />
              <span className="text-accent">Réservez avec Confiance</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p 
              variants={fadeInUp}
              className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed"
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
