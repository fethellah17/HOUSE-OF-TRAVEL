import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2, Plane } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { toast } from "sonner";
import LoginModal from "@/components/LoginModal";
import TravelModule from "@/components/TravelModule";
import VisaAssistantModule from "@/components/VisaAssistantModule";

interface DevisFormProps {
  prefilledDestination?: string;
  showLayout?: boolean;
}

type ServicePath = "" | "travel" | "visa";

interface FormData {
  // Personal Info
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  
  // Service Path
  servicePath: ServicePath;
  
  // Travel Path (Voyage Organisé / Omrah)
  travelType?: "omrah" | "voyage";
  
  // Omrah Configuration
  omrahHotelType?: "4stars" | "5stars";
  omrahDistance?: "close" | "medium";
  omrahRoomType?: "double" | "triple" | "quad";
  omrahRoomCount?: number;
  omrahAdultsCount?: number;
  omrahChildrenCount?: number;
  omrahChildrenAges?: string;
  omrahMealPlan?: "breakfast" | "half" | "full";
  omrahNeedVisa?: boolean;
  omrahFlightIncluded?: boolean;
  omrahDepartureDate?: string;
  omrahReturnDate?: string;
  
  // Voyage Organisé Configuration
  voyageDestination?: string;
  voyageBoardType?: "full" | "half";
  
  // Visa Path
  visaProfession?: string;
  visaDestination?: string;
  hasUsaVisa?: boolean;
  
  // Common
  message?: string;
}

const DevisForm = ({ prefilledDestination = "", showLayout = false }: DevisFormProps) => {
  const { addMessage } = useData();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const [formData, setFormData] = useState<FormData>({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    servicePath: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load user data on mount
  useEffect(() => {
    const loadUserData = () => {
      const currentUserStr = localStorage.getItem("currentUser");
      if (currentUserStr) {
        try {
          const currentUser = JSON.parse(currentUserStr);
          if (currentUser.nom && currentUser.prenom && currentUser.email) {
            setIsLoggedIn(true);
            setFormData((prev) => ({
              ...prev,
              nom: currentUser.nom || "",
              prenom: currentUser.prenom || "",
              email: currentUser.email || "",
              telephone: currentUser.phone || "",
            }));
            toast.success("Vos informations ont été pré-remplies !", { duration: 3000 });
          }
        } catch (error) {
          console.error("Error parsing current user:", error);
        }
      }
    };

    loadUserData();

    const handleProfileUpdate = () => loadUserData();
    const handleLogout = () => {
      setIsLoggedIn(false);
      setFormData((prev) => ({ ...prev, nom: "", prenom: "", email: "", telephone: "" }));
    };

    const handleLogin = () => {
      loadUserData();
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);
    window.addEventListener("userLoggedOut", handleLogout);
    window.addEventListener("userLoggedIn", handleLogin);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
      window.removeEventListener("userLoggedOut", handleLogout);
      window.removeEventListener("userLoggedIn", handleLogin);
    };
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    
    // Personal Info Validation
    if (!formData.nom.trim()) e.nom = "Le nom est obligatoire.";
    if (!formData.prenom.trim()) e.prenom = "Le prénom est obligatoire.";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      e.email = "Veuillez entrer un email valide.";
    }
    if (!formData.telephone.trim()) e.telephone = "Le téléphone est obligatoire.";
    
    // Service Path Validation
    if (!formData.servicePath) e.servicePath = "Veuillez choisir un service.";
    
    // Travel Path Validation
    if (formData.servicePath === "travel") {
      if (!formData.travelType) e.travelType = "Veuillez choisir un type de voyage.";
      
      if (formData.travelType === "omrah") {
        // Hotel Configuration
        if (!formData.omrahHotelType) e.omrahHotelType = "Type d'hôtel requis.";
        if (!formData.omrahDistance) e.omrahDistance = "Distance du Haram requise.";
        if (!formData.omrahRoomType) e.omrahRoomType = "Type de chambre requis.";
        if (!formData.omrahRoomCount || formData.omrahRoomCount < 1) {
          e.omrahRoomCount = "Nombre de chambres requis.";
        }
        
        // Passenger Management
        if (!formData.omrahAdultsCount || formData.omrahAdultsCount < 1) {
          e.omrahAdultsCount = "Nombre d'adultes requis.";
        }
        if (formData.omrahChildrenCount && formData.omrahChildrenCount > 0) {
          if (!formData.omrahChildrenAges?.trim()) {
            e.omrahChildrenAges = "Veuillez indiquer l'âge des enfants.";
          }
        }
        
        // Meal Plan
        if (!formData.omrahMealPlan) e.omrahMealPlan = "Type de pension requis.";
        
        // Logistics
        if (formData.omrahNeedVisa === undefined) {
          e.omrahNeedVisa = "Veuillez indiquer si vous avez besoin d'un visa.";
        }
        if (formData.omrahFlightIncluded === undefined) {
          e.omrahFlightIncluded = "Veuillez indiquer si le vol est inclus.";
        }
        
        // Dates
        if (!formData.omrahDepartureDate) e.omrahDepartureDate = "Date de départ requise.";
        if (!formData.omrahReturnDate) e.omrahReturnDate = "Date de retour requise.";
        
        // Date logic validation
        if (formData.omrahDepartureDate && formData.omrahReturnDate) {
          if (new Date(formData.omrahReturnDate) <= new Date(formData.omrahDepartureDate)) {
            e.omrahReturnDate = "La date de retour doit être après la date de départ.";
          }
        }
      }
      
      if (formData.travelType === "voyage") {
        if (!formData.voyageDestination) e.voyageDestination = "Destination requise.";
        if (!formData.voyageBoardType) e.voyageBoardType = "Type de pension requis.";
      }
    }
    
    // Visa Path Validation
    if (formData.servicePath === "visa") {
      if (!formData.visaProfession) e.visaProfession = "Profession requise.";
      if (!formData.visaDestination) e.visaDestination = "Destination requise.";
    }
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      localStorage.setItem("pendingRequest", JSON.stringify(formData));
      setShowLoginModal(true);
      toast.info("Presque fini ! Connectez-vous pour valider votre demande.", { duration: 4000 });
      return;
    }

    if (!validate()) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setStatus("loading");

    setTimeout(() => {
      const currentUserStr = localStorage.getItem("currentUser");
      let userInfo = {
        name: "Visiteur Anonyme",
        email: formData.email || "Non spécifié",
        phone: formData.telephone || "Non spécifié",
        isAnonymous: true,
      };

      if (currentUserStr) {
        try {
          const currentUser = JSON.parse(currentUserStr);
          userInfo = {
            name: currentUser.fullName || "Utilisateur",
            email: currentUser.email || formData.email,
            phone: currentUser.phone || formData.telephone,
            isAnonymous: false,
          };
        } catch (error) {
          console.error("Error parsing user:", error);
        }
      }

      const requestObject = {
        id: `req-${Date.now()}`,
        type: "Devis",
        userInfo: userInfo,
        formData: formData,
        timestamp: new Date().toISOString(),
        isRead: false,
      };

      const adminInbox = JSON.parse(localStorage.getItem("admin_inbox") || "[]");
      adminInbox.push(requestObject);
      localStorage.setItem("admin_inbox", JSON.stringify(adminInbox));

      addMessage({
        type: "Devis",
        name: formData.nom || "Non spécifié",
        email: formData.email || "Non spécifié",
        phone: formData.telephone || "Non spécifié",
        subject: `DEVIS GRATUIT - ${formData.servicePath === "travel" ? "Voyage" : "Visa"}`,
        content: formData.message || "Aucun message supplémentaire",
        devisDetails: {
          prenom: formData.prenom,
          destination: formData.voyageDestination || formData.visaDestination || "Non spécifié",
        },
      });

      setStatus("success");
      toast.success("Votre demande de devis a été envoyée avec succès !");

      setTimeout(() => {
        setFormData({
          nom: "",
          prenom: "",
          email: "",
          telephone: "",
          servicePath: "",
          message: "",
        });
        setStatus("idle");
      }, 2000);
    }, 1500);
  };

  const formContent = (
    <AnimatePresence mode="wait">
      {status === "success" ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 bg-white rounded-2xl shadow-xl border border-gray-200"
        >
          <CheckCircle size={64} className="mx-auto text-[#2C5F2D] mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-[#0a2357]">Demande Envoyée !</h2>
          <p className="text-muted-foreground">Notre équipe vous répondra dans les plus brefs délais.</p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Section 1: Personal Information */}
          <div>
            <div className="border-l-4 border-[#0a2357] pl-4 mb-6">
              <h2 className="text-2xl font-bold text-[#0a2357]">Informations Personnelles</h2>
              <p className="text-sm text-muted-foreground mt-1">Vos coordonnées pour vous contacter</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Nom *" error={errors.nom}>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className={`premium-input ${isLoggedIn ? "bg-blue-50 cursor-not-allowed" : ""}`}
                  placeholder="Votre nom"
                  readOnly={isLoggedIn}
                />
              </Field>

              <Field label="Prénom *" error={errors.prenom}>
                <input
                  type="text"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  className={`premium-input ${isLoggedIn ? "bg-blue-50 cursor-not-allowed" : ""}`}
                  placeholder="Votre prénom"
                  readOnly={isLoggedIn}
                />
              </Field>

              <Field label="Email *" error={errors.email}>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`premium-input ${isLoggedIn ? "bg-blue-50 cursor-not-allowed" : ""}`}
                  placeholder="exemple@email.com"
                  readOnly={isLoggedIn}
                />
              </Field>

              <Field label="Téléphone *" error={errors.telephone}>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className={`premium-input ${isLoggedIn ? "bg-blue-50 cursor-not-allowed" : ""}`}
                  placeholder="0549059432"
                  readOnly={isLoggedIn}
                />
              </Field>
            </div>
          </div>

          {/* Section 2: Service Choice (The Logic Gate) */}
          <div>
            <div className="border-l-4 border-[#2C5F2D] pl-4 mb-6">
              <h2 className="text-2xl font-bold text-[#0a2357]">Choisissez Votre Service</h2>
              <p className="text-sm text-muted-foreground mt-1">Sélectionnez le type de service souhaité</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.button
                type="button"
                onClick={() => setFormData({ ...formData, servicePath: "travel" })}
                className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                  formData.servicePath === "travel"
                    ? "border-[#2C5F2D] bg-[#2C5F2D]/5 shadow-lg"
                    : "border-gray-200 hover:border-[#2C5F2D]/50 hover:shadow-md"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Plane className="text-[#2C5F2D]" size={28} />
                  <h3 className="text-lg font-bold text-[#0a2357]">Voyage Organisé / Omrah</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Réservez votre voyage complet avec hébergement et services
                </p>
              </motion.button>

              <motion.button
                type="button"
                onClick={() => setFormData({ ...formData, servicePath: "visa" })}
                className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                  formData.servicePath === "visa"
                    ? "border-[#2C5F2D] bg-[#2C5F2D]/5 shadow-lg"
                    : "border-gray-200 hover:border-[#2C5F2D]/50 hover:shadow-md"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <svg
                    className="text-[#2C5F2D]"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M7 15h0M2 9.5h20" />
                  </svg>
                  <h3 className="text-lg font-bold text-[#0a2357]">Assistant Visa</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Assistance professionnelle pour votre dossier de visa
                </p>
              </motion.button>
            </div>
            {errors.servicePath && <p className="text-red-500 text-sm mt-2">{errors.servicePath}</p>}
          </div>

          {/* Dynamic Path Rendering */}
          <AnimatePresence mode="wait">
            {formData.servicePath === "travel" && (
              <TravelModule
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
            )}

            {formData.servicePath === "visa" && (
              <VisaAssistantModule
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
            )}
          </AnimatePresence>

          {/* Message Section */}
          {formData.servicePath && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="border-l-4 border-gray-300 pl-4 mb-6">
                <h2 className="text-xl font-bold text-[#0a2357]">Message Supplémentaire</h2>
                <p className="text-sm text-muted-foreground mt-1">Informations complémentaires (optionnel)</p>
              </div>

              <Field label="Votre message">
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="premium-input min-h-[120px] resize-y"
                  placeholder="Décrivez vos besoins spécifiques..."
                  maxLength={1000}
                />
              </Field>
            </motion.div>
          )}

          {/* Submit Button */}
          {formData.servicePath && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-[#2C5F2D] text-white px-8 py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Plane size={24} />
                    Confirmer ma Réservation
                  </>
                )}
              </button>

              {!isLoggedIn && (
                <p className="text-sm text-center text-blue-600 font-medium">
                  💡 Vous serez invité à vous connecter pour finaliser votre demande
                </p>
              )}
            </motion.div>
          )}
        </motion.form>
      )}
    </AnimatePresence>
  );

  if (showLayout) {
    return (
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="text-center mb-12">
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm uppercase tracking-wider text-[#2C5F2D] font-bold mb-2"
            >
              Devis Gratuit
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-4 text-[#0a2357]"
            >
              Demander un Devis Personnalisé
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg"
            >
              Remplissez le formulaire ci-dessous et recevez une proposition sur mesure sous 24h.
            </motion.p>
          </div>
          {formContent}
          <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} editMode={true} />
        </div>
      </section>
    );
  }

  return (
    <>
      {formContent}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} editMode={true} />
    </>
  );
};

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-sm font-semibold text-[#0a2357] mb-2">{label}</label>
    {children}
    {error && (
      <motion.p
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-red-500 text-xs mt-1 font-medium"
      >
        {error}
      </motion.p>
    )}
  </div>
);

export default DevisForm;
