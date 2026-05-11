import { motion } from "framer-motion";
import { Eye, Calendar, Map as MapIcon, DollarSign, Heart, Users as UsersIcon, Briefcase, Compass, FileDown, CheckCircle, MessageCircle } from "lucide-react";
import type { SejourRequest } from "@/contexts/DataContext";
import { generateRequestPDF } from "@/lib/requestPdfGenerator";
import { toast } from "sonner";

interface SejourTableProps {
  requests: SejourRequest[];
  onOpen: (req: SejourRequest) => void;
  onToggleStatus: (id: string) => void;
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
const generateWhatsAppMessage = (req: SejourRequest): string => {
  const clientName = `${req.personalInfo.prenom} ${req.personalInfo.nom}`;
  return encodeURIComponent(
    `Bonjour ${clientName}, c'est House of Travel. Nous avons bien reçu votre demande pour Séjour à la carte. Comment pouvons-nous vous aider ?`
  );
};

// Helper function to open WhatsApp
const openWhatsApp = (phone: string, message: string) => {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  const url = `https://wa.me/${formattedPhone}?text=${message}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

const SejourTable = ({ requests, onOpen, onToggleStatus }: SejourTableProps) => {
  const handleExportPDF = (e: React.MouseEvent, req: SejourRequest) => {
    e.stopPropagation();
    generateRequestPDF(req);
    toast.success("PDF généré avec succès");
  };

  const handleToggleStatus = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onToggleStatus(id);
  };

  const handleWhatsApp = (e: React.MouseEvent, req: SejourRequest) => {
    e.stopPropagation();
    const message = generateWhatsAppMessage(req);
    openWhatsApp(req.personalInfo.telephone, message);
  };
  
  if (requests.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <MapIcon size={48} className="mx-auto text-slate-300 mb-3" />
        <p className="text-slate-500">Aucune demande de séjour à la carte</p>
      </div>
    );
  }

  const getTripTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "lune de miel":
        return <Heart size={14} className="text-pink-500" />;
      case "famille":
        return <UsersIcon size={14} className="text-blue-500" />;
      case "business":
        return <Briefcase size={14} className="text-slate-600" />;
      case "aventure":
        return <Compass size={14} className="text-orange-500" />;
      default:
        return <MapIcon size={14} className="text-slate-400" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full" style={{ minWidth: '900px' }}>
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Client</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Destination</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Dates</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Budget</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Services</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs font-semibold uppercase tracking-wider whitespace-nowrap sticky right-0 bg-primary shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map((req, index) => (
              <motion.tr
                key={req.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`hover:bg-slate-50 transition-colors ${!req.isRead ? "bg-blue-50/50" : ""}`}
              >
                <td className={`px-2 sm:px-4 py-2 sm:py-3 ${req.completed ? "opacity-60" : ""}`}>
                  <div className="flex items-center gap-2">
                    {!req.isRead && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-slate-900 truncate whitespace-nowrap">
                        {req.personalInfo.prenom} {req.personalInfo.nom}
                      </p>
                      <p className="text-xs text-slate-500 truncate hidden sm:block">{req.personalInfo.email}</p>
                    </div>
                  </div>
                </td>
                <td className={`px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-slate-900 whitespace-nowrap ${req.completed ? "opacity-60" : ""}`}>{req.destination}</td>
                <td className={`px-2 sm:px-4 py-2 sm:py-3 ${req.completed ? "opacity-60" : ""}`}>
                  <div className="text-xs sm:text-sm text-slate-700">
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Calendar size={14} className="text-slate-400 hidden sm:inline" />
                      <span>{new Date(req.dateDepart).toLocaleDateString("fr-FR", { day: '2-digit', month: '2-digit' })}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 whitespace-nowrap">
                      → {new Date(req.dateRetour).toLocaleDateString("fr-FR", { day: '2-digit', month: '2-digit' })}
                    </div>
                  </div>
                </td>
                <td className={`px-2 sm:px-4 py-2 sm:py-3 ${req.completed ? "opacity-60" : ""}`}>
                  <div className="flex items-center gap-1 text-xs sm:text-sm font-medium text-slate-900 whitespace-nowrap">
                    <DollarSign size={14} className="text-green-600 hidden sm:inline" />
                    <span>{req.budget} DA</span>
                  </div>
                </td>
                <td className={`px-2 sm:px-4 py-2 sm:py-3 ${req.completed ? "opacity-60" : ""}`}>
                  <div className="flex flex-wrap gap-1">
                    {req.servicesInclus && req.servicesInclus.length > 0 ? (
                      req.servicesInclus.slice(0, 2).map((service, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary whitespace-nowrap"
                        >
                          {service}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">Aucun</span>
                    )}
                    {req.servicesInclus && req.servicesInclus.length > 2 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        +{req.servicesInclus.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className={`px-2 sm:px-4 py-2 sm:py-3 text-center sticky right-0 z-[20] shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)] ${
                  !req.isRead ? "bg-blue-50 opacity-100" : "bg-white opacity-100"
                }`}>
                  <div className={`flex items-center justify-center gap-1 sm:gap-2 ${req.completed ? "opacity-60" : ""}`}>
                    <button
                      onClick={(e) => handleWhatsApp(e, req)}
                      className="inline-flex items-center gap-1 p-1.5 sm:px-3 sm:py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      title="Contacter via WhatsApp"
                    >
                      <MessageCircle size={16} />
                    </button>
                    <button
                      onClick={(e) => handleExportPDF(e, req)}
                      className="inline-flex items-center gap-1 p-1.5 sm:px-3 sm:py-1.5 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
                      title="Exporter en PDF"
                    >
                      <FileDown size={16} />
                    </button>
                    <button
                      onClick={(e) => handleToggleStatus(e, req.id)}
                      className={`inline-flex items-center gap-1 p-1.5 sm:px-3 sm:py-1.5 rounded-lg transition-colors text-sm font-medium ${
                        req.completed
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                      }`}
                      title={req.completed ? "Marquer comme non traité" : "Marquer comme traité"}
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button
                      onClick={() => onOpen(req)}
                      className="inline-flex items-center gap-1 p-1.5 sm:px-3 sm:py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                      title="Voir les détails"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SejourTable;
