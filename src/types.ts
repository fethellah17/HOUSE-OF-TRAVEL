export type VoyageCategory = 'Omrah' | 'Voyage Organisé' | 'Voyage à la Carte' | 'Voyage National';
export type VoyageStatus = 'normal' | 'almost-full' | 'full' | 'limited-offer';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
}

export interface Stage {
  id: string;
  name: string;
  hotelName: string;
  googleMapsUrl: string;
  days: number;
  icon?: 'kaaba' | 'dome' | 'default';
}

export interface Voyage {
  id: string;
  title: string;
  imageUrl: string;
  imageUrls?: string[];
  price: number; // Starting price (À partir de)
  description: string;
  category: VoyageCategory;
  duration: string;
  date: string;
  createdAt: string;
  stages?: Stage[];
  status?: VoyageStatus;
  features?: string[]; // Points Forts du voyage (ex: "Vol Direct", "Hôtel 4*", "All Inclusive")
  points_forts?: string; // Points Forts stored in database as comma-separated string or raw text
  // Champs de contrôle Admin pour Omrah et Voyage Organisé
  flightType?: string; // Type de vol (ex: "Avec vol", "Sans vol", "")
  visaRequired?: string; // Besoin VISA (ex: "Oui", "Non", "")
  roomType?: string; // Type de chambre (ex: "Double", "Triple", "")
  mealPlan?: string; // Pension (ex: "Pension complète", "Demi-pension", "")
}

export type MessageType = 'Billetterie' | 'Devis';

export interface Message {
  id: string;
  type: MessageType;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  // Champs spécifiques pour les devis
  devisDetails?: {
    prenom?: string;
    destination?: string;
    besoinVisa?: string;
    volAvecSans?: string;
    nomHotel?: string;
    nombreEtoiles?: string;
    nombreChambres?: string;
    typeChambre?: string;
    pension?: string;
    nombreAdultes?: string;
    nombreEnfants?: string;
    ageEnfants?: string;
    dateDepart?: string;
    dateRetour?: string;
    stages?: Array<{
      name: string;
      hotelName: string;
      googleMapsUrl: string;
      days: number;
    }>;
  };
  // Champs spécifiques pour la billetterie
  billeterieDetails?: {
    prenom?: string;
    destination?: string;
    besoinVisa?: string;
    compagnie?: string;
    nombreAdultes?: string;
    nombreEnfants?: string;
    ageEnfants?: string;
    dateDepart?: string;
    dateRetour?: string;
  };
}
