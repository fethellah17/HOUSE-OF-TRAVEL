import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, Clock, Plane, Hotel, Utensils, Users, Wifi, MapPin, Star, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/formatters";
import StageDisplay from "../components/StageDisplay";
import VoyageStatusBadge from "../components/VoyageStatusBadge";
import { useMetaTags } from "@/hooks/useMetaTags";
import logo from "@/assets/logo.png";
import { supabase } from "@/lib/supabase";

const getFeatureIcon = (feature: string) => {
  const lowerFeature = feature.toLowerCase();
  if (lowerFeature.includes("vol") || lowerFeature.includes("avion") || lowerFeature.includes("billet")) {
    return <Plane size={14} />;
  }
  if (lowerFeature.includes("hôtel") || lowerFeature.includes("hotel")) {
    return <Hotel size={14} />;
  }
  if (lowerFeature.includes("inclusive") || lowerFeature.includes("pension") || lowerFeature.includes("repas")) {
    return <Utensils size={14} />;
  }
  if (lowerFeature.includes("guide") || lowerFeature.includes("francophone")) {
    return <Users size={14} />;
  }
  if (lowerFeature.includes("wifi") || lowerFeature.includes("internet")) {
    return <Wifi size={14} />;
  }
  if (lowerFeature.includes("tour") || lowerFeature.includes("visite") || lowerFeature.includes("croisière")) {
    return <MapPin size={14} />;
  }
  if (lowerFeature.includes("*") || lowerFeature.includes("étoile")) {
    return <Star size={14} />;
  }
  return null;
};

const VoyageDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { voyages } = useData();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [supabaseVoyage, setSupabaseVoyage] = useState<any>(null);
  const [supabaseStages, setSupabaseStages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch voyage and stages from Supabase
  useEffect(() => {
    const fetchVoyageDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch voyage details
        const { data: voyageData, error: voyageError } = await supabase
          .from("voyages")
          .select("*")
          .eq("id", id)
          .single();

        if (voyageError) {
          console.error("❌ Error fetching voyage:", voyageError);
          setSupabaseVoyage(null);
        } else {
          console.log("✅ Fetched voyage from Supabase:", voyageData);
          setSupabaseVoyage(voyageData);
        }

        // Fetch voyage stages
        const { data: stagesData, error: stagesError } = await supabase
          .from("voyage_stages")
          .select("*")
          .eq("voyage_id", id)
          .order("stage_number", { ascending: true });

        if (stagesError) {
          console.error("❌ Error fetching stages:", stagesError);
          setSupabaseStages([]);
        } else {
          console.log("✅ Fetched stages from Supabase:", stagesData);
          // Map to frontend Stage format
          const mappedStages = stagesData.map((s: any) => ({
            id: s.id,
            name: s.name || s.city || "",
            hotelName: s.hotel_name || "",
            googleMapsUrl: s.google_maps_url || "",
            days: s.duration_days || 0,
            icon: s.icon || "default",
            description: s.description || "",
          }));
          setSupabaseStages(mappedStages);
        }
      } catch (err) {
        console.error("❌ Unexpected error fetching voyage details:", err);
        setSupabaseVoyage(null);
        setSupabaseStages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVoyageDetails();
  }, [id]);

  // Use Supabase data if available, fallback to context
  const contextVoyage = voyages.find((v) => v.id === id);
  const voyage = supabaseVoyage 
    ? {
        id: supabaseVoyage.id,
        title: supabaseVoyage.title,
        imageUrl: supabaseVoyage.image_url?.split(",")[0] || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
        imageUrls: supabaseVoyage.image_url?.includes(",") 
          ? supabaseVoyage.image_url.split(",") 
          : [supabaseVoyage.image_url],
        price: supabaseVoyage.price,
        description: supabaseVoyage.description || "",
        category: supabaseVoyage.category,
        duration: supabaseVoyage.duration || "",
        date: supabaseVoyage.start_date && supabaseVoyage.end_date
          ? `${new Date(supabaseVoyage.start_date).toLocaleDateString("fr-FR")} - ${new Date(supabaseVoyage.end_date).toLocaleDateString("fr-FR")}`
          : "",
        status: supabaseVoyage.status || "normal",
        stages: supabaseStages.length > 0 ? supabaseStages : undefined,
        points_forts: supabaseVoyage.points_forts || "",
        features: supabaseVoyage.points_forts 
          ? supabaseVoyage.points_forts.split(",").map((f: string) => f.trim()).filter(Boolean)
          : [],
      }
    : contextVoyage;

  const images = voyage?.imageUrls && voyage.imageUrls.length > 0 ? voyage.imageUrls : voyage ? [voyage.imageUrl] : [];
  const currentImage = images[currentImageIndex];

  // Configuration des meta tags pour SEO - MUST be called unconditionally at the top
  useMetaTags({
    title: voyage?.title || "Voyage",
    description: voyage?.description || "",
    image: images[0] || "",
    url: window.location.href,
    type: 'website'
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement du voyage...</p>
        </div>
      </div>
    );
  }

  if (!voyage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-primary mb-4">Voyage non trouvé</h1>
          <button
            onClick={() => navigate("/")}
            className="text-accent hover:text-accent/80 font-medium"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-accent/20 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => {
              // Vérifier s'il y a un historique, sinon aller à l'accueil
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate("/");
              }
            }}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="text-sm font-medium">Retour</span>
          </button>
          <img src={logo} alt="HOUSE OF TRAVEL" className="h-8 w-auto" />
          <div className="w-20" />
        </div>
      </div>

      {/* Galerie d'images - Conteneur centré et réduit */}
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Slider principal */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 mb-8 shadow-elegant">
            <motion.img
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={currentImage}
              alt={`${voyage.title} - Photo ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
            />
            
            {/* Badge de statut */}
            <VoyageStatusBadge status={voyage.status} />

            {/* Navigation galerie */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary p-2 rounded-full transition-all shadow-lg hover:shadow-xl"
                  aria-label="Image précédente"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary p-2 rounded-full transition-all shadow-lg hover:shadow-xl"
                  aria-label="Image suivante"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Indicateur de position */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {/* Miniatures */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-12 justify-center">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? "border-accent shadow-lg"
                      : "border-gray-200 hover:border-accent/50"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Miniature ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Informations du voyage */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <span className="inline-block text-upperspace bg-accent/10 text-accent px-3 py-1 rounded-md text-xs font-semibold mb-3">
                {voyage.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                {voyage.title}
              </h1>
              <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap break-words max-w-none">
                {voyage.description}
              </p>
            </div>

            {/* Points Forts du Voyage - Now from dedicated database column */}
            {voyage.features && voyage.features.length > 0 && (
              <div className="mb-8 pb-8 border-b border-accent/20">
                <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                  <Star size={24} className="text-accent" />
                  Points Forts
                </h2>
                <div className="flex flex-wrap gap-3">
                  {voyage.features.map((feature, idx) => {
                    const icon = getFeatureIcon(feature);
                    return (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 px-4 py-2.5 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-shadow"
                      >
                        {icon && <span className="text-purple-600">{icon}</span>}
                        <span>{feature}</span>
                      </motion.span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Détails */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-6 border-t border-b border-accent/20">
              <div className="flex items-start gap-3">
                <Calendar size={20} className="text-accent mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Dates</p>
                  {voyage.category === "Voyage à la Carte" ? (
                    <span className="inline-block text-xs bg-accent/10 text-accent px-2 py-1 rounded-md font-semibold">
                      Dates flexibles
                    </span>
                  ) : (
                    <p className="text-sm font-semibold text-primary">{voyage.date}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-accent mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Durée</p>
                  {voyage.category === "Voyage à la Carte" ? (
                    <span className="inline-block text-xs bg-accent/10 text-accent px-2 py-1 rounded-md font-semibold">
                      Sur mesure
                    </span>
                  ) : (
                    <p className="text-sm font-semibold text-primary">{voyage.duration}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-medium mb-2">Tarifs à partir de</p>
                  {voyage.price && voyage.price > 0 ? (
                    <span className="text-lg font-bold" style={{ color: "#D4AF37" }}>
                      {voyage.price.toLocaleString("fr-FR")} DA
                    </span>
                  ) : (
                    <span className="text-sm font-semibold text-accent">Sur devis</span>
                  )}
                </div>
              </div>
            </div>

            {/* Étapes du voyage (si disponibles) */}
            {voyage.stages && voyage.stages.length > 0 && (
              <div className="py-8 border-b border-accent/20">
                <h2 className="text-2xl font-bold text-primary mb-6">
                  Étapes du Voyage
                </h2>
                <StageDisplay
                  stages={voyage.stages}
                  isOmrah={voyage.category === "Omrah"}
                />
              </div>
            )}
          </div>

          {/* Carte de prix et CTA */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-24 bg-white rounded-2xl border-2 border-accent/30 p-6 shadow-card"
            >
              <div className="mb-6">
                <p className="text-xs text-muted-foreground font-medium mb-3">Tarifs à partir de</p>
                {voyage.price && voyage.price > 0 ? (
                  <span className="text-2xl font-bold" style={{ color: "#D4AF37" }}>
                    {voyage.price.toLocaleString("fr-FR")} DA
                  </span>
                ) : (
                  <span className="text-lg font-bold text-accent">Sur devis</span>
                )}
              </div>

              {/* Badge de statut proéminent */}
              {voyage.status && voyage.status !== 'normal' && (
                <div className="mb-6 flex justify-center">
                  <VoyageStatusBadge status={voyage.status} variant="detail" />
                </div>
              )}

              <button
                onClick={() => {
                  // Vérifier s'il y a un historique, sinon aller à l'accueil
                  if (window.history.length > 1) {
                    navigate(-1);
                  } else {
                    navigate("/");
                  }
                }}
                className="w-full bg-muted text-foreground px-6 py-3 rounded-lg font-semibold hover:bg-muted/80 transition-colors"
              >
                Retour
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoyageDetailPage;
