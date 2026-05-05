import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Plane, Ticket, Star } from "lucide-react";

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
      <section className="relative py-16 sm:py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-white via-slate-50 to-white">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #0a2357 1px, transparent 0)`,
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
              className="text-xs sm:text-sm uppercase tracking-wider text-[#2C5F2D] font-bold mb-3 sm:mb-4"
            >
              HOUSE OF TRAVEL
            </motion.p>

            {/* Main Headline - Mobile Optimized Typography */}
            <motion.h1 
              variants={fadeInUp}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-[#0a2357]"
            >
              Voyagez avec Expertise,<br />
              <span className="text-[#2C5F2D]">Réservez avec Confiance</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p 
              variants={fadeInUp}
              className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Votre partenaire privilégié pour les visas, l'Omrah sur mesure et la billetterie internationale.
            </motion.p>

            {/* Premium CTA Buttons - Mobile Optimized (Full Width + Stacked) */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4"
            >
              {/* Primary CTA - Sage Green - Full Width on Mobile */}
              <Link
                to="/devis"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#2C5F2D] text-white px-8 py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-[#234d24] hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 min-h-[56px]"
              >
                Demander un Devis Gratuit
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Secondary CTA - Navy Blue - Full Width on Mobile */}
              <Link
                to="/billetterie"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#0a2357] text-white px-8 py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-[#081b42] hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 min-h-[56px]"
              >
                Réserver votre Billet
                <Ticket size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
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
            <p className="text-xs sm:text-sm uppercase tracking-wider text-[#2C5F2D] font-bold mb-2 sm:mb-3">
              Nos Services
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#0a2357] mb-3 sm:mb-4">
              Comment Nous Vous Accompagnons
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Trois services professionnels pour répondre à tous vos besoins de voyage
            </p>
          </motion.div>

          {/* Service Cards - Mobile: Single Column, Centered */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10"
          >
            {/* Card 1: Visa Assistant - Mobile Centered */}
            <motion.div
              variants={fadeInUp}
              className="group relative bg-white rounded-2xl p-6 sm:p-8 border-2 border-slate-200 hover:border-[#2C5F2D] hover:shadow-2xl transition-all duration-300 text-center"
            >
              {/* Icon - Centered */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 mb-5 sm:mb-6 rounded-xl bg-gradient-to-br from-[#2C5F2D]/10 to-[#2C5F2D]/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto">
                <Shield size={28} className="sm:w-8 sm:h-8 text-[#2C5F2D]" />
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold text-[#0a2357] mb-2 sm:mb-3">
                Visa Assistant
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Un accompagnement expert pour votre dossier de visa (Schengen, Canada, USA).
              </p>

              {/* Hover Indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2C5F2D] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl" />
            </motion.div>

            {/* Card 2: Omrah sur Mesure - Mobile Centered */}
            <motion.div
              variants={fadeInUp}
              className="group relative bg-white rounded-2xl p-6 sm:p-8 border-2 border-slate-200 hover:border-[#2C5F2D] hover:shadow-2xl transition-all duration-300 text-center"
            >
              {/* Icon - Centered */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 mb-5 sm:mb-6 rounded-xl bg-gradient-to-br from-[#2C5F2D]/10 to-[#2C5F2D]/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto">
                <Star size={28} className="sm:w-8 sm:h-8 text-[#2C5F2D]" />
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold text-[#0a2357] mb-2 sm:mb-3">
                Omrah sur Mesure
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Planifiez votre pèlerinage selon vos besoins : hôtels, dates, et vol.
              </p>

              {/* Hover Indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2C5F2D] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl" />
            </motion.div>

            {/* Card 3: Billetterie - Mobile Centered */}
            <motion.div
              variants={fadeInUp}
              className="group relative bg-white rounded-2xl p-6 sm:p-8 border-2 border-slate-200 hover:border-[#2C5F2D] hover:shadow-2xl transition-all duration-300 text-center"
            >
              {/* Icon - Centered */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 mb-5 sm:mb-6 rounded-xl bg-gradient-to-br from-[#2C5F2D]/10 to-[#2C5F2D]/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto">
                <Plane size={28} className="sm:w-8 sm:h-8 text-[#2C5F2D]" />
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold text-[#0a2357] mb-2 sm:mb-3">
                Billetterie
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Les meilleurs tarifs pour vos vols nationaux et internationaux.
              </p>

              {/* Hover Indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2C5F2D] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl" />
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-[#0a2357]">
              Prêt à Partir ?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-[#0a2357]/70 mb-8 sm:mb-10 leading-relaxed max-w-xl mx-auto">
              Demandez votre devis gratuit et recevez une proposition personnalisée sous 24h.
            </p>
            <Link
              to="/devis"
              className="group inline-flex items-center justify-center gap-3 bg-[#2C5F2D] text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg hover:bg-[#234d24] hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto min-h-[56px]"
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
