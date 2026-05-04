import Layout from "@/components/Layout";
import TripCard from "@/components/TripCard";
import CategoryFilter from "@/components/CategoryFilter";
import { useData } from "@/contexts/DataContext";
import { VoyageCategory } from "@/types";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Compass, Shield, HeartHandshake } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const { voyages } = useData();
  const [selectedCategory, setSelectedCategory] = useState<VoyageCategory | "Tous">("Tous");
  
  // Filtrer les voyages selon la catégorie sélectionnée
  const filteredVoyages = selectedCategory === "Tous" 
    ? voyages 
    : voyages.filter(v => v.category === selectedCategory);
  
  const featured = filteredVoyages.slice(0, 6); // Afficher jusqu'à 6 voyages

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-32 lg:py-40 overflow-hidden bg-background">
        <div className="container mx-auto px-4 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 25 }}
            className="max-w-2xl"
          >
            <p className="text-upperspace text-accent mb-4">HOUSE OF TRAVEL</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6 leading-tight">
              Votre pèlerinage commence par la confiance.
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Nous organisons vos voyages spirituels et touristiques avec soin, transparence et un accompagnement personnalisé.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/devis"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 hover:shadow-elegant active:scale-[0.98] transition-all duration-200"
              >
                Devis Gratuit <ArrowRight size={18} />
              </Link>
              <Link
                to="/omrah"
                className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-lg font-semibold hover:border-accent hover:text-primary transition-all duration-200"
              >
                Découvrir nos Omrah
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Separator line */}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="h-px bg-accent/30" />
      </div>

      {/* Values */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Shield, 
                title: "Votre Partenaire de Confiance", 
                desc: "HOUSE OF TRAVEL vous accompagne dans l'organisation de vos voyages nationaux, internationaux et Omra avec professionnalisme et passion. Explorez le monde avec l'esprit serein." 
              },
              { icon: Compass, title: "Accompagnement", desc: "Un guide francophone vous accompagne à chaque étape de votre voyage." },
              { icon: HeartHandshake, title: "Sur Mesure", desc: "Chaque voyage est adapté à vos besoins, votre budget et vos envies." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 150, damping: 25, delay: i * 0.1 }}
                className="text-center p-8"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-muted flex items-center justify-center">
                  <item.icon size={24} className="text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: item.desc }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Separator line */}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="h-px bg-accent/30" />
      </div>

      {/* Featured Trips */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <p className="text-upperspace text-accent mb-2">Nos Voyages</p>
              <h2 className="text-3xl md:text-4xl font-medium">Découvrez nos offres</h2>
            </div>
            <Link
              to="/voyage-organise"
              className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Voir tout <ArrowRight size={14} />
            </Link>
          </div>
          
          {/* Filtre de catégories */}
          <div className="mb-8">
            <CategoryFilter
              categories={["Omrah", "Voyage Organisé", "Voyage National", "Voyage à la Carte"]}
              active={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>
          
          {/* Grille de voyages */}
          {featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((v, i) => (
                <TripCard key={v.id} voyage={v} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-muted/30 rounded-2xl">
              <p className="text-muted-foreground">
                Aucun voyage disponible dans cette catégorie pour le moment.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-background border-t border-accent/30">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-medium mb-4">
            Prêt à partir ?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Demandez votre devis gratuit et recevez une proposition personnalisée sous 24h.
          </p>
          <Link
            to="/devis"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 hover:shadow-elegant active:scale-[0.98] transition-all duration-200"
          >
            Demander un Devis Gratuit <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
