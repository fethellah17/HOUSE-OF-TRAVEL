import Layout from "@/components/Layout";
import LoginModal from "@/components/LoginModal";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2, Pencil, MapPin, Calendar, Users, Plane, ArrowLeftRight, ArrowRight, Ticket, Globe, Luggage, Map } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { toast } from "sonner";

// Comprehensive list of popular travel destinations
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

const BilletteriePage = () => {
  const { addRequest } = useData();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUpdateFlash, setShowUpdateFlash] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  
  // Autocomplete state for departure and arrival
  const [showDepartDropdown, setShowDepartDropdown] = useState(false);
  const [showArriveeDropdown, setShowArriveeDropdown] = useState(false);
  const [filteredDepartDestinations, setFilteredDepartDestinations] = useState<string[]>([]);
  const [filteredArriveeDestinations, setFilteredArriveeDestinations] = useState<string[]>([]);
  const departInputRef = useRef<HTMLInputElement>(null);
  const arriveeInputRef = useRef<HTMLInputElement>(null);
  const departDropdownRef = useRef<HTMLDivElement>(null);
  const arriveeDropdownRef = useRef<HTMLDivElement>(null);
  
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    typeVoyage: "aller-retour",
    villeDepart: "",
    villeArrivee: "",
    besoinVisa: "",
    compagnie: "",
    nombreAdultes: 1,
    nombreEnfants: 0,
    nombreBebes: 0,
    enfantsDates: [] as string[],
    bebesDates: [] as string[],
    dateDepart: "",
    dateRetour: "",
    message: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [showPassengersDropdown, setShowPassengersDropdown] = useState(false);
  const passengersDropdownRef = useRef<HTMLDivElement>(null);
  const passengersButtonRef = useRef<HTMLButtonElement>(null);

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

  // Handle destination autocomplete
  const handleDepartChange = (value: string) => {
    setForm({ ...form, villeDepart: value });
    
    if (value.trim().length > 0) {
      const filtered = DESTINATIONS.filter(dest =>
        dest.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 10);
      setFilteredDepartDestinations(filtered);
      setShowDepartDropdown(filtered.length > 0);
    } else {
      setFilteredDepartDestinations([]);
      setShowDepartDropdown(false);
    }
  };

  const handleArriveeChange = (value: string) => {
    setForm({ ...form, villeArrivee: value });
    
    if (value.trim().length > 0) {
      const filtered = DESTINATIONS.filter(dest =>
        dest.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 10);
      setFilteredArriveeDestinations(filtered);
      setShowArriveeDropdown(filtered.length > 0);
    } else {
      setFilteredArriveeDestinations([]);
      setShowArriveeDropdown(false);
    }
  };

  const handleDepartSelect = (destination: string) => {
    setForm({ ...form, villeDepart: destination });
    setShowDepartDropdown(false);
    setFilteredDepartDestinations([]);
  };

  const handleArriveeSelect = (destination: string) => {
    setForm({ ...form, villeArrivee: destination });
    setShowArriveeDropdown(false);
    setFilteredArriveeDestinations([]);
  };

  // Switch departure and arrival cities
  const handleSwitchCities = () => {
    setForm({
      ...form,
      villeDepart: form.villeArrivee,
      villeArrivee: form.villeDepart,
    });
  };

  // Handle passengers count changes with proper event handling
  const handleAdultesChange = (increment: boolean) => {
    const newCount = increment 
      ? form.nombreAdultes + 1 
      : Math.max(1, form.nombreAdultes - 1);
    setForm({ ...form, nombreAdultes: newCount });
  };

  const handleEnfantsChange = (increment: boolean) => {
    const newCount = increment 
      ? form.nombreEnfants + 1 
      : Math.max(0, form.nombreEnfants - 1);
    
    // Adjust dates array
    const newDates = [...form.enfantsDates];
    if (increment) {
      newDates.push("");
    } else if (newDates.length > newCount) {
      newDates.pop();
    }
    
    setForm({ ...form, nombreEnfants: newCount, enfantsDates: newDates });
    
    // Auto-scroll to bottom when adding a child
    if (increment && passengersDropdownRef.current) {
      setTimeout(() => {
        if (passengersDropdownRef.current) {
          passengersDropdownRef.current.scrollTo({
            top: passengersDropdownRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  const handleBebesChange = (increment: boolean) => {
    const newCount = increment 
      ? form.nombreBebes + 1 
      : Math.max(0, form.nombreBebes - 1);
    
    // Adjust dates array
    const newDates = [...form.bebesDates];
    if (increment) {
      newDates.push("");
    } else if (newDates.length > newCount) {
      newDates.pop();
    }
    
    setForm({ ...form, nombreBebes: newCount, bebesDates: newDates });
    
    // Auto-scroll to bottom when adding a baby
    if (increment && passengersDropdownRef.current) {
      setTimeout(() => {
        if (passengersDropdownRef.current) {
          passengersDropdownRef.current.scrollTo({
            top: passengersDropdownRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  // Wrapper functions to prevent event bubbling
  const handleCounterClick = (e: React.MouseEvent, callback: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    callback();
  };

  const handleDateInputClick = (e: React.MouseEvent) => {
    // Only stop propagation to prevent dropdown from closing
    // Do NOT preventDefault - it blocks the native date picker
    e.stopPropagation();
  };

  const handleEnfantDateChange = (index: number, value: string) => {
    const newDates = [...form.enfantsDates];
    newDates[index] = value;
    setForm({ ...form, enfantsDates: newDates });
  };

  const handleBebeDateChange = (index: number, value: string) => {
    const newDates = [...form.bebesDates];
    newDates[index] = value;
    setForm({ ...form, bebesDates: newDates });
  };

  const getTotalPassengers = () => {
    return form.nombreAdultes + form.nombreEnfants + form.nombreBebes;
  };

  const getPassengersSummary = () => {
    const total = getTotalPassengers();
    if (total === 1) return "1 Personne";
    return `${total} Personnes`;
  };

  // Close dropdown when clicking outside (desktop only, mobile uses backdrop)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only handle desktop dropdown (not mobile modal)
      if (window.innerWidth >= 768) {
        // Departure dropdown
        if (
          departDropdownRef.current &&
          !departDropdownRef.current.contains(event.target as Node) &&
          departInputRef.current &&
          !departInputRef.current.contains(event.target as Node)
        ) {
          setShowDepartDropdown(false);
        }
        
        // Arrival dropdown
        if (
          arriveeDropdownRef.current &&
          !arriveeDropdownRef.current.contains(event.target as Node) &&
          arriveeInputRef.current &&
          !arriveeInputRef.current.contains(event.target as Node)
        ) {
          setShowArriveeDropdown(false);
        }

        // Passengers dropdown (desktop only)
        if (
          passengersDropdownRef.current &&
          !passengersDropdownRef.current.contains(event.target as Node) &&
          passengersButtonRef.current &&
          !passengersButtonRef.current.contains(event.target as Node)
        ) {
          console.log("Closed by outside click", event.target);
          setShowPassengersDropdown(false);
        }
      }
    };

    if (showPassengersDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPassengersDropdown]);

  // Lock body scroll on mobile when passengers dropdown is open
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile && showPassengersDropdown) {
      // Lock body scroll
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      
      return () => {
        // Restore body scroll
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
      };
    }
  }, [showPassengersDropdown]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nom.trim()) e.nom = "Le nom est obligatoire.";
    if (!form.prenom.trim()) e.prenom = "Le prénom est obligatoire.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalide.";
    if (!form.telephone.trim()) e.telephone = "Le téléphone est obligatoire.";
    if (!form.villeDepart.trim()) e.villeDepart = "La ville de départ est obligatoire.";
    if (!form.villeArrivee.trim()) e.villeArrivee = "La ville d'arrivée est obligatoire.";
    if (!form.dateDepart) e.dateDepart = "La date de départ est obligatoire.";
    if (form.typeVoyage === "aller-retour" && !form.dateRetour) e.dateRetour = "La date de retour est obligatoire.";
    
    // Validate birth dates for children
    if (form.nombreEnfants > 0) {
      for (let i = 0; i < form.nombreEnfants; i++) {
        if (!form.enfantsDates[i] || form.enfantsDates[i].trim() === "") {
          e.enfantsDates = `Veuillez renseigner toutes les dates de naissance des enfants.`;
          break;
        }
      }
    }
    
    // Validate birth dates for babies
    if (form.nombreBebes > 0) {
      for (let i = 0; i < form.nombreBebes; i++) {
        if (!form.bebesDates[i] || form.bebesDates[i].trim() === "") {
          e.bebesDates = `Veuillez renseigner toutes les dates de naissance des bébés.`;
          break;
        }
      }
    }
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      const pendingData = { 
        villeDepart: form.villeDepart, 
        villeArrivee: form.villeArrivee, 
        besoinVisa: form.besoinVisa, 
        compagnie: form.compagnie, 
        nombreAdultes: form.nombreAdultes, 
        nombreEnfants: form.nombreEnfants, 
        nombreBebes: form.nombreBebes,
        enfantsDates: form.enfantsDates,
        bebesDates: form.bebesDates,
        dateDepart: form.dateDepart, 
        dateRetour: form.dateRetour, 
        message: form.message, 
        typeVoyage: form.typeVoyage 
      };
      localStorage.setItem("pendingRequest", JSON.stringify(pendingData));
      setShowLoginModal(true);
      toast.info("Connectez-vous pour valider votre demande.", { duration: 4000 });
      return;
    }
    
    if (!validate()) {
      // Show specific error messages for birth dates
      if (errors.enfantsDates) {
        toast.error(errors.enfantsDates, { duration: 5000 });
      }
      if (errors.bebesDates) {
        toast.error(errors.bebesDates, { duration: 5000 });
      }
      return;
    }
    
    setStatus("loading");
    
    setTimeout(() => {
      addRequest({
        serviceType: "billetterie",
        personalInfo: {
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
          telephone: form.telephone,
        },
        tripType: form.typeVoyage,
        villeDepart: form.villeDepart,
        villeArrivee: form.villeArrivee,
        dateDepart: form.dateDepart,
        dateRetour: form.dateRetour,
        nombreAdultes: form.nombreAdultes.toString(),
        nombreEnfants: form.nombreEnfants.toString(),
        nombreBebes: form.nombreBebes.toString(),
        enfantsDates: form.enfantsDates.join(", "),
        bebesDates: form.bebesDates.join(", "),
        compagnie: form.compagnie,
        besoinVisa: form.besoinVisa,
        message: form.message,
      });
      
      setStatus("success");
      toast.success("Votre demande a été envoyée avec succès !");
      
      setTimeout(() => {
        setForm({ 
          nom: "", 
          prenom: "", 
          email: "", 
          telephone: "", 
          typeVoyage: "aller-retour", 
          villeDepart: "", 
          villeArrivee: "", 
          besoinVisa: "", 
          compagnie: "", 
          nombreAdultes: 1, 
          nombreEnfants: 0, 
          nombreBebes: 0,
          enfantsDates: [],
          bebesDates: [],
          dateDepart: "", 
          dateRetour: "", 
          message: "" 
        });
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
      <section className="relative py-24 bg-gradient-to-b from-slate-50 to-white min-h-screen">
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
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200">
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

                  <div className="p-6 pb-2 space-y-6 min-h-[600px]">
                    {/* Departure, Arrival, and Switch Button */}
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
                      {/* Ville de départ */}
                      <div className="relative">
                        <label className="block text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                          <MapPin size={16} />
                          Ville de départ *
                        </label>
                        <div className="relative">
                          <input 
                            ref={departInputRef}
                            type="text" 
                            value={form.villeDepart} 
                            onChange={(e) => handleDepartChange(e.target.value)}
                            onFocus={() => {
                              if (form.villeDepart.trim().length > 0) {
                                const filtered = DESTINATIONS.filter(dest =>
                                  dest.toLowerCase().includes(form.villeDepart.toLowerCase())
                                ).slice(0, 10);
                                setFilteredDepartDestinations(filtered);
                                setShowDepartDropdown(filtered.length > 0);
                              }
                            }}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base" 
                            placeholder="Ex: Alger, Paris..." 
                            autoComplete="off"
                          />
                          
                          {/* Autocomplete Dropdown */}
                          <AnimatePresence>
                            {showDepartDropdown && filteredDepartDestinations.length > 0 && (
                              <motion.div
                                ref={departDropdownRef}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute z-50 w-full mt-1 bg-white border-2 border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                              >
                                {filteredDepartDestinations.map((destination, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleDepartSelect(destination)}
                                    className="w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors border-b border-slate-100 last:border-b-0 flex items-center gap-2 text-sm"
                                  >
                                    <MapPin size={14} className="text-primary flex-shrink-0" />
                                    <span className="text-gray-700">{destination}</span>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        {errors.villeDepart && <p className="text-sm text-red-600 mt-1">{errors.villeDepart}</p>}
                      </div>

                      {/* Switch Button */}
                      <div className="flex items-center justify-center md:pb-0 pb-2">
                        <motion.button
                          type="button"
                          onClick={handleSwitchCities}
                          whileHover={{ scale: 1.1, rotate: 180 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-12 h-12 rounded-full bg-accent text-primary flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                          aria-label="Échanger départ et arrivée"
                        >
                          <ArrowLeftRight size={20} />
                        </motion.button>
                      </div>

                      {/* Ville d'arrivée */}
                      <div className="relative">
                        <label className="block text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                          <MapPin size={16} />
                          Ville d'arrivée *
                        </label>
                        <div className="relative">
                          <input 
                            ref={arriveeInputRef}
                            type="text" 
                            value={form.villeArrivee} 
                            onChange={(e) => handleArriveeChange(e.target.value)}
                            onFocus={() => {
                              if (form.villeArrivee.trim().length > 0) {
                                const filtered = DESTINATIONS.filter(dest =>
                                  dest.toLowerCase().includes(form.villeArrivee.toLowerCase())
                                ).slice(0, 10);
                                setFilteredArriveeDestinations(filtered);
                                setShowArriveeDropdown(filtered.length > 0);
                              }
                            }}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base" 
                            placeholder="Ex: Istanbul, Dubai..." 
                            autoComplete="off"
                          />
                          
                          {/* Autocomplete Dropdown */}
                          <AnimatePresence>
                            {showArriveeDropdown && filteredArriveeDestinations.length > 0 && (
                              <motion.div
                                ref={arriveeDropdownRef}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute z-50 w-full mt-1 bg-white border-2 border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                              >
                                {filteredArriveeDestinations.map((destination, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleArriveeSelect(destination)}
                                    className="w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors border-b border-slate-100 last:border-b-0 flex items-center gap-2 text-sm"
                                  >
                                    <MapPin size={14} className="text-primary flex-shrink-0" />
                                    <span className="text-gray-700">{destination}</span>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        {errors.villeArrivee && <p className="text-sm text-red-600 mt-1">{errors.villeArrivee}</p>}
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="block text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                          <Calendar size={16} />
                          Date de départ *
                        </label>
                        <input type="date" value={form.dateDepart} onChange={(e) => setForm({ ...form, dateDepart: e.target.value })} onClick={(e) => e.stopPropagation()} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base" />
                        {errors.dateDepart && <p className="text-sm text-red-600 mt-1">{errors.dateDepart}</p>}
                      </div>
                      
                      {form.typeVoyage === "aller-retour" && (
                        <div className="relative">
                          <label className="block text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                            <Calendar size={16} />
                            Date de retour *
                          </label>
                          <input type="date" value={form.dateRetour} onChange={(e) => setForm({ ...form, dateRetour: e.target.value })} onClick={(e) => e.stopPropagation()} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base" />
                          {errors.dateRetour && <p className="text-sm text-red-600 mt-1">{errors.dateRetour}</p>}
                        </div>
                      )}
                    </div>

                    {/* Passengers Dropdown - Full Width Row */}
                    <div className="relative">
                      <label className="block text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                        <Users size={16} />
                        Personnes
                      </label>
                      <button
                        ref={passengersButtonRef}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowPassengersDropdown(!showPassengersDropdown);
                        }}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base text-left flex items-center justify-between bg-white hover:border-primary"
                      >
                        <span className="text-gray-700">{getPassengersSummary()}</span>
                        <Users size={18} className="text-primary" />
                      </button>

                      {/* Passengers Dropdown Panel - Desktop */}
                      <AnimatePresence>
                        {showPassengersDropdown && (
                          <>
                            {/* Desktop Dropdown */}
                            <motion.div
                              ref={passengersDropdownRef}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                e.nativeEvent.stopImmediatePropagation();
                              }}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              className="hidden md:block absolute left-0 right-0 mt-1 bg-white border-2 border-slate-200 rounded-xl shadow-2xl z-50"
                              style={{ minWidth: '100%' }}
                            >
                              <div className="p-4 space-y-4">
                                {/* Adultes */}
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-semibold text-primary">Adultes</p>
                                    <p className="text-xs text-gray-500">12 ans et plus</p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <button
                                      type="button"
                                      onClick={(e) => handleCounterClick(e, () => handleAdultesChange(false))}
                                      disabled={form.nombreAdultes <= 1}
                                      className="w-8 h-8 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                      −
                                    </button>
                                    <span className="w-8 text-center font-semibold">{form.nombreAdultes}</span>
                                    <button
                                      type="button"
                                      onClick={(e) => handleCounterClick(e, () => handleAdultesChange(true))}
                                      className="w-8 h-8 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>

                                {/* Enfants */}
                                <div className="border-t pt-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <div>
                                      <p className="font-semibold text-primary">Enfants</p>
                                      <p className="text-xs text-gray-500">Moins de 12 ans</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <button
                                        type="button"
                                        onClick={(e) => handleCounterClick(e, () => handleEnfantsChange(false))}
                                        disabled={form.nombreEnfants <= 0}
                                        className="w-8 h-8 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                      >
                                        −
                                      </button>
                                      <span className="w-8 text-center font-semibold">{form.nombreEnfants}</span>
                                      <button
                                        type="button"
                                        onClick={(e) => handleCounterClick(e, () => handleEnfantsChange(true))}
                                        className="w-8 h-8 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                  
                                  {/* Dynamic date inputs for children */}
                                  {form.nombreEnfants > 0 && (
                                    <div className="space-y-2 mt-3">
                                      {Array.from({ length: form.nombreEnfants }).map((_, index) => (
                                        <div key={index}>
                                          <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Date de naissance enfant {index + 1}
                                          </label>
                                          <input
                                            type="date"
                                            value={form.enfantsDates[index] || ""}
                                            onChange={(e) => handleEnfantDateChange(index, e.target.value)}
                                            onClick={handleDateInputClick}
                                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 ${
                                              errors.enfantsDates ? "border-red-500" : "border-slate-200"
                                            }`}
                                          />
                                        </div>
                                      ))}
                                      {errors.enfantsDates && (
                                        <p className="text-xs text-red-600 mt-1">{errors.enfantsDates}</p>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Bébés */}
                                <div className="border-t pt-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <div>
                                      <p className="font-semibold text-primary">Bébés</p>
                                      <p className="text-xs text-gray-500">Moins de 2 ans</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <button
                                        type="button"
                                        onClick={(e) => handleCounterClick(e, () => handleBebesChange(false))}
                                        disabled={form.nombreBebes <= 0}
                                        className="w-8 h-8 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                      >
                                        −
                                      </button>
                                      <span className="w-8 text-center font-semibold">{form.nombreBebes}</span>
                                      <button
                                        type="button"
                                        onClick={(e) => handleCounterClick(e, () => handleBebesChange(true))}
                                        className="w-8 h-8 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                  
                                  {/* Dynamic date inputs for infants */}
                                  {form.nombreBebes > 0 && (
                                    <div className="space-y-2 mt-3">
                                      {Array.from({ length: form.nombreBebes }).map((_, index) => (
                                        <div key={index}>
                                          <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Date de naissance bébé {index + 1}
                                          </label>
                                          <input
                                            type="date"
                                            value={form.bebesDates[index] || ""}
                                            onChange={(e) => handleBebeDateChange(index, e.target.value)}
                                            onClick={handleDateInputClick}
                                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 ${
                                              errors.bebesDates ? "border-red-500" : "border-slate-200"
                                            }`}
                                          />
                                        </div>
                                      ))}
                                      {errors.bebesDates && (
                                        <p className="text-xs text-red-600 mt-1">{errors.bebesDates}</p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>

                              {/* Mobile Modal */}
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="md:hidden fixed inset-0 bg-black/50 z-[100] flex items-end"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setShowPassengersDropdown(false);
                                }}
                              >
                                <motion.div
                                  ref={passengersDropdownRef}
                                  initial={{ y: "100%" }}
                                  animate={{ y: 0 }}
                                  exit={{ y: "100%" }}
                                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                  className="bg-white rounded-t-3xl w-full max-h-[70vh] overflow-y-auto p-6 space-y-6"
                                  style={{ overscrollBehaviorY: "contain" }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    e.nativeEvent.stopImmediatePropagation();
                                  }}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  onTouchStart={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  {/* Header */}
                                  <div className="flex items-center justify-between pb-4 border-b">
                                    <h3 className="text-xl font-bold text-primary">Sélectionner les personnes</h3>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        e.nativeEvent.stopImmediatePropagation();
                                        setShowPassengersDropdown(false);
                                      }}
                                      className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                                    >
                                      ✕
                                    </button>
                                  </div>

                                  {/* Adultes */}
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="font-semibold text-primary text-lg">Adultes</p>
                                      <p className="text-sm text-gray-500">12 ans et plus</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <button
                                        type="button"
                                        onClick={(e) => handleCounterClick(e, () => handleAdultesChange(false))}
                                        disabled={form.nombreAdultes <= 1}
                                        className="w-12 h-12 rounded-full border-2 border-primary text-primary font-bold text-xl hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                      >
                                        −
                                      </button>
                                      <span className="w-10 text-center font-bold text-xl">{form.nombreAdultes}</span>
                                      <button
                                        type="button"
                                        onClick={(e) => handleCounterClick(e, () => handleAdultesChange(true))}
                                        className="w-12 h-12 rounded-full border-2 border-primary text-primary font-bold text-xl hover:bg-primary hover:text-white transition-all"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>

                                  {/* Enfants */}
                                  <div className="border-t pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                      <div>
                                        <p className="font-semibold text-primary text-lg">Enfants</p>
                                        <p className="text-sm text-gray-500">Moins de 12 ans</p>
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <button
                                          type="button"
                                          onClick={(e) => handleCounterClick(e, () => handleEnfantsChange(false))}
                                          disabled={form.nombreEnfants <= 0}
                                          className="w-12 h-12 rounded-full border-2 border-primary text-primary font-bold text-xl hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                          −
                                        </button>
                                        <span className="w-10 text-center font-bold text-xl">{form.nombreEnfants}</span>
                                        <button
                                          type="button"
                                          onClick={(e) => handleCounterClick(e, () => handleEnfantsChange(true))}
                                          className="w-12 h-12 rounded-full border-2 border-primary text-primary font-bold text-xl hover:bg-primary hover:text-white transition-all"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                    
                                    {/* Dynamic date inputs for children */}
                                    {form.nombreEnfants > 0 && (
                                      <div className="space-y-3 mt-4">
                                        {Array.from({ length: form.nombreEnfants }).map((_, index) => (
                                          <div key={index}>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                              Date de naissance enfant {index + 1}
                                            </label>
                                            <input
                                              type="date"
                                              value={form.enfantsDates[index] || ""}
                                              onChange={(e) => handleEnfantDateChange(index, e.target.value)}
                                              onClick={handleDateInputClick}
                                              className={`w-full px-4 py-3 border-2 rounded-xl text-base focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                                                errors.enfantsDates ? "border-red-500" : "border-slate-200"
                                              }`}
                                            />
                                          </div>
                                        ))}
                                        {errors.enfantsDates && (
                                          <p className="text-sm text-red-600 mt-2">{errors.enfantsDates}</p>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  {/* Bébés */}
                                  <div className="border-t pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                      <div>
                                        <p className="font-semibold text-primary text-lg">Bébés</p>
                                        <p className="text-sm text-gray-500">Moins de 2 ans</p>
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <button
                                          type="button"
                                          onClick={(e) => handleCounterClick(e, () => handleBebesChange(false))}
                                          disabled={form.nombreBebes <= 0}
                                          className="w-12 h-12 rounded-full border-2 border-primary text-primary font-bold text-xl hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                          −
                                        </button>
                                        <span className="w-10 text-center font-bold text-xl">{form.nombreBebes}</span>
                                        <button
                                          type="button"
                                          onClick={(e) => handleCounterClick(e, () => handleBebesChange(true))}
                                          className="w-12 h-12 rounded-full border-2 border-primary text-primary font-bold text-xl hover:bg-primary hover:text-white transition-all"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                    
                                    {/* Dynamic date inputs for infants */}
                                    {form.nombreBebes > 0 && (
                                      <div className="space-y-3 mt-4">
                                        {Array.from({ length: form.nombreBebes }).map((_, index) => (
                                          <div key={index}>
                                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                              Date de naissance bébé {index + 1}
                                            </label>
                                            <input
                                              type="date"
                                              value={form.bebesDates[index] || ""}
                                              onChange={(e) => handleBebeDateChange(index, e.target.value)}
                                              onClick={handleDateInputClick}
                                              className={`w-full px-4 py-3 border-2 rounded-xl text-base focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                                                errors.bebesDates ? "border-red-500" : "border-slate-200"
                                              }`}
                                            />
                                          </div>
                                        ))}
                                        {errors.bebesDates && (
                                          <p className="text-sm text-red-600 mt-2">{errors.bebesDates}</p>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  {/* Done Button */}
                                  <div className="pt-4">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        e.nativeEvent.stopImmediatePropagation();
                                        setShowPassengersDropdown(false);
                                      }}
                                      className="w-full bg-primary text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all"
                                    >
                                      Confirmer
                                    </button>
                                  </div>
                                </motion.div>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
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
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <Plane size={24} />
                        <span>Envoyer</span>
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

        /* Custom scrollbar for Personnes dropdown */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #4B2C7F #f1f5f9;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 5px;
          margin: 4px 0;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4B2C7F;
          border-radius: 5px;
          border: 2px solid #f1f5f9;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3a2260;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: #2d1a4d;
        }
      `}</style>
    </Layout>
  );
};

export default BilletteriePage;
