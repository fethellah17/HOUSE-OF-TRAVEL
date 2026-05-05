import { motion, AnimatePresence } from "framer-motion";
import { FileText, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

interface FormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  servicePath: "" | "travel" | "visa";
  travelType?: "omrah" | "voyage";
  omrahHotelType?: "4stars" | "5stars";
  omrahDistance?: "close" | "medium";
  omrahRoomType?: "double" | "triple" | "quad";
  voyageDestination?: string;
  voyageBoardType?: "full" | "half";
  visaProfession?: string;
  visaDestination?: string;
  hasUsaVisa?: boolean;
  message?: string;
}

interface VisaAssistantModuleProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  errors: Record<string, string>;
}

// Document requirements based on profession and destination
const getRequiredDocuments = (profession?: string, destination?: string): string[] => {
  if (!profession || !destination) return [];

  const baseDocuments = [
    "Passeport valide (6 mois minimum)",
    "Photos d'identité récentes",
    "Formulaire de demande de visa",
  ];

  // Schengen specific documents
  if (destination === "Schengen") {
    const schengenDocs = [
      ...baseDocuments,
      "Assurance voyage (30 000€ minimum)",
      "Réservation d'hôtel ou lettre d'invitation",
      "Relevés bancaires (3 derniers mois)",
    ];

    if (profession === "Salarié") {
      return [
        ...schengenDocs,
        "Attestation de travail",
        "Fiches de paie (3 derniers mois)",
        "Autorisation de congé",
      ];
    } else if (profession === "Commerçant") {
      return [
        ...schengenDocs,
        "Registre de Commerce",
        "Extrait de rôle C20",
        "Attestation CASNOS",
        "Bilan comptable",
      ];
    } else if (profession === "Profession Libérale") {
      return [
        ...schengenDocs,
        "Carte professionnelle",
        "Attestation CASNOS",
        "Déclaration fiscale",
        "Justificatifs de revenus",
      ];
    } else if (profession === "Retraité") {
      return [
        ...schengenDocs,
        "Attestation de retraite",
        "Relevés de pension (3 derniers mois)",
        "Certificat de résidence",
      ];
    }
  }

  // Canada specific documents
  if (destination === "Canada") {
    const canadaDocs = [
      ...baseDocuments,
      "Preuve de fonds suffisants",
      "Lettre d'invitation (si applicable)",
      "Historique de voyage",
    ];

    if (profession === "Salarié") {
      return [
        ...canadaDocs,
        "Attestation de travail",
        "Fiches de paie (6 derniers mois)",
        "Contrat de travail",
      ];
    } else if (profession === "Commerçant") {
      return [
        ...canadaDocs,
        "Registre de Commerce",
        "Bilans financiers (2 dernières années)",
        "Attestation CASNOS",
        "Déclaration fiscale",
      ];
    } else if (profession === "Profession Libérale") {
      return [
        ...canadaDocs,
        "Carte professionnelle",
        "Justificatifs de revenus",
        "Attestation CASNOS",
        "Déclaration fiscale",
      ];
    } else if (profession === "Retraité") {
      return [
        ...canadaDocs,
        "Attestation de retraite",
        "Relevés de pension (6 derniers mois)",
        "Preuve de propriété immobilière",
      ];
    }
  }

  // USA specific documents
  if (destination === "USA") {
    const usaDocs = [
      ...baseDocuments,
      "Confirmation de rendez-vous DS-160",
      "Preuve de liens avec l'Algérie",
      "Historique de voyage",
    ];

    if (profession === "Salarié") {
      return [
        ...usaDocs,
        "Attestation de travail",
        "Fiches de paie (6 derniers mois)",
        "Contrat de travail",
        "Relevés bancaires",
      ];
    } else if (profession === "Commerçant") {
      return [
        ...usaDocs,
        "Registre de Commerce",
        "Bilans financiers",
        "Attestation CASNOS",
        "Preuve de propriété commerciale",
      ];
    } else if (profession === "Profession Libérale") {
      return [
        ...usaDocs,
        "Carte professionnelle",
        "Justificatifs de revenus",
        "Attestation CASNOS",
        "Preuve d'activité professionnelle",
      ];
    } else if (profession === "Retraité") {
      return [
        ...usaDocs,
        "Attestation de retraite",
        "Relevés de pension",
        "Preuve de propriété immobilière",
        "Certificat de résidence",
      ];
    }
  }

  return baseDocuments;
};

const VisaAssistantModule = ({ formData, setFormData, errors }: VisaAssistantModuleProps) => {
  const requiredDocuments = getRequiredDocuments(formData.visaProfession, formData.visaDestination);
  const showCanadaMagic = formData.visaDestination === "Canada" && formData.hasUsaVisa === true;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Professional Information */}
      <div>
        <div className="border-l-4 border-[#2C5F2D] pl-4 mb-6">
          <h2 className="text-2xl font-bold text-[#0a2357]">Informations Professionnelles</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Pour personnaliser votre dossier de visa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profession */}
          <div>
            <label className="block text-sm font-semibold text-[#0a2357] mb-2">
              Votre Profession *
            </label>
            <select
              value={formData.visaProfession || ""}
              onChange={(e) =>
                setFormData({ ...formData, visaProfession: e.target.value })
              }
              className="premium-input"
            >
              <option value="">Sélectionner votre profession</option>
              <option value="Salarié">💼 Salarié</option>
              <option value="Commerçant">🏪 Commerçant</option>
              <option value="Profession Libérale">⚖️ Profession Libérale</option>
              <option value="Retraité">🏖️ Retraité</option>
            </select>
            {errors.visaProfession && (
              <p className="text-red-500 text-xs mt-1">{errors.visaProfession}</p>
            )}
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-semibold text-[#0a2357] mb-2">
              Destination du Visa *
            </label>
            <select
              value={formData.visaDestination || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  visaDestination: e.target.value,
                  hasUsaVisa: undefined,
                })
              }
              className="premium-input"
            >
              <option value="">Sélectionner la destination</option>
              <option value="Schengen">🇪🇺 Espace Schengen</option>
              <option value="Canada">🇨🇦 Canada</option>
              <option value="USA">🇺🇸 États-Unis</option>
            </select>
            {errors.visaDestination && (
              <p className="text-red-500 text-xs mt-1">{errors.visaDestination}</p>
            )}
          </div>
        </div>
      </div>

      {/* Canada Magic Feature */}
      <AnimatePresence>
        {formData.visaDestination === "Canada" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
              <div className="flex items-start gap-3 mb-4">
                <Sparkles className="text-blue-600 mt-1" size={24} />
                <div>
                  <h3 className="text-lg font-bold text-[#0a2357] mb-2">
                    Vérification d'Éligibilité - Traitement Simplifié
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Possédez-vous un Visa USA valide ?
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <motion.button
                  type="button"
                  onClick={() => setFormData({ ...formData, hasUsaVisa: true })}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all duration-300 ${
                    formData.hasUsaVisa === true
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CheckCircle2
                    className={`mx-auto mb-2 ${
                      formData.hasUsaVisa === true ? "text-green-600" : "text-gray-400"
                    }`}
                    size={28}
                  />
                  <p className="font-semibold text-sm">Oui, j'ai un Visa USA</p>
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => setFormData({ ...formData, hasUsaVisa: false })}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all duration-300 ${
                    formData.hasUsaVisa === false
                      ? "border-gray-400 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <AlertCircle
                    className={`mx-auto mb-2 ${
                      formData.hasUsaVisa === false ? "text-gray-600" : "text-gray-400"
                    }`}
                    size={28}
                  />
                  <p className="font-semibold text-sm">Non, je n'en ai pas</p>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Canada Success Alert */}
      <AnimatePresence>
        {showCanadaMagic && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 p-6 rounded-xl border-2 border-green-400 shadow-xl"
          >
            <div className="flex items-start gap-4">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, 10, -10, 10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-green-500 rounded-full p-3">
                  <CheckCircle2 className="text-white" size={32} />
                </div>
              </motion.div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-green-800 mb-2 flex items-center gap-2">
                  🎉 Félicitations !
                </h3>
                <p className="text-green-700 font-medium mb-2">
                  Vous êtes éligible au <span className="font-bold">Simplified Path</span> (Traitement
                  Prioritaire)
                </p>
                <p className="text-sm text-green-600">
                  Votre Visa USA valide vous permet de bénéficier d'une procédure accélérée pour le
                  Canada. Nous vous accompagnerons dans cette démarche simplifiée.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto-Generated Document Checklist */}
      <AnimatePresence>
        {formData.visaProfession && formData.visaDestination && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-gradient-to-r from-[#0a2357]/5 to-[#2C5F2D]/5 p-6 rounded-xl border border-[#2C5F2D]/20">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-[#2C5F2D]" size={24} />
                <div>
                  <h3 className="text-lg font-bold text-[#0a2357]">
                    Documents Requis pour Votre Dossier
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Liste personnalisée selon votre profil
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {requiredDocuments.map((doc, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-[#2C5F2D]/30 transition-colors"
                  >
                    <CheckCircle2 className="text-[#2C5F2D] mt-0.5 flex-shrink-0" size={18} />
                    <p className="text-sm text-gray-700 font-medium">{doc}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
              >
                <p className="text-sm text-blue-800">
                  <span className="font-bold">💡 Note:</span> Notre équipe vous accompagnera dans la
                  préparation de chaque document et vérifiera la conformité de votre dossier avant
                  soumission.
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VisaAssistantModule;
