import { motion } from "framer-motion";
import { Eye, Calendar, FileText, CheckCircle, XCircle, FileDown, CheckCircle as CheckIcon } from "lucide-react";
import type { VisaRequest } from "@/contexts/DataContext";
import { generateRequestPDF } from "@/lib/requestPdfGenerator";
import { toast } from "sonner";

interface VisaTableProps {
  requests: VisaRequest[];
  onOpen: (req: VisaRequest) => void;
  onToggleStatus: (id: string) => void;
}

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
  if (requests.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <FileText size={48} className="mx-auto text-slate-300 mb-3" />
        <p className="text-slate-500">Aucune demande de visa</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Client</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Type Visa</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Pays</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Date Voyage</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Situation Pro</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Passeport</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((req, index) => (
                <motion.tr
                  key={req.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`hover:bg-slate-50 transition-colors ${!req.isRead ? "bg-blue-50/50" : ""} ${req.completed ? "opacity-60" : ""}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {!req.isRead && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {req.personalInfo.prenom} {req.personalInfo.nom}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{req.personalInfo.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      req.visaType === "e-visa" 
                        ? "bg-accent/10 text-primary" 
                        : "bg-purple-100 text-purple-700"
                    }`}>
                      {req.visaType === "e-visa" ? "E-visa" : "Visa Dossier"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{req.pays}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-slate-700">
                      <Calendar size={14} className="text-slate-400" />
                      <span>{new Date(req.dateVoyage).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {req.situationPro || <span className="text-slate-400 italic">N/A</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {req.passeportValide ? (
                      <CheckCircle size={18} className="inline text-green-600" />
                    ) : (
                      <XCircle size={18} className="inline text-red-600" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => handleExportPDF(e, req)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
                        title="Exporter en PDF"
                      >
                        <FileDown size={16} />
                      </button>
                      <button
                        onClick={(e) => handleToggleStatus(e, req.id)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium ${
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
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
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

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {requests.map((req, index) => (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onOpen(req)}
            className={`bg-white rounded-lg shadow-sm border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
              !req.isRead ? "border-primary" : "border-slate-200"
            } ${req.completed ? "opacity-60" : ""}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {!req.isRead && (
                    <span className="px-2 py-0.5 bg-primary text-white text-xs rounded-full font-semibold">
                      Nouveau
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    req.visaType === "e-visa" 
                      ? "bg-accent/10 text-primary" 
                      : "bg-purple-100 text-purple-700"
                  }`}>
                    {req.visaType === "e-visa" ? "E-visa" : "Dossier"}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(req.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <p className="font-semibold text-primary text-lg">
                  {req.personalInfo.prenom} {req.personalInfo.nom}
                </p>
                <p className="text-sm text-slate-500 truncate">{req.personalInfo.email}</p>
              </div>
              <FileText size={24} className="text-primary/30 flex-shrink-0" />
            </div>

            <div className="space-y-2 text-sm border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Pays:</span>
                <span className="font-medium text-slate-900">{req.pays}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Date voyage:</span>
                <span className="font-medium text-slate-900">
                  {new Date(req.dateVoyage).toLocaleDateString("fr-FR")}
                </span>
              </div>
              {req.situationPro && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Situation:</span>
                  <span className="font-medium text-slate-900">{req.situationPro}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Passeport valide:</span>
                <span className="flex items-center gap-1">
                  {req.passeportValide ? (
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
              {req.message && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs text-slate-600 line-clamp-2">{req.message}</p>
                </div>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleExportPDF(e, req);
                }}
                className="flex-1 py-2 bg-slate-600 text-white rounded-lg font-medium text-sm hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <FileDown size={16} />
                PDF
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleStatus(e, req.id);
                }}
                className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                  req.completed
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
              >
                <CheckCircle size={16} />
                {req.completed ? "Traité" : "Marquer"}
              </button>
            </div>
            <button 
              onClick={() => onOpen(req)}
              className="w-full mt-2 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              Voir les détails
            </button>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default VisaTable;
