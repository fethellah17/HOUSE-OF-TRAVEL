import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Mail, Phone, Calendar, Users, Plane, FileText, Hotel, Map, CheckCircle, XCircle, MessageCircle } from "lucide-react";
import type { ServiceRequest, BilletterieRequest, VisaRequest, HotelRequest, SejourRequest } from "@/contexts/DataContext";

interface RequestDetailModalProps {
  request: ServiceRequest | null;
  onClose: () => void;
  onDelete: (id: string) => Promise<void> | void;
}

// Helper function to format phone number for WhatsApp
const formatPhoneForWhatsApp = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    return '213' + cleaned.substring(1);
  }
  if (cleaned.startsWith('213')) {
    return cleaned;
  }
  return '213' + cleaned;
};

// Helper function to generate WhatsApp message
const generateWhatsAppMessage = (request: ServiceRequest): string => {
  const clientName = `${request.personalInfo.prenom} ${request.personalInfo.nom}`;
  const serviceType = request.serviceType.charAt(0).toUpperCase() + request.serviceType.slice(1);
  return encodeURIComponent(
    `Bonjour ${clientName}, c'est House of Travel. Nous avons bien reçu votre demande pour ${serviceType}. Comment pouvons-nous vous aider ?`
  );
};

// Helper function to open WhatsApp
const openWhatsApp = (phone: string, message: string) => {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  const url = `https://wa.me/${formattedPhone}?text=${message}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};


const RequestDetailModal = ({ request, onClose, onDelete }: RequestDetailModalProps) => {
  if (!request) return null;

  const handleDelete = async () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette demande ?")) {
      await onDelete(request.id);
      onClose();
    }
  };

  const handleWhatsApp = () => {
    const message = generateWhatsAppMessage(request);
    openWhatsApp(request.personalInfo.telephone, message);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-primary text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {request.serviceType === "billetterie" && <Plane size={24} />}
              {request.serviceType === "visa" && <FileText size={24} />}
              {request.serviceType === "hotel" && <Hotel size={24} />}
              {request.serviceType === "sejour" && <Map size={24} />}
              <div>
                <h3 className="text-lg font-bold">
                  {request.personalInfo.prenom} {request.personalInfo.nom}
                </h3>
                <p className="text-sm text-white/80">
                  {request.serviceType.charAt(0).toUpperCase() + request.serviceType.slice(1)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2"
              aria-label="Fermer"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Personal Info Section */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-primary mb-3 pb-2 border-b-2 border-primary/20 flex items-center gap-2">
                <Users size={16} />
                Informations Personnelles
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <Mail size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="text-sm font-medium text-slate-900">{request.personalInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">Téléphone</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-900">{request.personalInfo.telephone}</p>
                      <button
                        onClick={handleWhatsApp}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs font-medium"
                        title="Contacter via WhatsApp"
                      >
                        <MessageCircle size={14} />
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Demande reçue le {new Date(request.createdAt).toLocaleDateString("fr-FR")} à{" "}
                {new Date(request.createdAt).toLocaleTimeString("fr-FR")}
              </div>
            </div>

            {/* Service-Specific Details */}
            {request.serviceType === "billetterie" && <BilletterieDetails request={request as BilletterieRequest} />}
            {request.serviceType === "visa" && <VisaDetails request={request as VisaRequest} />}
            {request.serviceType === "hotel" && <HotelDetails request={request as HotelRequest} />}
            {request.serviceType === "sejour" && <SejourDetails request={request as SejourRequest} />}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-slate-200 px-6 py-4 flex gap-3">
            <button
              onClick={handleDelete}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <Trash2 size={18} />
              Supprimer
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
            >
              Fermer
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Billetterie Details Component
const BilletterieDetails = ({ request }: { request: BilletterieRequest }) => {
  // Parse birth dates from comma-separated strings
  const enfantsDates = request.enfantsDates ? request.enfantsDates.split(", ").filter(d => d.trim()) : [];
  const bebesDates = request.bebesDates ? request.bebesDates.split(", ").filter(d => d.trim()) : [];
  
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-primary mb-3 pb-2 border-b-2 border-primary/20 flex items-center gap-2">
          <Plane size={16} />
          Détails du Vol
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-600">Type de voyage:</span>
            <span className="font-medium text-slate-900">{request.tripType}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-600">Ville de départ:</span>
            <span className="font-medium text-slate-900">{request.villeDepart || request.destination}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-600">Ville d'arrivée:</span>
            <span className="font-medium text-slate-900">{request.villeArrivee || request.destination}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-600">Date de départ:</span>
            <span className="font-medium text-slate-900">{new Date(request.dateDepart).toLocaleDateString("fr-FR")}</span>
          </div>
          {request.dateRetour && (
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">Date de retour:</span>
              <span className="font-medium text-slate-900">{new Date(request.dateRetour).toLocaleDateString("fr-FR")}</span>
            </div>
          )}
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-600">Adultes:</span>
            <span className="font-medium text-slate-900">{request.nombreAdultes}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-600">Enfants (moins de 12 ans):</span>
            <span className="font-medium text-slate-900">{request.nombreEnfants}</span>
          </div>
          {enfantsDates.length > 0 && (
            <div className="py-2 border-b border-slate-100">
              <span className="text-slate-600 block mb-2">Dates de naissance des enfants:</span>
              <div className="space-y-1 ml-4">
                {enfantsDates.map((date, index) => (
                  <div key={index} className="text-sm">
                    <span className="text-slate-500">Enfant {index + 1}:</span>{" "}
                    <span className="font-medium text-slate-900">
                      {new Date(date).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {request.nombreBebes && parseInt(request.nombreBebes) > 0 && (
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">Bébés (moins de 2 ans):</span>
              <span className="font-medium text-slate-900">{request.nombreBebes}</span>
            </div>
          )}
          {bebesDates.length > 0 && (
            <div className="py-2 border-b border-slate-100">
              <span className="text-slate-600 block mb-2">Dates de naissance des bébés:</span>
              <div className="space-y-1 ml-4">
                {bebesDates.map((date, index) => (
                  <div key={index} className="text-sm">
                    <span className="text-slate-500">Bébé {index + 1}:</span>{" "}
                    <span className="font-medium text-slate-900">
                      {new Date(date).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {request.ageEnfants && (
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">Âge des enfants:</span>
              <span className="font-medium text-slate-900">{request.ageEnfants}</span>
            </div>
          )}
          {request.compagnie && (
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">Compagnie aérienne:</span>
              <span className="font-medium text-slate-900">{request.compagnie}</span>
            </div>
          )}
          {request.besoinVisa && (
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">Besoin de visa:</span>
              <span className="font-medium text-slate-900">{request.besoinVisa}</span>
            </div>
          )}
        </div>
      </div>
      {request.message && (
        <div>
          <h4 className="text-sm font-semibold text-primary mb-2">Message</h4>
          <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">{request.message}</p>
        </div>
      )}
    </div>
  );
};

// Visa Details Component
const VisaDetails = ({ request }: { request: VisaRequest }) => (
  <div className="space-y-4">
    <div>
      <h4 className="text-sm font-semibold text-primary mb-3 pb-2 border-b-2 border-primary/20 flex items-center gap-2">
        <FileText size={16} />
        Détails du Visa
      </h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between py-2 border-b border-slate-100">
          <span className="text-slate-600">Type de visa:</span>
          <span className="font-medium text-slate-900">
            {request.visaType === "e-visa" ? "E-visa" : "Visa Dossier"}
          </span>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-100">
          <span className="text-slate-600">Pays de destination:</span>
          <span className="font-medium text-slate-900">{request.pays}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-100">
          <span className="text-slate-600">Date de voyage:</span>
          <span className="font-medium text-slate-900">{new Date(request.dateVoyage).toLocaleDateString("fr-FR")}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-slate-100">
          <span className="text-slate-600">Passeport valide (6 mois):</span>
          <span className="flex items-center gap-1">
            {request.passeportValide ? (
              <>
                <CheckCircle size={16} className="text-green-600" />
                <span className="font-medium text-green-600">Oui</span>
              </>
            ) : (
              <>
                <XCircle size={16} className="text-red-600" />
                <span className="font-medium text-red-600">Non</span>
              </>
            )}
          </span>
        </div>
        {request.situationPro && (
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-600">Situation professionnelle:</span>
            <span className="font-medium text-slate-900">{request.situationPro}</span>
          </div>
        )}
        {request.situationGarant && (
          <div className="flex justify-between py-2 border-b border-slate-100 bg-blue-50 px-2 py-2 rounded">
            <span className="text-slate-600 font-semibold">Situation du Garant:</span>
            <span className="font-medium text-blue-700">{request.situationGarant}</span>
          </div>
        )}
      </div>
    </div>
    {request.message && (
      <div>
        <h4 className="text-sm font-semibold text-primary mb-2">Message / Demandes particulières</h4>
        <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">{request.message}</p>
      </div>
    )}
  </div>
);

// Hotel Details Component
const HotelDetails = ({ request }: { request: HotelRequest }) => (
  <div className="space-y-4">
    <div>
      <h4 className="text-sm font-semibold text-primary mb-3 pb-2 border-b-2 border-primary/20 flex items-center gap-2">
        <Hotel size={16} />
        Détails de la Réservation
      </h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between py-2 border-b border-slate-100">
          <span className="text-slate-600">Préférence:</span>
          <span className="font-medium text-slate-900">
            {request.hotelPreference === "specific" ? "Hôtel spécifique" : "Proposition d'hôtel"}
          </span>
        </div>
        {request.hotelName && (
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-600">Nom de l'hôtel:</span>
            <span className="font-medium text-slate-900">{request.hotelName}</span>
          </div>
        )}
        {request.hotelCategory && (
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-600">Catégorie:</span>
            <span className="font-medium text-slate-900">{request.hotelCategory}</span>
          </div>
        )}
        <div className="flex justify-between py-2 border-b border-slate-100">
          <span className="text-slate-600">Ville/Destination:</span>
          <span className="font-medium text-slate-900">{request.city}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-100">
          <span className="text-slate-600">Date d'arrivée:</span>
          <span className="font-medium text-slate-900">{new Date(request.dateArrivee).toLocaleDateString("fr-FR")}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-100">
          <span className="text-slate-600">Date de départ:</span>
          <span className="font-medium text-slate-900">{new Date(request.dateDepart).toLocaleDateString("fr-FR")}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-100">
          <span className="text-slate-600">Nombre de chambres:</span>
          <span className="font-medium text-slate-900">{request.nombreChambres}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-100">
          <span className="text-slate-600">Nombre de personnes:</span>
          <span className="font-medium text-slate-900">{request.nombrePersonnes}</span>
        </div>
        {request.roomType && (
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-600">Type de chambre:</span>
            <span className="font-medium text-slate-900">{request.roomType}</span>
          </div>
        )}
        {request.boardBasis && (
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-600">Type de pension:</span>
            <span className="font-medium text-slate-900">{request.boardBasis}</span>
          </div>
        )}
      </div>
    </div>
    {request.message && (
      <div>
        <h4 className="text-sm font-semibold text-primary mb-2">Message</h4>
        <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">{request.message}</p>
      </div>
    )}
  </div>
);

// Sejour Details Component
const SejourDetails = ({ request }: { request: SejourRequest }) => (
  <div className="space-y-4">
    <div>
      <h4 className="text-sm font-semibold text-primary mb-3 pb-2 border-b-2 border-primary/20 flex items-center gap-2">
        <Map size={16} />
        Détails du Séjour
      </h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between py-2 border-b border-slate-100">
          <span className="text-slate-600">Destination:</span>
          <span className="font-medium text-slate-900">{request.destination}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-100">
          <span className="text-slate-600">Budget estimé:</span>
          <span className="font-medium text-slate-900">{request.budget} DA</span>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-100">
          <span className="text-slate-600">Date de départ:</span>
          <span className="font-medium text-slate-900">{new Date(request.dateDepart).toLocaleDateString("fr-FR")}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-100">
          <span className="text-slate-600">Date de retour:</span>
          <span className="font-medium text-slate-900">{new Date(request.dateRetour).toLocaleDateString("fr-FR")}</span>
        </div>
      </div>
    </div>
    {request.servicesInclus && request.servicesInclus.length > 0 && (
      <div>
        <h4 className="text-sm font-semibold text-primary mb-2">Services inclus</h4>
        <div className="flex flex-wrap gap-2">
          {request.servicesInclus.map((service, index) => (
            <span key={index} className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
              {service}
            </span>
          ))}
        </div>
      </div>
    )}
    {request.preferences && (
      <div>
        <h4 className="text-sm font-semibold text-primary mb-2">Préférences</h4>
        <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">{request.preferences}</p>
      </div>
    )}
  </div>
);

export default RequestDetailModal;
