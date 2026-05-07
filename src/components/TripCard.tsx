import { Voyage } from "@/types";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import VoyageStatusBadge from "./VoyageStatusBadge";
import { Plane, Hotel, Utensils, Users, Wifi, MapPin, Star } from "lucide-react";

interface TripCardProps {
  voyage: Voyage;
  index?: number;
}

const getStageIcon = (stageName: string) => {
  const lowerName = stageName.toLowerCase();
  if (lowerName.includes("mecque") || lowerName.includes("makkah") || lowerName.includes("mecca")) {
    return "🕋";
  }
  if (lowerName.includes("medine") || lowerName.includes("madinah") || lowerName.includes("medina")) {
    return "🕌";
  }
  return null;
};

const getFeatureIcon = (feature: string) => {
  const lowerFeature = feature.toLowerCase();
  if (lowerFeature.includes("vol") || lowerFeature.includes("avion") || lowerFeature.includes("billet")) {
    return <Plane size={12} />;
  }
  if (lowerFeature.includes("hôtel") || lowerFeature.includes("hotel")) {
    return <Hotel size={12} />;
  }
  if (lowerFeature.includes("inclusive") || lowerFeature.includes("pension") || lowerFeature.includes("repas")) {
    return <Utensils size={12} />;
  }
  if (lowerFeature.includes("guide") || lowerFeature.includes("francophone")) {
    return <Users size={12} />;
  }
  if (lowerFeature.includes("wifi") || lowerFeature.includes("internet")) {
    return <Wifi size={12} />;
  }
  if (lowerFeature.includes("tour") || lowerFeature.includes("visite") || lowerFeature.includes("croisière")) {
    return <MapPin size={12} />;
  }
  if (lowerFeature.includes("*") || lowerFeature.includes("étoile")) {
    return <Star size={12} />;
  }
  return null;
};

const TripCard = ({ voyage, index = 0 }: TripCardProps) => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(75, 44, 127, 0.15)" }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 25,
        delay: index * 0.08,
      }}
    >
      <Link to={`/voyage/${voyage.id}`}>
        <div className="group rounded-2xl bg-white overflow-hidden shadow-card hover:shadow-elegant border border-transparent hover:border-accent transition-all duration-300 cursor-pointer">
          <div className="aspect-[4/3] overflow-hidden relative">
            <img
              src={voyage.imageUrl}
              alt={voyage.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <span className="absolute top-4 left-4 text-upperspace bg-background/90 backdrop-blur-sm px-3 py-1 rounded-md text-primary text-xs font-semibold">
              {voyage.category}
            </span>
            <VoyageStatusBadge status={voyage.status} />
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">{voyage.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 whitespace-pre-wrap break-words">{voyage.description}</p>

            {/* Points Forts (Features) */}
            {voyage.features && voyage.features.length > 0 && (
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {voyage.features.slice(0, 5).map((feature, idx) => {
                    const icon = getFeatureIcon(feature);
                    return (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full text-xs font-medium"
                      >
                        {icon}
                        <span>{feature}</span>
                      </span>
                    );
                  })}
                  {voyage.features.length > 5 && (
                    <span className="inline-flex items-center bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-medium">
                      +{voyage.features.length - 5}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Affichage des étapes si disponibles */}
            {voyage.stages && voyage.stages.length > 0 && (
              <div className="mb-4 space-y-2 pb-4 border-b border-gray-200">
                {voyage.stages.slice(0, 2).map((stage) => {
                  const icon = getStageIcon(stage.name);
                  return (
                    <div key={stage.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                      {icon && <span>{icon}</span>}
                      <span className="font-medium">{stage.name}</span>
                      <span className="text-gray-400">•</span>
                      <span>{stage.days}j</span>
                    </div>
                  );
                })}
                {voyage.stages.length > 2 && (
                  <p className="text-xs text-accent font-medium">
                    +{voyage.stages.length - 2} étape{voyage.stages.length - 2 > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            )}

            {/* Section Tarifs */}
            <div className="mb-4 pb-4 border-b border-gray-200">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Tarifs à partir de</p>
              <div className="space-y-1.5">
                {voyage.priceAdult && voyage.priceAdult > 0 ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Adulte :</span>
                    <span className="text-sm font-semibold" style={{ color: "#D4AF37" }}>
                      {voyage.priceAdult.toLocaleString("fr-FR")} DA
                    </span>
                  </div>
                ) : null}
                {voyage.priceChild && voyage.priceChild > 0 ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Enfant :</span>
                    <span className="text-sm font-semibold text-accent">
                      {voyage.priceChild.toLocaleString("fr-FR")} DA
                    </span>
                  </div>
                ) : null}
                {(!voyage.priceAdult || voyage.priceAdult === 0) && (!voyage.priceChild || voyage.priceChild === 0) ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Prix :</span>
                    <span className="text-sm font-semibold text-accent">Sur devis</span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex items-center justify-between">
              {voyage.category === "Voyage à la Carte" ? (
                <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-md font-medium">
                  Sur mesure
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">{voyage.duration}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default TripCard;
