import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: User) => void;
  editMode?: boolean; // New prop to indicate profile editing mode
}

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
}

type Step = 1 | 2 | 3;
type View = "login" | "register" | "forgot-password" | "edit-profile";
type ForgotPasswordStep = "phone" | "otp" | "new-password";

const LoginModal = ({ isOpen, onClose, onLoginSuccess, editMode = false }: LoginModalProps) => {
  const [view, setView] = useState<View>("login");
  const [step, setStep] = useState<Step>(1);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<ForgotPasswordStep>("phone");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  
  // Form data - Split fullName into nom and prenom
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Login form data
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Forgot password data
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  
  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setView("login");
        setStep(1);
        setForgotPasswordStep("phone");
        setNom("");
        setPrenom("");
        setEmail("");
        setPhone("");
        setOtp("");
        setPassword("");
        setConfirmPassword("");
        setLoginEmail("");
        setLoginPassword("");
        setForgotPhone("");
        setForgotOtp("");
        setNewPassword("");
        setConfirmNewPassword("");
        setErrors({});
        setShowOTP(false);
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
  useEffect(() => {
    if (isOpen && editMode) {
      const currentUserStr = localStorage.getItem("currentUser");
      if (currentUserStr) {
        try {
          const currentUser = JSON.parse(currentUserStr);
          setView("edit-profile");
          setNom(currentUser.nom || "");
          setPrenom(currentUser.prenom || "");
          setEmail(currentUser.email || "");
          setPhone(currentUser.phone || "");
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      }
    }
  }, [isOpen, editMode]);

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

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!phone.trim()) {
      newErrors.phone = "Le numéro de téléphone est requis";
    } else if (!/^[0-9]{10}$/.test(phone.replace(/\s/g, ""))) {
      newErrors.phone = "Numéro invalide (10 chiffres requis)";
    }
    
    if (showOTP && !otp.trim()) {
      newErrors.otp = "Le code de vérification est requis";
    } else if (showOTP && otp.length !== 6) {
      newErrors.otp = "Le code doit contenir 6 chiffres";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
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

  const handleLogin = () => {
    if (validateLogin()) {
      setLoading(true);
      
      setTimeout(() => {
        // Check if user exists in localStorage
        const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const user = existingUsers.find((u: User) => u.email === loginEmail && u.password === loginPassword);
        
        if (user) {
          localStorage.setItem("currentUser", JSON.stringify(user));
          setLoading(false);
          toast.success("Connexion réussie ! Bienvenue !");
          
          // Dispatch event for pending request recovery
          window.dispatchEvent(new Event("userLoggedIn"));
          
          if (onLoginSuccess) {
            onLoginSuccess(user);
          }
          
          onClose();
        } else {
          setLoading(false);
          toast.error("Email ou mot de passe incorrect");
          setErrors({ loginEmail: "Identifiants incorrects" });
        }
      }, 1000);
    }
  };

  // Forgot Password Handlers
  const handleForgotPasswordPhone = () => {
    const newErrors: Record<string, string> = {};
    
    if (!forgotPhone.trim()) {
      newErrors.forgotPhone = "Le numéro de téléphone est requis";
    } else if (!/^[0-9]{10}$/.test(forgotPhone.replace(/\s/g, ""))) {
      newErrors.forgotPhone = "Numéro invalide (10 chiffres requis)";
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      
      setTimeout(() => {
        // Check if phone exists
        const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const user = existingUsers.find((u: any) => u.phone === forgotPhone);
        
        if (user) {
          setLoading(false);
          setForgotPasswordStep("otp");
          toast.success(`Code envoyé par SMS au ${forgotPhone}`);
        } else {
          setLoading(false);
          toast.error("Aucun compte associé à ce numéro");
          setErrors({ forgotPhone: "Numéro non trouvé" });
        }
      }, 1000);
    }
  };

  const handleForgotPasswordOtp = () => {
    const newErrors: Record<string, string> = {};
    
    if (!forgotOtp.trim()) {
      newErrors.forgotOtp = "Le code est requis";
    } else if (forgotOtp.length !== 6) {
      newErrors.forgotOtp = "Le code doit contenir 6 chiffres";
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      
      setTimeout(() => {
        // Simulate OTP verification
        setLoading(false);
        setForgotPasswordStep("new-password");
        toast.success("Code vérifié avec succès !");
      }, 1000);
    }
  };

  const handleResetPassword = () => {
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
      
      setTimeout(() => {
        // Update password in localStorage
        const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const userIndex = existingUsers.findIndex((u: any) => u.phone === forgotPhone);
        
        if (userIndex !== -1) {
          existingUsers[userIndex].password = newPassword;
          localStorage.setItem("users", JSON.stringify(existingUsers));
          
          setLoading(false);
          toast.success("Mot de passe réinitialisé avec succès !");
          
          // Reset forgot password fields
          setForgotPhone("");
          setForgotOtp("");
          setNewPassword("");
          setConfirmNewPassword("");
          setForgotPasswordStep("phone");
          
          // Return to login view
          setTimeout(() => {
            setView("login");
          }, 1500);
        }
      }, 1000);
    }
  };

  const handleUpdateProfile = () => {
    if (validateStep1()) {
      setLoading(true);
      
      setTimeout(() => {
        // Get current user
        const currentUserStr = localStorage.getItem("currentUser");
        if (currentUserStr) {
          try {
            const currentUser = JSON.parse(currentUserStr);
            
            // Update user data
            const updatedUser = {
              ...currentUser,
              nom,
              prenom,
              fullName: `${prenom} ${nom}`,
              email,
              phone,
            };
            
            // Update in localStorage
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));
            
            // Update in users array
            const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
            const userIndex = existingUsers.findIndex((u: any) => u.id === currentUser.id);
            if (userIndex !== -1) {
              existingUsers[userIndex] = {
                ...existingUsers[userIndex],
                nom,
                prenom,
                fullName: `${prenom} ${nom}`,
                email,
                phone,
              };
              localStorage.setItem("users", JSON.stringify(existingUsers));
            }
            
            setLoading(false);
            toast.success("Profil mis à jour avec succès !");
            
            // Trigger a custom event to notify forms
            window.dispatchEvent(new Event("profileUpdated"));
            
            if (onLoginSuccess) {
              onLoginSuccess(updatedUser);
            }
            
            setTimeout(() => {
              onClose();
            }, 1000);
          } catch (error) {
            console.error("Error updating profile:", error);
            setLoading(false);
            toast.error("Erreur lors de la mise à jour");
          }
        }
      }, 1000);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    
    // Simulate Google OAuth
    setTimeout(() => {
      const mockUser = {
        id: `user-${Date.now()}`,
        nom: "Google",
        prenom: "Utilisateur",
        fullName: "Utilisateur Google",
        email: "user@gmail.com",
        phone: "0600000000",
        password: "",
        createdAt: new Date().toISOString(),
        dateInsc: new Date().toLocaleDateString("fr-FR"),
      };
      
      // Save to localStorage with separate nom/prenom
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      existingUsers.push(mockUser);
      localStorage.setItem("users", JSON.stringify(existingUsers));
      localStorage.setItem("currentUser", JSON.stringify({
        id: mockUser.id,
        nom: mockUser.nom,
        prenom: mockUser.prenom,
        fullName: mockUser.fullName,
        email: mockUser.email,
        phone: mockUser.phone,
        createdAt: mockUser.createdAt,
        dateInsc: mockUser.dateInsc,
      }));
      
      setLoading(false);
      toast.success("Connexion réussie avec Google !");
      
      // Dispatch event for admin panel to update user count
      window.dispatchEvent(new Event("userRegistered"));
      
      // Dispatch event for pending request recovery
      window.dispatchEvent(new Event("userLoggedIn"));
      
      if (onLoginSuccess) {
        onLoginSuccess(mockUser);
      }
      
      onClose();
    }, 1500);
  };

  const handleStep1Next = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleStep2Verify = () => {
    if (!showOTP) {
      if (validateStep2()) {
        setLoading(true);
        // Simulate sending OTP
        setTimeout(() => {
          setLoading(false);
          setShowOTP(true);
          toast.success("Code de vérification envoyé !");
        }, 1000);
      }
    } else {
      if (validateStep2()) {
        setStep(3);
      }
    }
  };

  const handleStep3Complete = () => {
    if (validateStep3()) {
      setLoading(true);
      
      setTimeout(() => {
        const newUser = {
          id: `user-${Date.now()}`,
          nom: nom,
          prenom: prenom,
          fullName: `${prenom} ${nom}`,
          email,
          phone,
          password,
          createdAt: new Date().toISOString(),
          dateInsc: new Date().toLocaleDateString("fr-FR"),
        };
        
        // Save to localStorage with separate nom/prenom
        const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
        existingUsers.push(newUser);
        localStorage.setItem("users", JSON.stringify(existingUsers));
        localStorage.setItem("currentUser", JSON.stringify({
          id: newUser.id,
          nom: nom,
          prenom: prenom,
          fullName: newUser.fullName,
          email,
          phone,
          createdAt: newUser.createdAt,
          dateInsc: newUser.dateInsc,
        }));
        
        setLoading(false);
        toast.success("Inscription réussie ! Bienvenue !");
        
        // Dispatch event for admin panel to update user count
        window.dispatchEvent(new Event("userRegistered"));
        
        // Dispatch event for pending request recovery
        window.dispatchEvent(new Event("userLoggedIn"));
        
        if (onLoginSuccess) {
          onLoginSuccess(newUser);
        }
        
        onClose();
      }, 1500);
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
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                      s <= step ? "bg-[#2C5F2D]" : "bg-gray-300 dark:bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            )}
            
            {/* Step Indicator - Forgot Password */}
            {view === "forgot-password" && (
              <div className="flex items-center gap-2 mt-6 max-w-xs mx-auto">
                {["phone", "otp", "new-password"].map((s, index) => (
                  <div
                    key={s}
                    className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                      ["phone", "otp", "new-password"].indexOf(forgotPasswordStep) >= index ? "bg-primary" : "bg-gray-300 dark:bg-slate-700"
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
                  {/* Google Sign In Button */}
                  <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 hover:border-[#2C5F2D] dark:hover:border-[#D4AF37] text-gray-700 dark:text-gray-200 font-semibold py-3 md:py-4 min-h-[48px] px-4 rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continuer avec Google
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400">ou</span>
                    </div>
                  </div>

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
                        className={`w-full px-4 py-3 md:py-3 min-h-[48px] text-base border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2C5F2D] dark:focus:ring-[#D4AF37] focus:border-transparent transition-all ${
                          errors.loginEmail ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                        }`}
                        placeholder="Ex: ahmed@example.com"
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
                  {/* Step A: Phone Input */}
                  {forgotPasswordStep === "phone" && (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        Entrez le numéro de téléphone associé à votre compte
                      </p>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Numéro de Téléphone *
                        </label>
                        <input
                          type="tel"
                          value={forgotPhone}
                          onChange={(e) => setForgotPhone(e.target.value)}
                          className={`w-full px-4 py-3 md:py-3 min-h-[48px] text-base border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                            errors.forgotPhone ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                          }`}
                          placeholder="Ex: 0600000000"
                        />
                        {errors.forgotPhone && (
                          <p className="text-red-500 text-xs mt-1">{errors.forgotPhone}</p>
                        )}
                      </div>

                      <button
                        onClick={handleForgotPasswordPhone}
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 md:py-4 min-h-[48px] px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 touch-manipulation"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Envoi...
                          </>
                        ) : (
                          "Envoyer le code"
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

                  {/* Step B: OTP Verification */}
                  {forgotPasswordStep === "otp" && (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        Un code de vérification a été envoyé au {forgotPhone}
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
                          Entrez le code à 6 chiffres
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
                          "Vérifier"
                        )}
                      </button>
                    </div>
                  )}

                  {/* Step C: New Password */}
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
                          className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
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
                          className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
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
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 touch-manipulation"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Réinitialisation...
                          </>
                        ) : (
                          "Réinitialiser le mot de passe"
                        )}
                      </button>
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
                        placeholder="Ex: Benali"
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
                        placeholder="Ex: Ahmed"
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
                      className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                        errors.email ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                      }`}
                      placeholder="Ex: ahmed@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
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
                  {/* Google Sign In Button */}
                  <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 hover:border-[#2C5F2D] dark:hover:border-[#D4AF37] text-gray-700 dark:text-gray-200 font-semibold py-4 px-4 rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                  >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuer avec Google
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400">ou</span>
              </div>
            </div>

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
                        className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2C5F2D] dark:focus:ring-[#D4AF37] focus:border-transparent transition-all ${
                          errors.nom ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                        }`}
                        placeholder="Ex: Benali"
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
                        className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2C5F2D] dark:focus:ring-[#D4AF37] focus:border-transparent transition-all ${
                          errors.prenom ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                        }`}
                        placeholder="Ex: Ahmed"
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
                      className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2C5F2D] dark:focus:ring-[#D4AF37] focus:border-transparent transition-all ${
                        errors.email ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                      }`}
                      placeholder="Ex: ahmed@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  <button
                    onClick={handleStep1Next}
                    className="w-full bg-[#2C5F2D] hover:bg-[#234d24] text-white font-bold py-4 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg touch-manipulation"
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Numéro de Téléphone *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2C5F2D] dark:focus:ring-[#D4AF37] focus:border-transparent transition-all ${
                        errors.phone ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                      }`}
                      placeholder="Ex: 0600000000"
                      disabled={showOTP}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <AnimatePresence>
                    {showOTP && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Code de Vérification *
                        </label>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2C5F2D] dark:focus:ring-[#D4AF37] focus:border-transparent transition-all text-center text-2xl tracking-widest font-semibold ${
                            errors.otp ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                          }`}
                          placeholder="000000"
                          maxLength={6}
                        />
                        {errors.otp && (
                          <p className="text-red-500 text-xs mt-1">{errors.otp}</p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                          Entrez le code à 6 chiffres envoyé par SMS
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

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
                      className="w-full md:flex-1 bg-[#2C5F2D] hover:bg-[#234d24] text-white font-bold py-4 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 touch-manipulation"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Envoi...
                        </>
                      ) : showOTP ? (
                        <>
                          Vérifier
                          <CheckCircle size={18} />
                        </>
                      ) : (
                        "Vérifier"
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Mot de Passe *
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2C5F2D] dark:focus:ring-[#D4AF37] focus:border-transparent transition-all ${
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
                      className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2C5F2D] dark:focus:ring-[#D4AF37] focus:border-transparent transition-all ${
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
                      onClick={() => {
                        setStep(2);
                        setShowOTP(false);
                        setOtp("");
                      }}
                      className="w-full md:w-auto bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 font-bold py-4 px-4 rounded-lg transition-all duration-200 touch-manipulation"
                    >
                      Retour
                    </button>
                    <button
                      onClick={handleStep3Complete}
                      disabled={loading}
                      className="w-full md:flex-1 bg-[#2C5F2D] hover:bg-[#234d24] text-white font-bold py-4 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 touch-manipulation"
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
