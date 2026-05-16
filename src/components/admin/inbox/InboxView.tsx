import { useState } from "react";
import { motion } from "framer-motion";
import { Inbox, Plane, FileText, Hotel, Map } from "lucide-react";
import type { ServiceRequest, BilletterieRequest, VisaRequest, HotelRequest, SejourRequest } from "@/contexts/DataContext";
import BilletterieTable from "./BilletterieTable";
import VisaTable from "./VisaTable";
import HotelTable from "./HotelTable";
import SejourTable from "./SejourTable";
import RequestDetailModal from "./RequestDetailModal";

interface InboxViewProps {
  requests: ServiceRequest[];
  markRequestAsRead: (id: string) => void;
  deleteRequest: (id: string) => Promise<void> | void;
  markVisaAsRead?: (id: string, e?: React.MouseEvent) => void;
  deleteVisaRequest?: (id: string) => Promise<void> | void;
}

type ServiceTab = "billetterie" | "visa" | "hotel" | "sejour";

const InboxView = ({ requests, markRequestAsRead, deleteRequest, markVisaAsRead, deleteVisaRequest }: InboxViewProps) => {
  const [activeServiceTab, setActiveServiceTab] = useState<ServiceTab>("billetterie");
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  // Filter requests by service type
  const billetterieRequests = requests.filter(r => r.serviceType === "billetterie") as BilletterieRequest[];
  const visaRequests = requests.filter(r => r.serviceType === "visa") as VisaRequest[];
  const hotelRequests = requests.filter(r => r.serviceType === "hotel") as HotelRequest[];
  const sejourRequests = requests.filter(r => r.serviceType === "sejour") as SejourRequest[];

  const unreadCount = requests.filter(r => !r.isRead).length;

  const openRequest = (req: ServiceRequest) => {
    setSelectedRequest(req);
    if (!req.isRead) {
      markRequestAsRead(req.id);
    }
  };

  const serviceTabs = [
    { id: "billetterie" as const, label: "Billetterie", icon: Plane, count: billetterieRequests.length },
    { id: "visa" as const, label: "Visa", icon: FileText, count: visaRequests.length },
    { id: "hotel" as const, label: "Hôtel", icon: Hotel, count: hotelRequests.length },
    { id: "sejour" as const, label: "Séjour", icon: Map, count: sejourRequests.length },
  ];

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Boîte de Réception</h2>

      {/* Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-600 mb-0.5">Demandes Non Lues</p>
              <p className="text-xl font-bold tabular-nums text-slate-900">{unreadCount}</p>
            </div>
            <div className="bg-slate-100 p-2.5 rounded-lg">
              <Inbox size={20} className="text-slate-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Service Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-slate-100">
        {serviceTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveServiceTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all whitespace-nowrap touch-manipulation ${
                activeServiceTab === tab.id
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-primary"
              }`}
            >
              <Icon size={18} />
              <span className="text-sm sm:text-base">{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold tabular-nums ${
                activeServiceTab === tab.id
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onDelete={
            selectedRequest.serviceType === "visa" && deleteVisaRequest
              ? deleteVisaRequest
              : deleteRequest
          }
        />
      )}

      {/* Dynamic Tables/Cards */}
      {activeServiceTab === "billetterie" && (
        <BilletterieTable 
          requests={billetterieRequests} 
          onOpen={openRequest}
          onMarkAsRead={markRequestAsRead}
        />
      )}
      {activeServiceTab === "visa" && (
        <VisaTable 
          requests={visaRequests} 
          onOpen={openRequest}
          onMarkAsRead={markVisaAsRead ?? markRequestAsRead}
        />
      )}
      {activeServiceTab === "hotel" && (
        <HotelTable 
          requests={hotelRequests} 
          onOpen={openRequest}
          onMarkAsRead={markRequestAsRead}
        />
      )}
      {activeServiceTab === "sejour" && (
        <SejourTable 
          requests={sejourRequests} 
          onOpen={openRequest}
          onMarkAsRead={markRequestAsRead}
        />
      )}
    </div>
  );
};

export default InboxView;
