import Layout from "@/components/Layout";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Hotel, Map, FileText, Zap, Briefcase, ArrowRight, CheckCircle, Upload, Pencil, MapPin } from "lucide-react";
import { toast } from "sonner";
import LoginModal from "@/components/LoginModal";

type ServiceType = "hotel" | "sejour" | "visa" | null;
type VisaType = "e-visa" | "dossier" | null;

// Comprehensive list of popular travel destinations (same as BilletteriePage)
const DESTINATIONS = [
  "Alger, Algérie", "Oran, Algérie", "Constantine, Algérie", "Annaba, Algérie",
  "Paris, France", "Lyon, France", "Marseille, France", "Nice, France", "Toulouse, France",
  "Istanbul, Turquie", "Ankara, Turquie", "Antalya, Turquie",
  "Dubai, Émirats Arabes Unis", "Abu Dhabi, Émirats Arabes Unis",
  "Le Caire, Égypte", "Alexandrie, Égypte", "Sharm El-Sheikh, Égypte", "Hurghada, Égypte",
  "Tunis, Tunisie", "Djerba, Tunisie", "Sousse, Tunisie",
  "Casablanca, Maroc", "Marrakech, Maroc", "Rabat, Maroc", "Fès, Maroc", "Tanger, Maroc",
  "Londres, Royaume-Uni", "Manchester, Royaume-Uni", "Édimbourg, Royaume-Uni",
  "Madrid, Spain", "Barcelone, Espagne", "Séville, Espagne", "Valence, Espagne",
  "Rome, Italie", "Milan, Italie", "Venise, Italie", "Florence, Italie", "Naples, Italie",
  "Berlin, Allemagne", "Munich, Allemagne", "Francfort, Allemagne", "Hambourg, Allemagne",
  "Amsterdam, Pays-Bas", "Rotterdam, Pays-Bas",
  "Bruxelles, Belgique", "Anvers, Belgique",
  "Vienne, Autriche", "Salzbourg, Autriche",
  "Zurich, Suisse", "Genève, Suisse", "Berne, Suisse",
  "Lisbonne, Portugal", "Porto, Portugal",
  "Athènes, Grèce", "Thessalonique, Grèce", "Santorin, Grèce",
  "Prague, République Tchèque", "Budapest, Hongrie", "Varsovie, Pologne",
  "Stockholm, Suède", "Copenhague, Danemark", "Oslo, Norvège", "Helsinki, Finlande",
  "Moscou, Russie", "Saint-Pétersbourg, Russie",
  "New York, États-Unis", "Los Angeles, États-Unis", "Chicago, États-Unis", "Miami, États-Unis", "San Francisco, États-Unis",
  "Toronto, Canada", "Montréal, Canada", "Vancouver, Canada",
  "Mexico, Mexique", "Cancún, Mexique",
  "São Paulo, Brésil", "Rio de Janeiro, Brésil",
  "Buenos Aires, Argentine",
  "Tokyo, Japon", "Osaka, Japon", "Kyoto, Japon",
  "Séoul, Corée du Sud", "Busan, Corée du Sud",
  "Pékin, Chine", "Shanghai, Chine", "Hong Kong, Chine", "Guangzhou, Chine",
  "Bangkok, Thaïlande", "Phuket, Thaïlande", "Chiang Mai, Thaïlande",
  "Singapour", "Kuala Lumpur, Malaisie",
  "Jakarta, Indonésie", "Bali, Indonésie",
  "Manille, Philippines", "Cebu, Philippines",
  "Hanoï, Vietnam", "Ho Chi Minh, Vietnam",
  "Mumbai, Inde", "Delhi, Inde", "Bangalore, Inde", "Goa, Inde",
  "Dubaï, Émirats Arabes Unis", "Doha, Qatar", "Riyad, Arabie Saoudite", "Jeddah, Arabie Saoudite",
  "Beyrouth, Liban", "Amman, Jordanie",
  "Tel Aviv, Israël", "Jérusalem, Israël",
  "Nairobi, Kenya", "Le Cap, Afrique du Sud", "Johannesburg, Afrique du Sud",
  "Sydney, Australie", "Melbourne, Australie", "Brisbane, Australie",
  "Auckland, Nouvelle-Zélande",
];

const DevisPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeService, setActiveService] = useState<ServiceType>(null);
  const [visaType, setVisaType] = useState<VisaType>(null);
  
  // Refs for autocomplete
  const cityInputRef = useRef<HTMLInputElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  
  // Ref for form section (auto-scroll)
  const formRef = useRef<HTMLDivElement>(null);
  
  // Autocomplete state
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  
  // Personal Info (Pre-filled from session)
  const [personalInfo, setPersonalInfo] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: ""
  });

  // Hotel Form - Enhanced with new fields
  const [hotelForm, setHotelForm] = useState({
    hotelPreference: "specific", // "specific" or "suggest"
    hotelName: "",
    hotelCategory: "",
    city: "",
    dateArrivee: "",
    dateDepart: "",
    nombreChambres: "1",
    nombrePersonnes: "1",
    roomType: "",
    boardBasis: "",
    message: ""
  });

  // Séjour à la Carte Form
  const [sejourForm, setSejourForm] = useState({
    destination: "",
    budget: "",
    duree: "",
    preferences: ""
  });

  // Visa Form
  const [visaForm, setVisaForm] = useState({
    pays: "",
    duree: "",
    passportFile: null as File | null,
    photoFile: null as File | null
  });

  const countries = [
    "France", "Canada", "USA", "Royaume-Uni", "Allemagne", 
    "Espagne", "Italie", "Turquie", "Émirats Arabes Unis", "Arabie Saoudite"
  ];

  const countryRequirements: Record<string, string[]> = {
    "France": [
      "Passeport valide (minimum 6 mois)",
      "2 photos d'identité récentes",
      "Justificatif de domicile",
      "Attestation d'assurance voyage",
      "Relevés bancaires (3 derniers mois)",
      "Lettre d'invitation ou réservation d'hôtel"
    ],
    "Canada": [
      "Passeport valide",
      "Formulaire de demande complété",
      "Photos biométriques",
      "Preuve de fonds suffisants",
      "Lettre d'invitation (si applicable)",
      "Certificat de police"
    ],
    "USA": [
      "Passeport valide",
      "Formulaire DS-160",
      "Photo format US",
      "Preuve de liens avec le pays d'origine",
      "Relevés bancaires",
      "Lettre d'employeur"
    ]
  };

  // Load user data on mount
  useEffect(() => {
    const currentUserStr = localStorage.getItem("currentUser");
    if (currentUserStr) {
      try {
        const currentUser = JSON.parse(currentUserStr);
        setIsLoggedIn(true);
        setPersonalInfo({
          nom: currentUser.nom || "",
          prenom: currentUser.prenom || "",
          email: currentUser.email || "",
          telephone: currentUser.phone || ""
        });
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    }
  }, []);

  // Handle city autocomplete
  const handleCityChange = (value: string) => {
    setHotelForm({ ...hotelForm, city: value });
    
    if (value.trim().length > 0) {
      const filtered = DESTINATIONS.filter(dest =>
        dest.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 10);
      setFilteredCities(filtered);
      setShowCityDropdown(filtered.length > 0);
    } else {
      setFilteredCities([]);
      setShowCityDropdown(false);
    }
  };

  const handleCitySelect = (city: string) => {
    setHotelForm({ ...hotelForm, city });
    setShowCityDropdown(false);
    setFilteredCities([]);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target as Node) &&
        cityInputRef.current &&
        !cityInputRef.current.contains(event.target as Node)
      ) {
        setShowCityDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleServiceClick = (service: string) => {
    if (service === "voyage") {
      navigate("/dashboard/voyages");
      return;
    }
    
    setActiveService(service as ServiceType);
    setVisaType(null);
    
    // Auto-scroll to form section after a brief delay for state update
    setTimeout(() => {
      if (formRef.current) {
        const yOffset = -80; // Offset for fixed header (adjust as needed)
        const element = formRef.current;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleVisaTypeClick = (type: VisaType) => {
    setVisaType(type);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      setShowLoginModal(true);
      toast.info("Connectez-vous pour envoyer votre demande");
      return;
    }

    console.log("Service:", activeService);
    console.log("Personal Info:", personalInfo);
    
    if (activeService === "hotel") {
      console.log("Hotel Form:", hotelForm);
    } else if (activeService === "sejour") {
      console.log("Séjour Form:", sejourForm);
    } else if (activeService === "visa") {
      console.log("Visa Type:", visaType);
      console.log("Visa Form:", visaForm);
    }

    toast.success("Votre demande a été envoyée avec succès !");
    
    // Reset
    setTimeout(() => {
      setActiveService(null);
      setVisaType(null);
      setHotelForm({ hotelPreference: "specific", hotelName: "", hotelCategory: "", city: "", dateArrivee: "", dateDepart: "", nombreChambres: "1", nombrePersonnes: "1", roomType: "", boardBasis: "", message: "" });
      setSejourForm({ destination: "", budget: "", duree: "", preferences: "" });
      setVisaForm({ pays: "", duree: "", passportFile: null, photoFile: null });
    }, 2000);
  };

  const services = [
    { id: "voyage", title: "Voyage Organisé", description: "Circuits tout compris", icon: Users },
    { id: "hotel", title: "Réservation d'Hôtel", description: "Hébergements adaptés", icon: Hotel },
    { id: "sejour", title: "Séjour à la Carte", description: "Voyage personnalisé", icon: Map },
    { id: "visa", title: "Assistant Visa", description: "Accompagnement visa", icon: FileText }
  ];

  return (
    <Layout>
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-slate-50 to-white min-h-screen">
        <div className="container mx-auto px-6 sm:px-8 lg:px-8 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full mb-4">
              <FileText size={20} />
              <span className="text-sm font-semibold uppercase tracking-wider">Devis Gratuit</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary">
              Demandez Votre Devis
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Remplissez vos informations et sélectionnez le service souhaité
            </p>
          </motion.div>

          {/* Personal Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-primary">Informations Personnelles</h2>
              {isLoggedIn && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-green-600 font-medium">✓ Pré-remplies</span>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Nom *</label>
                <input
                  type="text"
                  value={personalInfo.nom}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, nom: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all ${
                    isLoggedIn ? "bg-primary/5 border-primary/30 cursor-not-allowed" : "border-slate-200 focus:border-primary"
                  }`}
                  placeholder="Votre nom"
                  readOnly={isLoggedIn}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Prénom *</label>
                <input
                  type="text"
                  value={personalInfo.prenom}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, prenom: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all ${
                    isLoggedIn ? "bg-primary/5 border-primary/30 cursor-not-allowed" : "border-slate-200 focus:border-primary"
                  }`}
                  placeholder="Votre prénom"
                  readOnly={isLoggedIn}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Email *</label>
                <input
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all ${
                    isLoggedIn ? "bg-primary/5 border-primary/30 cursor-not-allowed" : "border-slate-200 focus:border-primary"
                  }`}
                  placeholder="votre@email.com"
                  readOnly={isLoggedIn}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Téléphone *</label>
                <input
                  type="tel"
                  value={personalInfo.telephone}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, telephone: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all ${
                    isLoggedIn ? "bg-primary/5 border-primary/30 cursor-not-allowed" : "border-slate-200 focus:border-primary"
                  }`}
                  placeholder="0549059432"
                  readOnly={isLoggedIn}
                />
              </div>
            </div>

            {!isLoggedIn && (
              <p className="text-sm text-primary font-medium mt-4 text-center">
                💡 <button onClick={() => setShowLoginModal(true)} className="underline">Connectez-vous</button> pour pré-remplir vos informations
              </p>
            )}
          </motion.div>

          {/* Service Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-primary mb-6 text-center">Choisissez Votre Service</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {services.map((service, index) => {
                const Icon = service.icon;
                const isActive = activeService === service.id;

                return (
                  <motion.button
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleServiceClick(service.id)}
                    className={`group relative bg-white rounded-2xl p-6 border-2 transition-all duration-300 text-left ${
                      isActive
                        ? "border-primary shadow-2xl scale-105"
                        : "border-slate-200 hover:border-accent hover:shadow-xl"
                    }`}
                  >
                    <div className={`w-14 h-14 mb-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center transition-transform ${
                      isActive ? "scale-110" : "group-hover:scale-110"
                    }`}>
                      <Icon size={28} className="text-primary" />
                    </div>

                    <h3 className={`text-lg font-bold mb-2 ${isActive ? "text-primary" : "text-slate-800"}`}>
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-600">{service.description}</p>

                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 right-4 w-6 h-6 bg-accent rounded-full flex items-center justify-center"
                      >
                        <CheckCircle size={16} className="text-primary" />
                      </motion.div>
                    )}

                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-accent transform transition-transform rounded-b-2xl ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`} />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Dynamic Forms */}
          <AnimatePresence mode="wait">
            {activeService && (
              <motion.form
                ref={formRef}
                key={activeService}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSubmit}
                className="overflow-hidden"
              >
                {/* Hotel Form */}
                {activeService === "hotel" && (
                  <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 mb-6">
                    <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                      <Hotel size={20} />
                      Détails de la Réservation
                    </h3>

                    {/* Radio Button Group - Hotel Preference */}
                    <div className="mb-6 p-4 bg-slate-50 rounded-xl border-2 border-slate-200">
                      <label className="block text-sm font-semibold text-primary mb-3">Préférence d'hôtel *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setHotelForm({ ...hotelForm, hotelPreference: "specific", hotelCategory: "" });
                          }}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                            hotelForm.hotelPreference === "specific"
                              ? "border-primary bg-primary/5 shadow-md"
                              : "border-slate-300 bg-white hover:border-primary/50"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            hotelForm.hotelPreference === "specific"
                              ? "border-primary"
                              : "border-slate-400"
                          }`}>
                            {hotelForm.hotelPreference === "specific" && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-3 h-3 rounded-full bg-primary"
                              />
                            )}
                          </div>
                          <span className={`text-sm font-medium ${
                            hotelForm.hotelPreference === "specific" ? "text-primary" : "text-slate-700"
                          }`}>
                            J'ai un hôtel spécifique
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setHotelForm({ ...hotelForm, hotelPreference: "suggest", hotelName: "" });
                          }}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                            hotelForm.hotelPreference === "suggest"
                              ? "border-primary bg-primary/5 shadow-md"
                              : "border-slate-300 bg-white hover:border-primary/50"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            hotelForm.hotelPreference === "suggest"
                              ? "border-primary"
                              : "border-slate-400"
                          }`}>
                            {hotelForm.hotelPreference === "suggest" && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-3 h-3 rounded-full bg-primary"
                              />
                            )}
                          </div>
                          <span className={`text-sm font-medium ${
                            hotelForm.hotelPreference === "suggest" ? "text-primary" : "text-slate-700"
                          }`}>
                            Proposez-moi un hôtel
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Conditional: Hotel Name (Only if "specific" is selected) */}
                      <AnimatePresence>
                        {hotelForm.hotelPreference === "specific" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <label className="block text-sm font-semibold text-primary mb-2">Nom de l'hôtel</label>
                            <input
                              type="text"
                              value={hotelForm.hotelName}
                              onChange={(e) => setHotelForm({ ...hotelForm, hotelName: e.target.value })}
                              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                              placeholder="Ex: Hilton Paris"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Conditional: Hotel Category (Only if "suggest" is selected) */}
                      <AnimatePresence>
                        {hotelForm.hotelPreference === "suggest" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <label className="block text-sm font-semibold text-primary mb-2">Catégorie d'hôtel</label>
                            <select
                              value={hotelForm.hotelCategory}
                              onChange={(e) => setHotelForm({ ...hotelForm, hotelCategory: e.target.value })}
                              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                            >
                              <option value="">Sélectionner</option>
                              <option value="2-stars">⭐⭐ - 2 Étoiles</option>
                              <option value="3-stars">⭐⭐⭐ - 3 Étoiles</option>
                              <option value="4-stars">⭐⭐⭐⭐ - 4 Étoiles</option>
                              <option value="5-stars">⭐⭐⭐⭐⭐ - 5 Étoiles</option>
                              <option value="luxury">💎 - Luxe</option>
                            </select>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="relative">
                        <label className="block text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                          <MapPin size={16} />
                          Ville/Destination *
                        </label>
                        <div className="relative">
                          <input
                            ref={cityInputRef}
                            type="text"
                            value={hotelForm.city}
                            onChange={(e) => handleCityChange(e.target.value)}
                            onFocus={() => {
                              if (hotelForm.city.trim().length > 0) {
                                const filtered = DESTINATIONS.filter(dest =>
                                  dest.toLowerCase().includes(hotelForm.city.toLowerCase())
                                ).slice(0, 10);
                                setFilteredCities(filtered);
                                setShowCityDropdown(filtered.length > 0);
                              }
                            }}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                            placeholder="Ex: Paris, Istanbul, Dubai..."
                            autoComplete="off"
                            required
                          />
                          
                          {/* Autocomplete Dropdown */}
                          <AnimatePresence>
                            {showCityDropdown && filteredCities.length > 0 && (
                              <motion.div
                                ref={cityDropdownRef}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute z-50 w-full mt-1 bg-white border-2 border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                              >
                                {filteredCities.map((city, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleCitySelect(city)}
                                    className="w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors border-b border-slate-100 last:border-b-0 flex items-center gap-2 text-sm"
                                  >
                                    <MapPin size={14} className="text-primary flex-shrink-0" />
                                    <span className="text-gray-700">{city}</span>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-primary mb-2">Date d'arrivée *</label>
                        <input
                          type="date"
                          value={hotelForm.dateArrivee}
                          onChange={(e) => setHotelForm({ ...hotelForm, dateArrivee: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-primary mb-2">Date de départ *</label>
                        <input
                          type="date"
                          value={hotelForm.dateDepart}
                          onChange={(e) => setHotelForm({ ...hotelForm, dateDepart: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-primary mb-2">Nombre de chambres</label>
                        <input
                          type="number"
                          min="1"
                          value={hotelForm.nombreChambres}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              setHotelForm({ ...hotelForm, nombreChambres: "" });
                            } else {
                              const numValue = parseInt(value);
                              setHotelForm({ ...hotelForm, nombreChambres: String(numValue >= 1 ? numValue : 1) });
                            }
                          }}
                          onBlur={(e) => {
                            if (e.target.value === "" || parseInt(e.target.value) < 1) {
                              setHotelForm({ ...hotelForm, nombreChambres: "1" });
                            }
                          }}
                          onFocus={(e) => e.target.select()}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-primary mb-2">Nombre de personnes</label>
                        <input
                          type="number"
                          min="1"
                          value={hotelForm.nombrePersonnes}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              setHotelForm({ ...hotelForm, nombrePersonnes: "" });
                            } else {
                              const numValue = parseInt(value);
                              setHotelForm({ ...hotelForm, nombrePersonnes: String(numValue >= 1 ? numValue : 1) });
                            }
                          }}
                          onBlur={(e) => {
                            if (e.target.value === "" || parseInt(e.target.value) < 1) {
                              setHotelForm({ ...hotelForm, nombrePersonnes: "1" });
                            }
                          }}
                          onFocus={(e) => e.target.select()}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-primary mb-2">Type de chambre</label>
                        <select
                          value={hotelForm.roomType}
                          onChange={(e) => setHotelForm({ ...hotelForm, roomType: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        >
                          <option value="">Sélectionner</option>
                          <option value="simple">Chambre Simple (Single)</option>
                          <option value="double">Chambre Double (Double)</option>
                          <option value="triple">Chambre Triple (Triple)</option>
                          <option value="quadruple">Chambre Quadruple (Quad)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-primary mb-2">Pension</label>
                        <select
                          value={hotelForm.boardBasis}
                          onChange={(e) => setHotelForm({ ...hotelForm, boardBasis: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        >
                          <option value="">Sélectionner</option>
                          <option value="breakfast">Petit déjeuner (Bed & Breakfast)</option>
                          <option value="half-board">Demi-pension (Half Board)</option>
                          <option value="full-board">Pension complète (Full Board)</option>
                          <option value="all-inclusive">All Inclusive</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-primary mb-2">Message / Demandes particulières</label>
                        <textarea
                          value={hotelForm.message}
                          onChange={(e) => setHotelForm({ ...hotelForm, message: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[120px] resize-y"
                          placeholder="Décrivez vos besoins spécifiques, préférences d'étage, vue, équipements particuliers..."
                          maxLength={1000}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Séjour à la Carte Form */}
                {activeService === "sejour" && (
                  <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 mb-6">
                    <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                      <Map size={20} />
                      Votre Séjour Personnalisé
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-primary mb-2">Destination souhaitée *</label>
                        <input
                          type="text"
                          value={sejourForm.destination}
                          onChange={(e) => setSejourForm({ ...sejourForm, destination: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary"
                          placeholder="Ex: Bali, Indonésie"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-primary mb-2">Budget estimé</label>
                        <input
                          type="text"
                          value={sejourForm.budget}
                          onChange={(e) => setSejourForm({ ...sejourForm, budget: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary"
                          placeholder="Ex: 2000€ - 3000€"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-primary mb-2">Durée du séjour</label>
                        <input
                          type="text"
                          value={sejourForm.duree}
                          onChange={(e) => setSejourForm({ ...sejourForm, duree: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary"
                          placeholder="Ex: 7 jours / 6 nuits"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-primary mb-2">Préférences particulières</label>
                        <textarea
                          value={sejourForm.preferences}
                          onChange={(e) => setSejourForm({ ...sejourForm, preferences: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary min-h-[120px]"
                          placeholder="Activités souhaitées, type de repas, hébergement préféré..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Visa Form */}
                {activeService === "visa" && (
                  <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 mb-6">
                    <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                      <FileText size={20} />
                      Assistant Visa
                    </h3>

                    {/* Visa Type Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-primary mb-3">Type de visa *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => handleVisaTypeClick("e-visa")}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            visaType === "e-visa"
                              ? "border-accent bg-accent/10"
                              : "border-slate-200 hover:border-accent/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Zap size={24} className={visaType === "e-visa" ? "text-accent" : "text-slate-600"} />
                            <div>
                              <h4 className="font-bold text-primary">Visa Électronique</h4>
                              <p className="text-sm text-slate-600">Processus digital simple</p>
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleVisaTypeClick("dossier")}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            visaType === "dossier"
                              ? "border-accent bg-accent/10"
                              : "border-slate-200 hover:border-accent/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Briefcase size={24} className={visaType === "dossier" ? "text-accent" : "text-slate-600"} />
                            <div>
                              <h4 className="font-bold text-primary">Visa Dossier</h4>
                              <p className="text-sm text-slate-600">Préparation professionnelle</p>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Visa Fields */}
                    {visaType && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-semibold text-primary mb-2">Pays de destination *</label>
                          <select
                            value={visaForm.pays}
                            onChange={(e) => setVisaForm({ ...visaForm, pays: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary"
                            required
                          >
                            <option value="">Sélectionner un pays</option>
                            {countries.map((country) => (
                              <option key={country} value={country}>{country}</option>
                            ))}
                          </select>
                        </div>

                        {visaType === "e-visa" && (
                          <>
                            <div>
                              <label className="block text-sm font-semibold text-primary mb-2">Durée demandée</label>
                              <input
                                type="text"
                                value={visaForm.duree}
                                onChange={(e) => setVisaForm({ ...visaForm, duree: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary"
                                placeholder="Ex: 30 jours"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-semibold text-primary mb-2">Copie du passeport</label>
                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer">
                                  <Upload size={32} className="mx-auto text-slate-400 mb-2" />
                                  <p className="text-sm text-slate-600">Cliquez pour télécharger</p>
                                  <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => setVisaForm({ ...visaForm, passportFile: e.target.files?.[0] || null })}
                                    className="hidden"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-primary mb-2">Photo d'identité</label>
                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer">
                                  <Upload size={32} className="mx-auto text-slate-400 mb-2" />
                                  <p className="text-sm text-slate-600">Cliquez pour télécharger</p>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setVisaForm({ ...visaForm, photoFile: e.target.files?.[0] || null })}
                                    className="hidden"
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {visaType === "dossier" && visaForm.pays && countryRequirements[visaForm.pays] && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-primary/5 rounded-xl p-6 border-2 border-primary/20"
                          >
                            <h4 className="font-bold text-primary mb-4">Documents requis pour {visaForm.pays}</h4>
                            <ul className="space-y-2">
                              {countryRequirements[visaForm.pays].map((req, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                                  <CheckCircle size={16} className="text-accent mt-0.5 flex-shrink-0" />
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    className="group inline-flex items-center justify-center gap-3 bg-accent text-primary px-10 py-5 rounded-2xl font-bold text-lg hover:bg-accent/90 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    Envoyer ma demande
                    <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} editMode={true} />
    </Layout>
  );
};

export default DevisPage;
