import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Voyage, Message } from "@/types";
import { mockVoyages, mockMessages } from "@/data/mockData";

export interface SejourDestination {
  id: string;
  name: string;
}

export interface SejourService {
  id: string;
  label: string;
}

export interface EVisaCountry {
  id: string;
  name: string;
}

export interface DossierCountry {
  id: string;
  name: string;
  documents: string[];
}

// Request interfaces for specialized inbox
export interface BilletterieRequest {
  id: string;
  serviceType: "billetterie";
  createdAt: string;
  isRead: boolean;
  completed: boolean;
  personalInfo: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
  };
  tripType: string;
  destination: string;
  dateDepart: string;
  dateRetour?: string;
  nombreAdultes: string;
  nombreEnfants: string;
  ageEnfants?: string;
  compagnie?: string;
  besoinVisa?: string;
  message?: string;
}

export interface VisaRequest {
  id: string;
  serviceType: "visa";
  createdAt: string;
  isRead: boolean;
  completed: boolean;
  personalInfo: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
  };
  visaType: "e-visa" | "dossier";
  pays: string;
  dateVoyage: string;
  passeportValide: boolean;
  situationPro?: string;
  message?: string;
}

export interface HotelRequest {
  id: string;
  serviceType: "hotel";
  createdAt: string;
  isRead: boolean;
  completed: boolean;
  personalInfo: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
  };
  hotelPreference: "specific" | "suggest";
  hotelName?: string;
  hotelCategory?: string;
  city: string;
  dateArrivee: string;
  dateDepart: string;
  nombreChambres: string;
  nombrePersonnes: string;
  roomType?: string;
  boardBasis?: string;
  message?: string;
}

export interface SejourRequest {
  id: string;
  serviceType: "sejour";
  createdAt: string;
  isRead: boolean;
  completed: boolean;
  personalInfo: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
  };
  destination: string;
  typeVoyage: string;
  budget: string;
  dateDepart: string;
  dateRetour: string;
  servicesInclus: string[];
  preferences?: string;
}

export type ServiceRequest = BilletterieRequest | VisaRequest | HotelRequest | SejourRequest;

interface DataContextType {
  voyages: Voyage[];
  messages: Message[];
  sejourDestinations: SejourDestination[];
  sejourServices: SejourService[];
  eVisaCountries: EVisaCountry[];
  dossierCountries: DossierCountry[];
  requests: ServiceRequest[];
  addVoyage: (voyage: Voyage) => void;
  updateVoyage: (id: string, voyage: Partial<Voyage>) => void;
  deleteVoyage: (id: string) => void;
  addMessage: (message: Omit<Message, "id" | "createdAt" | "isRead">) => void;
  markMessageAsRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  addSejourDestination: (destination: Omit<SejourDestination, "id">) => void;
  deleteSejourDestination: (id: string) => void;
  addSejourService: (service: Omit<SejourService, "id">) => void;
  deleteSejourService: (id: string) => void;
  addEVisaCountry: (country: Omit<EVisaCountry, "id">) => void;
  deleteEVisaCountry: (id: string) => void;
  addDossierCountry: (country: Omit<DossierCountry, "id">) => void;
  updateDossierCountry: (id: string, country: Partial<DossierCountry>) => void;
  deleteDossierCountry: (id: string) => void;
  addRequest: (request: Omit<ServiceRequest, "id" | "createdAt" | "isRead" | "completed">) => void;
  markRequestAsRead: (id: string) => void;
  toggleRequestStatus: (id: string) => void;
  deleteRequest: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Data version for schema migration
const DATA_VERSION = "2.0"; // Updated for new request system

// Default destinations and services
const defaultDestinations: SejourDestination[] = [
  { id: "1", name: "Alger, Algérie" },
  { id: "2", name: "Oran, Algérie" },
  { id: "3", name: "Paris, France" },
  { id: "4", name: "Istanbul, Turquie" },
  { id: "5", name: "Dubai, Émirats Arabes Unis" },
  { id: "6", name: "Le Caire, Égypte" },
  { id: "7", name: "Tunis, Tunisie" },
  { id: "8", name: "Casablanca, Maroc" },
  { id: "9", name: "Madrid, Espagne" },
  { id: "10", name: "Rome, Italie" },
];

const defaultServices: SejourService[] = [
  { id: "billet-avion", label: "Billet d'avion" },
  { id: "transfert", label: "Transfert Aéroport" },
  { id: "guide", label: "Guide touristique" },
  { id: "location-voiture", label: "Location de voiture" },
  { id: "activites", label: "Activités & Excursions" },
];

const defaultEVisaCountries: EVisaCountry[] = [
  { id: "1", name: "Turquie" },
  { id: "2", name: "Émirats Arabes Unis" },
  { id: "3", name: "Arabie Saoudite" },
  { id: "4", name: "Égypte" },
  { id: "5", name: "Inde" },
];

const defaultDossierCountries: DossierCountry[] = [
  {
    id: "1",
    name: "France",
    documents: [
      "Passeport valide (minimum 6 mois)",
      "2 photos d'identité récentes",
      "Justificatif de domicile",
      "Attestation d'assurance voyage",
      "Relevés bancaires (3 derniers mois)",
      "Lettre d'invitation ou réservation d'hôtel"
    ]
  },
  {
    id: "2",
    name: "Canada",
    documents: [
      "Passeport valide",
      "Formulaire de demande complété",
      "Photos biométriques",
      "Preuve de fonds suffisants",
      "Lettre d'invitation (si applicable)",
      "Certificat de police"
    ]
  },
  {
    id: "3",
    name: "USA",
    documents: [
      "Passeport valide",
      "Formulaire DS-160",
      "Photo format US",
      "Preuve de liens avec le pays d'origine",
      "Relevés bancaires",
      "Lettre d'employeur"
    ]
  }
];

export const DataProvider = ({ children }: { children: ReactNode }) => {
  // Initialiser avec les données mock (voyages par défaut)
  const [voyages, setVoyages] = useState<Voyage[]>(mockVoyages);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [sejourDestinations, setSejourDestinations] = useState<SejourDestination[]>(defaultDestinations);
  const [sejourServices, setSejourServices] = useState<SejourService[]>(defaultServices);
  const [eVisaCountries, setEVisaCountries] = useState<EVisaCountry[]>(defaultEVisaCountries);
  const [dossierCountries, setDossierCountries] = useState<DossierCountry[]>(defaultDossierCountries);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);

  // Charger les messages depuis localStorage au montage
  useEffect(() => {
    try {
      // Check data version for schema migration
      const savedVersion = localStorage.getItem("dataVersion");
      
      if (savedVersion !== DATA_VERSION) {
        console.log("Data schema version mismatch. Migrating to new version...");
        // Clear old data for fresh start with new request system
        localStorage.removeItem("eVisaCountries");
        localStorage.removeItem("dossierCountries");
        localStorage.removeItem("messages");
        localStorage.removeItem("admin_inbox");
        localStorage.setItem("dataVersion", DATA_VERSION);
      }

      // Load messages (legacy - will be phased out)
      const savedMessages = localStorage.getItem("messages");
      if (savedMessages) {
        try {
          const parsed = JSON.parse(savedMessages);
          if (Array.isArray(parsed)) {
            setMessages(parsed);
          }
        } catch (e) {
          console.error("Error parsing messages from localStorage", e);
        }
      }
      
      // Load requests (new system)
      const savedRequests = localStorage.getItem("requests");
      if (savedRequests) {
        try {
          const parsed = JSON.parse(savedRequests);
          if (Array.isArray(parsed)) {
            setRequests(parsed);
          }
        } catch (e) {
          console.error("Error parsing requests from localStorage", e);
        }
      }
      
      // Load sejour destinations
      const savedDestinations = localStorage.getItem("sejourDestinations");
      if (savedDestinations) {
        try {
          const parsed = JSON.parse(savedDestinations);
          if (Array.isArray(parsed)) {
            setSejourDestinations(parsed);
          }
        } catch (e) {
          console.error("Error parsing destinations from localStorage", e);
        }
      }
      
      // Load sejour services
      const savedServices = localStorage.getItem("sejourServices");
      if (savedServices) {
        try {
          const parsed = JSON.parse(savedServices);
          if (Array.isArray(parsed)) {
            setSejourServices(parsed);
          }
        } catch (e) {
          console.error("Error parsing services from localStorage", e);
        }
      }
      
      // Load E-visa countries with validation
      const savedEVisaCountries = localStorage.getItem("eVisaCountries");
      if (savedEVisaCountries) {
        try {
          const parsed = JSON.parse(savedEVisaCountries);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Validate structure
            const isValid = parsed.every(c => c.id && c.name);
            if (isValid) {
              setEVisaCountries(parsed);
            } else {
              console.warn("Invalid E-visa countries structure. Using defaults.");
            }
          }
        } catch (e) {
          console.error("Error parsing E-visa countries from localStorage", e);
        }
      }
      
      // Load Dossier countries with validation
      const savedDossierCountries = localStorage.getItem("dossierCountries");
      if (savedDossierCountries) {
        try {
          const parsed = JSON.parse(savedDossierCountries);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Validate structure
            const isValid = parsed.every(c => c.id && c.name && Array.isArray(c.documents));
            if (isValid) {
              setDossierCountries(parsed);
            } else {
              console.warn("Invalid Dossier countries structure. Using defaults.");
            }
          }
        } catch (e) {
          console.error("Error parsing Dossier countries from localStorage", e);
        }
      }
    } catch (error) {
      console.error("Critical error loading data from localStorage:", error);
      // Reset to defaults on critical error
      setMessages(mockMessages);
      setSejourDestinations(defaultDestinations);
      setSejourServices(defaultServices);
      setEVisaCountries(defaultEVisaCountries);
      setDossierCountries(defaultDossierCountries);
    }
  }, []);

  // Sauvegarder les données dans localStorage
  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);
  
  useEffect(() => {
    localStorage.setItem("requests", JSON.stringify(requests));
  }, [requests]);
  
  useEffect(() => {
    localStorage.setItem("sejourDestinations", JSON.stringify(sejourDestinations));
  }, [sejourDestinations]);
  
  useEffect(() => {
    localStorage.setItem("sejourServices", JSON.stringify(sejourServices));
  }, [sejourServices]);
  
  useEffect(() => {
    localStorage.setItem("eVisaCountries", JSON.stringify(eVisaCountries));
  }, [eVisaCountries]);
  
  useEffect(() => {
    localStorage.setItem("dossierCountries", JSON.stringify(dossierCountries));
  }, [dossierCountries]);

  const addVoyage = (voyage: Voyage) => {
    setVoyages((prev) => [voyage, ...prev]);
    // NOTE: Les nouveaux voyages sont stockés UNIQUEMENT en mémoire (React State)
    // Ils disparaîtront lors d'un refresh de la page
    // Cela évite les problèmes de localStorage avec les images lourdes sur iPhone
  };

  const updateVoyage = (id: string, updatedFields: Partial<Voyage>) => {
    setVoyages((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updatedFields } : v))
    );
  };

  const deleteVoyage = (id: string) => {
    setVoyages((prev) => prev.filter((v) => v.id !== id));
  };

  const addMessage = (messageData: Omit<Message, "id" | "createdAt" | "isRead">) => {
    const newMessage: Message = {
      ...messageData,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages((prev) => [newMessage, ...prev]);
  };

  const markMessageAsRead = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
    );
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const addSejourDestination = (destinationData: Omit<SejourDestination, "id">) => {
    const newDestination: SejourDestination = {
      ...destinationData,
      id: String(Date.now()),
    };
    setSejourDestinations((prev) => [...prev, newDestination]);
  };

  const deleteSejourDestination = (id: string) => {
    setSejourDestinations((prev) => prev.filter((d) => d.id !== id));
  };

  const addSejourService = (serviceData: Omit<SejourService, "id">) => {
    const newService: SejourService = {
      ...serviceData,
      id: serviceData.label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    };
    setSejourServices((prev) => [...prev, newService]);
  };

  const deleteSejourService = (id: string) => {
    setSejourServices((prev) => prev.filter((s) => s.id !== id));
  };

  const addEVisaCountry = (countryData: Omit<EVisaCountry, "id">) => {
    const newCountry: EVisaCountry = {
      ...countryData,
      id: String(Date.now()),
    };
    setEVisaCountries((prev) => [...prev, newCountry]);
  };

  const deleteEVisaCountry = (id: string) => {
    setEVisaCountries((prev) => prev.filter((c) => c.id !== id));
  };

  const addDossierCountry = (countryData: Omit<DossierCountry, "id">) => {
    const newCountry: DossierCountry = {
      ...countryData,
      id: String(Date.now()),
    };
    setDossierCountries((prev) => [...prev, newCountry]);
  };

  const updateDossierCountry = (id: string, updatedFields: Partial<DossierCountry>) => {
    setDossierCountries((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
  };

  const deleteDossierCountry = (id: string) => {
    setDossierCountries((prev) => prev.filter((c) => c.id !== id));
  };

  const addRequest = (requestData: Omit<ServiceRequest, "id" | "createdAt" | "isRead" | "completed">) => {
    const newRequest: ServiceRequest = {
      ...requestData,
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false,
      completed: false,
    } as ServiceRequest;
    setRequests((prev) => [newRequest, ...prev]);
  };

  const markRequestAsRead = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isRead: true } : r))
    );
  };

  const toggleRequestStatus = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const deleteRequest = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        voyages,
        messages,
        sejourDestinations,
        sejourServices,
        eVisaCountries,
        dossierCountries,
        requests,
        addVoyage,
        updateVoyage,
        deleteVoyage,
        addMessage,
        markMessageAsRead,
        deleteMessage,
        addSejourDestination,
        deleteSejourDestination,
        addSejourService,
        deleteSejourService,
        addEVisaCountry,
        deleteEVisaCountry,
        addDossierCountry,
        updateDossierCountry,
        deleteDossierCountry,
        addRequest,
        markRequestAsRead,
        toggleRequestStatus,
        deleteRequest,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
