import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Hotel, Users, Calendar, Utensils, FileText } from "lucide-react";

interface FormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  servicePath: "" | "travel" | "visa";
  travelType?: "omrah" | "voyage";
  
  // Omrah Configuration - Synced with Admin
  destination?: string;
  hotel_type?: "4stars" | "5stars";
  hotel_distance?: "close" | "medium" | "far";
  room_type?: "double" | "triple" | "quad";
  room_count?: number;
  adults_count?: number;
  children_count?: number;
  children_ages?: string;
  pension_type?: "none" | "breakfast" | "half" | "full";
  visa_required?: boolean;
  flight_included?: boolean;
  departure_date?: string;
  return_date?: string;
  
  // Voyage Organisé Configuration
  voyageDestination?: string;
  voyageBoardType?: "full" | "half";
  
  visaProfession?: string;
  visaDestination?: string;
  hasUsaVisa?: boolean;
  message?: string;
}

interface TravelModuleProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  errors: Record<string, string>;
}

const TravelModule = ({ formData, setFormData, errors }: TravelModuleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Travel Type Selection */}
      <div>
        <div className="border-l-4 border-[#2C5F2D] pl-4 mb-6">
          <h2 className="text-2xl font-bold text-[#0a2357]">Type de Voyage</h2>
          <p className="text-sm text-muted-foreground mt-1">Choisissez entre Omrah ou Voyage Organisé</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                travelType: "omrah",
                destination: "Omrah",
                voyageDestination: undefined,
                voyageBoardType: undefined,
              })
            }
            className={`p-6 rounded-xl border-2 transition-all duration-300 text-left min-h-[48px] ${
              formData.travelType === "omrah"
                ? "border-[#2C5F2D] bg-[#2C5F2D]/10 shadow-lg"
                : "border-gray-200 hover:border-[#2C5F2D]/50 hover:shadow-md"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <svg
                className="text-[#2C5F2D]"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <h3 className="text-lg font-bold text-[#0a2357]">Omrah</h3>
            </div>
            <p className="text-sm text-muted-foreground">Pèlerinage à La Mecque avec hébergement</p>
          </motion.button>

          <motion.button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                travelType: "voyage",
                destination: undefined,
                hotel_type: undefined,
                hotel_distance: undefined,
                room_type: undefined,
                room_count: undefined,
                adults_count: undefined,
                children_count: undefined,
                children_ages: undefined,
                pension_type: undefined,
                visa_required: undefined,
                flight_included: undefined,
                departure_date: undefined,
                return_date: undefined,
              })
            }
            className={`p-6 rounded-xl border-2 transition-all duration-300 text-left min-h-[48px] ${
              formData.travelType === "voyage"
                ? "border-[#2C5F2D] bg-[#2C5F2D]/10 shadow-lg"
                : "border-gray-200 hover:border-[#2C5F2D]/50 hover:shadow-md"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="text-[#2C5F2D]" size={28} />
              <h3 className="text-lg font-bold text-[#0a2357]">Voyage Organisé</h3>
            </div>
            <p className="text-sm text-muted-foreground">Destinations variées avec pension complète</p>
          </motion.button>
        </div>
        {errors.travelType && <p className="text-red-500 text-sm mt-2">{errors.travelType}</p>}
      </div>

      {/* Omrah Specific Fields - DEEP CONFIGURATION */}
      {formData.travelType === "omrah" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Hotel Configuration */}
          <div className="bg-white border border-slate-100 rounded-xl p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-[#0a2357] mb-4 flex items-center gap-2">
              <Hotel size={18} className="text-gray-400" />
              Configuration Hôtel
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Hotel Type */}
              <div>
                <label className="block text-sm font-semibold text-[#0a2357] mb-2">
                  Type d'Hôtel *
                </label>
                <select
                  value={formData.hotel_type || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hotel_type: e.target.value as "4stars" | "5stars",
                    })
                  }
                  className="premium-input w-full h-[52px]"
                >
                  <option value="">Sélectionner</option>
                  <option value="4stars">4 Étoiles</option>
                  <option value="5stars">5 Étoiles</option>
                </select>
                {errors.hotel_type && (
                  <p className="text-red-500 text-xs mt-1">{errors.hotel_type}</p>
                )}
              </div>

              {/* Distance from Haram */}
              <div>
                <label className="block text-sm font-semibold text-[#0a2357] mb-2">
                  Distance du Haram *
                </label>
                <select
                  value={formData.hotel_distance || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hotel_distance: e.target.value as "close" | "medium" | "far",
                    })
                  }
                  className="premium-input w-full h-[52px]"
                >
                  <option value="">Sélectionner</option>
                  <option value="close">Proche (0-500m)</option>
                  <option value="medium">Moyenne (500m-1km)</option>
                  <option value="far">Plus de 1km</option>
                </select>
                {errors.hotel_distance && (
                  <p className="text-red-500 text-xs mt-1">{errors.hotel_distance}</p>
                )}
              </div>

              {/* Room Type */}
              <div>
                <label className="block text-sm font-semibold text-[#0a2357] mb-2">
                  Type de Chambre *
                </label>
                <select
                  value={formData.room_type || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      room_type: e.target.value as "double" | "triple" | "quad",
                    })
                  }
                  className="premium-input w-full h-[52px]"
                >
                  <option value="">Sélectionner</option>
                  <option value="double">Double</option>
                  <option value="triple">Triple</option>
                  <option value="quad">Quadruple</option>
                </select>
                {errors.room_type && (
                  <p className="text-red-500 text-xs mt-1">{errors.room_type}</p>
                )}
              </div>
            </div>

            {/* Room Count */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-[#0a2357] mb-2">
                Nombre de Chambres *
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.room_count || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    room_count: parseInt(e.target.value) || undefined,
                  })
                }
                className="premium-input w-full h-[52px]"
                placeholder="Ex: 2"
              />
              {errors.room_count && (
                <p className="text-red-500 text-xs mt-1">{errors.room_count}</p>
              )}
            </div>
          </div>

          {/* Passenger Management */}
          <div className="bg-white border border-slate-100 rounded-xl p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-[#0a2357] mb-4 flex items-center gap-2">
              <Users size={18} className="text-gray-400" />
              Passagers
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Adults Count */}
              <div>
                <label className="block text-sm font-semibold text-[#0a2357] mb-2">
                  Nombre d'Adultes *
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.adults_count || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      adults_count: parseInt(e.target.value) || undefined,
                    })
                  }
                  className="premium-input w-full h-[52px]"
                  placeholder="Ex: 2"
                />
                {errors.adults_count && (
                  <p className="text-red-500 text-xs mt-1">{errors.adults_count}</p>
                )}
              </div>

              {/* Children Count */}
              <div>
                <label className="block text-sm font-semibold text-[#0a2357] mb-2">
                  Nombre d'Enfants
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.children_count || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      children_count: parseInt(e.target.value) || undefined,
                      children_ages: parseInt(e.target.value) === 0 ? undefined : formData.children_ages,
                    })
                  }
                  className="premium-input w-full h-[52px]"
                  placeholder="Ex: 1"
                />
                {errors.children_count && (
                  <p className="text-red-500 text-xs mt-1">{errors.children_count}</p>
                )}
              </div>
            </div>

            {/* Children Ages - Conditional */}
            <AnimatePresence>
              {formData.children_count && formData.children_count > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6"
                >
                  <label className="block text-sm font-semibold text-[#0a2357] mb-2">
                    Âge des Enfants *
                  </label>
                  <input
                    type="text"
                    value={formData.children_ages || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        children_ages: e.target.value,
                      })
                    }
                    className="premium-input w-full h-[52px]"
                    placeholder="Ex: 5 ans, 8 ans"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Séparez les âges par des virgules
                  </p>
                  {errors.children_ages && (
                    <p className="text-red-500 text-xs mt-1">{errors.children_ages}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Meal Plan */}
          <div className="bg-white border border-slate-100 rounded-xl p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-[#0a2357] mb-4 flex items-center gap-2">
              <Utensils size={18} className="text-gray-400" />
              Pension
            </h3>

            <div>
              <label className="block text-sm font-semibold text-[#0a2357] mb-2">
                Type de Pension *
              </label>
              <select
                value={formData.pension_type || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pension_type: e.target.value as "none" | "breakfast" | "half" | "full",
                  })
                }
                className="premium-input w-full h-[52px]"
              >
                <option value="">Sélectionner</option>
                <option value="none">Sans pension</option>
                <option value="breakfast">Petit déjeuner</option>
                <option value="half">Demi-pension</option>
                <option value="full">Pension complète</option>
              </select>
              {errors.pension_type && (
                <p className="text-red-500 text-xs mt-1">{errors.pension_type}</p>
              )}
            </div>
          </div>

          {/* Logistics Toggles */}
          <div className="bg-white border border-slate-100 rounded-xl p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-[#0a2357] mb-4 flex items-center gap-2">
              <FileText size={18} className="text-gray-400" />
              Logistique
            </h3>

            <div className="space-y-6">
              {/* Need Visa */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-semibold text-[#0a2357] mb-3">
                  Besoin d'un Visa ? *
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, visa_required: true })}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all duration-300 h-[60px] sm:h-[52px] ${
                      formData.visa_required === true
                        ? "border-[#0a2357] bg-[#0a2357]/5 shadow-md"
                        : "border-slate-200 hover:border-[#0a2357]/50"
                    }`}
                  >
                    <span className="font-semibold text-[#0a2357]">Oui</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, visa_required: false })}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all duration-300 h-[60px] sm:h-[52px] ${
                      formData.visa_required === false
                        ? "border-[#0a2357] bg-[#0a2357]/5 shadow-md"
                        : "border-slate-200 hover:border-[#0a2357]/50"
                    }`}
                  >
                    <span className="font-semibold text-[#0a2357]">Non</span>
                  </button>
                </div>
                {errors.visa_required && (
                  <p className="text-red-500 text-xs mt-1">{errors.visa_required}</p>
                )}
              </motion.div>

              {/* Flight Included */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-semibold text-[#0a2357] mb-3">
                  Vol Inclus ? *
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, flight_included: true })}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all duration-300 h-[60px] sm:h-[52px] ${
                      formData.flight_included === true
                        ? "border-[#0a2357] bg-[#0a2357]/5 shadow-md"
                        : "border-slate-200 hover:border-[#0a2357]/50"
                    }`}
                  >
                    <span className="font-semibold text-[#0a2357]">Oui</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, flight_included: false })}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all duration-300 h-[60px] sm:h-[52px] ${
                      formData.flight_included === false
                        ? "border-[#0a2357] bg-[#0a2357]/5 shadow-md"
                        : "border-slate-200 hover:border-[#0a2357]/50"
                    }`}
                  >
                    <span className="font-semibold text-[#0a2357]">Non</span>
                  </button>
                </div>
                {errors.flight_included && (
                  <p className="text-red-500 text-xs mt-1">{errors.flight_included}</p>
                )}
              </motion.div>
            </div>
          </div>

          {/* Travel Dates */}
          <div className="bg-white border border-slate-100 rounded-xl p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-[#0a2357] mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-gray-400" />
              Dates de Voyage
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Departure Date */}
              <div>
                <label className="block text-sm font-semibold text-[#0a2357] mb-2">
                  Date de Départ *
                </label>
                <input
                  type="date"
                  value={formData.departure_date || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      departure_date: e.target.value,
                    })
                  }
                  className="premium-input w-full h-[52px]"
                  min={new Date().toISOString().split("T")[0]}
                />
                {errors.departure_date && (
                  <p className="text-red-500 text-xs mt-1">{errors.departure_date}</p>
                )}
              </div>

              {/* Return Date */}
              <div>
                <label className="block text-sm font-semibold text-[#0a2357] mb-2">
                  Date de Retour *
                </label>
                <input
                  type="date"
                  value={formData.return_date || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      return_date: e.target.value,
                    })
                  }
                  className="premium-input w-full h-[52px]"
                  min={formData.departure_date || new Date().toISOString().split("T")[0]}
                />
                {errors.return_date && (
                  <p className="text-red-500 text-xs mt-1">{errors.return_date}</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Voyage Organisé Specific Fields */}
      {formData.travelType === "voyage" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div className="bg-white border border-slate-100 rounded-xl p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-[#0a2357] mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-gray-400" />
              Configuration Voyage
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Destination */}
              <div>
                <label className="block text-sm font-semibold text-[#0a2357] mb-2">
                  Destination *
                </label>
                <select
                  value={formData.voyageDestination || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, voyageDestination: e.target.value, destination: e.target.value })
                  }
                  className="premium-input w-full h-[52px]"
                >
                  <option value="">Sélectionner une destination</option>
                  <option value="Turquie">Turquie</option>
                  <option value="Tunisie">Tunisie</option>
                  <option value="Maroc">Maroc</option>
                  <option value="Égypte">Égypte</option>
                  <option value="Espagne">Espagne</option>
                  <option value="Italie">Italie</option>
                  <option value="Grèce">Grèce</option>
                  <option value="Dubaï">Dubaï</option>
                </select>
                {errors.voyageDestination && (
                  <p className="text-red-500 text-xs mt-1">{errors.voyageDestination}</p>
                )}
              </div>

              {/* Board Type */}
              <div>
                <label className="block text-sm font-semibold text-[#0a2357] mb-2">
                  Type de Pension *
                </label>
                <select
                  value={formData.voyageBoardType || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      voyageBoardType: e.target.value as "full" | "half",
                    })
                  }
                  className="premium-input w-full h-[52px]"
                >
                  <option value="">Sélectionner</option>
                  <option value="full">Pension complète</option>
                  <option value="half">Demi-pension</option>
                </select>
                {errors.voyageBoardType && (
                  <p className="text-red-500 text-xs mt-1">{errors.voyageBoardType}</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TravelModule;
