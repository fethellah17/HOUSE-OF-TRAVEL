import Layout from "@/components/Layout";
import LoginModal from "@/components/LoginModal";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2, Pencil, MapPin, Calendar, Users, Plane, ArrowLeftRight, ArrowRight, Ticket, Globe, Luggage, Map } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { toast } from "sonner";

const BilletteriePage = () => {
  const { addMessage } = useData();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUpdateFlash, setShowUpdateFlash] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    typeVoyage: "aller-retour",
    destination: "",
    besoinVisa: "",
    compagnie: "",
    nombreAdultes: "1",
    nombreEnfants: "0",
    ageEnfants: "",
    dateDepart: "",
    dateRetour: "",
    message: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  useEffect(() => {
    const loadUserData = () => {
      const currentUserStr = localStorage.getItem("currentUser");
      if (currentUserStr) {
        try {
          const currentUser = JSON.parse(currentUserStr);
          if (currentUser.nom && currentUser.prenom && currentUser.email) {
            setIsLoggedIn(true);
            setForm((prev) => ({
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
      setForm((prev) => ({ ...prev, nom: "", prenom: "", email: "", telephone: "" }));
    };

    const handleLogin = () => {
      const pendingRequest = localStorage.getItem("pendingRequest");
      if (pendingRequest) {
        try {
          const savedData = JSON.parse(pendingRequest);
          const currentUserStr = localStorage.getItem("currentUser");
          if (currentUserStr) {
            const currentUser = JSON.parse(currentUserStr);
            setForm({ ...savedData, nom: currentUser.nom || "", prenom: currentUser.prenom || "", email: currentUser.email || "", telephone: currentUser.phone || "" });
            setIsLoggedIn(true);
            setShowUpdateFlash(true);
            setTimeout(() => setShowUpdateFlash(false), 2000);
            localStorage.removeItem("pendingRequest");
            toast.success("Vos informations ont été restaurées !", { duration: 4000 });
          }
        } catch (error) {
          console.error("Error recovering pending request:", error);
        }
      } else {
        loadUserData();
      }
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

  // Auto-scroll animation - starts immediately on mount
  useEffect(() => {
    const animate = () => {
      if (scrollContainerRef.current && !isPaused) {
        const container = scrollContainerRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        // Seamless infinite loop
        if (container.scrollLeft >= maxScroll - 1) {
          container.scrollLeft = 0;
        } else {
          container.scrollLeft += 0.5;
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation immediately on mount
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPaused]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nom.trim()) e.nom = "Le nom est obligatoire.";
    if (!form.prenom.trim()) e.prenom = "Le prénom est obligatoire.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalide.";
    if (!form.telephone.trim()) e.telephone = "Le téléphone est obligatoire.";
    if (!form.destination.trim()) e.destination = "La destination est obligatoire.";
    if (!form.dateDepart) e.dateDepart = "La date de départ est obligatoire.";
    if (form.typeVoyage === "aller-retour" && !form.dateRetour) e.dateRetour = "La date de retour est obligatoire.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      const pendingData = { destination: form.destination, besoinVisa: form.besoinVisa, compagnie: form.compagnie, nombreAdultes: form.nombreAdultes, nombreEnfants: form.nombreEnfants, ageEnfants: form.ageEnfants, dateDepart: form.dateDepart, dateRetour: form.dateRetour, message: form.message, typeVoyage: form.typeVoyage };
      localStorage.setItem("pendingRequest", JSON.stringify(pendingData));
      setShowLoginModal(true);
      toast.info("Connectez-vous pour valider votre demande.", { duration: 4000 });
      return;
    }
    
    if (!validate()) return;
    setStatus("loading");
    
    setTimeout(() => {
      const currentUserStr = localStorage.getItem("currentUser");
      let userInfo = { name: "Visiteur Anonyme", email: form.email || "Non spécifié", phone: form.telephone || "Non spécifié", isAnonymous: true };

      if (currentUserStr) {
        try {
          const currentUser = JSON.parse(currentUserStr);
          userInfo = { name: currentUser.fullName || "Utilisateur", email: currentUser.email || form.email, phone: currentUser.phone || form.telephone, isAnonymous: false };
        } catch (error) {
          console.error("Error parsing user:", error);
        }
      }

      const requestObject = {
        id: `req-${Date.now()}`,
        type: "Billetterie",
        userInfo: userInfo,
        formData: { ...form },
        timestamp: new Date().toISOString(),
        isRead: false,
      };

      const adminInbox = JSON.parse(localStorage.getItem("admin_inbox") || "[]");
      adminInbox.push(requestObject);
      localStorage.setItem("admin_inbox", JSON.stringify(adminInbox));

      addMessage({
        type: "Billetterie",
        name: form.nom || "Non spécifié",
        email: form.email || "Non spécifié",
        phone: form.telephone || "Non spécifié",
        subject: `BILLETTERIE - ${form.destination || "Destination non spécifiée"}`,
        content: form.message || "Aucun message supplémentaire",
        billeterieDetails: {
          prenom: form.prenom || "Non spécifié",
          destination: form.destination || "Non spécifié",
          besoinVisa: form.besoinVisa || "Non spécifié",
          compagnie: form.compagnie || "Non précisé",
          nombreAdultes: form.nombreAdultes || "Non spécifié",
          nombreEnfants: form.nombreEnfants || "0",
          ageEnfants: form.ageEnfants || "Non applicable",
          dateDepart: form.dateDepart || "Non spécifié",
          dateRetour: form.dateRetour || "Non spécifié",
        },
      });
      
      setStatus("success");
      toast.success("Votre demande a été envoyée avec succès !");
      
      setTimeout(() => {
        setForm({ nom: "", prenom: "", email: "", telephone: "", typeVoyage: "aller-retour", destination: "", besoinVisa: "", compagnie: "", nombreAdultes: "1", nombreEnfants: "0", ageEnfants: "", dateDepart: "", dateRetour: "", message: "" });
        setStatus("idle");
      }, 2000);
    }, 1500);
  };

  // Toggle selection logic
  const handleAirlineClick = (airlineName: string) => {
    if (form.compagnie === airlineName) {
      setForm({ ...form, compagnie: "" });
    } else {
      setForm({ ...form, compagnie: airlineName });
    }
  };

  const airlines = [
    { name: "AIR ALGERIE" },
    { name: "AIR FRANCE" },
    { name: "ROYAL AIR MAROC" },
    { name: "TUNIS AIR" },
    { name: "EMIRATS" },
    { name: "QATAR" },
    { name: "TURKISH AIRLINES" },
    { name: "ALITALIA" },
    { name: "VUELING" },
    { name: "Aigle azur" },
  ];

  const duplicatedAirlines = [...airlines, ...airlines, ...airlines];

  return (
    <Layout>
      <section className="relative py-24 bg-gradient-to-b from-slate-50 to-white min-h-screen overflow-hidden">
        {/* Floating Decorative Icons - Background Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Icon 1: Plane - Top Left */}
          <motion.div
            animate={{ 
              y: [0, -25, 0], 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.08, 1] 
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-16 left-4 md:top-24 md:left-12"
            style={{
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              willChange: 'transform'
            }}
          >
            <Plane className="w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 text-purple-600/15" />
          </motion.div>

          {/* Icon 2: Ticket - Top Right */}
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
              delay: 1.5 
            }}
            className="absolute top-32 right-6 md:top-48 md:right-16"
            style={{
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              willChange: 'transform'
            }}
          >
            <Ticket className="w-9 h-9 md:w-14 md:h-14 lg:w-18 lg:h-18 text-yellow-500/15" />
          </motion.div>

          {/* Icon 3: Globe - Mid Left */}
          <motion.div
            animate={{ 
              y: [0, -25, 0], 
              rotate: [0, 12, -12, 0],
              scale: [1, 1.06, 1] 
            }}
            transition={{ 
              duration: 9, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 2.5 
            }}
            className="absolute top-1/3 left-8 md:left-20"
            style={{
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              willChange: 'transform'
            }}
          >
            <Globe className="w-12 h-12 md:w-18 md:h-18 lg:w-24 lg:h-24 text-purple-600/15" />
          </motion.div>

          {/* Icon 4: Luggage - Mid Right */}
          <motion.div
            animate={{ 
              y: [0, -22, 0], 
              rotate: [0, -10, 10, 0],
              scale: [1, 1.09, 1] 
            }}
            transition={{ 
              duration: 11, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 3 
            }}
            className="absolute top-1/2 right-10 md:right-24"
            style={{
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              willChange: 'transform'
            }}
          >
            <Luggage className="w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 text-yellow-500/15" />
          </motion.div>

          {/* Icon 5: Map - Bottom Left */}
          <motion.div
            animate={{ 
              y: [0, -20, 0], 
              rotate: [0, 9, -9, 0],
              scale: [1, 1.07, 1] 
            }}
            transition={{ 
              duration: 7.5, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 4 
            }}
            className="absolute bottom-32 left-6 md:bottom-40 md:left-16"
            style={{
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              willChange: 'transform'
            }}
          >
            <Map className="w-11 h-11 md:w-18 md:h-18 lg:w-24 lg:h-24 text-purple-600/15" />
          </motion.div>

          {/* Icon 6: Plane - Bottom Right */}
          <motion.div
            animate={{ 
              y: [0, -25, 0], 
              rotate: [0, -12, 12, 0],
              scale: [1, 1.08, 1] 
            }}
            transition={{ 
              duration: 6.5, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1 
            }}
            className="absolute bottom-24 right-8 md:bottom-36 md:right-20"
            style={{
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              willChange: 'transform'
            }}
          >
            <Plane className="w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 text-yellow-500/15" />
          </motion.div>
        </div>

        {/* Content Layer - Higher z-index */}
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl relative z-10">
          <div className="text-center mb-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full mb-4">
              <Plane size={20} />
              <span className="text-sm font-semibold uppercase tracking-wider">Billetterie</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Trouvez votre vol idéal</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Comparez et réservez les meilleurs vols avec notre service premium</p>
          </div>

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 bg-white rounded-2xl shadow-xl border border-slate-200">
                <CheckCircle size={64} className="mx-auto text-accent mb-6" />
                <h2 className="text-2xl font-bold mb-3 text-primary">Demande envoyée avec succès !</h2>
                <p className="text-slate-600 text-lg">Notre équipe vous contactera dans les plus brefs délais.</p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                  <div className="bg-primary px-6 py-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                        <Plane size={20} />
                        Recherche de vol
                      </h2>
                      <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
                        <button type="button" onClick={() => setForm({ ...form, typeVoyage: "aller-retour" })} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${form.typeVoyage === "aller-retour" ? "bg-accent text-primary shadow-md" : "text-white hover:bg-white/20"}`}>
                          <ArrowLeftRight size={16} />
                          Aller-retour
                        </button>
                        <button type="button" onClick={() => setForm({ ...form, typeVoyage: "aller-simple", dateRetour: "" })} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${form.typeVoyage === "aller-simple" ? "bg-accent text-primary shadow-md" : "text-white hover:bg-white/20"}`}>
                          <ArrowRight size={16} />
                          Aller simple
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="relative">
                        <label className="block text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                          <MapPin size={16} />
                          Destination *
                        </label>
                        <input type="text" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base" placeholder="Ex: Istanbul, Paris, Dubai..." />
                        {errors.destination && <p className="text-sm text-red-600 mt-1">{errors.destination}</p>}
                      </div>
                      
                      <div className="relative">
                        <label className="block text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                          <Calendar size={16} />
                          Date de départ *
                        </label>
                        <input type="date" value={form.dateDepart} onChange={(e) => setForm({ ...form, dateDepart: e.target.value })} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base" />
                        {errors.dateDepart && <p className="text-sm text-red-600 mt-1">{errors.dateDepart}</p>}
                      </div>
                      
                      {form.typeVoyage === "aller-retour" && (
                        <div className="relative">
                          <label className="block text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                            <Calendar size={16} />
                            Date de retour *
                          </label>
                          <input type="date" value={form.dateRetour} onChange={(e) => setForm({ ...form, dateRetour: e.target.value })} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base" />
                          {errors.dateRetour && <p className="text-sm text-red-600 mt-1">{errors.dateRetour}</p>}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="relative">
                        <label className="block text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                          <Users size={16} />
                          Adultes
                        </label>
                        <input type="number" min="1" value={form.nombreAdultes} onChange={(e) => setForm({ ...form, nombreAdultes: e.target.value })} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base" placeholder="1" />
                      </div>
                      
                      <div className="relative">
                        <label className="block text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                          <Users size={16} />
                          Enfants
                        </label>
                        <input type="number" min="0" value={form.nombreEnfants} onChange={(e) => setForm({ ...form, nombreEnfants: e.target.value })} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base" placeholder="0" />
                      </div>
                      
                      <div className="relative">
                        <label className="block text-sm font-semibold text-primary mb-2">Âge des enfants</label>
                        <input type="text" value={form.ageEnfants} onChange={(e) => setForm({ ...form, ageEnfants: e.target.value })} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base" placeholder="Ex: 5 ans, 8 ans" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                        <Plane size={16} />
                        Compagnie aérienne (optionnel)
                      </label>
                      <div 
                        ref={scrollContainerRef}
                        className="overflow-x-auto rounded-xl border-2 border-slate-200 bg-white p-4 airline-scroll-container"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        onTouchStart={() => setIsPaused(true)}
                        onTouchEnd={() => setIsPaused(false)}
                      >
                        <div className="flex gap-4" style={{ width: 'max-content' }}>
                          {duplicatedAirlines.map((airline, index) => (
                            <button 
                              key={`${airline.name}-${index}`} 
                              type="button" 
                              onClick={() => handleAirlineClick(airline.name)} 
                              className={`flex-shrink-0 flex items-center justify-center px-6 py-4 rounded-xl border-2 transition-all duration-300 w-[160px] h-[80px] ${
                                form.compagnie === airline.name 
                                  ? "border-primary bg-primary text-white shadow-lg" 
                                  : "border-slate-200 bg-white text-slate-700 hover:border-accent hover:shadow-md"
                              }`}
                            >
                              <span className="text-sm font-bold text-center leading-tight">{airline.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 text-center">Faites glisser pour voir plus de compagnies • Cliquez à nouveau pour désélectionner</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="block text-sm font-semibold text-primary mb-2">Besoin d'un VISA ?</label>
                        <select value={form.besoinVisa} onChange={(e) => setForm({ ...form, besoinVisa: e.target.value })} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base">
                          <option value="">Sélectionner</option>
                          <option value="Oui">Oui</option>
                          <option value="Non">Non</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
                    <h2 className="text-xl font-bold text-primary">Informations Personnelles</h2>
                    {isLoggedIn && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-normal text-green-600">✓ Pré-remplies</span>
                        <button onClick={() => setShowLoginModal(true)} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/5" type="button">
                          <Pencil size={14} />
                          <span>Modifier</span>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <AnimatePresence>
                    {showUpdateFlash && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/30 rounded-xl px-4 py-3 mb-4">
                        <p className="text-sm text-primary font-medium flex items-center gap-2">
                          <CheckCircle size={16} className="text-accent" />
                          Informations mises à jour !
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">Nom *</label>
                      <input type="text" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} className={`w-full px-4 py-3 border-2 rounded-xl transition-all text-base ${isLoggedIn ? showUpdateFlash ? "bg-gradient-to-r from-accent/10 to-primary/10 border-accent/30 animate-pulse" : "bg-primary/5 border-primary/30 cursor-not-allowed" : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20"}`} placeholder="Votre nom" readOnly={isLoggedIn} />
                      {errors.nom && <p className="text-sm text-red-600 mt-1">{errors.nom}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">Prénom *</label>
                      <input type="text" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} className={`w-full px-4 py-3 border-2 rounded-xl transition-all text-base ${isLoggedIn ? showUpdateFlash ? "bg-gradient-to-r from-accent/10 to-primary/10 border-accent/30 animate-pulse" : "bg-primary/5 border-primary/30 cursor-not-allowed" : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20"}`} placeholder="Votre prénom" readOnly={isLoggedIn} />
                      {errors.prenom && <p className="text-sm text-red-600 mt-1">{errors.prenom}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">Email *</label>
                      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`w-full px-4 py-3 border-2 rounded-xl transition-all text-base ${isLoggedIn ? showUpdateFlash ? "bg-gradient-to-r from-accent/10 to-primary/10 border-accent/30 animate-pulse" : "bg-primary/5 border-primary/30 cursor-not-allowed" : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20"}`} placeholder="votre@email.com" readOnly={isLoggedIn} />
                      {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">Téléphone *</label>
                      <input type="tel" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} className={`w-full px-4 py-3 border-2 rounded-xl transition-all text-base ${isLoggedIn ? showUpdateFlash ? "bg-gradient-to-r from-accent/10 to-primary/10 border-accent/30 animate-pulse" : "bg-primary/5 border-primary/30 cursor-not-allowed" : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20"}`} placeholder="0549059432" readOnly={isLoggedIn} />
                      {errors.telephone && <p className="text-sm text-red-600 mt-1">{errors.telephone}</p>}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
                  <h2 className="text-xl font-bold text-primary mb-4">Détails supplémentaires</h2>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base min-h-[120px] resize-y" placeholder="Décrivez vos besoins spécifiques..." maxLength={1000} />
                </div>

                <div className="space-y-3">
                  <button type="submit" disabled={status === "loading"} className="w-full bg-accent text-primary px-8 py-5 rounded-2xl font-bold text-lg hover:bg-accent/90 hover:shadow-2xl transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98]">
                    {status === "loading" ? (
                      <>
                        <Loader2 size={24} className="animate-spin" /> 
                        <span>Recherche en cours...</span>
                      </>
                    ) : (
                      <>
                        <Plane size={24} />
                        <span>Rechercher des vols</span>
                      </>
                    )}
                  </button>
                  {!isLoggedIn && (
                    <p className="text-sm text-center text-primary font-medium">💡 Connectez-vous pour valider votre recherche</p>
                  )}
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
      
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} editMode={true} />
      
      <style>{`
        .airline-scroll-container {
          scrollbar-width: none;
        }
        
        .airline-scroll-container::-webkit-scrollbar {
          display: none;
        }
        
        .airline-scroll-container:hover {
          scrollbar-width: thin;
          scrollbar-color: #4B2C7F #f1f5f9;
        }
        
        .airline-scroll-container:hover::-webkit-scrollbar {
          display: block;
          height: 8px;
        }
        
        .airline-scroll-container:hover::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        
        .airline-scroll-container:hover::-webkit-scrollbar-thumb {
          background: #4B2C7F;
          border-radius: 4px;
        }
        
        .airline-scroll-container:hover::-webkit-scrollbar-thumb:hover {
          background: #3a2260;
        }
      `}</style>
    </Layout>
  );
};

export default BilletteriePage;
