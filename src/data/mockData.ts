import { Voyage, Message } from "@/types";

// ============================================================================
// MOCK DATA REMOVED - ALL VOYAGES NOW COME FROM SUPABASE DATABASE
// ============================================================================
// The 3 legacy mock trips (Sharm El-Sheikh, Égypte, Istanbul) have been
// permanently removed. The application now relies exclusively on dynamic
// data fetched from Supabase.
// ============================================================================
export const mockVoyages: Voyage[] = [];

export const mockMessages: Message[] = [
  {
    id: "1",
    type: "Devis",
    name: "Ahmed Benali",
    email: "ahmed.benali@email.com",
    phone: "+33 6 12 34 56 78",
    subject: "DEVIS GRATUIT - Omrah Ramadan 2025",
    content: "Nous souhaitons une expérience premium avec guide francophone et repas halal.",
    isRead: false,
    createdAt: "2024-11-20T14:30:00Z",
    devisDetails: {
      prenom: "Ahmed",
      destination: "La Mecque",
      besoinVisa: "Non",
      volAvecSans: "Avec vol",
      nomHotel: "Hilton Makkah Convention",
      nombreEtoiles: "5 étoiles",
      nombreChambres: "2",
      typeChambre: "Double",
      pension: "Pension complète",
      nombreAdultes: "2",
      nombreEnfants: "2",
      ageEnfants: "8 ans, 12 ans",
      dateDepart: "2025-03-01",
      dateRetour: "2025-03-14",
    },
  },
  {
    id: "2",
    type: "Billetterie",
    name: "Fatima Zahra",
    email: "fatima.z@email.com",
    phone: "+33 7 98 76 54 32",
    subject: "BILLETTERIE - Istanbul",
    content: "Je cherche un billet aller-retour Paris-Istanbul pour le 15 avril. Classe économique, 1 adulte.",
    isRead: false,
    createdAt: "2024-11-19T10:15:00Z",
    billeterieDetails: {
      prenom: "Zahra",
      destination: "Istanbul",
      besoinVisa: "Non",
      nombreAdultes: "1",
      nombreEnfants: "0",
      ageEnfants: "",
      dateDepart: "2025-04-15",
      dateRetour: "2025-04-22",
    },
  },
  {
    id: "3",
    type: "Devis",
    name: "Karim Hadj",
    email: "k.hadj@email.com",
    phone: "+33 6 55 44 33 22",
    subject: "DEVIS GRATUIT - Voyage à la Carte - Jordanie",
    content: "Nous cherchons un voyage complet avec visite de Petra et Wadi Rum.",
    isRead: true,
    createdAt: "2024-11-18T09:00:00Z",
    devisDetails: {
      prenom: "Karim",
      destination: "Jordanie",
      besoinVisa: "Oui",
      volAvecSans: "Avec vol",
      nomHotel: "Amman Marriott",
      nombreEtoiles: "4 étoiles",
      nombreChambres: "3",
      typeChambre: "Double",
      pension: "Demi-pension",
      nombreAdultes: "4",
      nombreEnfants: "2",
      ageEnfants: "6 ans, 10 ans",
      dateDepart: "2025-09-01",
      dateRetour: "2025-09-08",
    },
  },
];
