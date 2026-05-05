import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Hotel, Users, Calendar, Utensils, Plane as PlaneIcon, FileText } from "lucide-react";

interface FormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  servicePath: "" | "travel" | "visa";
  travelType?: "omrah" | "voyage";
  
  // Omrah Configuration
  omrahHotelType?: "4stars" | "5stars";
  omrahDistance?: "close" | "medium";
  omrahRoomType?: "double" | "triple" | "quad";
  omrahRoomCount?: number;
  omrahAdultsCount?: number;
  omrahChildrenCount?: number;
  omrahChildrenAges?: string;
  omrahMealPlan?: "breakfast" | "half" | "full";
  omrahNeedVisa?: boolean;
  omrahFlightIncluded?: boolean;
  omrahDepartureDate?: string;
  omrahReturnDate?: string;
  
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
                voyageDestination: undefined,
                voyageBoardType: undefined,
              })
            }
            className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
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
                omrahHotelType: undefined,
                omrahDistance: undefined,
                omrahRoomType: undefined,
                omrahRoomCount: undefined,
                omrahAdultsCount: undefined,
                omrahChildrenCount: undefined,
                omrahChildrenAges: undefined,
                omrahMealPlan: undefined,
                omrahNeedVisa: undefined,
                omrahFlightIncluded: undefined,
                omrahDepartureDate: undefined,
                omrahReturnDate: undefined,
              })
            }
            className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
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
          <div className="bg-gradient-to-r from-[#0a2357]/5 to-[#2C5F2D]/5 p-6 rounded-xl border border-[#2C5F2D]/20">
            <h3 className="text-lg font-bold text-[#0a2357] mb-4 flex items-center gap-2">
              <Hotel size={20} className="text-[#2C5F2D]" />
              Configuration Hôtel
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Hotel Type */}
              <div>
                <label className="block text-sm font-semibold text-[#0a2357] mb-2">
                  Type d'Hôtel *
                </label>
                <select
                  value={formData.omrahHotelType || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      omrahHotelType: e.target.value as "4stars" | "5stars",
                    })
                  }
                  className="premium-input"
                >
                  <option value="">Sélectionner</option>
                  <option value="4stars">⭐⭐⭐⭐ 4 Étoiles</option>
                  <option value="5stars">⭐⭐⭐⭐⭐ 5 Étoiles</option>
                </select>
                {errors.omrahHotelType && (
                  <p className="text-red-500 text-xs mt-1">{errors.omrahHotelType}</p>
                )}
              </div>

              {/* Distance from Haram */}
              <div>
                <label className="block text-sm font-semibold text-[#0a2357] mb-2">
                  Distance du Haram *
                </label>
                <select
                  value={formData.omrahDistance || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      omrahDistance: e.target.value as "close" | "medium",
                    })
                  }
                  className="premium-input"
                >
                  <option value="">Sélectionner</option>
                  <option value="close">🕌 Proche (0-500m)</option>
                  <option value="medium">🚶 Moyenne (500m-1km)</option>
                </select>
                {errors.omrahDistance && (
                  <p className="text-red-500 text-xs mt-1">{errors.omrahDistance}</p>
                )}
              </div>

              {/* Room Type */}
              <div>
                <label className="block text-sm font-semibold text-[#0a2357] mb-2">
                  Type de Chambre *
                </label>
                <select
                  value={formData.omrahRoomType || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      omrahRoomType: e.target.value as "double" | "triple" | "quad",
                    })
                  }
                  className="premium-input"
                >
                  <option value="">Sélectionner</option>
                  <option value="double">🛏️ Double</option>
                  <option value="triple">🛏️🛏️ Triple</option>
                  <option value="quad">🛏️🛏️🛏️ Quadruple</option>
                </select>
                {errors.omrahRoomType && (
                  <p className="text-red-500 text-xs mt-1">{errors.omrahRoomType}</p>
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
                value={formData.omrahRoomCount || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    omrahRoomCount: parseInt(e.target.value) || undefined,
                  })
                }
                className="premium-input"
                placeholder="Ex: 2"
              />
              {errors.omrahRoomCount && (
                <p className="text-red-500 text-xs mt-1">{errors.omrahRoomCount}</p>
              )}
            </div>
          </div>

          {/* Passenger Management */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
            <h3 className="text-lg font-bold text-[#0a2357] mb-4 flex items-center gap-2">
              <Users size={20} className="text-[#2C5F2D]" />
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
                  value={formData.omrahAdultsCount || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      omrahAdultsCount: parseInt(e.target.value) || undefined,
                    })
                  }
                  className="premium-input"
                  placeholder="Ex: 2"
                />
                {errors.omrahAdultsCount && (
                  <p className="text-red-500 text-xs mt-1">{errors.omrahAdultsCount}</p>
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
                  value={formData.omrahChildrenCount || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      omrahChildrenCount: parseInt(e.target.value) || undefined,
                      omrahChildrenAges: parseInt(e.target.value) === 0 ? undefined : formData.omrahChildrenAges,
                    })
                  }
                  className="premium-input"
                  placeholder="Ex: 1"
                />
                {errors.omrahChildrenCount && (
                  <p className="text-red-500 text-xs mt-1">{errors.omrahChildrenCount}</p>
                )}
              </div>
            </div>

            {/* Children Ages - Conditional */}
            <AnimatePresence>
              {formData.omrahChildrenCount && formData.omrahChildrenCount > 0 && (
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
                    value={formData.omrahChildrenAges || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        omrahChildrenAges: e.target.value,
                      })
                    }
                    className="premium-input"
                    placeholder="Ex: 5 ans, 8 ans"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Séparez les âges par des virgules
                  </p>
                  {errors.omrahChildrenAges && (
                    <p className="text-red-500 text-xs mt-1">{errors.omrahChildrenAges}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Meal Plan */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
            <h3 className="text-lg font-bold text-[#0a2357] mb-4 flex items-center gap-2">
              <Utensils size={20} className="text-[#2C5F2D]" />
              Pension
            </h3>

            <div>
              <label className="block text-sm font-semibold text-[#0a2357] mb-2">
                Type de Pension *
              </label>
              <select
                value={formData.omrahMealPlan || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    omrahMealPlan: e.target.value as "breakfast" | "half" | "full",
                  })
                }
                className="premium-input"
              >
                <option value="">Sélectionner</option>
                <option value="breakfast">🥐 Petit Déjeuner</option>
                <option value="half">🍽️ Demi-Pension</option>
                <option value="full">🍽️🍽️ Pension Complète</option>
              </select>
              {errors.omrahMealPlan && (
                <p className="text-red-500 text-xs mt-1">{errors.omrahMealPlan}</p>
              )}
            </div>
          </div>

          {/* Logistics Toggles */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
            <h3 className="text-lg font-bold text-[#0a2357] mb-4 flex items-center gap-2">
              <FileText size={20} className="text-[#2C5F2D]" />
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
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, omrahNeedVisa: true })}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all duration-300 ${
                      formData.omrahNeedVisa === true
                        ? "border-[#2C5F2D] bg-[#2C5F2D]/10 shadow-md"
                        : "border-gray-200 hover:border-[#2C5F2D]/50"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          formData.omrahNeedVisa === true
                            ? "border-[#2C5F2D] bg-[#2C5F2D]"
                            : "border-gray-300"
                        }`}
                      >
                        {formData.omrahNeedVisa === true && (
                          <div className="w-2.5 h-2.5 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="font-semibold text-[#0a2357]">Oui</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, omrahNeedVisa: false })}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all duration-300 ${
                      formData.omrahNeedVisa === false
                        ? "border-[#2C5F2D] bg-[#2C5F2D]/10 shadow-md"
                        : "border-gray-200 hover:border-[#2C5F2D]/50"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          formData.omrahNeedVisa === false
                            ? "border-[#2C5F2D] bg-[#2C5F2D]"
                            : "border-gray-300"
                        }`}
                      >
                        {formData.omrahNeedVisa === false && (
                          <div className="w-2.5 h-2.5 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="font-semibold text-[#0a2357]">Non</span>
                    </div>
                  </button>
                </div>
                {errors.omrahNeedVisa && (
                  <p className="text-red-500 text-xs mt-1">{errors.omrahNeedVisa}</p>
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
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, omrahFlightIncluded: true })}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all duration-300 ${
                      formData.omrahFlightIncluded === true
                        ? "border-[#2C5F2D] bg-[#2C5F2D]/10 shadow-md"
                        : "border-gray-200 hover:border-[#2C5F2D]/50"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <PlaneIcon
                        size={18}
                        className={formData.omrahFlightIncluded === true ? "text-[#2C5F2D]" : "text-gray-400"}
                      />
                      <span className="font-semibold text-[#0a2357]">Avec Vol</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, omrahFlightIncluded: false })}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all duration-300 ${
                      formData.omrahFlightIncluded === false
                        ? "border-[#2C5F2D] bg-[#2C5F2D]/10 shadow-md"
                        : "border-gray-200 hover:border-[#2C5F2D]/50"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <PlaneIcon
                        size={18}
                        className={formData.omrahFlightIncluded === false ? "text-[#2C5F2D]" : "text-gray-400"}
                      />
                      <span className="font-semibold text-[#0a2357]">Sans Vol</span>
                    </div>
                  </button>
                </div>
                {errors.omrahFlightIncluded && (
                  <p className="text-red-500 text-xs mt-1">{errors.omrahFlightIncluded}</p>
                )}
              </motion.div>
            </div>
          </div>

          {/* Travel Dates */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border border-green-200">
            <h3 className="text-lg font-bold text-[#0a2357] mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-[#2C5F2D]" />
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
                  value={formData.omrahDepartureDate || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      omrahDepartureDate: e.target.value,
                    })
                  }
                  className="premium-input"
                  min={new Date().toISOString().split("T")[0]}
                />
                {errors.omrahDepartureDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.omrahDepartureDate}</p>
                )}
              </div>

              {/* Return Date */}
              <div>
                <label className="block text-sm font-semibold text-[#0a2357] mb-2">
                  Date de Retour *
                </label>
                <input
                  type="date"
                  value={formData.omrahReturnDate || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      omrahReturnDate: e.target.value,
                    })
                  }
                  className="premium-input"
                  min={formData.omrahDepartureDate || new Date().toISOString().split("T")[0]}
                />
                {errors.omrahReturnDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.omrahReturnDate}</p>
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
          <div className="bg-gradient-to-r from-[#0a2357]/5 to-[#2C5F2D]/5 p-6 rounded-xl border border-[#2C5F2D]/20">
            <h3 className="text-lg font-bold text-[#0a2357] mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-[#2C5F2D]" />
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
                    setFormData({ ...formData, voyageDestination: e.target.value })
                  }
                  className="premium-input"
                >
                  <option value="">Sélectionner une destination</option>
                  <option value="Turquie">🇹🇷 Turquie</option>
                  <option value="Tunisie">🇹🇳 Tunisie</option>
                  <option value="Maroc">🇲🇦 Maroc</option>
                  <option value="Égypte">🇪🇬 Égypte</option>
                  <option value="Espagne">🇪🇸 Espagne</option>
                  <option value="Italie">🇮🇹 Italie</option>
                  <option value="Grèce">🇬🇷 Grèce</option>
                  <option value="Dubaï">🇦🇪 Dubaï</option>
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
                  className="premium-input"
                >
                  <option value="">Sélectionner</option>
                  <option value="full">🍽️ Pension Complète</option>
                  <option value="half">🥐 Demi-Pension</option>
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
