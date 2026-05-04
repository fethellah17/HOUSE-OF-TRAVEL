import Layout from "@/components/Layout";
import LoginModal from "@/components/LoginModal";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2, Pencil } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { toast } from "sonner";

const BilletteriePage = () => {
  const { addMessage } = useData();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const [showUpdateFlash, setShowUpdateFlash] = useState(false);
  const [form, setForm] = useState({
    // Infos Personnelles
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    // Détails du Vol
    destination: "",
    besoinVisa: "",
    compagnie: "",
    // Passagers
    nombreAdultes: "",
    nombreEnfants: "",
    ageEnfants: "",
    // Dates
    dateDepart: "",
    dateRetour: "",
    // Message
    message: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  // Track form interaction for progress bar
  useEffect(() => {
    const checkFormProgress = () => {
      const filledFields = [
        form.destination,
        form.dateDepart,
        form.dateRetour,
      ].filter(field => field && field.trim() !== "").length;

      if (filledFields > 0 && !isLoggedIn) {
        setProgressWidth(50);
      }
    };

    checkFormProgress();
  }, [form.destination, form.dateDepart, form.dateRetour, isLoggedIn]);

  // Smart-Fill: Auto-populate fields if user is logged in
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
            
            toast.success("Vos informations ont été pré-remplies !", {
              duration: 3000,
            });
          }
        } catch (error) {
          console.error("Error parsing current user:", error);
        }
      }
    };

    loadUserData();

    // Listen for profile updates
    const handleProfileUpdate = () => {
      loadUserData();
    };

    // Listen for logout
    const handleLogout = () => {
      setIsLoggedIn(false);
      setForm((prev) => ({
        ...prev,
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
      }));
    };

    // Listen for login (post-registration recovery)
    const handleLogin = () => {
      const pendingRequest = localStorage.getItem("pendingRequest");
      if (pendingRequest) {
        try {
          const savedData = JSON.parse(pendingRequest);
          const currentUserStr = localStorage.getItem("currentUser");
          
          if (currentUserStr) {
            const currentUser = JSON.parse(currentUserStr);
            
            // Restore form data with new user info
            setForm({
              ...savedData,
              nom: currentUser.nom || "",
              prenom: currentUser.prenom || "",
              email: currentUser.email || "",
              telephone: currentUser.phone || "",
            });
            
            setIsLoggedIn(true);
            setProgressWidth(100); // Complete progress bar
            
            // Trigger flash animation
            setShowUpdateFlash(true);
            setTimeout(() => {
              setShowUpdateFlash(false);
            }, 2000);
            
            // Clear pending request
            localStorage.removeItem("pendingRequest");
            
            toast.success("Vos informations ont été restaurées ! Vous pouvez maintenant envoyer votre demande.", {
              duration: 4000,
            });
          }
        } catch (error) {
          console.error("Error recovering pending request:", error);
        }
      } else {
        loadUserData();
        if (localStorage.getItem("currentUser")) {
          setProgressWidth(100);
        }
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

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nom.trim()) e.nom = "Le nom est obligatoire.";
    if (!form.prenom.trim()) e.prenom = "Le prénom est obligatoire.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) 
      e.email = "Veuillez entrer un email valide.";
    if (!form.telephone.trim()) e.telephone = "Le téléphone est obligatoire.";
    if (!form.destination.trim()) e.destination = "La destination est obligatoire.";
    if (!form.dateDepart) e.dateDepart = "La date de départ est obligatoire.";
    if (!form.dateRetour) e.dateRetour = "La date de retour est obligatoire.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Soft Gate: If not logged in, save form and open login modal
    if (!isLoggedIn) {
      // Save current form data (excluding personal info)
      const pendingData = {
        destination: form.destination,
        besoinVisa: form.besoinVisa,
        compagnie: form.compagnie,
        nombreAdultes: form.nombreAdultes,
        nombreEnfants: form.nombreEnfants,
        ageEnfants: form.ageEnfants,
        dateDepart: form.dateDepart,
        dateRetour: form.dateRetour,
        message: form.message,
      };
      
      localStorage.setItem("pendingRequest", JSON.stringify(pendingData));
      setProgressWidth(80); // Animate to 80% when opening login modal
      setShowLoginModal(true);
      toast.info("Presque fini ! Connectez-vous pour valider votre demande.", {
        duration: 4000,
      });
      return;
    }
    
    // Normal submission flow for logged-in users
    if (!validate()) return;
    setStatus("loading");
    
    setTimeout(() => {
      // Get current user info
      const currentUserStr = localStorage.getItem("currentUser");
      let userInfo = {
        name: "Visiteur Anonyme",
        email: form.email || "Non spécifié",
        phone: form.telephone || "Non spécifié",
        isAnonymous: true,
      };

      if (currentUserStr) {
        try {
          const currentUser = JSON.parse(currentUserStr);
          userInfo = {
            name: currentUser.fullName || "Utilisateur",
            email: currentUser.email || form.email,
            phone: currentUser.phone || form.telephone,
            isAnonymous: false,
          };
        } catch (error) {
          console.error("Error parsing user:", error);
        }
      }

      // Create request object for admin inbox
      const requestObject = {
        id: `req-${Date.now()}`,
        type: "Billetterie",
        userInfo: userInfo,
        formData: {
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
          telephone: form.telephone,
          destination: form.destination,
          besoinVisa: form.besoinVisa,
          compagnie: form.compagnie,
          nombreAdultes: form.nombreAdultes,
          nombreEnfants: form.nombreEnfants,
          ageEnfants: form.ageEnfants,
          dateDepart: form.dateDepart,
          dateRetour: form.dateRetour,
          message: form.message,
        },
        timestamp: new Date().toISOString(),
        isRead: false,
      };

      // Save to admin inbox
      const adminInbox = JSON.parse(localStorage.getItem("admin_inbox") || "[]");
      adminInbox.push(requestObject);
      localStorage.setItem("admin_inbox", JSON.stringify(adminInbox));

      // Ajouter le message à la boîte de réception avec le tag BILLETTERIE (existing functionality)
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
      toast.success("Votre demande de billetterie a été envoyée avec succès à HOUSE OF TRAVEL !");
      
      // Réinitialiser le formulaire après 2 secondes
      setTimeout(() => {
        setForm({
          nom: "",
          prenom: "",
          email: "",
          telephone: "",
          destination: "",
          besoinVisa: "",
          compagnie: "",
          nombreAdultes: "",
          nombreEnfants: "",
          ageEnfants: "",
          dateDepart: "",
          dateRetour: "",
          message: "",
        });
        setStatus("idle");
      }, 2000);
    }, 1500);
  };

  return (
    <Layout>
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-wider text-primary mb-2">Billetterie</p>
            <h1 className="text-3xl md:text-4xl font-medium mb-4">Faites une demande de billetterie</h1>
            <p className="text-muted-foreground">
              Remplissez le formulaire ci-dessous et notre équipe vous proposera les meilleures options de vol.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <CheckCircle size={48} className="mx-auto text-primary mb-4" />
                <h2 className="text-xl font-semibold mb-2">Votre demande a bien été envoyée !</h2>
                <p className="text-muted-foreground">Notre équipe vous répondra dans les plus brefs délais.</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-8 relative overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Dynamic Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#0a2357] to-[#2C5F2D] relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressWidth}%` }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                  >
                    {/* Glow effect at the tip */}
                    {progressWidth > 0 && progressWidth < 100 && (
                      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/30 blur-sm" />
                    )}
                    {/* Success checkmark when complete */}
                    {progressWidth === 100 && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                        className="absolute -right-1 -top-1 bg-[#2C5F2D] rounded-full p-1"
                      >
                        <CheckCircle size={16} className="text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                </div>
                {/* Section 1: Infos Personnelles */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 pb-2 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-primary">
                      Informations Personnelles
                    </h2>
                    {isLoggedIn && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-normal text-green-600">
                          ✓ Pré-remplies depuis votre profil
                        </span>
                        <button
                          onClick={() => setShowLoginModal(true)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/5 touch-manipulation"
                          type="button"
                        >
                          <Pencil size={14} />
                          <span>Modifier</span>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Update Notification */}
                  <AnimatePresence>
                    {showUpdateFlash && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg px-4 py-3 overflow-hidden"
                      >
                        <p className="text-sm text-primary font-medium flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-600" />
                          Nous avons mis à jour vos informations personnelles avec votre nouveau profil.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Nom *" error={errors.nom}>
                      <input
                        type="text"
                        value={form.nom}
                        onChange={(e) => setForm({ ...form, nom: e.target.value })}
                        className={`devis-input transition-all duration-1000 ${
                          isLoggedIn 
                            ? showUpdateFlash 
                              ? "bg-gradient-to-r from-blue-100 to-green-100 border-green-300 animate-pulse" 
                              : "bg-blue-50 border-primary/30 cursor-not-allowed"
                            : ""
                        }`}
                        placeholder="Votre nom"
                        readOnly={isLoggedIn}
                        title={isLoggedIn ? "Ce champ est pré-rempli depuis votre profil" : ""}
                      />
                    </Field>
                    <Field label="Prénom *" error={errors.prenom}>
                      <input
                        type="text"
                        value={form.prenom}
                        onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                        className={`devis-input transition-all duration-1000 ${
                          isLoggedIn 
                            ? showUpdateFlash 
                              ? "bg-gradient-to-r from-blue-100 to-green-100 border-green-300 animate-pulse" 
                              : "bg-blue-50 border-primary/30 cursor-not-allowed"
                            : ""
                        }`}
                        placeholder="Votre prénom"
                        readOnly={isLoggedIn}
                        title={isLoggedIn ? "Ce champ est pré-rempli depuis votre profil" : ""}
                      />
                    </Field>
                    <Field label="Email *" error={errors.email}>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={`devis-input transition-all duration-1000 ${
                          isLoggedIn 
                            ? showUpdateFlash 
                              ? "bg-gradient-to-r from-blue-100 to-green-100 border-green-300 animate-pulse" 
                              : "bg-blue-50 border-primary/30 cursor-not-allowed"
                            : ""
                        }`}
                        placeholder="EX : Houseoftravel@gmail.com"
                        readOnly={isLoggedIn}
                        title={isLoggedIn ? "Ce champ est pré-rempli depuis votre profil" : ""}
                      />
                    </Field>
                    <Field label="Téléphone portable *" error={errors.telephone}>
                      <input
                        type="tel"
                        value={form.telephone}
                        onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                        className={`devis-input transition-all duration-1000 ${
                          isLoggedIn 
                            ? showUpdateFlash 
                              ? "bg-gradient-to-r from-blue-100 to-green-100 border-green-300 animate-pulse" 
                              : "bg-blue-50 border-primary/30 cursor-not-allowed"
                            : ""
                        }`}
                        placeholder="EX : 0549059432"
                        readOnly={isLoggedIn}
                        title={isLoggedIn ? "Ce champ est pré-rempli depuis votre profil" : ""}
                      />
                    </Field>
                  </div>
                </div>

                {/* Section 2: Détails du Vol */}
                <div>
                  <h2 className="text-xl font-semibold text-primary mb-4 pb-2 border-b border-gray-200">
                    Détails du Vol
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Destination *" error={errors.destination}>
                      <input
                        type="text"
                        value={form.destination}
                        onChange={(e) => setForm({ ...form, destination: e.target.value })}
                        className="devis-input"
                        placeholder="Ex: Istanbul"
                      />
                    </Field>
                    <Field label="Besoin d'un VISA">
                      <select
                        value={form.besoinVisa}
                        onChange={(e) => setForm({ ...form, besoinVisa: e.target.value })}
                        className="devis-input"
                      >
                        <option value="">Sélectionner</option>
                        <option value="Oui">Oui</option>
                        <option value="Non">Non</option>
                      </select>
                    </Field>
                    <Field label="Compagnie Aérienne">
                      <select
                        value={form.compagnie}
                        onChange={(e) => setForm({ ...form, compagnie: e.target.value })}
                        className="devis-input"
                      >
                        <option value="">Sélectionner</option>
                        <option value="AIR ALGERIE">AIR ALGERIE</option>
                        <option value="AIR FRANCE">AIR FRANCE</option>
                        <option value="ROYAL AIR MAROC">ROYAL AIR MAROC</option>
                        <option value="TUNIS AIR">TUNIS AIR</option>
                        <option value="EMIRATS">EMIRATS</option>
                        <option value="QATAR">QATAR</option>
                        <option value="TURKISH AIRLINES">TURKISH AIRLINES</option>
                        <option value="ALITALIA">ALITALIA</option>
                        <option value="VUELING">VUELING</option>
                        <option value="Aigle azur">Aigle azur</option>
                      </select>
                    </Field>
                  </div>
                </div>

                {/* Section 3: Passagers */}
                <div>
                  <h2 className="text-xl font-semibold text-primary mb-4 pb-2 border-b border-gray-200">
                    Passagers
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Field label="Adultes">
                      <input
                        type="number"
                        min="0"
                        value={form.nombreAdultes}
                        onChange={(e) => setForm({ ...form, nombreAdultes: e.target.value })}
                        className="devis-input"
                        placeholder="0"
                      />
                    </Field>
                    <Field label="Enfants">
                      <input
                        type="number"
                        min="0"
                        value={form.nombreEnfants}
                        onChange={(e) => setForm({ ...form, nombreEnfants: e.target.value })}
                        className="devis-input"
                        placeholder="0"
                      />
                    </Field>
                    <Field label="Âge des enfants (si applicable)">
                      <input
                        type="text"
                        value={form.ageEnfants}
                        onChange={(e) => setForm({ ...form, ageEnfants: e.target.value })}
                        className="devis-input"
                        placeholder="Ex: 5 ans, 8 ans"
                      />
                    </Field>
                  </div>
                </div>

                {/* Section 4: Dates */}
                <div>
                  <h2 className="text-xl font-semibold text-primary mb-4 pb-2 border-b border-gray-200">
                    Dates
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Date de départ *" error={errors.dateDepart}>
                      <input
                        type="date"
                        value={form.dateDepart}
                        onChange={(e) => setForm({ ...form, dateDepart: e.target.value })}
                        className="devis-input"
                      />
                    </Field>
                    <Field label="Date de retour *" error={errors.dateRetour}>
                      <input
                        type="date"
                        value={form.dateRetour}
                        onChange={(e) => setForm({ ...form, dateRetour: e.target.value })}
                        className="devis-input"
                      />
                    </Field>
                  </div>
                </div>

                {/* Section 5: Message */}
                <div>
                  <h2 className="text-xl font-semibold text-primary mb-4 pb-2 border-b border-gray-200">
                    Message
                  </h2>
                  <Field label="Détails supplémentaires">
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="devis-input min-h-[120px] resize-y"
                      placeholder="Décrivez vos besoins spécifiques, préférences ou toute autre information utile..."
                      maxLength={1000}
                    />
                  </Field>
                </div>

                {/* Bouton d'envoi */}
                <div className="space-y-2">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-primary text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg hover:border-2 hover:border-[#D4AF37] transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2 touch-manipulation"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Envoi en cours...
                      </>
                    ) : (
                      "Envoyer la demande"
                    )}
                  </button>
                  {!isLoggedIn && (
                    <p className="text-sm text-center text-blue-600 font-medium">
                      💡 Cliquez pour vous connecter et valider votre demande
                    </p>
                  )}
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
      
      {/* Login Modal for Profile Editing */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        editMode={true}
      />
    </Layout>
  );
};

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    {children}
    {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
  </div>
);

export default BilletteriePage;
