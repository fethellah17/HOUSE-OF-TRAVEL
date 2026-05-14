import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, MessageCircle, User, LogOut, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";
import LoginModal from "./LoginModal";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/services/authService";

const navLinks = [
  { to: "/", label: "Accueil" },
  { to: "/voyage-organise", label: "Voyage Organisé" },
  { to: "/billetterie", label: "Billetterie" },
  { to: "/devis", label: "Devis Gratuit" },
];

const whatsappServices = [
  { id: 1, label: "Assistant 1", phone: "213549059432" },
  { id: 2, label: "Assistant 2", phone: "213777738342" },
  { id: 3, label: "Assistant 3", phone: "213771933646" },
];

const Navbar = () => {
  const location = useLocation();
  const { user: authUser, isLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [whatsappDropdownOpen, setWhatsappDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setWhatsappDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    // Confirmation dialog
    const confirmed = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
    
    if (confirmed) {
      const result = await logout();
      if (result.success) {
        setMobileOpen(false);
        
        // Dispatch custom event to notify all forms
        window.dispatchEvent(new Event("userLoggedOut"));
        
        toast.success("Déconnexion réussie !");
      } else {
        toast.error(result.error || "Erreur lors de la déconnexion");
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <nav className="container mx-auto flex items-center justify-between h-16 sm:h-20 px-4 lg:px-8">
        <Link to="/" className="flex items-center py-2">
          <img 
            src={logo} 
            alt="HOUSE OF TRAVEL" 
            className="h-12 sm:h-14 md:h-16 lg:h-18 w-auto object-contain" 
          />
        </Link>

        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.to} className="relative">
              <Link
                to={link.to}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md
                  ${location.pathname === link.to
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                  }
                  ${link.to === "/devis" ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground px-5 py-2 rounded-lg ml-2" : ""}`}
              >
                {link.label}
                {location.pathname === link.to && link.to !== "/devis" && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 150, damping: 25 }}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 md:gap-4">
          {/* User Account Button */}
          {authUser ? (
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary">
                <User size={18} />
                <span className="text-sm font-medium hidden md:inline">
                  {authUser.prenom || "Utilisateur"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-purple-50 text-purple-900 transition-colors"
                title="Se déconnecter"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="hidden sm:flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-medium text-sm"
            >
              <User size={18} />
              <span className="hidden md:inline">Se connecter</span>
            </button>
          )}

          {/* Mobile User Greeting - Shows before WhatsApp icon */}
          {authUser && (
            <div className="sm:hidden flex items-center">
              <span className="text-xs font-medium text-slate-700 max-w-[70px] truncate">
                {authUser.prenom || "User"}
              </span>
            </div>
          )}

          {/* WhatsApp Contact Dropdown - Desktop */}
          <div className="hidden sm:block relative" ref={dropdownRef}>
            <motion.button
              onClick={() => setWhatsappDropdownOpen(!whatsappDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 hover:bg-green-100 transition-colors duration-200 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "loop",
              }}
              title="Contactez-nous sur WhatsApp"
            >
              <MessageCircle className="w-5 h-5 text-green-600 group-hover:text-green-700 transition-colors" />
              <span className="text-sm font-medium text-green-700 group-hover:text-green-800 transition-colors hidden md:inline">
                Contact
              </span>
              <ChevronDown className={`w-4 h-4 text-green-600 transition-transform duration-200 ${whatsappDropdownOpen ? "rotate-180" : ""}`} />
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {whatsappDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
                >
                  {whatsappServices.map((service) => (
                    <a
                      key={service.id}
                      href={`https://wa.me/${service.phone}?text=Bonjour%20Agence%20HOUSE%20OF%20TRAVEL,%20je%20souhaite%20avoir%20plus%20d'informations%20sur%20vos%20offres.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setWhatsappDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#0a2357] hover:bg-slate-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                    >
                      <MessageCircle className="w-4 h-4 text-green-600" />
                      <span>{service.label}</span>
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* WhatsApp Contact Icon - Mobile */}
          <div className="sm:hidden relative" ref={dropdownRef}>
            <motion.button
              onClick={() => setWhatsappDropdownOpen(!whatsappDropdownOpen)}
              className="p-2 rounded-lg bg-green-50 hover:bg-green-100 transition-colors duration-200 relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "loop",
              }}
              title="Contactez-nous sur WhatsApp"
            >
              <MessageCircle className="w-6 h-6 text-green-600 hover:text-green-700 transition-colors" />
              <ChevronDown className={`w-3 h-3 text-green-600 absolute -bottom-0.5 -right-0.5 transition-transform duration-200 ${whatsappDropdownOpen ? "rotate-180" : ""}`} />
            </motion.button>

            {/* Mobile Dropdown Menu */}
            <AnimatePresence>
              {whatsappDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
                >
                  {whatsappServices.map((service) => (
                    <a
                      key={service.id}
                      href={`https://wa.me/${service.phone}?text=Bonjour%20Agence%20HOUSE%20OF%20TRAVEL,%20je%20souhaite%20avoir%20plus%20d'informations%20sur%20vos%20offres.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setWhatsappDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#0a2357] hover:bg-slate-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                    >
                      <MessageCircle className="w-4 h-4 text-green-600" />
                      <span>{service.label}</span>
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden p-2 text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b border-border bg-white overflow-hidden"
          >
            <ul className="flex flex-col p-4 gap-1">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 text-sm font-medium rounded-lg transition-colors
                      ${location.pathname === link.to
                        ? "bg-muted text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-primary"
                      }
                      ${link.to === "/devis" ? "bg-primary text-primary-foreground hover:text-primary-foreground text-center mt-2" : ""}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              
              {/* Mobile Login/Logout */}
              <li className="mt-2 pt-2 border-t border-border">
                {authUser ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-purple-50 text-purple-900 hover:bg-purple-100 transition-colors text-sm font-medium"
                  >
                    <LogOut size={18} />
                    Déconnexion
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowLoginModal(true);
                      setMobileOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    <User size={18} />
                    Se connecter
                  </button>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </header>
  );
};

export default Navbar;
