import { motion } from "framer-motion";
import { Eye, Calendar, Map as MapIcon, DollarSign, Heart, Users as UsersIcon, Briefcase, Compass, FileDown, CheckCircle } from "lucide-react";
import type { SejourRequest } from "@/contexts/DataContext";
import { generateRequestPDF } from "@/lib/requestPdfGenerator";
import { toast } from "sonner";

interface SejourTableProps {
  requests: SejourRequest[];
  onOpen: (req: SejourRequest) => void;
  onToggleStatus: (id: string) => void;
}

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
    <>
      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Client</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Destination</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Dates</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Budget</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Services</th>
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
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{req.destination}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {getTripTypeIcon(req.typeVoyage)}
                      <span className="text-sm text-slate-700">{req.typeVoyage}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-slate-700">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-slate-400" />
                        <span>{new Date(req.dateDepart).toLocaleDateString("fr-FR")}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        → {new Date(req.dateRetour).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm font-medium text-slate-900">
                      <DollarSign size={14} className="text-green-600" />
                      <span>{req.budget} DA</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {req.servicesInclus && req.servicesInclus.length > 0 ? (
                        req.servicesInclus.slice(0, 2).map((service, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
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
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-full">
                    {getTripTypeIcon(req.typeVoyage)}
                    <span className="text-xs font-medium text-slate-700">{req.typeVoyage}</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(req.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <p className="font-semibold text-primary text-lg">
                  {req.personalInfo.prenom} {req.personalInfo.nom}
                </p>
                <p className="text-sm text-slate-500 truncate">{req.personalInfo.email}</p>
              </div>
              <MapIcon size={24} className="text-primary/30 flex-shrink-0" />
            </div>

            <div className="space-y-2 text-sm border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Destination:</span>
                <span className="font-medium text-slate-900">{req.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Départ:</span>
                <span className="font-medium text-slate-900">
                  {new Date(req.dateDepart).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Retour:</span>
                <span className="font-medium text-slate-900">
                  {new Date(req.dateRetour).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Budget:</span>
                <span className="font-medium text-green-600">{req.budget} DA</span>
              </div>

              {/* Services Inclus */}
              {req.servicesInclus && req.servicesInclus.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-700 mb-2">Services inclus:</p>
                  <div className="flex flex-wrap gap-1">
                    {req.servicesInclus.map((service, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferences */}
              {req.preferences && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-700 mb-1">Préférences:</p>
                  <p className="text-xs text-slate-600 line-clamp-2">{req.preferences}</p>
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

export default SejourTable;
