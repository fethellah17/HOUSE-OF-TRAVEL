/**
 * SUPABASE INTEGRATION - Complete Implementation Script
 * 
 * This script provides ready-to-use code for connecting the Admin Dashboard
 * and remaining forms to Supabase real-time data.
 */

// =============================================================================
// STEP 1: UPDATE AdminPage.tsx TO FETCH REAL REQUESTS
// =============================================================================

// LOCATION: src/pages/AdminPage.tsx, line ~20 (imports section)
// ADD THESE IMPORTS:

import { 
  fetchBilletterieRequests,
  fetchVisaRequests,
  fetchHotelRequests,
  fetchDevisRequests,
  markRequestAsRead as markRequestAsReadService,
  updateRequestStatus,
  deleteRequest as deleteRequestService
} from "@/lib/formsService";

// LOCATION: src/pages/AdminPage.tsx, after line 50 (state declarations)
// ADD NEW STATE FOR REAL REQUESTS:

const [realRequests, setRealRequests] = useState<any[]>([]);
const [loadingRequests, setLoadingRequests] = useState(false);

// LOCATION: src/pages/AdminPage.tsx, add new useEffect AFTER existing hooks:
// ADD THIS TO LOAD REAL REQUESTS:

useEffect(() => {
  if (!loggedIn) return;
  
  const loadAllRequests = async () => {
    try {
      setLoadingRequests(true);
      
      // Fetch all request types from Supabase
      const [billRequests, visaReqs, hotelReqs, devisReqs] = await Promise.all([
        fetchBilletterieRequests(),
        fetchVisaRequests(),
        fetchHotelRequests(),
        fetchDevisRequests(),
      ]);
      
      // Combine all requests with type information
      const allRequests = [
        ...billRequests.map(r => ({ ...r, serviceType: "billetterie" })),
        ...visaReqs.map(r => ({ ...r, serviceType: "visa" })),
        ...hotelReqs.map(r => ({ ...r, serviceType: "hotel" })),
        ...devisReqs.map(r => ({ ...r, serviceType: "devis" })),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setRealRequests(allRequests);
    } catch (error) {
      console.error("Error loading requests:", error);
      toast.error("Erreur lors du chargement des demandes");
    } finally {
      setLoadingRequests(false);
    }
  };
  
  loadAllRequests();
  
  // Set up real-time subscription (optional - for live updates)
  // This requires setting up Supabase realtime listeners
}, [loggedIn]);

// LOCATION: InboxView component call (around line 229)
// UPDATE PROPS TO USE REAL REQUESTS:

// BEFORE:
{/* <InboxView
  requests={safeRequests}
  markRequestAsRead={markRequestAsRead}
  toggleRequestStatus={toggleRequestStatus}
  deleteRequest={deleteRequest}
/> */}

// AFTER:
<InboxView
  requests={realRequests}
  markRequestAsRead={async (id) => {
    // Find request type
    const req = realRequests.find(r => r.id === id);
    if (req) {
      await markRequestAsReadService(id, req.serviceType);
      // Reload requests
      loadAllRequests();
    }
  }}
  toggleRequestStatus={async (id) => {
    // Find request and toggle status
    const req = realRequests.find(r => r.id === id);
    if (req) {
      const newStatus = req.status === "pending" ? "reviewed" : "pending";
      await updateRequestStatus(id, req.serviceType, newStatus);
      // Reload requests
      loadAllRequests();
    }
  }}
  deleteRequest={async (id) => {
    // Find request type
    const req = realRequests.find(r => r.id === id);
    if (req) {
      await deleteRequestService(id, req.serviceType);
      // Reload requests
      setRealRequests(prev => prev.filter(r => r.id !== id));
    }
  }}
/>

// =============================================================================
// STEP 2: UPDATE DevisPage.tsx - CONNECT HOTEL & SÉJOUR FORMS
// =============================================================================

// LOCATION: src/pages/DevisPage.tsx, line ~1 (imports)
// ADD THESE IMPORTS:

import { 
  submitHotelRequest,
  submitDevisRequest,
  fetchVisaConfigs,
  fetchSejourConfigs
} from "@/lib/formsService";
import { getCurrentUser } from "@/lib/authService";

// LOCATION: src/pages/DevisPage.tsx, around line 70 (state)
// ADD NEW STATE FOR DYNAMIC CONFIGS:

const [visaCountries, setVisaCountries] = useState<any[]>([]);
const [sejourServices, setSejourServices] = useState<any[]>([]);

// LOCATION: src/pages/DevisPage.tsx, add NEW useEffect:
// LOAD DYNAMIC CONFIGS ON MOUNT:

useEffect(() => {
  const loadConfigs = async () => {
    try {
      const [visas, sejours] = await Promise.all([
        fetchVisaConfigs(),
        fetchSejourConfigs(),
      ]);
      setVisaCountries(visas);
      setSejourServices(sejours);
    } catch (error) {
      console.error("Error loading configs:", error);
    }
  };
  
  loadConfigs();
}, []);

// LOCATION: src/pages/DevisPage.tsx, handleSubmit function (~line 315)
// REPLACE HOTEL HANDLING:

if (activeService === "hotel") {
  try {
    const authUser = await getCurrentUser();
    const result = await submitHotelRequest({
      user_id: authUser.success ? authUser.user?.id : undefined,
      nom: personalInfo.nom,
      prenom: personalInfo.prenom,
      email: personalInfo.email,
      phone: personalInfo.telephone,
      hotel_preference: hotelForm.hotelPreference as "specific" | "suggest",
      hotel_name: hotelForm.hotelName,
      hotel_category: hotelForm.hotelCategory,
      city: hotelForm.city,
      check_in_date: hotelForm.dateArrivee,
      check_out_date: hotelForm.dateDepart,
      number_of_rooms: parseInt(hotelForm.nombreChambres) || 1,
      number_of_people: parseInt(hotelForm.nombrePersonnes) || 1,
      room_type: hotelForm.roomType,
      meal_basis: hotelForm.boardBasis,
      special_requests: hotelForm.message,
    });

    if (!result.success) {
      toast.error("Erreur lors de l'envoi");
      setStatus("idle");
      return;
    }
  } catch (error) {
    console.error("Error:", error);
    toast.error("Erreur lors de l'envoi");
    setStatus("idle");
    return;
  }
}

// LOCATION: src/pages/DevisPage.tsx, handleSubmit function (~line 345)
// REPLACE SÉJOUR HANDLING:

else if (activeService === "sejour") {
  try {
    const authUser = await getCurrentUser();
    const result = await submitDevisRequest({
      user_id: authUser.success ? authUser.user?.id : undefined,
      nom: personalInfo.nom,
      prenom: personalInfo.prenom,
      email: personalInfo.email,
      phone: personalInfo.telephone,
      destination: sejourForm.destination,
      visa_needed: false,
      flight_with_without: "Sans vol",
      number_of_adults: 1,
      number_of_children: 0,
      departure_date: sejourForm.dateDepart,
      return_date: sejourForm.dateRetour,
      special_requests: `Services demandés: ${sejourForm.servicesInclus.join(", ")}\nPréférences: ${sejourForm.preferences}`,
    });

    if (!result.success) {
      toast.error("Erreur lors de l'envoi");
      setStatus("idle");
      return;
    }
  } catch (error) {
    console.error("Error:", error);
    toast.error("Erreur lors de l'envoi");
    setStatus("idle");
    return;
  }
}

// UPDATE VISA COUNTRY DROPDOWN:
// FIND: <select value={visaForm.pays} onChange={(e) => setVisaForm(...)}
// REPLACE OPTIONS WITH:

{visaCountries.map((country) => (
  <option key={country.id} value={country.country_name}>
    {country.country_name}
  </option>
))}

// UPDATE SÉJOUR SERVICES CHECKBOXES:
// FIND: Services checkboxes in séjour form
// REPLACE WITH:

{sejourServices.map((service) => (
  <label key={service.id} className="flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      checked={sejourForm.servicesInclus.includes(service.service_name)}
      onChange={(e) => {
        if (e.target.checked) {
          setSejourForm({
            ...sejourForm,
            servicesInclus: [...sejourForm.servicesInclus, service.service_name],
          });
        } else {
          setSejourForm({
            ...sejourForm,
            servicesInclus: sejourForm.servicesInclus.filter(s => s !== service.service_name),
          });
        }
      }}
    />
    <span>{service.service_label}</span>
  </label>
))}

// =============================================================================
// STEP 3: UPDATE VoyageListPage.tsx - FETCH FROM SUPABASE
// =============================================================================

// LOCATION: src/pages/VoyageListPage.tsx (or wherever voyages are listed)
// ADD IMPORT:

import { fetchPublicVoyages } from "@/lib/formsService";

// REPLACE MOCK DATA INITIALIZATION:

// BEFORE:
// const [voyages, setVoyages] = useState([...mockVoyages]);

// AFTER:
const [voyages, setVoyages] = useState<any[]>([]);
const [loadingVoyages, setLoadingVoyages] = useState(true);

useEffect(() => {
  const loadVoyages = async () => {
    try {
      setLoadingVoyages(true);
      const data = await fetchPublicVoyages();
      setVoyages(data);
    } catch (error) {
      console.error("Error loading voyages:", error);
      toast.error("Erreur lors du chargement des voyages");
    } finally {
      setLoadingVoyages(false);
    }
  };

  loadVoyages();
}, []);

// Show loading state while fetching:
if (loadingVoyages) {
  return <LoadingSpinner />;
}

// =============================================================================
// STEP 4: DATA MIGRATION - SEED INITIAL CONFIGS
// =============================================================================

// Run this once to populate visa_configs and sejour_configs tables
// You can run this in the browser console or create a migration script

import { createVisaConfig, createSejourConfig } from "@/lib/formsService";

// SEED VISA CONFIGS:
const visaCountries = [
  {
    country_name: "États-Unis",
    visa_type: "dossier" as const,
    required_documents: ["Passeport", "Photo d'identité", "Formulaire DS-160", "Preuve financière"],
    processing_days: 15,
  },
  {
    country_name: "Canada",
    visa_type: "dossier" as const,
    required_documents: ["Passeport", "Photo d'identité", "Formulaire IMM 0008", "Preuve financière"],
    processing_days: 20,
  },
  {
    country_name: "France",
    visa_type: "dossier" as const,
    required_documents: ["Passeport", "Photo d'identité", "Formulaire court Schengen"],
    processing_days: 7,
  },
  {
    country_name: "Turquie",
    visa_type: "e-visa" as const,
    required_documents: ["Passeport"],
    processing_days: 1,
  },
  {
    country_name: "Égypte",
    visa_type: "e-visa" as const,
    required_documents: ["Passeport"],
    processing_days: 1,
  },
];

// SEED SÉJOUR CONFIGS:
const sejourServices = [
  { service_name: "transport", service_label: "Transport", display_order: 1 },
  { service_name: "accommodation", service_label: "Hébergement", display_order: 2 },
  { service_name: "guided_tours", service_label: "Visites guidées", display_order: 3 },
  { service_name: "meals", service_label: "Repas", display_order: 4 },
  { service_name: "activities", service_label: "Activités", display_order: 5 },
  { service_name: "insurance", service_label: "Assurance voyage", display_order: 6 },
];

// Execute this once:
/*
async function seedConfigs() {
  console.log("Seeding visa configs...");
  for (const country of visaCountries) {
    await createVisaConfig({ ...country, is_active: true });
  }
  
  console.log("Seeding sejour configs...");
  for (const service of sejourServices) {
    await createSejourConfig({ ...service, is_active: true });
  }
  
  console.log("Seeding complete!");
}

seedConfigs();
*/

// =============================================================================
// TESTING & VERIFICATION
// =============================================================================

// After implementing these changes, test:

// 1. Billetterie Form:
//    - Fill form, submit → Check billetterie_requests table

// 2. Visa Form:
//    - Fill form, submit → Check visa_requests table

// 3. Hotel Form:
//    - Fill form, submit → Check hotel_requests table

// 4. Dévis Form:
//    - Fill form, submit → Check devis_requests table

// 5. Admin Inbox:
//    - Login to admin → Check Boîte de Réception shows real data

// 6. Voyages:
//    - Create voyage in admin → Check it appears on public page

// 7. Configs:
//    - Visa countries dropdown shows items
//    - Séjour services checkboxes show items

// =============================================================================
// TROUBLESHOOTING
// =============================================================================

// If forms not submitting:
// - Check browser console for errors
// - Verify user is logged in (check Supabase Auth)
// - Check Supabase table permissions (RLS policies)

// If admin inbox empty:
// - Verify requests exist in Supabase tables
// - Check Supabase project URL and API key
// - Verify RLS policies allow reading

// If configs not loading:
// - Seed the tables first using script above
// - Check Supabase table has data
// - Verify RLS policies allow reading

// Common error: "Supabase not connected"
// Solution: Verify src/lib/supabase.ts has correct URL and API key

// =============================================================================
// ESTIMATED COMPLETION TIME: 30-45 minutes
// =============================================================================
