import { useState, useEffect } from "react";
import { useData } from "@/contexts/DataContext";
import { Voyage, Message, VoyageCategory, Stage, VoyageStatus } from "@/types";
import type { BilletterieRequest, HotelRequest } from "@/contexts/DataContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane, Inbox, Plus, LogOut, Eye, Trash2, X, CheckCircle, Loader2, Menu, Pencil, FileDown, ArrowLeft, Users, Settings2, FileText,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import logo from "@/assets/logo.png";
import { DateRangePicker } from "@/components/ui/date-picker";
import { MultiImageUpload } from "@/components/MultiImageUpload";
import StageSection from "@/components/StageSection";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { formatPrice } from "@/lib/formatters";
import { generateMessagePDF } from "@/lib/pdfGenerator";
import InboxView from "@/components/admin/inbox/InboxView";
import { fetchBilletterieRequests, fetchHotelRequests, markRequestAsRead as markRequestAsReadService, updateHotelRequestStatus, updateRequestStatus as updateRequestStatusService, deleteRequest as deleteRequestService } from "@/lib/formsService";

type Tab = "inbox" | "users" | "voyages" | "sejour-config" | "visa-config" | "settings";

const AdminPage = () => {
  const navigate = useNavigate();
  const { 
    voyages, 
    messages, 
    requests,
    sejourDestinations, 
    sejourServices,
    eVisaCountries,
    dossierCountries,
    addVoyage, 
    updateVoyage, 
    deleteVoyage, 
    markMessageAsRead,
    markRequestAsRead,
    toggleRequestStatus,
    deleteRequest,
    addSejourDestination,
    deleteSejourDestination,
    addSejourService,
    deleteSejourService,
    addEVisaCountry,
    deleteEVisaCountry,
    addDossierCountry,
    updateDossierCountry,
    deleteDossierCountry
  } = useData();
  
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState<Tab>("inbox");
  const [showAddForm, setShowAddForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [realBilletterieRequests, setRealBilletterieRequests] = useState<BilletterieRequest[]>([]);
  const [realHotelRequests, setRealHotelRequests] = useState<HotelRequest[]>([]);
  const [loadingBilletterie, setLoadingBilletterie] = useState(false);

  // Safety check for critical data
  if (!voyages || !messages || !requests) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-primary mx-auto mb-4" />
          <p className="text-slate-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  // Fetch real billetterie requests from Supabase
  useEffect(() => {
    if (!loggedIn) return;

    const loadBilletterieRequests = async () => {
      try {
        setLoadingBilletterie(true);
        const supabaseRequests = await fetchBilletterieRequests();
        
        // Map Supabase data to BilletterieRequest format
        const mappedRequests: BilletterieRequest[] = supabaseRequests.map((req: any) => ({
          id: req.id,
          serviceType: "billetterie" as const,
          createdAt: req.created_at,
          isRead: req.is_read || false,
          completed: req.status === "completed",
          personalInfo: {
            nom: req.nom || "",
            prenom: req.prenom || "",
            email: req.email || "",
            telephone: req.phone || "",
          },
          tripType: "",
          destination: `${req.departure_city || ""} → ${req.arrival_city || ""}`,
          villeDepart: req.departure_city || "",
          villeArrivee: req.arrival_city || "",
          dateDepart: req.departure_date || "",
          dateRetour: req.return_date || "",
          nombreAdultes: (req.number_of_adults || 0).toString(),
          nombreEnfants: (req.number_of_children || 0).toString(),
          nombreBebes: (req.number_of_babies || 0).toString(),
          enfantsDates: req.children_age || "",
          bebesDates: req.babies_age || "",
          compagnie: req.airline_preference || "",
          besoinVisa: req.visa_needed ? "Oui" : "Non",
          message: req.special_requests || "",
        }));

        setRealBilletterieRequests(mappedRequests);
      } catch (error) {
        console.error("Error loading billetterie requests:", error);
        toast.error("Erreur lors du chargement des demandes. Vérifiez les permissions RLS dans Supabase.");
      } finally {
        setLoadingBilletterie(false);
      }
    };

    loadBilletterieRequests();

    // Also load hotel requests from Supabase
    const loadHotelRequests = async () => {
      try {
        const supabaseHotelRequests = await fetchHotelRequests();
        
        const mappedHotelRequests: HotelRequest[] = supabaseHotelRequests.map((req: any) => ({
          id: req.id,
          serviceType: "hotel" as const,
          createdAt: req.created_at,
          isRead: req.is_read || false,
          completed: req.status === "completed",
          personalInfo: {
            nom: req.nom || "",
            prenom: req.prenom || "",
            email: req.email || "",
            telephone: req.phone || "",
          },
          hotelPreference: req.hotel_preference || "suggest",
          hotelName: req.hotel_name || "",
          hotelCategory: req.hotel_category || "",
          city: req.city || "",
          dateArrivee: req.check_in_date || "",
          dateDepart: req.check_out_date || "",
          nombreChambres: (req.number_of_rooms || 0).toString(),
          nombrePersonnes: (req.number_of_people || 0).toString(),
          roomType: req.room_type || "",
          boardBasis: req.meal_basis || "",
          message: req.special_requests || "",
        }));

        setRealHotelRequests(mappedHotelRequests);
        console.log("🏨 Hotel requests loaded:", mappedHotelRequests.length);
      } catch (error) {
        console.error("Error loading hotel requests:", error);
      }
    };

    loadHotelRequests();
  }, [loggedIn]);

  // Ensure arrays are defined with fallbacks
  const safeSejourDestinations = sejourDestinations || [];
  const safeSejourServices = sejourServices || [];
  const safeEVisaCountries = eVisaCountries || [];
  const safeDossierCountries = dossierCountries || [];
  const safeRequests = requests || [];

  // ========== BILLETTERIE REQUEST HANDLERS ==========
  // These handlers work with real Supabase data when available, fall back to context
  
  const handleMarkBilletterieAsRead = async (id: string) => {
    try {
      // Check if it's a hotel request first
      const hotelRequest = realHotelRequests.find(r => r.id === id);
      if (hotelRequest) {
        // Toggle the current status
        const newStatus = !hotelRequest.isRead;
        const success = await updateHotelRequestStatus(id, newStatus);
        if (success) {
          setRealHotelRequests((prev) =>
            prev.map((r) => (r.id === id ? { ...r, isRead: newStatus } : r))
          );
          toast.success(newStatus ? "Marqué comme lu" : "Marqué comme non lu");
          return;
        }
        toast.error("Erreur lors de la mise à jour");
        return;
      }

      // Try billetterie
      const billetterieRequest = realBilletterieRequests.find(r => r.id === id);
      if (billetterieRequest) {
        // Toggle the current status
        const newStatus = !billetterieRequest.isRead;
        const success = await markRequestAsReadService(id, "billetterie", newStatus);
        if (success) {
          setRealBilletterieRequests((prev) =>
            prev.map((r) => (r.id === id ? { ...r, isRead: newStatus } : r))
          );
          toast.success(newStatus ? "Marqué comme lu" : "Marqué comme non lu");
          return;
        }
        toast.error("Erreur lors de la mise à jour");
        return;
      }

      // Fallback to context for other request types (visa, sejour)
      // For context-based requests, we'll just toggle using the context method
      const contextRequest = safeRequests.find(r => r.id === id);
      if (contextRequest) {
        markRequestAsRead(id);
        toast.success("Marqué comme lu");
      }
    } catch (error) {
      console.error("Error marking request as read:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleDeleteBilletterieRequest = async (id: string) => {
    try {
      // Check if it's a hotel request first
      const hotelRequest = realHotelRequests.find(r => r.id === id);
      if (hotelRequest) {
        const success = await deleteRequestService(id, "hotel");
        if (success) {
          setRealHotelRequests((prev) => prev.filter((r) => r.id !== id));
          toast.success("Demande supprimée");
          return;
        }
        toast.error("Erreur lors de la suppression");
        return;
      }

      // Try billetterie
      const billetterieRequest = realBilletterieRequests.find(r => r.id === id);
      if (billetterieRequest) {
        const success = await deleteRequestService(id, "billetterie");
        if (success) {
          setRealBilletterieRequests((prev) => prev.filter((r) => r.id !== id));
          toast.success("Demande supprimée");
          return;
        }
        toast.error("Erreur lors de la suppression");
        return;
      }

      // Fallback to context for other request types
      deleteRequest(id);
      toast.success("Demande supprimée");
    } catch (error) {
      console.error("Error deleting request:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleLogout = () => {
    // Nettoyage de la session
    setLoggedIn(false);
    setShowLogoutConfirm(false);
    // Redirection vers la page d'accueil
    navigate("/");
    // Notification de confirmation
    toast.success("Déconnexion réussie, à bientôt !");
  };

  if (!loggedIn) {
    return <AdminLogin onLogin={() => setLoggedIn(true)} />;
  }

  const sidebarItems: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "inbox", label: "Boîte de Réception", icon: Inbox, count: safeRequests.filter((r) => !r.isRead).length },
    { id: "users", label: "Gérer les Comptes", icon: Users },
    { id: "voyages", label: "Gérer les Voyages Organisés", icon: Plane },
    { id: "sejour-config", label: "Configuration Séjour", icon: Settings2 },
    { id: "visa-config", label: "Configuration Visa", icon: FileText },
    { id: "settings", label: "Paramètres Admin", icon: Settings2 },
  ];

  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    setSidebarOpen(false); // Fermer la sidebar sur mobile après sélection
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-primary hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Menu"
        >
          <Menu size={24} />
        </button>
        <img src={logo} alt="HOUSE OF TRAVEL" className="h-10 w-auto" />
        <div className="w-10" /> {/* Spacer pour centrer le logo */}
      </div>

      {/* Overlay pour mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-foreground/20"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-60 bg-white text-foreground flex flex-col shrink-0 border-r border-accent/20
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-accent/20">
          <Link to="/" className="flex flex-col items-center">
            <img src={logo} alt="HOUSE OF TRAVEL" className="h-16 w-auto mb-3" />
          </Link>
          <p className="text-xs text-muted-foreground mt-2 text-center">Administration</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 lg:py-2.5 rounded-lg text-sm font-medium transition-colors touch-manipulation
                ${tab === item.id ? "bg-primary text-white" : "text-foreground hover:text-primary hover:bg-muted/50"}`}
            >
              <item.icon size={20} className="lg:w-[18px] lg:h-[18px]" />
              {item.label}
              {item.count ? (
                <span className="ml-auto bg-accent text-primary text-xs px-2 py-0.5 rounded-full tabular-nums">
                  {item.count}
                </span>
              ) : null}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-accent/20">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-3 py-3 lg:py-2.5 rounded-lg text-sm text-foreground hover:text-primary hover:bg-muted/50 transition-colors touch-manipulation"
          >
            <LogOut size={20} className="lg:w-[18px] lg:h-[18px]" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setShowLogoutConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 max-w-md w-full">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <LogOut size={24} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      Confirmer la déconnexion
                    </h3>
                    <p className="text-sm text-slate-600">
                      Êtes-vous sûr de vouloir vous déconnecter ?
                    </p>
                  </div>
                </div>
                <div className="flex flex-col-reverse sm:flex-row gap-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Se déconnecter
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="flex-1 overflow-auto pt-16 lg:pt-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {tab === "inbox" ? (
            <div>
              {loadingBilletterie && (
                <div className="flex items-center justify-center py-12 bg-white rounded-lg border border-slate-200 mb-6">
                  <div className="text-center">
                    <Loader2 className="animate-spin h-8 w-8 text-primary mx-auto mb-3" />
                    <p className="text-slate-600">Chargement des demandes...</p>
                  </div>
                </div>
              )}
              <InboxView
                requests={[
                  ...(realBilletterieRequests.length > 0 ? realBilletterieRequests : safeRequests.filter(r => r.serviceType === "billetterie")),
                  ...realHotelRequests,
                  ...safeRequests.filter(r => r.serviceType === "visa" || r.serviceType === "sejour"),
                  ...(realBilletterieRequests.length === 0 ? safeRequests.filter(r => r.serviceType === "hotel") : []),
                ]}
                markRequestAsRead={realBilletterieRequests.length > 0 || realHotelRequests.length > 0 ? handleMarkBilletterieAsRead : markRequestAsRead}
                deleteRequest={realBilletterieRequests.length > 0 || realHotelRequests.length > 0 ? handleDeleteBilletterieRequest : deleteRequest}
              />
              {!loadingBilletterie && realBilletterieRequests.length === 0 && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                  <p className="font-semibold mb-2">💡 Conseil RLS</p>
                  <p>Si les demandes n'apparaissent pas, vérifiez les permissions RLS dans Supabase:</p>
                  <ol className="mt-2 ml-4 list-decimal space-y-1 text-xs">
                    <li>Allez dans Supabase → Table <code className="bg-blue-100 px-1 rounded">billetterie_requests</code></li>
                    <li>Cliquez sur l'onglet <code className="bg-blue-100 px-1 rounded">RLS</code></li>
                    <li>Créez une policy pour permettre aux utilisateurs connectés (authenticated) d'avoir SELECT</li>
                  </ol>
                </div>
              )}
            </div>
          ) : tab === "users" ? (
            <UsersView />
          ) : tab === "sejour-config" ? (
            <SejourConfigView
              services={safeSejourServices}
              addService={addSejourService}
              deleteService={deleteSejourService}
            />
          ) : tab === "visa-config" ? (
            <VisaConfigView
              eVisaCountries={safeEVisaCountries}
              dossierCountries={safeDossierCountries}
              addEVisaCountry={addEVisaCountry}
              deleteEVisaCountry={deleteEVisaCountry}
              addDossierCountry={addDossierCountry}
              updateDossierCountry={updateDossierCountry}
              deleteDossierCountry={deleteDossierCountry}
            />
          ) : tab === "settings" ? (
            <AdminSettingsView />
          ) : (
            <VoyagesView
              voyages={voyages}
              addVoyage={addVoyage}
              updateVoyage={updateVoyage}
              deleteVoyage={deleteVoyage}
              showAddForm={showAddForm}
              setShowAddForm={setShowAddForm}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* Login */
const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const navigate = useNavigate();
  const { validateAdminLogin, verifyAdminRecoveryCode, resetAdminPassword } = useData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Forgot Password Modal States
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState<"code" | "password">("code");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryErrors, setRecoveryErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    setLoading(true);
    
    // Simulate network delay for better UX
    setTimeout(() => {
      if (validateAdminLogin(email, password)) {
        toast.success("Connexion réussie !");
        onLogin();
      } else {
        toast.error("Identifiants incorrects");
        setPassword(""); // Clear password on error
      }
      setLoading(false);
    }, 800);
  };

  const handleVerifyRecoveryCode = () => {
    setRecoveryErrors({});
    
    if (!recoveryCode.trim()) {
      setRecoveryErrors({ code: "Veuillez entrer le code de sécurité" });
      return;
    }
    
    setRecoveryLoading(true);
    
    setTimeout(() => {
      if (verifyAdminRecoveryCode(recoveryCode)) {
        toast.success("Code vérifié avec succès !");
        setRecoveryStep("password");
        setRecoveryCode("");
      } else {
        toast.error("Code de sécurité incorrect");
        setRecoveryErrors({ code: "Code incorrect" });
      }
      setRecoveryLoading(false);
    }, 800);
  };

  const handleResetPassword = () => {
    setRecoveryErrors({});
    
    const newErrors: Record<string, string> = {};
    
    if (!newPassword.trim()) {
      newErrors.newPassword = "Le nouveau mot de passe est requis";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Le mot de passe doit contenir au moins 6 caractères";
    }
    
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Veuillez confirmer le mot de passe";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setRecoveryErrors(newErrors);
      return;
    }
    
    setRecoveryLoading(true);
    
    setTimeout(() => {
      if (resetAdminPassword(newPassword)) {
        toast.success("Mot de passe réinitialisé avec succès ✅");
        closeForgotPasswordModal();
      } else {
        toast.error("Erreur lors de la réinitialisation");
      }
      setRecoveryLoading(false);
    }, 800);
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPassword(false);
    setRecoveryStep("code");
    setRecoveryCode("");
    setNewPassword("");
    setConfirmPassword("");
    setRecoveryErrors({});
    setRecoveryLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 relative">
      {/* Bouton Retour à l'accueil */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-muted/50 touch-manipulation"
        aria-label="Retour à l'accueil"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-medium hidden sm:inline">Retour</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white p-6 sm:p-8 rounded-2xl shadow-elegant border border-accent/20"
      >
        <div className="text-center mb-6 sm:mb-8">
          <img src={logo} alt="HOUSE OF TRAVEL" className="h-20 sm:h-24 w-auto mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Administration</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" placeholder="EX : Houseoftravel@gmail.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground px-6 py-3.5 rounded-lg font-semibold hover:scale-[1.01] active:scale-[0.99] transition-all touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </button>
          
          {/* Forgot Password Link */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-slate-500 hover:text-primary transition-colors underline"
            >
              Mot de passe oublié ?
            </button>
          </div>
        </form>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotPassword && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={closeForgotPasswordModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 max-w-md w-full">
                {/* Phase 1: Code Entry */}
                {recoveryStep === "code" && (
                  <>
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Settings2 size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                          Récupération du compte
                        </h3>
                        <p className="text-sm text-slate-600">
                          Entrez le code de sécurité pour réinitialiser votre mot de passe
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Code de sécurité (6 chiffres) *
                        </label>
                        <input
                          type="text"
                          value={recoveryCode}
                          onChange={(e) => {
                            setRecoveryCode(e.target.value);
                            if (recoveryErrors.code) {
                              setRecoveryErrors({ ...recoveryErrors, code: "" });
                            }
                          }}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-center text-lg tracking-widest font-mono ${
                            recoveryErrors.code ? "border-red-500" : "border-slate-300"
                          }`}
                          placeholder="000000"
                          maxLength={6}
                        />
                        {recoveryErrors.code && (
                          <p className="text-red-500 text-xs mt-1">{recoveryErrors.code}</p>
                        )}
                      </div>

                      {/* Security Notice */}
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-xs text-yellow-800">
                          <strong>Note:</strong> Contactez le service technique si vous n'avez pas le code
                        </p>
                      </div>

                      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                        <button
                          onClick={closeForgotPasswordModal}
                          className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={handleVerifyRecoveryCode}
                          disabled={recoveryLoading}
                          className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {recoveryLoading ? (
                            <>
                              <Loader2 size={18} className="animate-spin" />
                              Vérification...
                            </>
                          ) : (
                            "Vérifier le code"
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Phase 2: New Password */}
                {recoveryStep === "password" && (
                  <>
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={24} className="text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                          Nouveau mot de passe
                        </h3>
                        <p className="text-sm text-slate-600">
                          Choisissez un nouveau mot de passe sécurisé
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Nouveau mot de passe *
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            if (recoveryErrors.newPassword) {
                              setRecoveryErrors({ ...recoveryErrors, newPassword: "" });
                            }
                          }}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                            recoveryErrors.newPassword ? "border-red-500" : "border-slate-300"
                          }`}
                          placeholder="Minimum 6 caractères"
                        />
                        {recoveryErrors.newPassword && (
                          <p className="text-red-500 text-xs mt-1">{recoveryErrors.newPassword}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Confirmer le mot de passe *
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (recoveryErrors.confirmPassword) {
                              setRecoveryErrors({ ...recoveryErrors, confirmPassword: "" });
                            }
                          }}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                            recoveryErrors.confirmPassword ? "border-red-500" : "border-slate-300"
                          }`}
                          placeholder="Confirmez votre mot de passe"
                        />
                        {recoveryErrors.confirmPassword && (
                          <p className="text-red-500 text-xs mt-1">{recoveryErrors.confirmPassword}</p>
                        )}
                      </div>

                      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                        <button
                          onClick={closeForgotPasswordModal}
                          className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={handleResetPassword}
                          disabled={recoveryLoading}
                          className="flex-1 px-4 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {recoveryLoading ? (
                            <>
                              <Loader2 size={18} className="animate-spin" />
                              Réinitialisation...
                            </>
                          ) : (
                            <>
                              <CheckCircle size={18} />
                              Réinitialiser
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

/* Admin Settings View - Password Change */
const AdminSettingsView = () => {
  const { adminCredentials, updateAdminPassword } = useData();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!currentPassword.trim()) {
      newErrors.currentPassword = "Le mot de passe actuel est requis";
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = "Le nouveau mot de passe est requis";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Le mot de passe doit contenir au moins 6 caractères";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Veuillez confirmer le nouveau mot de passe";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const success = updateAdminPassword(currentPassword, newPassword);

      if (success) {
        toast.success("Mot de passe modifié avec succès !");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrors({});
        
        // Show success message
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        toast.error("Le mot de passe actuel est incorrect");
        setErrors({ currentPassword: "Mot de passe incorrect" });
      }

      setLoading(false);
    }, 800);
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Paramètres Admin</h2>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 max-w-2xl">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-primary mb-2">Modifier le mot de passe</h3>
          <p className="text-sm text-slate-600">
            Changez votre mot de passe administrateur pour sécuriser votre compte
          </p>
        </div>

        {/* Current Credentials Display */}
        <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-sm font-medium text-slate-700 mb-2">Email administrateur actuel:</p>
          <p className="text-sm text-slate-900 font-mono">{adminCredentials.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Success Message */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-green-50 border-2 border-green-500 rounded-lg flex items-center gap-3"
              >
                <CheckCircle size={24} className="text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-800">Modifié avec succès ✅</p>
                  <p className="text-xs text-green-700">Votre mot de passe a été mis à jour</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Ancien mot de passe *
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                if (errors.currentPassword) {
                  setErrors({ ...errors, currentPassword: "" });
                }
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                errors.currentPassword ? "border-red-500" : "border-slate-300"
              }`}
              placeholder="Entrez votre mot de passe actuel"
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Nouveau mot de passe *
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (errors.newPassword) {
                  setErrors({ ...errors, newPassword: "" });
                }
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                errors.newPassword ? "border-red-500" : "border-slate-300"
              }`}
              placeholder="Minimum 6 caractères"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Confirmer le nouveau mot de passe *
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) {
                  setErrors({ ...errors, confirmPassword: "" });
                }
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                errors.confirmPassword ? "border-red-500" : "border-slate-300"
              }`}
              placeholder="Confirmez votre nouveau mot de passe"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Enregistrer le nouveau mot de passe
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>Note de sécurité:</strong> Après avoir changé votre mot de passe, vous devrez utiliser le nouveau mot de passe pour toutes les connexions futures.
          </p>
        </div>
      </div>
    </div>
  );
};

/* Users Management View */
const UsersView = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
    
    // Listen for new user registrations from Supabase
    const handleUserUpdate = () => {
      loadUsers();
    };
    
    window.addEventListener("userRegistered", handleUserUpdate);
    
    return () => {
      window.removeEventListener("userRegistered", handleUserUpdate);
    };
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Query only from the users table - ensures only fully registered users appear
      // (profiles are only created after email verification AND password setup)
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false }); // Most recent first

      if (error) {
        console.error("Error loading users:", error);
        toast.error("Erreur lors du chargement des utilisateurs");
        setUsers([]);
      } else {
        setUsers(data || []);
      }
    } catch (error: any) {
      console.error("Error loading users:", error);
      toast.error("Erreur lors du chargement des utilisateurs");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Delete from users table
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", userId);

      if (error) {
        toast.error("Erreur lors de la suppression");
        return;
      }

      // Also delete from auth if possible (requires admin privileges)
      try {
        await supabase.auth.admin.deleteUser(userId);
      } catch (authError) {
        console.warn("Could not delete auth user, may require admin privileges:", authError);
      }

      loadUsers();
      setShowDeleteConfirm(null);
      toast.success("Utilisateur supprimé avec succès");
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "---";
      return new Date(dateString).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "---";
    }
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Gérer les Comptes</h2>

      {/* Compact Stats Card - Minimalist White Design */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4"
      >
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-600 mb-0.5">Total Inscriptions</p>
              <p className="text-xl font-bold tabular-nums text-slate-900">{users.length}</p>
            </div>
            <div className="bg-slate-100 p-2.5 rounded-lg">
              <Users size={20} className="text-slate-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmer la suppression</h3>
              <p className="text-sm text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer ce compte utilisateur ? Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDeleteUser(showDeleteConfirm)}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center p-4"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedUser.fullName || `${selectedUser.prenom || ''} ${selectedUser.nom || ''}`.trim() || 'Utilisateur'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">ID: {selectedUser.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedUser(null)} 
                  className="text-gray-400 hover:text-gray-600 p-2 -mr-2"
                  aria-label="Fermer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* User Info */}
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Informations du Compte</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Nom:</strong> {selectedUser.nom || "---"}</p>
                    <p><strong>Prénom:</strong> {selectedUser.prenom || "---"}</p>
                    <p><strong>Email:</strong> {selectedUser.email || "---"}</p>
                    <p><strong>Téléphone:</strong> {selectedUser.phone || "---"}</p>
                    <p><strong>Date d'inscription:</strong> {selectedUser.dateInsc || formatDate(selectedUser.createdAt)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Users Table - Minimalist SaaS Design with Mobile Scroll */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-slate-100">
          <table className="w-full" style={{ minWidth: '600px' }}>
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-2 sm:px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                  Nom
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                  Prénom
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                  Email
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                  Téléphone
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                  Date
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wider whitespace-nowrap sticky right-0 bg-primary shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-slate-500 text-sm">
                    Aucun utilisateur enregistré
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr 
                    key={user.id} 
                    className={`hover:bg-slate-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                  >
                    <td className="px-2 sm:px-3 py-2.5 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-900">
                        {user.nom || "---"}
                      </span>
                    </td>
                    <td className="px-2 sm:px-3 py-2.5 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-900">
                        {user.prenom || "---"}
                      </span>
                    </td>
                    <td className="px-2 sm:px-3 py-2.5 whitespace-nowrap">
                      <span className="text-sm text-slate-600">
                        {user.email || "---"}
                      </span>
                    </td>
                    <td className="px-2 sm:px-3 py-2.5 whitespace-nowrap">
                      <span className="text-sm text-slate-600">
                        {user.phone || "---"}
                      </span>
                    </td>
                    <td className="px-2 sm:px-3 py-2.5 text-sm text-slate-600 whitespace-nowrap">
                      {user.dateInsc || formatDate(user.createdAt)}
                    </td>
                    <td className="px-2 sm:px-3 py-2.5 sticky right-0 bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                          title="Voir les détails"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(user.id)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* Requests View - DEPRECATED - Keeping for reference */
const RequestsView = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  useEffect(() => {
    const adminInbox = JSON.parse(localStorage.getItem("admin_inbox") || "[]");
    setRequests(adminInbox.reverse()); // Most recent first
  }, []);

  const markAsRead = (id: string) => {
    const adminInbox = JSON.parse(localStorage.getItem("admin_inbox") || "[]");
    const updated = adminInbox.map((req: any) => 
      req.id === id ? { ...req, isRead: true } : req
    );
    localStorage.setItem("admin_inbox", JSON.stringify(updated));
    setRequests(updated.reverse());
  };

  const openRequest = (request: any) => {
    setSelectedRequest(request);
    if (!request.isRead) {
      markAsRead(request.id);
    }
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Demandes Clients</h2>

      {/* Request Detail Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/20 flex items-center justify-center p-4"
            onClick={() => setSelectedRequest(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-elegant border border-accent/20 p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedRequest.type === "Devis" 
                        ? "bg-primary/10 text-primary" 
                        : "bg-green-100 text-green-700"
                    }`}>
                      {selectedRequest.type}
                    </span>
                    {selectedRequest.userInfo.isAnonymous && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                        Visiteur Anonyme
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-primary">
                    {selectedRequest.userInfo.name}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedRequest(null)} 
                  className="text-muted-foreground hover:text-foreground p-2 -mr-2 touch-manipulation"
                  aria-label="Fermer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* User Info */}
              <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="text-sm font-semibold text-primary mb-3">Informations de Contact</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> {selectedRequest.userInfo.email}</p>
                  <p><strong>Téléphone:</strong> {selectedRequest.userInfo.phone}</p>
                  <p><strong>Date:</strong> {new Date(selectedRequest.timestamp).toLocaleString("fr-FR")}</p>
                </div>
              </div>

              {/* Form Data */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-primary mb-3">Détails de la Demande</h4>
                {Object.entries(selectedRequest.formData).map(([key, value]: [string, any]) => (
                  value && value !== "Non spécifié" && value !== "" && (
                    <div key={key} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-sm font-medium text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-sm text-gray-900 text-right ml-4 max-w-[60%]">
                        {value}
                      </span>
                    </div>
                  )
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
                  Date
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    Aucune demande pour le moment
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr 
                    key={request.id} 
                    className={`hover:bg-gray-50 transition-colors ${!request.isRead ? "bg-blue-50/50" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {!request.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {request.userInfo.name}
                          </p>
                          <p className="text-xs text-gray-500">{request.userInfo.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                        request.type === "Devis" 
                          ? "bg-primary/10 text-primary" 
                          : "bg-green-100 text-green-700"
                      }`}>
                        {request.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                      {new Date(request.timestamp).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => openRequest(request)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                      >
                        <Eye size={16} />
                        <span className="hidden sm:inline">Voir</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* Voyages */
const VoyagesView = ({
  voyages, addVoyage, updateVoyage, deleteVoyage, showAddForm, setShowAddForm,
}: {
  voyages: Voyage[];
  addVoyage: (voyage: Voyage) => void;
  updateVoyage: (id: string, voyage: Partial<Voyage>) => void;
  deleteVoyage: (id: string) => void;
  showAddForm: boolean;
  setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [newVoyage, setNewVoyage] = useState({
    title: "", imageUrl: "", imageUrls: [] as string[], price: "", description: "", category: "Voyage Organisé" as VoyageCategory, duration: "", date: "", status: "normal" as VoyageStatus, flightType: "", visaRequired: "", roomType: "", mealPlan: "", features: [] as string[],
  });
  const [newFeatureInput, setNewFeatureInput] = useState("");
  const [newStartDate, setNewStartDate] = useState<Date | undefined>();
  const [newEndDate, setNewEndDate] = useState<Date | undefined>();
  const [newStages, setNewStages] = useState<Stage[]>([
    { id: "stage-1", name: "", hotelName: "", googleMapsUrl: "", days: 0 },
  ]);
  const [newDaysMismatch, setNewDaysMismatch] = useState(false);
  
  const [editingVoyage, setEditingVoyage] = useState<Voyage | null>(null);
  const [editForm, setEditForm] = useState({
    title: "", imageUrl: "", imageUrls: [] as string[], price: "", description: "", category: "Voyage Organisé" as VoyageCategory, duration: "", date: "", status: "normal" as VoyageStatus, flightType: "", visaRequired: "", roomType: "", mealPlan: "", features: [] as string[],
  });
  const [editFeatureInput, setEditFeatureInput] = useState("");
  const [editStartDate, setEditStartDate] = useState<Date | undefined>();
  const [editEndDate, setEditEndDate] = useState<Date | undefined>();
  const [editStages, setEditStages] = useState<Stage[]>([
    { id: "stage-1", name: "", hotelName: "", googleMapsUrl: "", days: 0 },
  ]);
  const [editDaysMismatch, setEditDaysMismatch] = useState(false);
  
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Helper function to add a new stage
  const addNewStage = () => {
    const newStage: Stage = {
      id: `stage-${Date.now()}`,
      name: "",
      hotelName: "",
      googleMapsUrl: "",
      days: 0,
    };
    setNewStages([...newStages, newStage]);
  };

  // Helper function to add a new stage in edit mode
  const addEditStage = () => {
    const newStage: Stage = {
      id: `stage-${Date.now()}`,
      name: "",
      hotelName: "",
      googleMapsUrl: "",
      days: 0,
    };
    setEditStages([...editStages, newStage]);
  };

  // Calculer automatiquement la durée et formater la date
  const calculateDurationAndDate = (start?: Date, end?: Date) => {
    if (!start || !end) return { duration: "", date: "" };
    
    const days = differenceInDays(end, start) + 1;
    const duration = `${days} jour${days > 1 ? 's' : ''}`;
    const date = `${format(start, "dd/MM/yyyy", { locale: fr })} - ${format(end, "dd/MM/yyyy", { locale: fr })}`;
    
    return { duration, date };
  };

  // Calculer la durée pour l'affichage en temps réel
  const getCalculatedDuration = (start?: Date, end?: Date) => {
    if (!start || !end) return "";
    const days = differenceInDays(end, start) + 1;
    return `${days} jour${days > 1 ? 's' : ''}`;
  };

  // Calculer le nombre total de jours
  const getTotalDays = (start?: Date, end?: Date) => {
    if (!start || !end) return 0;
    return differenceInDays(end, start) + 1;
  };

  // Vérifier si la catégorie nécessite des étapes
  const needsStages = (category: VoyageCategory) => {
    return category === "Voyage Organisé";
  };

  // Valider les étapes avant soumission
  const validateStages = (stages: Stage[], totalDays: number, category: VoyageCategory) => {
    if (!needsStages(category)) return true;
    
    // Vérifier que les champs obligatoires sont remplis (name et days)
    const allFilled = stages.every(s => s.name && s.days > 0);
    if (!allFilled) {
      toast.error("Veuillez remplir le nom et le nombre de jours pour chaque étape");
      return false;
    }
    
    // Vérifier que la somme des jours correspond
    const stageDaysTotal = stages.reduce((sum, s) => sum + s.days, 0);
    if (stageDaysTotal !== totalDays) {
      toast.error(`La somme des jours des étapes (${stageDaysTotal}) ne correspond pas à la durée totale (${totalDays} jours)`);
      return false;
    }
    
    return true;
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoyage.title || !newVoyage.price) return;
    
    // Pour "Voyage à la Carte", utiliser des valeurs par défaut
    let duration, date;
    let totalDays = 0;
    
    if (newVoyage.category === "Voyage à la Carte") {
      duration = "Sur mesure";
      date = "Dates flexibles";
    } else {
      const calculated = calculateDurationAndDate(newStartDate, newEndDate);
      duration = calculated.duration;
      date = calculated.date;
      totalDays = getTotalDays(newStartDate, newEndDate);
      
      // Valider les étapes si nécessaire
      if (needsStages(newVoyage.category) && !validateStages(newStages, totalDays, newVoyage.category)) {
        return;
      }
    }
    
    setSaving(true);
    
    setTimeout(() => {
      const v: Voyage = {
        id: String(Date.now()),
        title: newVoyage.title,
        imageUrl: newVoyage.imageUrls[0] || newVoyage.imageUrl || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
        imageUrls: newVoyage.imageUrls.length > 0 ? newVoyage.imageUrls : undefined,
        price: Number(newVoyage.price),
        description: newVoyage.description,
        category: newVoyage.category,
        duration: duration || newVoyage.duration,
        date: date || newVoyage.date,
        createdAt: new Date().toISOString(),
        stages: needsStages(newVoyage.category) ? newStages : undefined,
        status: newVoyage.status,
        features: newVoyage.features.length > 0 ? newVoyage.features : undefined,
        flightType: newVoyage.flightType || undefined,
        visaRequired: newVoyage.visaRequired || undefined,
        roomType: newVoyage.roomType || undefined,
        mealPlan: newVoyage.mealPlan || undefined,
      };
      addVoyage(v);
      setShowAddForm(false);
      setNewVoyage({ title: "", imageUrl: "", imageUrls: [], price: "", description: "", category: "Voyage Organisé", duration: "", date: "", status: "normal", flightType: "", visaRequired: "", roomType: "", mealPlan: "", features: [] });
      setNewFeatureInput("");
      setNewStartDate(undefined);
      setNewEndDate(undefined);
      setNewStages([
        { id: "stage-1", name: "", hotelName: "", googleMapsUrl: "", days: 0 },
      ]);
      setSaving(false);
      toast.success("Voyage ajouté avec succès");
    }, 800);
  };

  const handleDelete = (id: string) => {
    deleteVoyage(id);
    setDeleteConfirmId(null);
    toast.success("Voyage supprimé avec succès");
  };

  const openEditModal = (voyage: Voyage) => {
    setEditingVoyage(voyage);
    setEditForm({
      title: voyage.title,
      imageUrl: voyage.imageUrl,
      imageUrls: voyage.imageUrls || [],
      price: String(voyage.price),
      description: voyage.description || "",
      category: voyage.category,
      duration: voyage.duration || "",
      date: voyage.date || "",
      status: voyage.status || "normal",
      features: voyage.features || [],
      flightType: voyage.flightType || "",
      visaRequired: voyage.visaRequired || "",
      roomType: voyage.roomType || "",
      mealPlan: voyage.mealPlan || "",
    });
    
    // Parser et charger les dates existantes si disponibles
    if (voyage.date && voyage.category !== "Voyage à la Carte") {
      try {
        // Format attendu: "DD/MM/YYYY - DD/MM/YYYY"
        const dateParts = voyage.date.split(" - ");
        if (dateParts.length === 2) {
          const [startStr, endStr] = dateParts;
          // Parser les dates au format DD/MM/YYYY
          const [startDay, startMonth, startYear] = startStr.split("/").map(Number);
          const [endDay, endMonth, endYear] = endStr.split("/").map(Number);
          
          if (startDay && startMonth && startYear) {
            setEditStartDate(new Date(startYear, startMonth - 1, startDay));
          }
          if (endDay && endMonth && endYear) {
            setEditEndDate(new Date(endYear, endMonth - 1, endDay));
          }
        }
      } catch (error) {
        console.error("Erreur lors du parsing des dates:", error);
        setEditStartDate(undefined);
        setEditEndDate(undefined);
      }
    } else {
      setEditStartDate(undefined);
      setEditEndDate(undefined);
    }
    
    // Charger les étapes existantes ou initialiser
    setEditStages(voyage.stages || [
      { id: "stage-1", name: "", hotelName: "", googleMapsUrl: "", days: 0 },
    ]);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.title || !editForm.price || !editingVoyage) return;
    
    // Pour "Voyage à la Carte", utiliser des valeurs par défaut
    let duration, date;
    let totalDays = 0;
    
    if (editForm.category === "Voyage à la Carte") {
      duration = "Sur mesure";
      date = "Dates flexibles";
    } else {
      // Si les dates ont été modifiées, calculer les nouvelles valeurs
      if (editStartDate && editEndDate) {
        const calculated = calculateDurationAndDate(editStartDate, editEndDate);
        duration = calculated.duration;
        date = calculated.date;
        totalDays = getTotalDays(editStartDate, editEndDate);
        
        // Valider les étapes si nécessaire
        if (needsStages(editForm.category) && !validateStages(editStages, totalDays, editForm.category)) {
          return;
        }
      } else {
        // Conserver les anciennes valeurs si les dates n'ont pas été modifiées
        duration = editingVoyage.duration;
        date = editingVoyage.date;
      }
    }
    
    setSaving(true);
    
    setTimeout(() => {
      updateVoyage(editingVoyage.id, {
        title: editForm.title,
        imageUrl: editForm.imageUrls[0] || editForm.imageUrl || editingVoyage.imageUrl,
        imageUrls: editForm.imageUrls.length > 0 ? editForm.imageUrls : undefined,
        price: Number(editForm.price),
        description: editForm.description,
        category: editForm.category,
        duration: duration || editForm.duration,
        date: date || editForm.date,
        stages: needsStages(editForm.category) ? editStages : undefined,
        status: editForm.status,
        features: editForm.features.length > 0 ? editForm.features : undefined,
        flightType: editForm.flightType || undefined,
        visaRequired: editForm.visaRequired || undefined,
        roomType: editForm.roomType || undefined,
        mealPlan: editForm.mealPlan || undefined,
      });
      setEditingVoyage(null);
      setEditFeatureInput("");
      setEditStartDate(undefined);
      setEditEndDate(undefined);
      setSaving(false);
      toast.success("Voyage modifié avec succès");
    }, 800);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Gérer les Voyages Organisés</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          {showAddForm ? <X size={16} /> : <Plus size={16} />}
          {showAddForm ? "Annuler" : "Ajouter un Voyage"}
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="bg-white p-6 rounded-2xl shadow-card border border-accent/20 mb-6 space-y-4 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Titre *</label>
                <input type="text" value={newVoyage.title} onChange={(e) => setNewVoyage({ ...newVoyage, title: e.target.value })} className="form-input" required maxLength={200} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Prix (À partir de) - DA *</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={newVoyage.price} 
                    onChange={(e) => setNewVoyage({ ...newVoyage, price: e.target.value })} 
                    className="form-input pr-12" 
                    required 
                    min={0}
                    step="0.01"
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">DA</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Statut du voyage</label>
              <select value={newVoyage.status} onChange={(e) => setNewVoyage({ ...newVoyage, status: e.target.value as VoyageStatus })} className="form-input">
                <option value="normal">Normal</option>
                <option value="almost-full">Bientôt complet (باقي أماكن قليلة)</option>
                <option value="full">Complet (الرحلة كاملة)</option>
                <option value="limited-offer">Offre limitée (عرض محدود)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Dates du voyage {newVoyage.category !== "Voyage à la Carte" && "*"}
              </label>
              {newVoyage.category === "Voyage à la Carte" ? (
                <div className="form-input bg-muted/30 cursor-not-allowed flex items-center justify-center text-muted-foreground">
                  Dates flexibles - Sur mesure
                </div>
              ) : (
                <>
                  <DateRangePicker
                    startDate={newStartDate}
                    endDate={newEndDate}
                    onStartDateChange={setNewStartDate}
                    onEndDateChange={setNewEndDate}
                  />
                  {newStartDate && newEndDate && (
                    <p className="text-xs text-primary mt-2 font-medium">
                      ✓ Durée : {getCalculatedDuration(newStartDate, newEndDate)} • 
                      Période : {format(newStartDate, "dd/MM/yyyy")} - {format(newEndDate, "dd/MM/yyyy")}
                    </p>
                  )}
                </>
              )}
            </div>

            <MultiImageUpload
              value={newVoyage.imageUrls}
              onChange={(imageUrls) => setNewVoyage({ ...newVoyage, imageUrls })}
              maxFiles={10}
              label="Photos du voyage"
            />
            <div>
              <label className="block text-sm font-medium mb-1.5">Description</label>
              <textarea value={newVoyage.description} onChange={(e) => setNewVoyage({ ...newVoyage, description: e.target.value })} className="form-input min-h-[80px] resize-y" maxLength={1000} />
            </div>

            {/* Points Forts du Voyage */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Points Forts du Voyage</label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeatureInput}
                    onChange={(e) => setNewFeatureInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newFeatureInput.trim()) {
                          setNewVoyage({ ...newVoyage, features: [...newVoyage.features, newFeatureInput.trim()] });
                          setNewFeatureInput("");
                        }
                      }
                    }}
                    className="form-input flex-1"
                    placeholder="Ex: Vol Direct, Hôtel 4*, All Inclusive..."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newFeatureInput.trim()) {
                        setNewVoyage({ ...newVoyage, features: [...newVoyage.features, newFeatureInput.trim()] });
                        setNewFeatureInput("");
                      }
                    }}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Ajouter
                  </button>
                </div>
                {newVoyage.features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newVoyage.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-sm font-medium"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => {
                            setNewVoyage({
                              ...newVoyage,
                              features: newVoyage.features.filter((_, i) => i !== idx)
                            });
                          }}
                          className="hover:text-purple-900 transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sections d'étapes conditionnelles */}
            {needsStages(newVoyage.category) && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pt-2">
                  <div className="h-px flex-1 bg-accent/20" />
                  <h3 className="text-sm font-semibold text-primary">Étapes du voyage</h3>
                  <div className="h-px flex-1 bg-accent/20" />
                </div>
                <StageSection
                  stages={newStages}
                  onStagesChange={setNewStages}
                  totalDays={getTotalDays(newStartDate, newEndDate)}
                  onDaysMismatch={setNewDaysMismatch}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addNewStage();
                  }}
                  className="w-full border-dashed border-2 border-purple-300 text-purple-600 hover:bg-purple-50 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Ajouter une étape
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={saving || (needsStages(newVoyage.category) && newDaysMismatch)}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 flex items-center gap-2"
            >
              {saving ? <><Loader2 size={16} className="animate-spin" /> Enregistrement...</> : <><CheckCircle size={16} /> Enregistrer</>}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Modal de modification */}
      <AnimatePresence>
        {editingVoyage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/20 flex items-center justify-center p-4"
            onClick={() => setEditingVoyage(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-elegant border border-accent/20 p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg sm:text-xl font-semibold">Modifier le voyage</h3>
                <button 
                  onClick={() => setEditingVoyage(null)} 
                  className="text-muted-foreground hover:text-foreground p-2 -mr-2 touch-manipulation"
                  aria-label="Fermer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleEdit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Titre *</label>
                    <input 
                      type="text" 
                      value={editForm.title} 
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} 
                      className="form-input" 
                      required 
                      maxLength={200} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Prix (À partir de) - DA *</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={editForm.price} 
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} 
                        className="form-input pr-12" 
                        required 
                        min={0}
                        step="0.01"
                        placeholder="0"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">DA</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Statut du voyage</label>
                  <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value as VoyageStatus })} className="form-input">
                    <option value="normal">Normal</option>
                    <option value="almost-full">Bientôt complet (باقي أماكن قليلة)</option>
                    <option value="full">Complet (الرحلة كاملة)</option>
                    <option value="limited-offer">Offre limitée (عرض محدود)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Dates du voyage {editForm.category !== "Voyage à la Carte" && "*"}
                  </label>
                  {editForm.category === "Voyage à la Carte" ? (
                    <div className="form-input bg-muted/30 cursor-not-allowed flex items-center justify-center text-muted-foreground">
                      Dates flexibles - Sur mesure
                    </div>
                  ) : (
                    <>
                      <DateRangePicker
                        startDate={editStartDate}
                        endDate={editEndDate}
                        onStartDateChange={setEditStartDate}
                        onEndDateChange={setEditEndDate}
                      />
                      {editStartDate && editEndDate && (
                        <p className="text-xs text-primary mt-2 font-medium">
                          ✓ Durée : {getCalculatedDuration(editStartDate, editEndDate)} • 
                          Période : {format(editStartDate, "dd/MM/yyyy")} - {format(editEndDate, "dd/MM/yyyy")}
                        </p>
                      )}
                    </>
                  )}
                </div>

                <MultiImageUpload
                  value={editForm.imageUrls}
                  onChange={(imageUrls) => setEditForm({ ...editForm, imageUrls })}
                  maxFiles={10}
                  label="Photos du voyage"
                />
                <div>
                  <label className="block text-sm font-medium mb-1.5">Description</label>
                  <textarea 
                    value={editForm.description} 
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} 
                    className="form-input min-h-[80px] resize-y" 
                    maxLength={1000} 
                  />
                </div>

                {/* Points Forts du Voyage */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Points Forts du Voyage</label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editFeatureInput}
                        onChange={(e) => setEditFeatureInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (editFeatureInput.trim()) {
                              setEditForm({ ...editForm, features: [...editForm.features, editFeatureInput.trim()] });
                              setEditFeatureInput("");
                            }
                          }
                        }}
                        className="form-input flex-1"
                        placeholder="Ex: Vol Direct, Hôtel 4*, All Inclusive..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (editFeatureInput.trim()) {
                            setEditForm({ ...editForm, features: [...editForm.features, editFeatureInput.trim()] });
                            setEditFeatureInput("");
                          }
                        }}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                      >
                        Ajouter
                      </button>
                    </div>
                    {editForm.features.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {editForm.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-sm font-medium"
                          >
                            {feature}
                            <button
                              type="button"
                              onClick={() => {
                                setEditForm({
                                  ...editForm,
                                  features: editForm.features.filter((_, i) => i !== idx)
                                });
                              }}
                              className="hover:text-purple-900 transition-colors"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sections d'étapes conditionnelles */}
                {needsStages(editForm.category) && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pt-2">
                      <div className="h-px flex-1 bg-accent/20" />
                      <h3 className="text-sm font-semibold text-primary">Étapes du voyage</h3>
                      <div className="h-px flex-1 bg-accent/20" />
                    </div>
                    <StageSection
                      stages={editStages}
                      onStagesChange={setEditStages}
                      totalDays={getTotalDays(editStartDate, editEndDate)}
                      onDaysMismatch={setEditDaysMismatch}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addEditStage();
                      }}
                      className="w-full border-dashed border-2 border-purple-300 text-purple-600 hover:bg-purple-50 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={18} />
                      Ajouter une étape
                    </button>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingVoyage(null)}
                    className="flex-1 bg-muted text-foreground px-6 py-2.5 rounded-lg font-semibold hover:bg-muted/80 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={saving || (needsStages(editForm.category) && editDaysMismatch)}
                    className="flex-1 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {saving ? <><Loader2 size={16} className="animate-spin" /> Enregistrement...</> : <><CheckCircle size={16} /> Enregistrer les modifications</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {voyages.map((v) => (
          <div key={v.id} className="flex items-center gap-3 sm:gap-4 p-4 bg-white rounded-xl shadow-card border border-gray-200 hover:border-accent/50 transition-colors">
            <img src={v.imageUrl} alt={v.title} className="w-16 h-12 object-cover rounded-lg shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{v.title}</p>
              <p className="text-xs text-muted-foreground">{v.category} · {formatPrice(v.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => openEditModal(v)} 
                className="text-primary hover:text-accent transition-colors p-2 touch-manipulation"
                aria-label="Modifier"
                title="Modifier"
              >
                <Pencil size={16} />
              </button>
              <button 
                onClick={() => setDeleteConfirmId(v.id)} 
                className="text-muted-foreground hover:text-destructive transition-colors p-2 touch-manipulation"
                aria-label="Supprimer"
                title="Supprimer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setDeleteConfirmId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 max-w-md w-full">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Trash2 size={24} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      Supprimer ce voyage ?
                    </h3>
                    <p className="text-sm text-slate-600">
                      Êtes-vous sûr de vouloir supprimer ce voyage ? Cette action est irréversible.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col-reverse sm:flex-row gap-3">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirmId)}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

/* Séjour Configuration View */
interface SejourConfigViewProps {
  services: { id: string; label: string }[];
  addService: (service: { label: string }) => void;
  deleteService: (id: string) => void;
}

const SejourConfigView = ({
  services,
  addService,
  deleteService,
}: SejourConfigViewProps) => {
  const [newServiceLabel, setNewServiceLabel] = useState("");

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (newServiceLabel.trim()) {
      addService({ label: newServiceLabel.trim() });
      setNewServiceLabel("");
      toast.success("Service ajouté avec succès");
    }
  };

  const handleDeleteService = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      deleteService(id);
      toast.success("Service supprimé");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-6 text-primary">Configuration Séjour à la Carte</h2>
        <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
          Gérez les services disponibles pour les demandes de séjour personnalisé.
        </p>
      </div>

      {/* Services Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6"
      >
        <h3 className="text-lg sm:text-xl font-bold text-primary mb-4 flex items-center gap-2">
          <Settings2 size={20} />
          Services Inclus
        </h3>

        {/* Add Service Form */}
        <form onSubmit={handleAddService} className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
            <input
              type="text"
              value={newServiceLabel}
              onChange={(e) => setNewServiceLabel(e.target.value)}
              placeholder="Ex: Billet d'avion"
              className="flex-1 px-4 py-3 sm:py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base touch-manipulation"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 sm:py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 font-medium touch-manipulation min-h-[48px]"
            >
              <Plus size={20} />
              Ajouter
            </button>
          </div>
        </form>

        {/* Services List */}
        <div className="space-y-2">
          {services.length === 0 ? (
            <p className="text-slate-500 text-center py-4 text-sm sm:text-base">Aucun service configuré</p>
          ) : (
            services.map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 sm:p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-primary/50 transition-all"
              >
                <span className="text-slate-700 font-medium text-sm sm:text-base">
                  {service.label}
                </span>
                <button
                  onClick={() => handleDeleteService(service.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-2 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Supprimer"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

/* Visa Configuration View */
interface VisaConfigViewProps {
  eVisaCountries: { id: string; name: string }[];
  dossierCountries: { id: string; name: string; documents: string[] }[];
  addEVisaCountry: (country: { name: string }) => void;
  deleteEVisaCountry: (id: string) => void;
  addDossierCountry: (country: { name: string; documents: string[] }) => void;
  updateDossierCountry: (id: string, country: Partial<{ name: string; documents: string[] }>) => void;
  deleteDossierCountry: (id: string) => void;
}

const VisaConfigView = ({
  eVisaCountries,
  dossierCountries,
  addEVisaCountry,
  deleteEVisaCountry,
  addDossierCountry,
  updateDossierCountry,
  deleteDossierCountry,
}: VisaConfigViewProps) => {
  const [activeTab, setActiveTab] = useState<"evisa" | "dossier">("evisa");
  const [newEVisaCountry, setNewEVisaCountry] = useState("");
  const [newDossierCountry, setNewDossierCountry] = useState("");
  const [newDocument, setNewDocument] = useState("");
  const [editingCountry, setEditingCountry] = useState<string | null>(null);

  // Safety checks
  const safeEVisaCountries = eVisaCountries || [];
  const safeDossierCountries = dossierCountries || [];

  const handleAddEVisaCountry = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEVisaCountry.trim()) {
      addEVisaCountry({ name: newEVisaCountry.trim() });
      setNewEVisaCountry("");
      toast.success("Pays ajouté avec succès");
    }
  };

  const handleDeleteEVisaCountry = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce pays ?")) {
      deleteEVisaCountry(id);
      toast.success("Pays supprimé");
    }
  };

  const handleAddDossierCountry = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDossierCountry.trim()) {
      addDossierCountry({ name: newDossierCountry.trim(), documents: [] });
      setNewDossierCountry("");
      toast.success("Pays ajouté avec succès");
    }
  };

  const handleAddDocument = (countryId: string) => {
    if (newDocument.trim()) {
      const country = safeDossierCountries.find(c => c.id === countryId);
      if (country) {
        updateDossierCountry(countryId, {
          documents: [...(country.documents || []), newDocument.trim()]
        });
        setNewDocument("");
        toast.success("Document ajouté");
      }
    }
  };

  const handleDeleteDocument = (countryId: string, docIndex: number) => {
    const country = safeDossierCountries.find(c => c.id === countryId);
    if (country && country.documents) {
      const newDocs = country.documents.filter((_, index) => index !== docIndex);
      updateDossierCountry(countryId, { documents: newDocs });
      toast.success("Document supprimé");
    }
  };

  const handleDeleteDossierCountry = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce pays et tous ses documents ?")) {
      deleteDossierCountry(id);
      setEditingCountry(null);
      toast.success("Pays supprimé");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-6 text-primary">Configuration Assistant Visa</h2>
        <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
          Gérez les pays disponibles pour les demandes de visa E-visa et Visa Dossier.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b-2 border-slate-200">
        <button
          onClick={() => setActiveTab("evisa")}
          className={`px-4 sm:px-6 py-3 font-semibold transition-all ${
            activeTab === "evisa"
              ? "text-primary border-b-2 border-primary -mb-0.5"
              : "text-slate-600 hover:text-primary"
          }`}
        >
          E-visa
        </button>
        <button
          onClick={() => setActiveTab("dossier")}
          className={`px-4 sm:px-6 py-3 font-semibold transition-all ${
            activeTab === "dossier"
              ? "text-primary border-b-2 border-primary -mb-0.5"
              : "text-slate-600 hover:text-primary"
          }`}
        >
          Visa Dossier
        </button>
      </div>

      {/* E-visa Tab */}
      {activeTab === "evisa" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6"
        >
          <h3 className="text-lg sm:text-xl font-bold text-primary mb-4">Pays E-visa</h3>

          {/* Add Country Form */}
          <form onSubmit={handleAddEVisaCountry} className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newEVisaCountry}
                onChange={(e) => setNewEVisaCountry(e.target.value)}
                placeholder="Ex: Turquie"
                className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base touch-manipulation"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 font-medium touch-manipulation min-h-[48px]"
              >
                <Plus size={20} />
                Ajouter
              </button>
            </div>
          </form>

          {/* Countries List */}
          <div className="space-y-2">
            {safeEVisaCountries.length === 0 ? (
              <p className="text-slate-500 text-center py-4 text-sm sm:text-base">Aucun pays configuré</p>
            ) : (
              safeEVisaCountries.map((country) => (
                <motion.div
                  key={country.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-primary/50 transition-all"
                >
                  <span className="text-slate-700 font-medium text-sm sm:text-base">{country.name}</span>
                  <button
                    onClick={() => handleDeleteEVisaCountry(country.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-2 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* Visa Dossier Tab */}
      {activeTab === "dossier" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Add Country Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-primary mb-4">Ajouter un pays</h3>
            <form onSubmit={handleAddDossierCountry}>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newDossierCountry}
                  onChange={(e) => setNewDossierCountry(e.target.value)}
                  placeholder="Ex: France"
                  className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base touch-manipulation"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 font-medium touch-manipulation min-h-[48px]"
                >
                  <Plus size={20} />
                  Ajouter
                </button>
              </div>
            </form>
          </div>

          {/* Countries List with Documents */}
          <div className="space-y-4">
            {safeDossierCountries.length === 0 ? (
              <p className="text-slate-500 text-center py-4 text-sm sm:text-base">Aucun pays configuré</p>
            ) : (
              safeDossierCountries.map((country) => (
                <motion.div
                  key={country.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-primary">{country.name}</h4>
                    <button
                      onClick={() => handleDeleteDossierCountry(country.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-2 touch-manipulation"
                      aria-label="Supprimer le pays"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Add Document Form */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-primary mb-2">Ajouter un document requis</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingCountry === country.id ? newDocument : ""}
                        onChange={(e) => {
                          setEditingCountry(country.id);
                          setNewDocument(e.target.value);
                        }}
                        placeholder="Ex: Passeport valide"
                        className="flex-1 px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddDocument(country.id)}
                        className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all text-sm font-medium"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Documents List */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-700">Documents requis ({(country.documents || []).length})</p>
                    {(!country.documents || country.documents.length === 0) ? (
                      <p className="text-slate-500 text-sm italic">Aucun document ajouté</p>
                    ) : (
                      country.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-start justify-between p-2 bg-slate-50 rounded-lg border border-slate-200"
                        >
                          <span className="text-sm text-slate-700 flex-1">{doc}</span>
                          <button
                            onClick={() => handleDeleteDocument(country.id, index)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1 ml-2"
                            aria-label="Supprimer"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminPage;
