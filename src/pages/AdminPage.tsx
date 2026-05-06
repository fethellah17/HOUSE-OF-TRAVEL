import { useState, useEffect } from "react";
import { useData } from "@/contexts/DataContext";
import { Voyage, Message, VoyageCategory, Stage, VoyageStatus } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane, Inbox, Plus, LogOut, Eye, Trash2, X, CheckCircle, Loader2, Menu, Pencil, FileDown, ArrowLeft, Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { DateRangePicker } from "@/components/ui/date-picker";
import { MultiImageUpload } from "@/components/MultiImageUpload";
import StageSection from "@/components/StageSection";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { formatPrice } from "@/lib/formatters";
import { generateMessagePDF } from "@/lib/pdfGenerator";

type Tab = "inbox" | "users" | "voyages";

const AdminPage = () => {
  const navigate = useNavigate();
  const { voyages, messages, addVoyage, updateVoyage, deleteVoyage, markMessageAsRead } = useData();
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState<Tab>("inbox");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    // Nettoyage de la session
    setLoggedIn(false);
    // Redirection vers la page d'accueil
    navigate("/");
    // Notification de confirmation
    toast.success("Déconnexion réussie, à bientôt !");
  };

  if (!loggedIn) {
    return <AdminLogin onLogin={() => setLoggedIn(true)} />;
  }

  const sidebarItems: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "inbox", label: "Boîte de Réception", icon: Inbox, count: messages.filter((m) => !m.isRead).length },
    { id: "users", label: "Gérer les Comptes", icon: Users },
    { id: "voyages", label: "Gérer les Voyages", icon: Plane },
  ];

  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    setSidebarOpen(false); // Fermer la sidebar sur mobile après sélection
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-primary hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Menu"
        >
          <Menu size={24} />
        </button>
        <img src={logo} alt="HOUSE OF TRAVEL" className="h-10 w-auto" />
        <div className="w-10" /> {/* Spacer pour centrer le logo */}
      </div>

      {/* Overlay pour mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-foreground/20"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-60 bg-white text-foreground flex flex-col shrink-0 border-r border-accent/20
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-accent/20">
          <Link to="/" className="flex flex-col items-center">
            <img src={logo} alt="HOUSE OF TRAVEL" className="h-16 w-auto mb-3" />
          </Link>
          <p className="text-xs text-muted-foreground mt-2 text-center">Administration</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 lg:py-2.5 rounded-lg text-sm font-medium transition-colors touch-manipulation
                ${tab === item.id ? "bg-primary text-white" : "text-foreground hover:text-primary hover:bg-muted/50"}`}
            >
              <item.icon size={20} className="lg:w-[18px] lg:h-[18px]" />
              {item.label}
              {item.count ? (
                <span className="ml-auto bg-accent text-primary text-xs px-2 py-0.5 rounded-full tabular-nums">
                  {item.count}
                </span>
              ) : null}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-accent/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 lg:py-2.5 rounded-lg text-sm text-foreground hover:text-primary hover:bg-muted/50 transition-colors touch-manipulation"
          >
            <LogOut size={20} className="lg:w-[18px] lg:h-[18px]" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-auto pt-16 lg:pt-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {tab === "inbox" ? (
            <InboxView
              messages={messages}
              markMessageAsRead={markMessageAsRead}
              selectedMessage={selectedMessage}
              setSelectedMessage={setSelectedMessage}
            />
          ) : tab === "users" ? (
            <UsersView />
          ) : (
            <VoyagesView
              voyages={voyages}
              addVoyage={addVoyage}
              updateVoyage={updateVoyage}
              deleteVoyage={deleteVoyage}
              showAddForm={showAddForm}
              setShowAddForm={setShowAddForm}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* Login */
const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 relative">
      {/* Bouton Retour à l'accueil */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-muted/50 touch-manipulation"
        aria-label="Retour à l'accueil"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-medium hidden sm:inline">Retour</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white p-6 sm:p-8 rounded-2xl shadow-elegant border border-accent/20"
      >
        <div className="text-center mb-6 sm:mb-8">
          <img src={logo} alt="HOUSE OF TRAVEL" className="h-20 sm:h-24 w-auto mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Administration</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" placeholder="EX : Houseoftravel@gmail.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" placeholder="••••••••" required />
          </div>
          <button type="submit" className="w-full bg-primary text-primary-foreground px-6 py-3.5 rounded-lg font-semibold hover:scale-[1.01] active:scale-[0.99] transition-all touch-manipulation">
            Se connecter
          </button>
        </form>
      </motion.div>
    </div>
  );
};

/* Users Management View */
const UsersView = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
    
    // Listen for new user registrations
    const handleUserUpdate = () => {
      loadUsers();
    };
    
    window.addEventListener("userRegistered", handleUserUpdate);
    
    return () => {
      window.removeEventListener("userRegistered", handleUserUpdate);
    };
  }, []);

  const loadUsers = () => {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(allUsers.reverse()); // Most recent first
  };

  const handleDeleteUser = (userId: string) => {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = allUsers.filter((u: any) => u.id !== userId);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    // Also check if this was the current user
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (currentUser && currentUser.id === userId) {
      localStorage.removeItem("currentUser");
    }
    
    loadUsers();
    setShowDeleteConfirm(null);
    toast.success("Utilisateur supprimé avec succès");
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "---";
      return new Date(dateString).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "---";
    }
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Gérer les Comptes</h2>

      {/* Compact Stats Card - Minimalist White Design */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4"
      >
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-600 mb-0.5">Total Inscriptions</p>
              <p className="text-xl font-bold tabular-nums text-slate-900">{users.length}</p>
            </div>
            <div className="bg-slate-100 p-2.5 rounded-lg">
              <Users size={20} className="text-slate-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmer la suppression</h3>
              <p className="text-sm text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer ce compte utilisateur ? Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDeleteUser(showDeleteConfirm)}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center p-4"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedUser.fullName || `${selectedUser.prenom || ''} ${selectedUser.nom || ''}`.trim() || 'Utilisateur'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">ID: {selectedUser.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedUser(null)} 
                  className="text-gray-400 hover:text-gray-600 p-2 -mr-2"
                  aria-label="Fermer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* User Info */}
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Informations du Compte</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Nom:</strong> {selectedUser.nom || "---"}</p>
                    <p><strong>Prénom:</strong> {selectedUser.prenom || "---"}</p>
                    <p><strong>Email:</strong> {selectedUser.email || "---"}</p>
                    <p><strong>Téléphone:</strong> {selectedUser.phone || "---"}</p>
                    <p><strong>Date d'inscription:</strong> {selectedUser.dateInsc || formatDate(selectedUser.createdAt)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Users Table - Minimalist SaaS Design with Mobile Scroll */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-slate-100">
          <table className="w-full" style={{ minWidth: '600px' }}>
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-2 sm:px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                  Nom
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                  Prénom
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                  Email
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                  Téléphone
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                  Date
                </th>
                <th className="px-2 sm:px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wider whitespace-nowrap sticky right-0 bg-primary shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-slate-500 text-sm">
                    Aucun utilisateur enregistré
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr 
                    key={user.id} 
                    className={`hover:bg-slate-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                  >
                    <td className="px-2 sm:px-3 py-2.5 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-900">
                        {user.nom || "---"}
                      </span>
                    </td>
                    <td className="px-2 sm:px-3 py-2.5 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-900">
                        {user.prenom || "---"}
                      </span>
                    </td>
                    <td className="px-2 sm:px-3 py-2.5 whitespace-nowrap">
                      <span className="text-sm text-slate-600">
                        {user.email || "---"}
                      </span>
                    </td>
                    <td className="px-2 sm:px-3 py-2.5 whitespace-nowrap">
                      <span className="text-sm text-slate-600">
                        {user.phone || "---"}
                      </span>
                    </td>
                    <td className="px-2 sm:px-3 py-2.5 text-sm text-slate-600 whitespace-nowrap">
                      {user.dateInsc || formatDate(user.createdAt)}
                    </td>
                    <td className="px-2 sm:px-3 py-2.5 sticky right-0 bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                          title="Voir les détails"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(user.id)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* Requests View - DEPRECATED - Keeping for reference */
const RequestsView = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  useEffect(() => {
    const adminInbox = JSON.parse(localStorage.getItem("admin_inbox") || "[]");
    setRequests(adminInbox.reverse()); // Most recent first
  }, []);

  const markAsRead = (id: string) => {
    const adminInbox = JSON.parse(localStorage.getItem("admin_inbox") || "[]");
    const updated = adminInbox.map((req: any) => 
      req.id === id ? { ...req, isRead: true } : req
    );
    localStorage.setItem("admin_inbox", JSON.stringify(updated));
    setRequests(updated.reverse());
  };

  const openRequest = (request: any) => {
    setSelectedRequest(request);
    if (!request.isRead) {
      markAsRead(request.id);
    }
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Demandes Clients</h2>

      {/* Request Detail Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/20 flex items-center justify-center p-4"
            onClick={() => setSelectedRequest(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-elegant border border-accent/20 p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedRequest.type === "Devis" 
                        ? "bg-primary/10 text-primary" 
                        : "bg-green-100 text-green-700"
                    }`}>
                      {selectedRequest.type}
                    </span>
                    {selectedRequest.userInfo.isAnonymous && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                        Visiteur Anonyme
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-primary">
                    {selectedRequest.userInfo.name}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedRequest(null)} 
                  className="text-muted-foreground hover:text-foreground p-2 -mr-2 touch-manipulation"
                  aria-label="Fermer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* User Info */}
              <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="text-sm font-semibold text-primary mb-3">Informations de Contact</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> {selectedRequest.userInfo.email}</p>
                  <p><strong>Téléphone:</strong> {selectedRequest.userInfo.phone}</p>
                  <p><strong>Date:</strong> {new Date(selectedRequest.timestamp).toLocaleString("fr-FR")}</p>
                </div>
              </div>

              {/* Form Data */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-primary mb-3">Détails de la Demande</h4>
                {Object.entries(selectedRequest.formData).map(([key, value]: [string, any]) => (
                  value && value !== "Non spécifié" && value !== "" && (
                    <div key={key} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-sm font-medium text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-sm text-gray-900 text-right ml-4 max-w-[60%]">
                        {value}
                      </span>
                    </div>
                  )
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
                  Date
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    Aucune demande pour le moment
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr 
                    key={request.id} 
                    className={`hover:bg-gray-50 transition-colors ${!request.isRead ? "bg-blue-50/50" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {!request.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {request.userInfo.name}
                          </p>
                          <p className="text-xs text-gray-500">{request.userInfo.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                        request.type === "Devis" 
                          ? "bg-primary/10 text-primary" 
                          : "bg-green-100 text-green-700"
                      }`}>
                        {request.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                      {new Date(request.timestamp).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => openRequest(request)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                      >
                        <Eye size={16} />
                        <span className="hidden sm:inline">Voir</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* Inbox */
const InboxView = ({
  messages, markMessageAsRead, selectedMessage, setSelectedMessage,
}: {
  messages: Message[];
  markMessageAsRead: (id: string) => void;
  selectedMessage: Message | null;
  setSelectedMessage: React.Dispatch<React.SetStateAction<Message | null>>;
}) => {
  const openMessage = (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      markMessageAsRead(msg.id);
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const renderDevisDetails = (msg: Message) => {
    if (msg.type !== "Devis" || !msg.devisDetails) return null;
    
    const details = msg.devisDetails;
    const renderField = (label: string, value?: string) => {
      const displayValue = value && value.trim() !== "" ? value : "Non spécifié";
      return (
        <div key={label} className="flex flex-col sm:flex-row sm:justify-between sm:items-start py-2.5 border-b border-gray-100 last:border-b-0 gap-1 sm:gap-4">
          <span className="text-sm font-semibold text-[#0a2357]">{label}</span>
          <span className={`text-sm sm:text-right ${displayValue === "Non spécifié" ? "text-gray-400 italic" : "text-gray-700"}`}>
            {displayValue}
          </span>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        {/* Infos Personnelles */}
        <div>
          <h4 className="text-sm font-semibold text-[#0a2357] mb-3 pb-2 border-b-2 border-[#2C5F2D]">Informations Personnelles</h4>
          <div className="space-y-0">
            {renderField("Nom", msg.name)}
            {renderField("Prénom", details.prenom)}
            {renderField("Email", msg.email)}
            {renderField("Téléphone", msg.phone)}
          </div>
        </div>

        {/* Détails du Voyage */}
        <div>
          <h4 className="text-sm font-semibold text-[#0a2357] mb-3 pb-2 border-b-2 border-[#2C5F2D]">Détails du Voyage</h4>
          <div className="space-y-0">
            {renderField("Destination", details.destination)}
            {renderField("Besoin de VISA", details.besoinVisa)}
            {renderField("Vol", details.volAvecSans)}
          </div>
        </div>

        {/* Hébergement */}
        {(details.nomHotel || details.nombreEtoiles || details.distanceHaram || details.nombreChambres || details.typeChambre) && (
          <div>
            <h4 className="text-sm font-semibold text-[#0a2357] mb-3 pb-2 border-b-2 border-[#2C5F2D]">Hébergement</h4>
            <div className="space-y-0">
              {renderField("Type d'hôtel", details.nombreEtoiles)}
              {renderField("Distance du Haram", details.distanceHaram)}
              {renderField("Nombre de chambres", details.nombreChambres)}
              {renderField("Type de chambre", details.typeChambre)}
            </div>
          </div>
        )}

        {/* Passagers */}
        {(details.pension || details.nombreAdultes || details.nombreEnfants || details.ageEnfants) && (
          <div>
            <h4 className="text-sm font-semibold text-[#0a2357] mb-3 pb-2 border-b-2 border-[#2C5F2D]">Passagers & Pension</h4>
            <div className="space-y-0">
              {renderField("Pension", details.pension)}
              {renderField("Adultes", details.nombreAdultes)}
              {renderField("Enfants", details.nombreEnfants)}
              {renderField("Âge des enfants", details.ageEnfants)}
            </div>
          </div>
        )}

        {/* Dates */}
        {(details.dateDepart || details.dateRetour) && (
          <div>
            <h4 className="text-sm font-semibold text-[#0a2357] mb-3 pb-2 border-b-2 border-[#2C5F2D]">Dates</h4>
            <div className="space-y-0">
              {renderField("Départ", details.dateDepart)}
              {renderField("Retour", details.dateRetour)}
            </div>
          </div>
        )}

        {/* Message */}
        {msg.content && msg.content !== "Aucun message supplémentaire" && (
          <div>
            <h4 className="text-sm font-semibold text-[#0a2357] mb-3 pb-2 border-b-2 border-[#2C5F2D]">Message</h4>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg break-words leading-relaxed">{msg.content}</p>
          </div>
        )}
      </div>
    );
  };

  const renderBilleterieDetails = (msg: Message) => {
    if (msg.type !== "Billetterie" || !msg.billeterieDetails) return null;
    
    const details = msg.billeterieDetails;
    const renderField = (label: string, value?: string) => {
      const displayValue = value && value.trim() !== "" ? value : "Non spécifié";
      return (
        <div key={label} className="flex justify-between items-start py-2.5 border-b border-gray-100 last:border-b-0">
          <span className="text-sm font-medium text-primary">{label}</span>
          <span className={`text-sm text-right ml-4 ${displayValue === "Non spécifié" ? "text-gray-400 italic" : "text-gray-700"}`}>
            {displayValue}
          </span>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        {/* Infos Personnelles */}
        <div>
          <h4 className="text-sm font-semibold text-primary mb-3 pb-2 border-b border-gray-300">Informations Personnelles</h4>
          <div className="space-y-0">
            {renderField("Nom", msg.name)}
            {renderField("Prénom", details.prenom)}
            {renderField("Email", msg.email)}
            {renderField("Téléphone", msg.phone)}
          </div>
        </div>

        {/* Détails du Vol */}
        <div>
          <h4 className="text-sm font-semibold text-primary mb-3 pb-2 border-b border-gray-300">Détails du Vol</h4>
          <div className="space-y-0">
            {renderField("Destination", details.destination)}
            {renderField("Besoin de VISA", details.besoinVisa)}
            {renderField("Compagnie Aérienne", details.compagnie)}
          </div>
        </div>

        {/* Passagers */}
        <div>
          <h4 className="text-sm font-semibold text-primary mb-3 pb-2 border-b border-gray-300">Passagers</h4>
          <div className="space-y-0">
            {renderField("Adultes", details.nombreAdultes)}
            {renderField("Enfants", details.nombreEnfants)}
            {renderField("Âge des enfants", details.ageEnfants)}
          </div>
        </div>

        {/* Dates */}
        <div>
          <h4 className="text-sm font-semibold text-primary mb-3 pb-2 border-b border-gray-300">Dates</h4>
          <div className="space-y-0">
            {renderField("Départ", details.dateDepart)}
            {renderField("Retour", details.dateRetour)}
          </div>
        </div>

        {/* Message */}
        {msg.content && (
          <div>
            <h4 className="text-sm font-semibold text-primary mb-3 pb-2 border-b border-gray-300">Message</h4>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg break-words">{msg.content}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Boîte de Réception</h2>

      {/* Compact Stats Card - Minimalist White Design */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4"
      >
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-600 mb-0.5">Messages Non Lus</p>
              <p className="text-xl font-bold tabular-nums text-slate-900">{unreadCount}</p>
            </div>
            <div className="bg-slate-100 p-2.5 rounded-lg">
              <Inbox size={20} className="text-slate-600" />
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/20 flex items-center justify-center p-0 sm:p-4"
            onClick={() => setSelectedMessage(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-none sm:rounded-2xl shadow-elegant border-0 sm:border border-accent/20 p-4 sm:p-6 w-full h-full sm:h-auto sm:max-w-2xl sm:max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fixed Header on Mobile */}
              <div className="sticky top-0 bg-white z-10 pb-4 mb-2 border-b border-gray-200 sm:static sm:border-0 sm:pb-0 sm:mb-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-base sm:text-lg font-semibold break-words text-[#0a2357]">{selectedMessage.subject}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        generateMessagePDF(selectedMessage);
                        toast.success("PDF généré avec succès");
                      }}
                      className="text-[#0a2357] hover:bg-[#0a2357]/10 p-2 rounded-lg transition-colors touch-manipulation"
                      aria-label="Générer PDF"
                      title="Exporter en PDF"
                    >
                      <FileDown size={20} />
                    </button>
                    <button 
                      onClick={() => setSelectedMessage(null)} 
                      className="text-muted-foreground hover:text-foreground p-2 -mr-2 touch-manipulation"
                      aria-label="Fermer"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto">
                {/* Affichage spécifique pour les devis */}
                {selectedMessage.type === "Devis" ? (
                  renderDevisDetails(selectedMessage)
                ) : selectedMessage.type === "Billetterie" ? (
                  renderBilleterieDetails(selectedMessage)
                ) : (
                  <div>
                    <div className="space-y-2 text-sm text-muted-foreground mb-4 pb-4 border-b border-gray-200">
                      <p className="break-words"><strong className="text-foreground">De :</strong> {selectedMessage.name} ({selectedMessage.email})</p>
                      {selectedMessage.phone && <p><strong className="text-foreground">Tél :</strong> {selectedMessage.phone}</p>}
                      <p><strong className="text-foreground">Date :</strong> {new Date(selectedMessage.createdAt).toLocaleDateString("fr-FR")}</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg text-sm break-words">{selectedMessage.content}</div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            onClick={() => openMessage(msg)}
            className="relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-xl cursor-pointer transition-all bg-white border border-gray-200 hover:border-accent hover:shadow-sm touch-manipulation group"
          >
            {/* Pastille bleue pour messages non-lus */}
            {!msg.isRead && (
              <div className="absolute left-2 top-4 sm:top-1/2 sm:-translate-y-1/2 w-2.5 h-2.5 bg-primary rounded-full" />
            )}
            
            <div className="flex-1 min-w-0 ml-5 sm:ml-3">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-upperspace text-primary text-[10px] font-semibold">{msg.type}</span>
                <span className={`text-sm truncate ${!msg.isRead ? "font-bold text-primary" : "font-medium text-primary"}`}>
                  {msg.name}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 sm:truncate">{msg.subject} — {msg.content}</p>
              <span className="text-xs text-muted-foreground mt-1 inline-block sm:hidden tabular-nums">
                {new Date(msg.createdAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
            
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-xs text-muted-foreground whitespace-nowrap tabular-nums">
                {new Date(msg.createdAt).toLocaleDateString("fr-FR")}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openMessage(msg);
                }}
                className="text-gray-400 hover:text-primary transition-colors p-2 touch-manipulation"
                aria-label="Voir le message"
              >
                <Eye size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* Voyages */
const VoyagesView = ({
  voyages, addVoyage, updateVoyage, deleteVoyage, showAddForm, setShowAddForm,
}: {
  voyages: Voyage[];
  addVoyage: (voyage: Voyage) => void;
  updateVoyage: (id: string, voyage: Partial<Voyage>) => void;
  deleteVoyage: (id: string) => void;
  showAddForm: boolean;
  setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [newVoyage, setNewVoyage] = useState({
    title: "", imageUrl: "", imageUrls: [] as string[], price: "", priceAdult: "", priceChild: "", description: "", category: "Voyage Organisé" as VoyageCategory, duration: "", date: "", status: "normal" as VoyageStatus, flightType: "", visaRequired: "", roomType: "", mealPlan: "", departureTime: "", returnTime: "", hotelName: "", starRating: "",
  });
  const [newStartDate, setNewStartDate] = useState<Date | undefined>();
  const [newEndDate, setNewEndDate] = useState<Date | undefined>();
  const [newStages, setNewStages] = useState<Stage[]>([
    { id: "stage-1", name: "", hotelName: "", googleMapsUrl: "", days: 0 },
    { id: "stage-2", name: "", hotelName: "", googleMapsUrl: "", days: 0 },
  ]);
  const [newDaysMismatch, setNewDaysMismatch] = useState(false);
  
  const [editingVoyage, setEditingVoyage] = useState<Voyage | null>(null);
  const [editForm, setEditForm] = useState({
    title: "", imageUrl: "", imageUrls: [] as string[], price: "", priceAdult: "", priceChild: "", description: "", category: "Voyage Organisé" as VoyageCategory, duration: "", date: "", status: "normal" as VoyageStatus, flightType: "", visaRequired: "", roomType: "", mealPlan: "", departureTime: "", returnTime: "", hotelName: "", starRating: "",
  });
  const [editStartDate, setEditStartDate] = useState<Date | undefined>();
  const [editEndDate, setEditEndDate] = useState<Date | undefined>();
  const [editStages, setEditStages] = useState<Stage[]>([
    { id: "stage-1", name: "", hotelName: "", googleMapsUrl: "", days: 0 },
    { id: "stage-2", name: "", hotelName: "", googleMapsUrl: "", days: 0 },
  ]);
  const [editDaysMismatch, setEditDaysMismatch] = useState(false);
  
  const [saving, setSaving] = useState(false);

  // Calculer automatiquement la durée et formater la date
  const calculateDurationAndDate = (start?: Date, end?: Date) => {
    if (!start || !end) return { duration: "", date: "" };
    
    const days = differenceInDays(end, start) + 1;
    const duration = `${days} jour${days > 1 ? 's' : ''}`;
    const date = `${format(start, "dd/MM/yyyy", { locale: fr })} - ${format(end, "dd/MM/yyyy", { locale: fr })}`;
    
    return { duration, date };
  };

  // Calculer la durée pour l'affichage en temps réel
  const getCalculatedDuration = (start?: Date, end?: Date) => {
    if (!start || !end) return "";
    const days = differenceInDays(end, start) + 1;
    return `${days} jour${days > 1 ? 's' : ''}`;
  };

  // Calculer le nombre total de jours
  const getTotalDays = (start?: Date, end?: Date) => {
    if (!start || !end) return 0;
    return differenceInDays(end, start) + 1;
  };

  // Vérifier si la catégorie nécessite des étapes
  const needsStages = (category: VoyageCategory) => {
    return category === "Omrah" || category === "Voyage Organisé";
  };

  // Valider les étapes avant soumission
  const validateStages = (stages: Stage[], totalDays: number, category: VoyageCategory) => {
    if (!needsStages(category)) return true;
    
    // Vérifier que toutes les étapes sont remplies
    const allFilled = stages.every(s => s.name && s.hotelName && s.googleMapsUrl && s.days > 0);
    if (!allFilled) {
      toast.error("Veuillez remplir toutes les informations des étapes");
      return false;
    }
    
    // Vérifier que la somme des jours correspond
    const stageDaysTotal = stages.reduce((sum, s) => sum + s.days, 0);
    if (stageDaysTotal !== totalDays) {
      toast.error(`La somme des jours des étapes (${stageDaysTotal}) ne correspond pas à la durée totale (${totalDays} jours)`);
      return false;
    }
    
    return true;
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoyage.title || !newVoyage.priceAdult || !newVoyage.priceChild) return;
    
    // Pour "Voyage à la Carte", utiliser des valeurs par défaut
    let duration, date;
    let totalDays = 0;
    
    if (newVoyage.category === "Voyage à la Carte") {
      duration = "Sur mesure";
      date = "Dates flexibles";
    } else {
      const calculated = calculateDurationAndDate(newStartDate, newEndDate);
      duration = calculated.duration;
      date = calculated.date;
      totalDays = getTotalDays(newStartDate, newEndDate);
      
      // Valider les étapes si nécessaire
      if (needsStages(newVoyage.category) && !validateStages(newStages, totalDays, newVoyage.category)) {
        return;
      }
    }
    
    setSaving(true);
    
    setTimeout(() => {
      const v: Voyage = {
        id: String(Date.now()),
        title: newVoyage.title,
        imageUrl: newVoyage.imageUrls[0] || newVoyage.imageUrl || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
        imageUrls: newVoyage.imageUrls.length > 0 ? newVoyage.imageUrls : undefined,
        price: Number(newVoyage.priceAdult),
        priceAdult: Number(newVoyage.priceAdult),
        priceChild: Number(newVoyage.priceChild),
        description: newVoyage.description,
        category: newVoyage.category,
        duration: duration || newVoyage.duration,
        date: date || newVoyage.date,
        createdAt: new Date().toISOString(),
        stages: needsStages(newVoyage.category) ? newStages : undefined,
        status: newVoyage.status,
        flightType: newVoyage.flightType || undefined,
        visaRequired: newVoyage.visaRequired || undefined,
        roomType: newVoyage.roomType || undefined,
        mealPlan: newVoyage.mealPlan || undefined,
      };
      addVoyage(v);
      setShowAddForm(false);
      setNewVoyage({ title: "", imageUrl: "", imageUrls: [], price: "", priceAdult: "", priceChild: "", description: "", category: "Voyage Organisé", duration: "", date: "", status: "normal", flightType: "", visaRequired: "", roomType: "", mealPlan: "", departureTime: "", returnTime: "", hotelName: "", starRating: "" });
      setNewStartDate(undefined);
      setNewEndDate(undefined);
      setNewStages([
        { id: "stage-1", name: "", hotelName: "", googleMapsUrl: "", days: 0 },
        { id: "stage-2", name: "", hotelName: "", googleMapsUrl: "", days: 0 },
      ]);
      setSaving(false);
      toast.success("Voyage ajouté avec succès");
    }, 800);
  };

  const handleDelete = (id: string) => {
    deleteVoyage(id);
    toast.success("Voyage supprimé");
  };

  const openEditModal = (voyage: Voyage) => {
    setEditingVoyage(voyage);
    setEditForm({
      title: voyage.title,
      imageUrl: voyage.imageUrl,
      imageUrls: voyage.imageUrls || [],
      price: String(voyage.price),
      priceAdult: String(voyage.priceAdult || voyage.price),
      priceChild: String(voyage.priceChild || 0),
      description: voyage.description || "",
      category: voyage.category,
      duration: voyage.duration || "",
      date: voyage.date || "",
      status: voyage.status || "normal",
      flightType: voyage.flightType || "",
      visaRequired: voyage.visaRequired || "",
      roomType: voyage.roomType || "",
      mealPlan: voyage.mealPlan || "",
      departureTime: voyage.departureTime || "",
      returnTime: voyage.returnTime || "",
      hotelName: voyage.hotelName || "",
      starRating: voyage.starRating || "",
    });
    
    // Parser et charger les dates existantes si disponibles
    if (voyage.date && voyage.category !== "Voyage à la Carte") {
      try {
        // Format attendu: "DD/MM/YYYY - DD/MM/YYYY"
        const dateParts = voyage.date.split(" - ");
        if (dateParts.length === 2) {
          const [startStr, endStr] = dateParts;
          // Parser les dates au format DD/MM/YYYY
          const [startDay, startMonth, startYear] = startStr.split("/").map(Number);
          const [endDay, endMonth, endYear] = endStr.split("/").map(Number);
          
          if (startDay && startMonth && startYear) {
            setEditStartDate(new Date(startYear, startMonth - 1, startDay));
          }
          if (endDay && endMonth && endYear) {
            setEditEndDate(new Date(endYear, endMonth - 1, endDay));
          }
        }
      } catch (error) {
        console.error("Erreur lors du parsing des dates:", error);
        setEditStartDate(undefined);
        setEditEndDate(undefined);
      }
    } else {
      setEditStartDate(undefined);
      setEditEndDate(undefined);
    }
    
    // Charger les étapes existantes ou initialiser
    setEditStages(voyage.stages || [
      { id: "stage-1", name: "", hotelName: "", googleMapsUrl: "", days: 0 },
      { id: "stage-2", name: "", hotelName: "", googleMapsUrl: "", days: 0 },
    ]);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.title || !editForm.priceAdult || !editForm.priceChild || !editingVoyage) return;
    
    // Pour "Voyage à la Carte", utiliser des valeurs par défaut
    let duration, date;
    let totalDays = 0;
    
    if (editForm.category === "Voyage à la Carte") {
      duration = "Sur mesure";
      date = "Dates flexibles";
    } else {
      // Si les dates ont été modifiées, calculer les nouvelles valeurs
      if (editStartDate && editEndDate) {
        const calculated = calculateDurationAndDate(editStartDate, editEndDate);
        duration = calculated.duration;
        date = calculated.date;
        totalDays = getTotalDays(editStartDate, editEndDate);
        
        // Valider les étapes si nécessaire
        if (needsStages(editForm.category) && !validateStages(editStages, totalDays, editForm.category)) {
          return;
        }
      } else {
        // Conserver les anciennes valeurs si les dates n'ont pas été modifiées
        duration = editingVoyage.duration;
        date = editingVoyage.date;
      }
    }
    
    setSaving(true);
    
    setTimeout(() => {
      updateVoyage(editingVoyage.id, {
        title: editForm.title,
        imageUrl: editForm.imageUrls[0] || editForm.imageUrl || editingVoyage.imageUrl,
        imageUrls: editForm.imageUrls.length > 0 ? editForm.imageUrls : undefined,
        price: Number(editForm.priceAdult),
        priceAdult: Number(editForm.priceAdult),
        priceChild: Number(editForm.priceChild),
        description: editForm.description,
        category: editForm.category,
        duration: duration || editForm.duration,
        date: date || editForm.date,
        stages: needsStages(editForm.category) ? editStages : undefined,
        status: editForm.status,
        flightType: editForm.flightType || undefined,
        visaRequired: editForm.visaRequired || undefined,
        roomType: editForm.roomType || undefined,
        mealPlan: editForm.mealPlan || undefined,
      });
      setEditingVoyage(null);
      setEditStartDate(undefined);
      setEditEndDate(undefined);
      setSaving(false);
      toast.success("Voyage modifié avec succès");
    }, 800);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Gérer les Voyages</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          {showAddForm ? <X size={16} /> : <Plus size={16} />}
          {showAddForm ? "Annuler" : "Ajouter un Voyage"}
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="bg-white p-6 rounded-2xl shadow-card border border-accent/20 mb-6 space-y-4 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Titre *</label>
                <input type="text" value={newVoyage.title} onChange={(e) => setNewVoyage({ ...newVoyage, title: e.target.value })} className="form-input" required maxLength={200} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Catégorie</label>
                <select value={newVoyage.category} onChange={(e) => setNewVoyage({ ...newVoyage, category: e.target.value as VoyageCategory })} className="form-input">
                  <option>Voyage Organisé</option>
                  <option>Voyage National</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Prix Adulte (DA) *</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={newVoyage.priceAdult} 
                    onChange={(e) => setNewVoyage({ ...newVoyage, priceAdult: e.target.value })} 
                    className="form-input pr-12" 
                    required 
                    min={0}
                    step="0.01"
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">DA</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Prix Enfant (DA) *</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={newVoyage.priceChild} 
                    onChange={(e) => setNewVoyage({ ...newVoyage, priceChild: e.target.value })} 
                    className="form-input pr-12" 
                    required 
                    min={0}
                    step="0.01"
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">DA</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Statut du voyage</label>
              <select value={newVoyage.status} onChange={(e) => setNewVoyage({ ...newVoyage, status: e.target.value as VoyageStatus })} className="form-input">
                <option value="normal">Normal</option>
                <option value="almost-full">Bientôt complet (باقي أماكن قليلة)</option>
                <option value="full">Complet (الرحلة كاملة)</option>
                <option value="limited-offer">Offre limitée (عرض محدود)</option>
              </select>
            </div>

            {/* Champs de contrôle pour Omrah et Voyage Organisé */}
            {(newVoyage.category === "Omrah" || newVoyage.category === "Voyage Organisé") && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 pt-2">
                  <div className="h-px flex-1 bg-accent/20" />
                  <h3 className="text-sm font-semibold text-primary">Options Fixes (Contrôle Client)</h3>
                  <div className="h-px flex-1 bg-accent/20" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Type de Vol</label>
                    <select value={newVoyage.flightType} onChange={(e) => setNewVoyage({ ...newVoyage, flightType: e.target.value })} className="form-input">
                      <option value="">Laisser le client choisir</option>
                      <option value="Avec vol">Avec vol</option>
                      <option value="Sans vol">Sans vol</option>
                    </select>
                    <p className="text-xs text-muted-foreground mt-1">Laissez vide pour que le client choisisse</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Besoin d'un VISA</label>
                    <select value={newVoyage.visaRequired} onChange={(e) => setNewVoyage({ ...newVoyage, visaRequired: e.target.value })} className="form-input">
                      <option value="">Laisser le client choisir</option>
                      <option value="Oui">Oui</option>
                      <option value="Non">Non</option>
                    </select>
                    <p className="text-xs text-muted-foreground mt-1">Laissez vide pour que le client choisisse</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Type de Chambre</label>
                    <select value={newVoyage.roomType} onChange={(e) => setNewVoyage({ ...newVoyage, roomType: e.target.value })} className="form-input">
                      <option value="">Laisser le client choisir</option>
                      <option value="Double">Double</option>
                      <option value="Triple">Triple</option>
                      <option value="Quadruple">Quadruple</option>
                    </select>
                    <p className="text-xs text-muted-foreground mt-1">Laissez vide pour que le client choisisse</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Pension</label>
                    <select value={newVoyage.mealPlan} onChange={(e) => setNewVoyage({ ...newVoyage, mealPlan: e.target.value })} className="form-input">
                      <option value="">Laisser le client choisir</option>
                      <option value="Pension complète">Pension complète</option>
                      <option value="Demi-pension">Demi-pension</option>
                      <option value="Petit-déjeuner seul">Petit-déjeuner seul</option>
                    </select>
                    <p className="text-xs text-muted-foreground mt-1">Laissez vide pour que le client choisisse</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Dates du voyage {newVoyage.category !== "Voyage à la Carte" && "*"}
              </label>
              {newVoyage.category === "Voyage à la Carte" ? (
                <div className="form-input bg-muted/30 cursor-not-allowed flex items-center justify-center text-muted-foreground">
                  Dates flexibles - Sur mesure
                </div>
              ) : (
                <>
                  <DateRangePicker
                    startDate={newStartDate}
                    endDate={newEndDate}
                    onStartDateChange={setNewStartDate}
                    onEndDateChange={setNewEndDate}
                  />
                  {newStartDate && newEndDate && (
                    <p className="text-xs text-primary mt-2 font-medium">
                      ✓ Durée : {getCalculatedDuration(newStartDate, newEndDate)} • 
                      Période : {format(newStartDate, "dd/MM/yyyy")} - {format(newEndDate, "dd/MM/yyyy")}
                    </p>
                  )}
                </>
              )}
            </div>

            <MultiImageUpload
              value={newVoyage.imageUrls}
              onChange={(imageUrls) => setNewVoyage({ ...newVoyage, imageUrls })}
              maxFiles={10}
              label="Photos du voyage"
            />
            <div>
              <label className="block text-sm font-medium mb-1.5">Description</label>
              <textarea value={newVoyage.description} onChange={(e) => setNewVoyage({ ...newVoyage, description: e.target.value })} className="form-input min-h-[80px] resize-y" maxLength={1000} />
            </div>

            {/* Sections d'étapes conditionnelles */}
            {needsStages(newVoyage.category) && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pt-2">
                  <div className="h-px flex-1 bg-accent/20" />
                  <h3 className="text-sm font-semibold text-primary">Étapes du voyage</h3>
                  <div className="h-px flex-1 bg-accent/20" />
                </div>
                <StageSection
                  stages={newStages}
                  onStagesChange={setNewStages}
                  totalDays={getTotalDays(newStartDate, newEndDate)}
                  onDaysMismatch={setNewDaysMismatch}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={saving || (needsStages(newVoyage.category) && newDaysMismatch)}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 flex items-center gap-2"
            >
              {saving ? <><Loader2 size={16} className="animate-spin" /> Enregistrement...</> : <><CheckCircle size={16} /> Enregistrer</>}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Modal de modification */}
      <AnimatePresence>
        {editingVoyage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/20 flex items-center justify-center p-4"
            onClick={() => setEditingVoyage(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-elegant border border-accent/20 p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg sm:text-xl font-semibold">Modifier le voyage</h3>
                <button 
                  onClick={() => setEditingVoyage(null)} 
                  className="text-muted-foreground hover:text-foreground p-2 -mr-2 touch-manipulation"
                  aria-label="Fermer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleEdit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Titre *</label>
                    <input 
                      type="text" 
                      value={editForm.title} 
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} 
                      className="form-input" 
                      required 
                      maxLength={200} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Catégorie</label>
                    <select 
                      value={editForm.category} 
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value as VoyageCategory })} 
                      className="form-input"
                    >
                      <option>Voyage Organisé</option>
                      <option>Voyage National</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Prix Adulte (DA) *</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={editForm.priceAdult} 
                        onChange={(e) => setEditForm({ ...editForm, priceAdult: e.target.value })} 
                        className="form-input pr-12" 
                        required 
                        min={0}
                        step="0.01"
                        placeholder="0"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">DA</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Prix Enfant (DA) *</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={editForm.priceChild} 
                        onChange={(e) => setEditForm({ ...editForm, priceChild: e.target.value })} 
                        className="form-input pr-12" 
                        required 
                        min={0}
                        step="0.01"
                        placeholder="0"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">DA</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Statut du voyage</label>
                  <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value as VoyageStatus })} className="form-input">
                    <option value="normal">Normal</option>
                    <option value="almost-full">Bientôt complet (باقي أماكن قليلة)</option>
                    <option value="full">Complet (الرحلة كاملة)</option>
                    <option value="limited-offer">Offre limitée (عرض محدود)</option>
                  </select>
                </div>

                {/* Champs de contrôle pour Omrah et Voyage Organisé */}
                {(editForm.category === "Omrah" || editForm.category === "Voyage Organisé") && (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-2 pt-2">
                      <div className="h-px flex-1 bg-accent/20" />
                      <h3 className="text-sm font-semibold text-primary">Options Fixes (Contrôle Client)</h3>
                      <div className="h-px flex-1 bg-accent/20" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Type de Vol</label>
                        <select value={editForm.flightType} onChange={(e) => setEditForm({ ...editForm, flightType: e.target.value })} className="form-input">
                          <option value="">Laisser le client choisir</option>
                          <option value="Avec vol">Avec vol</option>
                          <option value="Sans vol">Sans vol</option>
                        </select>
                        <p className="text-xs text-muted-foreground mt-1">Laissez vide pour que le client choisisse</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Besoin d'un VISA</label>
                        <select value={editForm.visaRequired} onChange={(e) => setEditForm({ ...editForm, visaRequired: e.target.value })} className="form-input">
                          <option value="">Laisser le client choisir</option>
                          <option value="Oui">Oui</option>
                          <option value="Non">Non</option>
                        </select>
                        <p className="text-xs text-muted-foreground mt-1">Laissez vide pour que le client choisisse</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Type de Chambre</label>
                        <select value={editForm.roomType} onChange={(e) => setEditForm({ ...editForm, roomType: e.target.value })} className="form-input">
                          <option value="">Laisser le client choisir</option>
                          <option value="Double">Double</option>
                          <option value="Triple">Triple</option>
                          <option value="Quadruple">Quadruple</option>
                        </select>
                        <p className="text-xs text-muted-foreground mt-1">Laissez vide pour que le client choisisse</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Pension</label>
                        <select value={editForm.mealPlan} onChange={(e) => setEditForm({ ...editForm, mealPlan: e.target.value })} className="form-input">
                          <option value="">Laisser le client choisir</option>
                          <option value="Pension complète">Pension complète</option>
                          <option value="Demi-pension">Demi-pension</option>
                          <option value="Petit-déjeuner seul">Petit-déjeuner seul</option>
                        </select>
                        <p className="text-xs text-muted-foreground mt-1">Laissez vide pour que le client choisisse</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Dates du voyage {editForm.category !== "Voyage à la Carte" && "*"}
                  </label>
                  {editForm.category === "Voyage à la Carte" ? (
                    <div className="form-input bg-muted/30 cursor-not-allowed flex items-center justify-center text-muted-foreground">
                      Dates flexibles - Sur mesure
                    </div>
                  ) : (
                    <>
                      <DateRangePicker
                        startDate={editStartDate}
                        endDate={editEndDate}
                        onStartDateChange={setEditStartDate}
                        onEndDateChange={setEditEndDate}
                      />
                      {editStartDate && editEndDate && (
                        <p className="text-xs text-primary mt-2 font-medium">
                          ✓ Durée : {getCalculatedDuration(editStartDate, editEndDate)} • 
                          Période : {format(editStartDate, "dd/MM/yyyy")} - {format(editEndDate, "dd/MM/yyyy")}
                        </p>
                      )}
                    </>
                  )}
                </div>

                <MultiImageUpload
                  value={editForm.imageUrls}
                  onChange={(imageUrls) => setEditForm({ ...editForm, imageUrls })}
                  maxFiles={10}
                  label="Photos du voyage"
                />
                <div>
                  <label className="block text-sm font-medium mb-1.5">Description</label>
                  <textarea 
                    value={editForm.description} 
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} 
                    className="form-input min-h-[80px] resize-y" 
                    maxLength={1000} 
                  />
                </div>

                {/* Sections d'étapes conditionnelles */}
                {needsStages(editForm.category) && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pt-2">
                      <div className="h-px flex-1 bg-accent/20" />
                      <h3 className="text-sm font-semibold text-primary">Étapes du voyage</h3>
                      <div className="h-px flex-1 bg-accent/20" />
                    </div>
                    <StageSection
                      stages={editStages}
                      onStagesChange={setEditStages}
                      totalDays={getTotalDays(editStartDate, editEndDate)}
                      onDaysMismatch={setEditDaysMismatch}
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingVoyage(null)}
                    className="flex-1 bg-muted text-foreground px-6 py-2.5 rounded-lg font-semibold hover:bg-muted/80 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={saving || (needsStages(editForm.category) && editDaysMismatch)}
                    className="flex-1 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {saving ? <><Loader2 size={16} className="animate-spin" /> Enregistrement...</> : <><CheckCircle size={16} /> Enregistrer les modifications</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {voyages.map((v) => (
          <div key={v.id} className="flex items-center gap-3 sm:gap-4 p-4 bg-white rounded-xl shadow-card border border-gray-200 hover:border-accent/50 transition-colors">
            <img src={v.imageUrl} alt={v.title} className="w-16 h-12 object-cover rounded-lg shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{v.title}</p>
              <p className="text-xs text-muted-foreground">{v.category} · {formatPrice(v.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => openEditModal(v)} 
                className="text-primary hover:text-accent transition-colors p-2 touch-manipulation"
                aria-label="Modifier"
                title="Modifier"
              >
                <Pencil size={16} />
              </button>
              <button 
                onClick={() => handleDelete(v.id)} 
                className="text-muted-foreground hover:text-destructive transition-colors p-2 touch-manipulation"
                aria-label="Supprimer"
                title="Supprimer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
