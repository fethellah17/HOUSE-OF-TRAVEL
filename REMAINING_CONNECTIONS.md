/**
 * REMAINING DATABASE CONNECTIONS - Quick Implementation Guide
 * 
 * Copy-paste ready code snippets for connecting the remaining forms to Supabase
 */

// =============================================================================
// 1. DEVIS PAGE - HOTEL & SÉJOUR FORM SUBMISSIONS
// =============================================================================
// File: src/pages/DevisPage.tsx
// Location: handleSubmit function around line 300-390

// BEFORE FORM SUBMIT, ADD THESE IMPORTS:
import { submitHotelRequest, submitDevisRequest } from "@/lib/formsService";
import { getCurrentUser } from "@/lib/authService";

// INSIDE handleSubmit(), REPLACE the existing hotel/sejour submission blocks:

// FOR HOTEL SUBMISSION (around line 318):
if (activeService === "hotel") {
  try {
    const authUser = await getCurrentUser();
    const userId = authUser.success ? authUser.user?.id : undefined;

    const result = await submitHotelRequest({
      user_id: userId,
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
  } catch (err) {
    console.error("Hotel submit error:", err);
    toast.error("Erreur lors de l'envoi");
    setStatus("idle");
    return;
  }
}

// FOR SÉJOUR SUBMISSION (around line 348):
else if (activeService === "sejour") {
  try {
    const authUser = await getCurrentUser();
    const userId = authUser.success ? authUser.user?.id : undefined;

    // Séjour is submitted as a devis_request with service type indicator
    const result = await submitDevisRequest({
      user_id: userId,
      nom: personalInfo.nom,
      prenom: personalInfo.prenom,
      email: personalInfo.email,
      phone: personalInfo.telephone,
      destination: sejourForm.destination,
      visa_needed: false, // Séjour doesn't typically need visa indicator
      flight_with_without: "Sans vol", // Séjour usually local
      number_of_adults: 1,
      number_of_children: 0,
      departure_date: sejourForm.dateDepart,
      return_date: sejourForm.dateRetour,
      special_requests: `Services: ${sejourForm.servicesInclus.join(", ")}\nPreférences: ${sejourForm.preferences}`,
    });

    if (!result.success) {
      toast.error("Erreur lors de l'envoi");
      setStatus("idle");
      return;
    }
  } catch (err) {
    console.error("Sejour submit error:", err);
    toast.error("Erreur lors de l'envoi");
    setStatus("idle");
    return;
  }
}

// =============================================================================
// 2. ADMIN PAGE - FETCH REAL REQUESTS FROM SUPABASE
// =============================================================================
// File: src/pages/AdminPage.tsx
// Location: Replace admin_inbox localStorage with real data fetch

// ADD IMPORTS:
import { 
  fetchAllRequests, 
  fetchBilletterieRequests,
  fetchVisaRequests,
  fetchHotelRequests,
  fetchDevisRequests,
  markRequestAsRead,
  updateRequestStatus,
  deleteRequest
} from "@/lib/formsService";

// IN InboxView COMPONENT, REPLACE initialization with:
useEffect(() => {
  const loadRequests = async () => {
    try {
      setLoading(true);
      
      // Choose which requests to fetch based on current filter
      let data = [];
      if (currentFilter === "all") {
        data = await fetchAllRequests();
      } else if (currentFilter === "billetterie") {
        data = await fetchBilletterieRequests();
      } else if (currentFilter === "visa") {
        data = await fetchVisaRequests();
      } else if (currentFilter === "hotel") {
        data = await fetchHotelRequests();
      } else if (currentFilter === "devis") {
        data = await fetchDevisRequests();
      }
      
      setRequests(data);
    } catch (error) {
      console.error("Error loading requests:", error);
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };
  
  loadRequests();
}, [currentFilter]);

// REPLACE OLD localStorage read/mark/delete with:
const handleMarkAsRead = async (requestId: string, type: string) => {
  const success = await markRequestAsRead(requestId, type);
  if (success) {
    setRequests(prev => 
      prev.map(r => r.id === requestId ? { ...r, is_read: true } : r)
    );
    toast.success("Marqué comme lu");
  }
};

const handleUpdateStatus = async (requestId: string, type: string, status: string) => {
  const success = await updateRequestStatus(requestId, type, status);
  if (success) {
    setRequests(prev =>
      prev.map(r => r.id === requestId ? { ...r, status } : r)
    );
    toast.success("Statut mis à jour");
  }
};

const handleDeleteRequest = async (requestId: string, type: string) => {
  const success = await deleteRequest(requestId, type);
  if (success) {
    setRequests(prev => prev.filter(r => r.id !== requestId));
    toast.success("Demande supprimée");
  }
};

// =============================================================================
// 3. VOYAGES ADMIN - CONNECT FORM SUBMISSION
// =============================================================================
// File: (check Admin dashboard for voyage creation form)
// Location: handleSubmit for new voyage

// ADD IMPORTS:
import { createVoyage, fetchPublicVoyages } from "@/lib/formsService";

// IN VOYAGE FORM SUBMIT:
const handleCreateVoyage = async (voyageData) => {
  try {
    const authUser = await getCurrentUser();
    
    const result = await createVoyage({
      title: voyageData.title,
      description: voyageData.description,
      category: voyageData.category, // "Omrah" | "Voyage Organisé" | etc
      price: parseFloat(voyageData.price),
      duration: voyageData.duration,
      start_date: voyageData.start_date,
      end_date: voyageData.end_date,
      max_capacity: parseInt(voyageData.max_capacity) || 0,
      image_url: voyageData.image_url,
      created_by: authUser.user?.id, // Admin user ID
    });

    if (result.success) {
      toast.success("Voyage créé avec succès!");
      // Refresh voyage list
      const voyages = await fetchPublicVoyages();
      setVoyages(voyages);
    } else {
      toast.error("Erreur lors de la création");
    }
  } catch (error) {
    console.error("Error creating voyage:", error);
    toast.error("Erreur lors de la création");
  }
};

// =============================================================================
// 4. DYNAMIC CONFIGS - LOAD ON PAGE LOAD
// =============================================================================
// File: src/pages/DevisPage.tsx
// Location: useEffect on component mount

// ADD IMPORTS:
import { fetchVisaConfigs, fetchSejourConfigs } from "@/lib/formsService";

// INSIDE useEffect, ADD AFTER checking login:
useEffect(() => {
  const loadConfigs = async () => {
    try {
      // Load visa countries for visa assistant
      const visaCountries = await fetchVisaConfigs();
      // Store in state or use directly in visa section
      
      // Load séjour services
      const sejourServices = await fetchSejourConfigs();
      // Store in state or use directly in service checkboxes
    } catch (error) {
      console.error("Error loading configs:", error);
    }
  };
  
  loadConfigs();
}, []);

// REPLACE HARDCODED arrays with fetched data in JSX:
// OLD: const eVisaCountries = [...hardcoded list...]
// NEW: const [eVisaCountries, setEVisaCountries] = useState([]);

// In visa section:
<select value={visaForm.pays}>
  {eVisaCountries.map(country => (
    <option key={country.id} value={country.country_name}>
      {country.country_name}
    </option>
  ))}
</select>

// In séjour section (for checkbox services):
{sejourServices.map(service => (
  <label key={service.id}>
    <input
      type="checkbox"
      checked={sejourForm.servicesInclus.includes(service.service_name)}
      onChange={(e) => {
        if (e.target.checked) {
          setSejourForm({
            ...sejourForm,
            servicesInclus: [...sejourForm.servicesInclus, service.service_name]
          });
        } else {
          setSejourForm({
            ...sejourForm,
            servicesInclus: sejourForm.servicesInclus.filter(s => s !== service.service_name)
          });
        }
      }}
    />
    {service.service_label}
  </label>
))}

// =============================================================================
// 5. PUBLIC VOYAGE LIST - FETCH FROM SUPABASE
// =============================================================================
// File: src/pages/VoyageListPage.tsx (or similar)
// Location: useEffect on component mount

// ADD IMPORTS:
import { fetchPublicVoyages } from "@/lib/formsService";

// REPLACE:
const [voyages, setVoyages] = useState([...MOCK_VOYAGES]); // Old mock data

// WITH:
useEffect(() => {
  const loadVoyages = async () => {
    try {
      const data = await fetchPublicVoyages();
      setVoyages(data);
    } catch (error) {
      console.error("Error loading voyages:", error);
    }
  };
  
  loadVoyages();
}, []);

// =============================================================================
// IMPLEMENTATION ORDER (Recommended)
// =============================================================================
// 1. Hotel & Séjour forms in DevisPage ✓ Priority
// 2. Admin InboxView real data fetch ✓ Priority
// 3. Voyage list public page fetch
// 4. Voyage admin creation form
// 5. Dynamic config UI in DevisPage
// 6. Admin dashboard config management
