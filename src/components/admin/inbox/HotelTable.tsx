import { Eye, Calendar, Hotel as HotelIcon, MapPin, Users, Bed, FileDown, CheckCircle, MessageCircle } from "lucide-react";
import type { HotelRequest } from "@/contexts/DataContext";
import { generateRequestPDF } from "@/lib/requestPdfGenerator";
import { toast } from "sonner";

interface HotelTableProps {
  requests: HotelRequest[];
  onOpen: (req: HotelRequest) => void;
  onMarkAsRead: (id: string) => void;
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
const generateWhatsAppMessage = (req: HotelRequest): string => {
  const clientName = `${req.personalInfo.prenom} ${req.personalInfo.nom}`;
  return encodeURIComponent(
    `Bonjour ${clientName}, c'est House of Travel. Nous avons bien reçu votre demande pour Hôtel. Comment pouvons-nous vous aider ?`
  );
};

// Helper function to open WhatsApp
const openWhatsApp = (phone: string, message: string) => {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  const url = `https://wa.me/${formattedPhone}?text=${message}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

const HotelTable = ({ requests, onOpen, onMarkAsRead }: HotelTableProps) => {
  const handleExportPDF = (e: React.MouseEvent, req: HotelRequest) => {
    e.stopPropagation();
    generateRequestPDF(req);
    toast.success("PDF généré avec succès");
  };

  const handleMarkAsRead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onMarkAsRead(id);
  };

  const handleWhatsApp = (e: React.MouseEvent, req: HotelRequest) => {
    e.stopPropagation();
    const message = generateWhatsAppMessage(req);
    openWhatsApp(req.personalInfo.telephone, message);
  };
  
  if (requests.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <HotelIcon size={48} className="mx-auto text-slate-300 mb-3" />
        <p className="text-slate-500">Aucune demande d'hôtel</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full" style={{ minWidth: '900px' }}>
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Client</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Destination</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Dates</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Hôtel</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Chambres</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Pension</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs font-semibold uppercase tracking-wider whitespace-nowrap sticky right-0 bg-primary shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map((req, index) => (
              <tr
                key={req.id}
                style={{ animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both` }}
                className={`hover:bg-slate-50 transition-colors ${!req.isRead ? "bg-blue-50/50 font-medium" : "opacity-60"}`}
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
                <td className={`px-2 sm:px-4 py-2 sm:py-3 ${req.completed ? "opacity-60" : ""}`}>
                  <div className="flex items-center gap-1 text-xs sm:text-sm font-medium text-slate-900 whitespace-nowrap">
                    <MapPin size={14} className="text-slate-400 flex-shrink-0 hidden sm:inline" />
                    <span className="truncate">{req.city}</span>
                  </div>
                </td>
                <td className={`px-2 sm:px-4 py-2 sm:py-3 ${req.completed ? "opacity-60" : ""}`}>
                  <div className="text-xs sm:text-sm text-slate-700">
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Calendar size={14} className="text-slate-400 hidden sm:inline" />
                      <span>{new Date(req.dateArrivee).toLocaleDateString("fr-FR", { day: '2-digit', month: '2-digit' })}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 whitespace-nowrap">
                      → {new Date(req.dateDepart).toLocaleDateString("fr-FR", { day: '2-digit', month: '2-digit' })}
                    </div>
                  </div>
                </td>
                <td className={`px-2 sm:px-4 py-2 sm:py-3 ${req.completed ? "opacity-60" : ""}`}>
                  <div className="text-xs sm:text-sm whitespace-nowrap">
                    {req.hotelPreference === "specific" ? (
                      <div>
                        <span className="font-medium text-slate-900">{req.hotelName || "N/A"}</span>
                        <p className="text-xs text-slate-500 hidden sm:block">Spécifique</p>
                      </div>
                    ) : (
                      <div>
                        <span className="font-medium text-slate-900">{req.hotelCategory || "N/A"}</span>
                        <p className="text-xs text-slate-500 hidden sm:block">Proposition</p>
                      </div>
                    )}
                  </div>
                </td>
                <td className={`px-2 sm:px-4 py-2 sm:py-3 ${req.completed ? "opacity-60" : ""}`}>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Bed size={14} className="text-slate-400 hidden sm:inline" />
                      <span>{req.nombreChambres}</span>
                    </div>
                    <span className="text-slate-400">/</span>
                    <div className="flex items-center gap-1">
                      <Users size={14} className="text-slate-400 hidden sm:inline" />
                      <span>{req.nombrePersonnes}</span>
                    </div>
                  </div>
                </td>
                <td className={`px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-600 whitespace-nowrap ${req.completed ? "opacity-60" : ""}`}>
                  {req.boardBasis || <span className="text-slate-400 italic">N/A</span>}
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
                      onClick={(e) => handleMarkAsRead(e, req.id)}
                      className={`inline-flex items-center gap-1 p-1.5 sm:px-3 sm:py-1.5 rounded-lg transition-colors text-sm font-medium ${
                        req.isRead
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                      }`}
                      title={req.isRead ? "Marquer comme non lu" : "Marquer comme lu"}
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpen(req);
                      }}
                      className="inline-flex items-center gap-1 p-1.5 sm:px-3 sm:py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                      title="Voir les détails"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HotelTable;
