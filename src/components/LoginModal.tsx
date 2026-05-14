import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { login, logout, signUp, resetPassword, requestPasswordReset, updateUserProfile, verifyOTP, resendOTP, completeSignUp, verifyRecoveryOTP } from "@/services/authService";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: User) => void;
  editMode?: boolean; // New prop to indicate profile editing mode
}

interface User {
  id: string;
  fullName: string;
  nom: string;
  prenom: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
}

type Step = 1 | 2 | 3 | 4;
type View = "login" | "register" | "forgot-password" | "edit-profile";
type ForgotPasswordStep = "email" | "otp" | "new-password" | "success";

const LoginModal = ({ isOpen, onClose, onLoginSuccess, editMode = false }: LoginModalProps) => {
  const [view, setView] = useState<View>("login");
  const [step, setStep] = useState<Step>(1);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<ForgotPasswordStep>("email");
  const [loading, setLoading] = useState(false);
  
  // Form data - Split fullName into nom and prenom
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Login form data
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Forgot password data
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  
  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otpResendCount, setOtpResendCount] = useState(0);
  const [otpResendTimer, setOtpResendTimer] = useState(0);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setView("login");
        setStep(1);
        setForgotPasswordStep("email");
        setNom("");
        setPrenom("");
        setEmail("");
        setPhone("");
        setEmailOtp("");
        setPassword("");
        setConfirmPassword("");
        setLoginEmail("");
        setLoginPassword("");
        setForgotEmail("");
        setForgotOtp("");
        setNewPassword("");
        setConfirmNewPassword("");
        setErrors({});
      }, 300);
    }
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    };
  }, [isOpen]);

  // Check if user is logged in and set edit mode
  const { user } = useAuth();
  useEffect(() => {
    if (isOpen && editMode) {
      if (user) {
        setView("edit-profile");
        setNom(user.nom || "");
        setPrenom(user.prenom || "");
        setEmail(user.email || "");
        setPhone(user.phone || "");
      }
    }
  }, [isOpen, editMode, user]);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!nom.trim()) {
      newErrors.nom = "Le nom est requis";
    }
    
    if (!prenom.trim()) {
      newErrors.prenom = "Le prénom est requis";
    }
    
    if (!email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email invalide";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEditProfile = () => {
    const newErrors: Record<string, string> = {};
    
    if (!nom.trim()) {
      newErrors.nom = "Le nom est requis";
    }
    
    if (!prenom.trim()) {
      newErrors.prenom = "Le prénom est requis";
    }
    
    if (!phone.trim()) {
      newErrors.phone = "Le numéro de téléphone est requis";
    } else if (!/^[0-9]{10}$/.test(phone.replace(/\s/g, ""))) {
      newErrors.phone = "Numéro invalide (10 chiffres requis)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!emailOtp.trim()) {
      newErrors.emailOtp = "Le code de vérification est requis";
    } else if (emailOtp.length !== 6) {
      newErrors.emailOtp = "Le code doit contenir 6 chiffres";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!phone.trim()) {
      newErrors.phone = "Le numéro de téléphone est requis";
    } else if (!/^[0-9]{10}$/.test(phone.replace(/\s/g, ""))) {
      newErrors.phone = "Numéro invalide (10 chiffres requis)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!password.trim()) {
      newErrors.password = "Le mot de passe est requis";
    } else if (password.length < 6) {
      newErrors.password = "Minimum 6 caractères";
    }
    
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Veuillez confirmer le mot de passe";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLogin = () => {
    const newErrors: Record<string, string> = {};
    
    if (!loginEmail.trim()) {
      newErrors.loginEmail = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) {
      newErrors.loginEmail = "Email invalide";
    }
    
    if (!loginPassword.trim()) {
      newErrors.loginPassword = "Le mot de passe est requis";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      setLoading(true);
      const result = await login({ email: loginEmail, password: loginPassword });
      setLoading(false);
      
      if (result.success && result.user) {
        toast.success("Connexion réussie ! Bienvenue !");
        window.dispatchEvent(new Event("userLoggedIn"));
        
        if (onLoginSuccess) {
          onLoginSuccess({
            id: result.user.id,
            nom: result.user.user_metadata?.nom || "",
            prenom: result.user.user_metadata?.prenom || "",
            email: result.user.email || "",
            phone: result.user.user_metadata?.phone || "",
            fullName: `${result.user.user_metadata?.prenom || ""} ${result.user.user_metadata?.nom || ""}`,
            password: "",
            createdAt: result.user.created_at || new Date().toISOString(),
          });
        }
        
        onClose();
      } else {
        toast.error(result.error || "Email ou mot de passe incorrect");
        setErrors({ loginEmail: "Identifiants incorrects" });
      }
    }
  };

  // Forgot Password Handlers
  const handleForgotPasswordEmail = async () => {
    const newErrors: Record<string, string> = {};
    
    if (!forgotEmail.trim()) {
      newErrors.forgotEmail = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      newErrors.forgotEmail = "Email invalide";
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      const result = await requestPasswordReset(forgotEmail);
      setLoading(false);
      
      if (result.success) {
        setForgotPasswordStep("otp");
        toast.success("Code de vérification envoyé à votre email");
      } else {
        toast.error(result.error || "Aucun compte associé à cet email");
        setErrors({ forgotEmail: "Email non trouvé" });
      }
    }
  };

  const handleForgotPasswordOtp = async () => {
    const newErrors: Record<string, string> = {};
    
    if (!forgotOtp.trim()) {
      newErrors.forgotOtp = "Le code est requis";
    } else if (forgotOtp.length !== 6) {
      newErrors.forgotOtp = "Le code doit contenir 6 chiffres";
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      
      // Verify OTP with recovery type - establishes temporary session
      const result = await verifyRecoveryOTP(forgotEmail, forgotOtp);
      setLoading(false);
      
      if (result.success) {
        setForgotPasswordStep("new-password");
        toast.success(result.message);
      } else {
        toast.error(result.error || "Code invalide ou expiré");
        setErrors({ forgotOtp: "Code invalide" });
      }
    }
  };

  const handleResetPassword = async () => {
    const newErrors: Record<string, string> = {};
    
    if (!newPassword.trim()) {
      newErrors.newPassword = "Le mot de passe est requis";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Minimum 6 caractères";
    }
    
    if (!confirmNewPassword.trim()) {
      newErrors.confirmNewPassword = "Veuillez confirmer le mot de passe";
    } else if (newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = "Les mots de passe ne correspondent pas";
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      
      // Update password - session is active from verifyRecoveryOTP
      const result = await resetPassword(newPassword);
      setLoading(false);
      
      if (result.success) {
        setForgotPasswordStep("success");
        toast.success("Mot de passe mis à jour avec succès !");
        
        // Dispatch event to trigger auth state listener reload
        // This will cause useAuth hook to fetch the updated user profile
        window.dispatchEvent(new Event("userLoggedIn"));
        
        // Reset form for future use
        setTimeout(() => {
          setForgotEmail("");
          setForgotOtp("");
          setNewPassword("");
          setConfirmNewPassword("");
          setForgotPasswordStep("email");
          
          // Close modal and redirect to home page
          // User is already logged in with new password
          onClose();
          window.location.href = "/";
        }, 1500);
      } else {
        toast.error(result.error || "Erreur lors de la réinitialisation du mot de passe");
        setErrors({ newPassword: result.error || "Erreur" });
      }
    }
  };

  const handleUpdateProfile = async () => {
    if (validateEditProfile()) {
      setLoading(true);
      const result = await updateUserProfile(user!.id, {
        nom,
        prenom,
        phone,
      });
      setLoading(false);
      
      if (result.success && result.user) {
        toast.success("Profil mis à jour avec succès !");
        
        // Update localStorage immediately for synchronization
        localStorage.setItem("currentUser", JSON.stringify(result.user));
        
        // Trigger a custom event to notify forms
        window.dispatchEvent(new Event("profileUpdated"));
        
        if (onLoginSuccess) {
          onLoginSuccess({
            id: result.user.id,
            nom: result.user.nom,
            prenom: result.user.prenom,
            email: result.user.email,
            phone: result.user.phone,
            fullName: `${result.user.prenom} ${result.user.nom}`,
            password: "",
            createdAt: result.user.created_at || new Date().toISOString(),
          });
        }
        
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        toast.error(result.error || "Erreur lors de la mise à jour du profil");
        setErrors({ phone: result.error || "Erreur serveur" });
      }
    }
  };

  const handleGoogleLogin = () => {
    // Note: Supabase OAuth requires backend configuration
    // This is a placeholder - implement with supabase.auth.signInWithOAuth({ provider: 'google' })
    toast.info("Google login coming soon! Configure OAuth in Supabase dashboard.");
    setLoading(false);
  };

  const handleStep1Next = async () => {
    if (validateStep1()) {
      setLoading(true);
      
      const result = await signUp({
        email,
        password: "temp_password",
        nom,
        prenom,
        phone: "",
      });
      
      setLoading(false);
      
      if (result.success) {
        setStep(2);
        setOtpResendCount(0);
        toast.success("Code de vérification envoyé à " + email);
      } else {
        toast.error(result.error || "Erreur lors de l'inscription");
        if (result.error?.toLowerCase().includes("already")) {
          setErrors({ email: "Cet email est déjà utilisé" });
        }
      }
    }
  };

  const handleStep2Verify = async () => {
    if (validateStep2()) {
      setLoading(true);
      
      const result = await verifyOTP(email, emailOtp);
      setLoading(false);
      
      if (result.success) {
        setStep(3);
        toast.success("Email vérifié avec succès !");
      } else {
        toast.error(result.error || "Code invalide ou expiré");
        setErrors({ emailOtp: "Code invalide" });
      }
    }
  };
  
  const handleResendOTP = async () => {
    if (otpResendTimer > 0) return;
    
    setLoading(true);
    const result = await resendOTP(email);
    setLoading(false);
    
    if (result.success) {
      setOtpResendCount(otpResendCount + 1);
      setOtpResendTimer(60);
      toast.success(result.message);
    } else {
      toast.error(result.error || "Erreur lors de l'envoi du code");
    }
  };
  
  // Timer for resend button
  useEffect(() => {
    if (otpResendTimer > 0) {
      const timer = setTimeout(() => setOtpResendTimer(otpResendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpResendTimer]);

  const handleStep3Next = () => {
    if (validateStep3()) {
      setStep(4);
    }
  };

  const handleStep4Complete = async () => {
    if (validateStep4()) {
      setLoading(true);
      
      // Get current authenticated user from Supabase Auth
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (!authUser || authError) {
        toast.error("Erreur: Utilisateur non authentifié");
        setLoading(false);
        return;
      }

      // Update auth user password and metadata
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
        data: {
          nom: nom,
          prenom: prenom,
          phone: phone,
        },
      });

      if (updateError) {
        toast.error("Erreur lors de la mise à jour du mot de passe");
        setLoading(false);
        return;
      }

      // Now create the user profile in the database
      // This is the deferred profile creation - only happens after email verification AND password setup
      const result = await completeSignUp(authUser.id, email, nom, prenom, phone);
      
      setLoading(false);
      
      if (result.success && result.user) {
        toast.success("Inscription réussie ! Bienvenue !");
        
        // Dispatch events for immediate data sync
        window.dispatchEvent(new Event("userRegistered"));
        window.dispatchEvent(new Event("userLoggedIn"));
        
        // Call onLoginSuccess with user data for immediate state update
        if (onLoginSuccess) {
          onLoginSuccess({
            id: authUser.id,
            nom,
            prenom,
            email: email,
            phone: phone || "",
            fullName: `${prenom} ${nom}`,
            password: "",
            createdAt: authUser.created_at || new Date().toISOString(),
          });
        }
        
        // Close modal and redirect immediately
        onClose();
        
        // Immediate redirect to home page (no manual login needed)
        setTimeout(() => {
          window.location.href = "/";
        }, 100);
      } else {
        toast.error(result.error || "Erreur lors de la finalisation de l'inscription");
      }
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[99999] w-full h-full bg-white dark:bg-slate-950 flex flex-col items-center justify-start md:justify-center overflow-y-auto"
      >
        {/* Close Button - Top Right Corner */}
        <button
          onClick={onClose}
          className="fixed top-4 right-4 md:top-6 md:right-6 z-10 p-3 md:p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-primary hover:text-primary/80 transition-colors rounded-full hover:bg-primary/5 touch-manipulation"
          aria-label="Fermer"
        >
          <X size={28} strokeWidth={2.5} />
        </button>

        {/* Content Container */}
        <div className="w-full max-w-md px-4 md:px-6 py-6 md:py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
              {view === "login" ? "Se connecter" : view === "register" ? "Créer un compte" : view === "edit-profile" ? "Modifier mon Profil" : "Mot de passe oublié"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {view === "login" ? "Bienvenue sur HOUSE OF TRAVEL" : view === "register" ? "Rejoignez HOUSE OF TRAVEL" : view === "edit-profile" ? "Mettez à jour vos informations" : "Réinitialisez votre mot de passe"}
            </p>
            
            {/* Step Indicator - Only show in register view */}
            {view === "register" && (
              <div className="flex items-center gap-2 mt-6 max-w-xs mx-auto">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                      s <= step ? "bg-[#4B2C7F]" : "bg-gray-300 dark:bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            )}
            
            {/* Step Indicator - Forgot Password */}
            {view === "forgot-password" && (
              <div className="flex items-center gap-2 mt-6 max-w-xs mx-auto">
                {["email", "otp", "new-password", "success"].map((s, index) => (
                  <div
                    key={s}
                    className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                      ["email", "otp", "new-password", "success"].indexOf(forgotPasswordStep) >= index ? "bg-primary" : "bg-gray-300 dark:bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-800 p-6 md:p-8">
            <AnimatePresence mode="wait">
              {view === "login" ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Login Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className={`w-full px-4 py-3 md:py-3 min-h-[48px] text-base border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-[#D4AF37] focus:border-transparent transition-all ${
                          errors.loginEmail ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                        }`}
                        placeholder="Ex: fethellahhadjbouziane@gmail.com"
                        onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                      />
                      {errors.loginEmail && (
                        <p className="text-red-500 text-xs mt-1">{errors.loginEmail}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Mot de passe *
                      </label>
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className={`w-full px-4 py-3 md:py-3 min-h-[48px] text-base border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2C5F2D] dark:focus:ring-[#D4AF37] focus:border-transparent transition-all ${
                          errors.loginPassword ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                        }`}
                        placeholder="Votre mot de passe"
                        onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                      />
                      {errors.loginPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.loginPassword}</p>
                      )}
                    </div>

                    <button
                      onClick={handleLogin}
                      disabled={loading}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 md:py-4 min-h-[48px] px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 touch-manipulation"
                    >
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
                    <div className="text-center mt-3">
                      <button
                        onClick={() => setView("forgot-password")}
                        className="text-sm text-primary hover:underline cursor-pointer"
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>
                  </div>

                  {/* Toggle to Sign Up */}
                  <div className="text-center pt-4 border-t border-gray-200 dark:border-slate-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Vous n'avez pas de compte ?{" "}
                      <button
                        onClick={() => setView("register")}
                        className="text-primary font-semibold hover:underline"
                      >
                        Créer un compte
                      </button>
                    </p>
                  </div>
                </motion.div>
              ) : view === "forgot-password" ? (
                <motion.div
                  key="forgot-password"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Step 1: Email Input */}
                  {forgotPasswordStep === "email" && (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        Entrez l'email associé à votre compte
                      </p>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className={`w-full px-4 py-3 md:py-3 min-h-[48px] text-base border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                            errors.forgotEmail ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                          }`}
                          placeholder="Ex: fethellahhadjbouziane@gmail.com"
                        />
                        {errors.forgotEmail && (
                          <p className="text-red-500 text-xs mt-1">{errors.forgotEmail}</p>
                        )}
                      </div>

                      <button
                        onClick={handleForgotPasswordEmail}
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 md:py-4 min-h-[48px] px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 touch-manipulation"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Vérification...
                          </>
                        ) : (
                          "Vérifier le compte"
                        )}
                      </button>

                      <div className="text-center pt-4 border-t border-gray-200 dark:border-slate-700">
                        <button
                          onClick={() => setView("login")}
                          className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                        >
                          ← Retour à la connexion
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: OTP Verification */}
                  {forgotPasswordStep === "otp" && (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        Entrez le code à 6 chiffres envoyé à votre Gmail
                      </p>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Code de Vérification *
                        </label>
                        <input
                          type="text"
                          value={forgotOtp}
                          onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          className={`w-full px-4 py-3 md:py-3 min-h-[48px] text-base border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-center text-2xl tracking-widest font-semibold ${
                            errors.forgotOtp ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                          }`}
                          placeholder="000000"
                          maxLength={6}
                        />
                        {errors.forgotOtp && (
                          <p className="text-red-500 text-xs mt-1">{errors.forgotOtp}</p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                          {/* SUPABASE: supabase.auth.verifyOtp({ email, token: forgotOtp, type: 'recovery' }) */}
                          Vérifiez votre boîte de réception Gmail
                        </p>
                      </div>

                      <button
                        onClick={handleForgotPasswordOtp}
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 md:py-4 min-h-[48px] px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 touch-manipulation"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Vérification...
                          </>
                        ) : (
                          "Vérifier le code"
                        )}
                      </button>

                      <div className="text-center">
                        <button
                          onClick={() => setForgotPasswordStep("email")}
                          className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                        >
                          ← Retour
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: New Password */}
                  {forgotPasswordStep === "new-password" && (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        Créez un nouveau mot de passe pour votre compte
                      </p>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Nouveau Mot de Passe *
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className={`w-full px-4 py-3 md:py-3 min-h-[48px] text-base border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                            errors.newPassword ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                          }`}
                          placeholder="Minimum 6 caractères"
                        />
                        {errors.newPassword && (
                          <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Confirmer le Mot de Passe *
                        </label>
                        <input
                          type="password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          className={`w-full px-4 py-3 md:py-3 min-h-[48px] text-base border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                            errors.confirmNewPassword ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                          }`}
                          placeholder="Confirmez votre mot de passe"
                        />
                        {errors.confirmNewPassword && (
                          <p className="text-red-500 text-xs mt-1">{errors.confirmNewPassword}</p>
                        )}
                      </div>

                      <button
                        onClick={handleResetPassword}
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 md:py-4 min-h-[48px] px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 touch-manipulation"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Mise à jour...
                          </>
                        ) : (
                          "Mettre à jour"
                        )}
                      </button>

                      <div className="text-center">
                        <button
                          onClick={() => setForgotPasswordStep("otp")}
                          className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                        >
                          ← Retour
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Success & Auto-Login */}
                  {forgotPasswordStep === "success" && (
                    <div className="space-y-6">
                      <div className="text-center py-8">
                        <div className="mx-auto w-16 h-16 bg-[#4B2C7F]/10 dark:bg-[#4B2C7F]/30 rounded-full flex items-center justify-center mb-4">
                          <CheckCircle size={32} className="text-[#4B2C7F] dark:text-[#9B7FD4]" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          Mot de passe mis à jour !
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                          Votre mot de passe a été mis à jour avec succès. Vous allez être redirigé vers votre espace client...
                        </p>
                      </div>

                      <div className="flex items-center justify-center gap-2 text-primary">
                        <Loader2 size={20} className="animate-spin" />
                        <span className="text-sm font-medium">Connexion en cours...</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : view === "edit-profile" ? (
                <motion.div
                  key="edit-profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Modifiez vos informations personnelles ci-dessous
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Nom *
                      </label>
                      <input
                        type="text"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                          errors.nom ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                        }`}
                        placeholder="Ex: Hadj-bouziane"
                      />
                      {errors.nom && (
                        <p className="text-red-500 text-xs mt-1">{errors.nom}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                          errors.prenom ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                        }`}
                        placeholder="Ex: Fethellah"
                      />
                      {errors.prenom && (
                        <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full px-4 py-3 border rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-slate-600 cursor-not-allowed transition-all"
                      placeholder="Ex: fethellahhadjbouziane@gmail.com"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      L'adresse email ne peut pas être modifiée
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                        errors.phone ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                      }`}
                      placeholder="Ex: 0600000000"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
                    <button
                      onClick={onClose}
                      className="w-full sm:w-auto bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-sm py-2 px-4 rounded-lg transition-all duration-200"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleUpdateProfile}
                      disabled={loading}
                      className="w-full sm:flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-md disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Mise à jour...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={16} />
                          Enregistrer
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
            {/* Step Content */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Nom *
                      </label>
                      <input
                        type="text"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-[#D4AF37] focus:border-transparent transition-all ${
                          errors.nom ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                        }`}
                        placeholder="Ex: Hadj-bouziane"
                      />
                      {errors.nom && (
                        <p className="text-red-500 text-xs mt-1">{errors.nom}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-[#D4AF37] focus:border-transparent transition-all ${
                          errors.prenom ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                        }`}
                        placeholder="Ex: Fethellah"
                      />
                      {errors.prenom && (
                        <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-[#D4AF37] focus:border-transparent transition-all ${
                        errors.email ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                      }`}
                      placeholder="Ex: fethellahhadjbouziane@gmail.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  <button
                    onClick={handleStep1Next}
                    className="w-full bg-[#4B2C7F] hover:bg-[#3D1E63] text-white font-bold py-4 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg touch-manipulation"
                  >
                    Suivant
                    <ArrowRight size={18} />
                  </button>

                  {/* Toggle back to Login */}
                  <div className="text-center pt-4 border-t border-gray-200 dark:border-slate-700">
                    <button
                      onClick={() => setView("login")}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                    >
                      ← Retour à la connexion
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Entrez le code à 6 chiffres envoyé par Gmail
                  </p>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Code de Vérification *
                    </label>
                    <input
                      type="text"
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2C5F2D] dark:focus:ring-[#D4AF37] focus:border-transparent transition-all text-center text-2xl tracking-widest font-semibold ${
                        errors.emailOtp ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                      }`}
                      placeholder="000000"
                      maxLength={6}
                    />
                    {errors.emailOtp && (
                      <p className="text-red-500 text-xs mt-1">{errors.emailOtp}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                      Vérifiez votre boîte de réception
                    </p>
                    <button
                      onClick={handleResendOTP}
                      disabled={otpResendTimer > 0 || loading}
                      className="text-xs text-primary hover:underline disabled:text-gray-400 mt-2 text-center block w-full transition-colors"
                    >
                      {otpResendTimer > 0 
                        ? `Renvoyer le code dans ${otpResendTimer}s` 
                        : "Renvoyer le code"}
                    </button>
                  </div>

                  <div className="flex flex-col-reverse md:flex-row gap-3 mt-6">
                    <button
                      onClick={() => setStep(1)}
                      className="w-full md:w-auto bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 font-bold py-4 px-4 rounded-lg transition-all duration-200 touch-manipulation"
                    >
                      Retour
                    </button>
                    <button
                      onClick={handleStep2Verify}
                      disabled={loading}
                      className="w-full md:flex-1 bg-[#4B2C7F] hover:bg-[#3D1E63] text-white font-bold py-4 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 touch-manipulation"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Vérification...
                        </>
                      ) : (
                        <>
                          Vérifier
                          <CheckCircle size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Informations de contact
                  </p>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Numéro de Téléphone *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-[#D4AF37] focus:border-transparent transition-all ${
                        errors.phone ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                      }`}
                      placeholder="Ex: 0600000000"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Entrez un numéro de téléphone valide (10 chiffres)
                    </p>
                  </div>

                  <div className="flex flex-col-reverse md:flex-row gap-3 mt-6">
                    <button
                      onClick={() => setStep(2)}
                      className="w-full md:w-auto bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 font-bold py-4 px-4 rounded-lg transition-all duration-200 touch-manipulation"
                    >
                      Retour
                    </button>
                    <button
                      onClick={handleStep3Next}
                      disabled={loading}
                      className="w-full md:flex-1 bg-[#4B2C7F] hover:bg-[#3D1E63] text-white font-bold py-4 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 touch-manipulation"
                    >
                      Suivant
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Sécurisez votre compte avec un mot de passe
                  </p>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Mot de Passe *
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-[#D4AF37] focus:border-transparent transition-all ${
                        errors.password ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                      }`}
                      placeholder="Minimum 6 caractères"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Confirmer le Mot de Passe *
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-[#D4AF37] focus:border-transparent transition-all ${
                        errors.confirmPassword ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                      }`}
                      placeholder="Confirmez votre mot de passe"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="flex flex-col-reverse md:flex-row gap-3 mt-6">
                    <button
                      onClick={() => setStep(3)}
                      className="w-full md:w-auto bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 font-bold py-4 px-4 rounded-lg transition-all duration-200 touch-manipulation"
                    >
                      Retour
                    </button>
                    <button
                      onClick={handleStep4Complete}
                      disabled={loading}
                      className="w-full md:flex-1 bg-[#4B2C7F] hover:bg-[#3D1E63] text-white font-bold py-4 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 touch-manipulation"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Création...
                        </>
                      ) : (
                        <>
                          Créer mon compte
                          <CheckCircle size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default LoginModal;

