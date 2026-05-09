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
  const handleForgotPasswordEmail = () => {
    const newErrors: Record<string, string> = {};
    
    if (!forgotEmail.trim()) {
      newErrors.forgotEmail = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      newErrors.forgotEmail = "Email invalide";
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      
      // Frontend simulation: Check if email exists
      setTimeout(() => {
        const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const user = existingUsers.find((u: any) => u.email === forgotEmail);
        
        if (user) {
          setLoading(false);
          setForgotPasswordStep("otp");
          toast.success("Code de vérification envoyé à votre Gmail");
        } else {
          setLoading(false);
          toast.error("Aucun compte associé à cet email");
          setErrors({ forgotEmail: "Email non trouvé" });
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
      
      // SUPABASE: supabase.auth.verifyOtp({ email, token: forgotOtp, type: 'recovery' })
      setTimeout(() => {
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
      
      // SUPABASE: supabase.auth.updateUser({ password: newPassword })
      setTimeout(() => {
        // Update password in localStorage
        const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const userIndex = existingUsers.findIndex((u: any) => u.email === forgotEmail);
        
        if (userIndex !== -1) {
          existingUsers[userIndex].password = newPassword;
          localStorage.setItem("users", JSON.stringify(existingUsers));
          
          // AUTO-LOGIN: Set currentUser immediately
          const updatedUser = existingUsers[userIndex];
          localStorage.setItem("currentUser", JSON.stringify({
            id: updatedUser.id,
            nom: updatedUser.nom,
            prenom: updatedUser.prenom,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            phone: updatedUser.phone,
            createdAt: updatedUser.createdAt,
            dateInsc: updatedUser.dateInsc,
          }));
          
          setLoading(false);
          setForgotPasswordStep("success");
          toast.success("Mot de passe mis à jour. Bienvenue dans votre espace !");
          
          // Dispatch event for immediate data sync
          window.dispatchEvent(new Event("userLoggedIn"));
          
          // Call onLoginSuccess if provided
          if (onLoginSuccess) {
            onLoginSuccess(updatedUser);
          }
          
          // Close modal and redirect to home
          setTimeout(() => {
            onClose();
            window.location.href = "/";
          }, 1500);
        }
      }, 1000);
    }
  };

  const handleUpdateProfile = () => {
    if (validateEditProfile()) {
      setLoading(true);
      
      setTimeout(() => {
        // Get current user
        const currentUserStr = localStorage.getItem("currentUser");
        if (currentUserStr) {
          try {
            const currentUser = JSON.parse(currentUserStr);
            
            // Update user data (email is NOT updated - read-only)
            const updatedUser = {
              ...currentUser,
              nom,
              prenom,
              fullName: `${prenom} ${nom}`,
              phone,
              // email remains unchanged
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
                phone,
                // email remains unchanged
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
    
    // SUPABASE PLACEHOLDER: Replace with supabase.auth.signInWithOAuth({ provider: 'google' })
    setTimeout(() => {
      const mockUser = {
        id: `user-${Date.now()}`,
        nom: "Google",
        prenom: "Utilisateur",
        fullName: "Utilisateur Google",
        email: "user@gmail.com",
        phone: "",
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
      // Check for duplicate email before proceeding
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const emailExists = existingUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
      
      if (emailExists) {
        setErrors({ email: "Cet e-mail est déjà utilisé. Vous avez déjà créé un compte avec cet e-mail." });
        toast.error("Cet e-mail est déjà utilisé");
        return;
      }
      
      setLoading(true);
      
      // SUPABASE PLACEHOLDER: Replace with supabase.auth.signUp({ email, password: 'temp' })
      // This will trigger email OTP
      setTimeout(() => {
        setLoading(false);
        setStep(2);
        toast.success("Code de vérification envoyé à votre email !");
      }, 1000);
    }
  };

  const handleStep2Verify = () => {
    if (validateStep2()) {
      setLoading(true);
      
      // SUPABASE PLACEHOLDER: Replace with supabase.auth.verifyOtp({ email, token: emailOtp, type: 'signup' })
      setTimeout(() => {
        setLoading(false);
        setStep(3);
        toast.success("Email vérifié avec succès !");
      }, 1000);
    }
  };

  const handleStep3Next = () => {
    if (validateStep3()) {
      setStep(4);
    }
  };

  const handleStep4Complete = () => {
    if (validateStep4()) {
      setLoading(true);
      
      // SUPABASE PLACEHOLDER: Replace with supabase.auth.updateUser({ password, data: { nom, prenom, phone } })
      setTimeout(() => {
        const newUser = {
          id: `user-${Date.now()}`,
          nom: nom,
          prenom: prenom,
          fullName: `${prenom} ${nom}`,
          email,
          phone: phone, // Required field
          password,
          createdAt: new Date().toISOString(),
          dateInsc: new Date().toLocaleDateString("fr-FR"),
        };
        
        // Console log for debugging
        console.log("Registration Complete - User Data:", newUser);
        
        // Save to localStorage with separate nom/prenom
        const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
        existingUsers.push(newUser);
        localStorage.setItem("users", JSON.stringify(existingUsers));
        
        // IMMEDIATE AUTO-LOGIN: Set currentUser BEFORE any other actions
        const currentUserData = {
          id: newUser.id,
          nom: nom,
          prenom: prenom,
          fullName: newUser.fullName,
          email,
          phone: phone,
          createdAt: newUser.createdAt,
          dateInsc: newUser.dateInsc,
        };
        localStorage.setItem("currentUser", JSON.stringify(currentUserData));
        
        setLoading(false);
        toast.success("Inscription réussie ! Bienvenue !");
        
        // Dispatch events for immediate data sync
        window.dispatchEvent(new Event("userRegistered"));
        window.dispatchEvent(new Event("userLoggedIn"));
        
        // Call onLoginSuccess with user data for immediate state update
        if (onLoginSuccess) {
          onLoginSuccess(newUser);
        }
        
        // Close modal and redirect immediately
        onClose();
        
        // Immediate redirect to home page (no manual login needed)
        setTimeout(() => {
          window.location.href = "/";
        }, 100);
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
                {[1, 2, 3, 4].map((s) => (
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
                          placeholder="Ex: ahmed@example.com"
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
                        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                          <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
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
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full px-4 py-3 border rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-slate-600 cursor-not-allowed transition-all"
                      placeholder="Ex: ahmed@example.com"
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
                      Vérifiez votre boîte de réception Gmail
                    </p>
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
                      className="w-full md:flex-1 bg-[#2C5F2D] hover:bg-[#234d24] text-white font-bold py-4 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 touch-manipulation"
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
                      className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2C5F2D] dark:focus:ring-[#D4AF37] focus:border-transparent transition-all ${
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
                      className="w-full md:flex-1 bg-[#2C5F2D] hover:bg-[#234d24] text-white font-bold py-4 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 touch-manipulation"
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
                      onClick={() => setStep(3)}
                      className="w-full md:w-auto bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 font-bold py-4 px-4 rounded-lg transition-all duration-200 touch-manipulation"
                    >
                      Retour
                    </button>
                    <button
                      onClick={handleStep4Complete}
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
