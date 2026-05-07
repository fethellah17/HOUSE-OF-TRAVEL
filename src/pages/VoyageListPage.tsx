import Layout from "@/components/Layout";
import TripCard from "@/components/TripCard";
import { useData } from "@/contexts/DataContext";
import { VoyageCategory } from "@/types";
import { motion } from "framer-motion";
import { Plane, Camera, Map } from "lucide-react";

interface VoyageListPageProps {
  category: VoyageCategory;
  title: string;
  description: string;
}

const VoyageListPage = ({ category, title, description }: VoyageListPageProps) => {
  const { voyages } = useData();
  const trips = voyages.filter((v) => v.category === category);

  return (
    <Layout>
      <section className="relative min-h-screen py-24 overflow-hidden bg-white">
        {/* Floating Decorative Icons - Background Layer with Forced Visibility */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Icon 1: Plane - Top Left */}
          <motion.div
            animate={{ 
              y: [0, -20, 0], 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.08, 1] 
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-20 left-5 md:top-32 md:left-12"
            style={{
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              willChange: 'transform'
            }}
          >
            <Plane className="w-12 h-12 md:w-20 md:h-20 lg:w-24 lg:h-24 text-purple-600/20" />
          </motion.div>

          {/* Icon 2: Camera - Mid Right */}
          <motion.div
            animate={{ 
              y: [0, -20, 0], 
              rotate: [0, -8, 8, 0],
              scale: [1, 1.1, 1] 
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1 
            }}
            className="absolute top-40 right-8 md:top-56 md:right-16"
            style={{
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              willChange: 'transform'
            }}
          >
            <Camera className="w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 text-yellow-500/20" />
          </motion.div>

          {/* Icon 3: Map - Bottom Left */}
          <motion.div
            animate={{ 
              y: [0, -20, 0], 
              rotate: [0, 12, -12, 0],
              scale: [1, 1.06, 1] 
            }}
            transition={{ 
              duration: 9, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 2 
            }}
            className="absolute bottom-32 left-8 md:bottom-48 md:left-20"
            style={{
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              willChange: 'transform'
            }}
          >
            <Map className="w-14 h-14 md:w-20 md:h-20 lg:w-28 lg:h-28 text-purple-600/20" />
          </motion.div>

          {/* Icon 4: Plane - Bottom Right (Additional) */}
          <motion.div
            animate={{ 
              y: [0, -20, 0], 
              rotate: [0, -10, 10, 0],
              scale: [1, 1.09, 1] 
            }}
            transition={{ 
              duration: 11, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 3 
            }}
            className="absolute bottom-20 right-12 md:bottom-32 md:right-24"
            style={{
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              willChange: 'transform'
            }}
          >
            <Plane className="w-11 h-11 md:w-18 md:h-18 lg:w-22 lg:h-22 text-yellow-500/20" />
          </motion.div>
        </div>

        {/* Content Layer - Higher z-index */}
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          {/* Title & Subtitle "Reveal" Animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-12"
          >
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-upperspace text-primary mb-2"
            >
              {category}
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              className="text-3xl md:text-4xl font-medium mb-4"
            >
              {title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="text-muted-foreground max-w-lg"
            >
              {description}
            </motion.p>
          </motion.div>

          {/* Staggered Card Entrance */}
          {trips.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.12
                  }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {trips.map((v, i) => (
                <motion.div
                  key={v.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <TripCard voyage={v} index={i} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16 bg-muted/30 rounded-2xl"
            >
              <p className="text-muted-foreground">
                Aucun voyage ne correspond à vos critères. Découvrez toutes nos offres.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default VoyageListPage;
