import { motion } from "framer-motion";
import { Eye, Calendar, FileText, CheckCircle, XCircle, FileDown, CheckCircle as CheckIcon, MessageCircle } from "lucide-react";
import type { VisaRequest } from "@/contexts/DataContext";
import { generateRequestPDF } from "@/lib/requestPdfGenerator";
import { toast } from "sonner";

interface VisaTableProps {
  requests: VisaRequest[];
  onOpen: (req: VisaRequest) => void;
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
const generateWhatsAppMessage = (req: VisaRequest): string => {
  const clientName = `${req.personalInfo.prenom} ${req.personalInfo.nom}`;
  return encodeURIComponent(
    `Bonjour ${clientName}, c'est House of Travel. Nous avons bien reçu votre demande pour Visa. Comment pouvons-nous vous aider ?`
  );
};

// Helper function to open WhatsApp
const openWhatsApp = (phone: string, message: string) => {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  const url = `https://wa.me/${formattedPhone}?text=${message}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

const VisaTable = ({ requests, onOpen, onToggleStatus }: VisaTableProps) => {
  const handleExportPDF = (e: React.MouseEvent, req: VisaRequest) => {
    e.stopPropagation();
    generateRequestPDF(req);
    toast.success("PDF généré avec succès");
  };

  const handleToggleStatus = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onToggleStatus(id);
  };

  const handleWhatsApp = (e: React.MouseEvent, req: VisaRequest) => {
    e.stopPropagation();
    const message = generateWhatsAppMessage(req);
    openWhatsApp(req.personalInfo.telephone, message);
  };
  if (requests.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <FileText size={48} className="mx-auto text-slate-300 mb-3" />
        <p className="text-slate-500">Aucune demande de visa</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full" style={{ minWidth: '800px' }}>
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Client</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Type Visa</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Pays</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Date Voyage</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Situation Pro</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Passeport</th>
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
                <td className={`px-2 sm:px-4 py-2 sm:py-3 ${req.completed ? "opacity-60" : ""}`}>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    req.visaType === "e-visa" 
                      ? "bg-accent/10 text-primary" 
                      : "bg-purple-100 text-purple-700"
                  }`}>
                    {req.visaType === "e-visa" ? "E-visa" : "Dossier"}
                  </span>
                </td>
                <td className={`px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-slate-900 whitespace-nowrap ${req.completed ? "opacity-60" : ""}`}>{req.pays}</td>
                <td className={`px-2 sm:px-4 py-2 sm:py-3 ${req.completed ? "opacity-60" : ""}`}>
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-700 whitespace-nowrap">
                    <Calendar size={14} className="text-slate-400 hidden sm:inline" />
                    <span>{new Date(req.dateVoyage).toLocaleDateString("fr-FR", { day: '2-digit', month: '2-digit' })}</span>
                  </div>
                </td>
                <td className={`px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-600 whitespace-nowrap ${req.completed ? "opacity-60" : ""}`}>
                  {req.situationPro || <span className="text-slate-400 italic">N/A</span>}
                </td>
                <td className={`px-2 sm:px-4 py-2 sm:py-3 text-center ${req.completed ? "opacity-60" : ""}`}>
                  {req.passeportValide ? (
                    <CheckCircle size={18} className="inline text-green-600" />
                  ) : (
                    <XCircle size={18} className="inline text-red-600" />
                  )}
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

export default VisaTable;
