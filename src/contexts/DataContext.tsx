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

// ============================================================================
// GOLD MASTER PRESENTATION DATA (VOLATILE - RESETS ON REFRESH)
// ============================================================================
// These states are for demonstration purposes only. Changes made during the
// session will NOT persist to localStorage. On page refresh, they revert to
// these hardcoded "Gold Master" values.
// ============================================================================

// GOLD MASTER: Presentation Requests (Boîte de Réception)
const GOLD_MASTER_REQUESTS: ServiceRequest[] = [
  {
    id: "demo-bill-001",
    serviceType: "billetterie",
    createdAt: "2026-05-06T10:30:00.000Z",
    isRead: false,
    completed: false,
    personalInfo: {
      nom: "Benali",
      prenom: "Karim",
      email: "karim.benali@email.dz",
      telephone: "+213 555 123 456"
    },
    tripType: "Aller-retour",
    destination: "Paris, France",
    dateDepart: "2026-06-15",
    dateRetour: "2026-06-25",
    nombreAdultes: "2",
    nombreEnfants: "1",
    ageEnfants: "8 ans",
    compagnie: "Air France",
    besoinVisa: "Oui",
    message: "Nous préférons un vol direct si possible. Merci."
  },
  {
    id: "demo-visa-001",
    serviceType: "visa",
    createdAt: "2026-05-05T14:20:00.000Z",
    isRead: true,
    completed: false,
    personalInfo: {
      nom: "Mansouri",
      prenom: "Amina",
      email: "amina.mansouri@email.dz",
      telephone: "+213 666 789 012"
    },
    visaType: "e-visa",
    pays: "Turquie",
    dateVoyage: "2026-07-10",
    passeportValide: true,
    situationPro: "Employée",
    message: "Besoin urgent pour voyage d'affaires."
  },
  {
    id: "demo-hotel-001",
    serviceType: "hotel",
    createdAt: "2026-05-04T09:15:00.000Z",
    isRead: true,
    completed: true,
    personalInfo: {
      nom: "Khelifi",
      prenom: "Yacine",
      email: "yacine.khelifi@email.dz",
      telephone: "+213 777 345 678"
    },
    hotelPreference: "suggest",
    hotelCategory: "4 étoiles",
    city: "Istanbul",
    dateArrivee: "2026-08-01",
    dateDepart: "2026-08-07",
    nombreChambres: "1",
    nombrePersonnes: "2",
    roomType: "Double",
    boardBasis: "Petit-déjeuner inclus",
    message: "Proche des sites touristiques si possible."
  },
  {
    id: "demo-sejour-001",
    serviceType: "sejour",
    createdAt: "2026-05-03T16:45:00.000Z",
    isRead: false,
    completed: false,
    personalInfo: {
      nom: "Boudiaf",
      prenom: "Leila",
      email: "leila.boudiaf@email.dz",
      telephone: "+213 555 987 654"
    },
    destination: "Dubai, Émirats Arabes Unis",
    typeVoyage: "Lune de miel",
    budget: "350000",
    dateDepart: "2026-09-15",
    dateRetour: "2026-09-22",
    servicesInclus: ["Billet d'avion", "Transfert Aéroport", "Guide touristique"],
    preferences: "Hôtel 5 étoiles avec vue sur mer. Activités romantiques incluses."
  }
];

// GOLD MASTER: Séjour Destinations
const GOLD_MASTER_DESTINATIONS: SejourDestination[] = [
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

// GOLD MASTER: E-Visa Countries
const GOLD_MASTER_EVISA_COUNTRIES: EVisaCountry[] = [
  { id: "1", name: "Turquie" },
  { id: "2", name: "Émirats Arabes Unis" },
  { id: "3", name: "Arabie Saoudite" },
  { id: "4", name: "Égypte" },
  { id: "5", name: "Inde" },
];

// ============================================================================
// PERSISTENT DATA (SAVED TO LOCALSTORAGE)
// ============================================================================
// These states persist across page refreshes via localStorage
// ============================================================================

const defaultServices: SejourService[] = [
  { id: "billet-avion", label: "Billet d'avion" },
  { id: "transfert", label: "Transfert Aéroport" },
  { id: "guide", label: "Guide touristique" },
  { id: "location-voiture", label: "Location de voiture" },
  { id: "activites", label: "Activités & Excursions" },
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
  // ============================================================================
  // VOLATILE PRESENTATION STATE (NO LOCALSTORAGE PERSISTENCE)
  // ============================================================================
  // These states reset to Gold Master values on every page refresh
  const [requests, setRequests] = useState<ServiceRequest[]>(GOLD_MASTER_REQUESTS);
  const [sejourDestinations, setSejourDestinations] = useState<SejourDestination[]>(GOLD_MASTER_DESTINATIONS);
  const [eVisaCountries, setEVisaCountries] = useState<EVisaCountry[]>(GOLD_MASTER_EVISA_COUNTRIES);

  // ============================================================================
  // PERSISTENT STATE (LOCALSTORAGE ENABLED)
  // ============================================================================
  const [voyages, setVoyages] = useState<Voyage[]>(mockVoyages);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [sejourServices, setSejourServices] = useState<SejourService[]>(defaultServices);
  const [dossierCountries, setDossierCountries] = useState<DossierCountry[]>(defaultDossierCountries);

  // ============================================================================
  // LOAD PERSISTENT DATA FROM LOCALSTORAGE (ON MOUNT)
  // ============================================================================
  useEffect(() => {
    try {
      // Check data version for schema migration
      const savedVersion = localStorage.getItem("dataVersion");
      
      if (savedVersion !== DATA_VERSION) {
        console.log("Data schema version mismatch. Migrating to new version...");
        // Clear old volatile data
        localStorage.removeItem("requests");
        localStorage.removeItem("sejourDestinations");
        localStorage.removeItem("eVisaCountries");
        localStorage.removeItem("messages");
        localStorage.removeItem("admin_inbox");
        localStorage.setItem("dataVersion", DATA_VERSION);
      }

      // Load messages (legacy - persistent for now)
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
      
      // Load sejour services (persistent)
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
      
      // Load Dossier countries with validation (persistent)
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
      setSejourServices(defaultServices);
      setDossierCountries(defaultDossierCountries);
    }
  }, []);

  // ============================================================================
  // SAVE PERSISTENT DATA TO LOCALSTORAGE
  // ============================================================================
  // NOTE: Volatile states (requests, sejourDestinations, eVisaCountries) are
  // intentionally NOT saved to localStorage. They reset on page refresh.
  
  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);
  
  useEffect(() => {
    localStorage.setItem("sejourServices", JSON.stringify(sejourServices));
  }, [sejourServices]);
  
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
