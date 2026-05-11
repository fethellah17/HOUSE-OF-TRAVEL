import { Link } from "react-router-dom";
import { Settings, MapPin, Smartphone, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

// Social Media Icons as SVG components for better quality
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <img src={logo} alt="HOUSE OF TRAVEL" className="h-16 w-auto mb-4" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Votre partenaire de confiance pour les pèlerinages et voyages organisés. Nous vous accompagnons à chaque étape.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/voyage-organise" className="hover:text-primary transition-colors">Voyage Organisé</Link></li>
              <li><Link to="/billetterie" className="hover:text-primary transition-colors">Billetterie</Link></li>
              <li><Link to="/devis" className="hover:text-primary transition-colors">Devis Gratuit</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-[#FFD700] flex-shrink-0" />
                <a 
                  href="https://maps.app.goo.gl/817MPqjhBSFmToAd9?g_st=ic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Bab Ezzouar, Alger
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Smartphone size={16} className="text-[#FFD700] flex-shrink-0" />
                <a 
                  href="tel:0549059432" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  0549 05 94 32
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[#FFD700] flex-shrink-0" />
                <a 
                  href="tel:0777738342" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  0777 73 83 42
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[#FFD700] flex-shrink-0" />
                <a 
                  href="tel:0771933646" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  0771 93 36 46
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[#FFD700] flex-shrink-0" />
                <a 
                  href="mailto:Houseoftravel@gmail.com" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Houseoftravel@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Suivez-nous</h4>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Rejoignez notre communauté et suivez nos aventures !
            </p>
            <div className="flex gap-3">
              {/* Instagram */}
              <motion.a
                href="https://www.instagram.com/houseoftravel1?igsh=MTlzaHZvamo0cWY5OQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center text-white hover:shadow-lg transition-all group"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Suivez-nous sur Instagram"
              >
                <InstagramIcon className="w-6 h-6" />
              </motion.a>

              {/* TikTok */}
              <motion.a
                href="https://www.tiktok.com/@house.of.travel?_r=1&_t=ZS-96AsuZ23Xj3"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white hover:shadow-lg transition-all group"
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Suivez-nous sur TikTok"
              >
                <TikTokIcon className="w-6 h-6" />
              </motion.a>

              {/* Facebook */}
              <motion.a
                href="https://www.facebook.com/HOUSETRAVEL219"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white hover:shadow-lg transition-all group"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Suivez-nous sur Facebook"
              >
                <FacebookIcon className="w-6 h-6" />
              </motion.a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            © 2026 HOUSE OF TRAVEL. Tous droits réservés.
          </p>
          <Link
            to="/admin"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Administration"
          >
            <Settings size={16} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
