/**
 * Forms Service - Handle all form submissions and dynamic configurations
 * Connects UI forms to Supabase database tables
 */

import { supabase } from "./supabase";

// ============================================================================
// DYNAMIC CONFIGURATION - VISA & SÉJOUR
// ============================================================================

export interface VisaConfig {
  id: string;
  country_name: string;
  visa_type: "e-visa" | "dossier" | "both";
  required_documents: string[];
  processing_days: number;
  is_active: boolean;
}

export interface SejourConfig {
  id: string;
  service_name: string;
  service_label: string;
  description?: string;
  icon?: string;
  is_active: boolean;
  display_order: number;
}

/**
 * Fetch all active visa configurations for the Visa Assistant
 */
export const fetchVisaConfigs = async (): Promise<VisaConfig[]> => {
  try {
    const { data, error } = await supabase
      .from("visa_configs")
      .select("*")
      .eq("is_active", true)
      .order("country_name", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Error fetching visa configs:", err);
    return [];
  }
};

/**
 * Create a new visa configuration (Admin only)
 */
export const createVisaConfig = async (config: Omit<VisaConfig, "id">): Promise<VisaConfig | null> => {
  try {
    const { data, error } = await supabase
      .from("visa_configs")
      .insert([config])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error creating visa config:", err);
    return null;
  }
};

/**
 * Delete a visa configuration (Admin only)
 */
export const deleteVisaConfig = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("visa_configs")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error deleting visa config:", err);
    return false;
  }
};

/**
 * Fetch all active séjour service configurations
 */
export const fetchSejourConfigs = async (): Promise<SejourConfig[]> => {
  try {
    const { data, error } = await supabase
      .from("sejour_configs")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Error fetching sejour configs:", err);
    return [];
  }
};

/**
 * Create a new séjour service configuration (Admin only)
 */
export const createSejourConfig = async (config: Omit<SejourConfig, "id">): Promise<SejourConfig | null> => {
  try {
    const { data, error } = await supabase
      .from("sejour_configs")
      .insert([config])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error creating sejour config:", err);
    return null;
  }
};

/**
 * Delete a séjour service configuration (Admin only)
 */
export const deleteSejourConfig = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("sejour_configs")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error deleting sejour config:", err);
    return false;
  }
};

// ============================================================================
// FORM SUBMISSIONS
// ============================================================================

export interface BilletterieRequestInput {
  user_id?: string;
  nom: string;
  prenom: string;
  email: string;
  phone: string;
  departure_city: string;
  arrival_city: string;
  airline_preference?: string;
  visa_needed: boolean;
  number_of_adults: number;
  number_of_children: number;
  number_of_babies: number;
  children_age?: string;
  babies_age?: string;
  departure_date: string;
  return_date?: string;

  special_requests?: string;
}

/**
 * Submit a Billetterie (flight booking) request
 */
export const submitBilletterieRequest = async (data: BilletterieRequestInput) => {
  try {
    // Ensure ages are strings, not arrays
    const childrenAgeStr = typeof data.children_age === "string" ? data.children_age : String(data.children_age || "");
    const babiesAgeStr = typeof data.babies_age === "string" ? data.babies_age : String(data.babies_age || "");

    // Build payload with ONLY columns that exist in billetterie_requests table
    const payload = {
      user_id: data.user_id || null,
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      phone: data.phone,
      departure_city: data.departure_city,
      arrival_city: data.arrival_city,
      departure_date: data.departure_date,
      return_date: data.return_date || null,
      number_of_adults: data.number_of_adults,
      number_of_children: data.number_of_children,
      number_of_babies: data.number_of_babies,
      children_age: childrenAgeStr || null,
      babies_age: babiesAgeStr || null,
      airline_preference: data.airline_preference || null,
      visa_needed: data.visa_needed,
      special_requests: data.special_requests || null,
      status: "pending",
      is_read: false,
    };

    console.log("📤 Billetterie Payload:", payload);
    console.log("✈️ Airline preference:", data.airline_preference);
    console.log("👧 Children ages:", childrenAgeStr);
    console.log("👶 Babies ages:", babiesAgeStr);

    const { data: result, error } = await supabase
      .from("billetterie_requests")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase Error Details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw error;
    }

    console.log("✅ Billetterie request submitted successfully:", result);
    return { success: true, data: result };
  } catch (err: any) {
    console.error("❌ Error submitting billetterie request:", err);
    console.error("Error message:", err.message);
    console.error("Error details:", err.details);
    return { success: false, error: err };
  }
};

export interface VisaRequestInput {
  user_id?: string;
  nom: string;
  prenom: string;
  email: string;
  phone: string;
  visa_type: "e-visa" | "dossier";
  destination_country: string;
  passport_number: string;
  passport_expiry: string;
  travel_date: string;
  professional_status?: string;
  guarantor_status?: string;
  special_requests?: string;
}

/**
 * Submit a Visa Assistant request
 */
export const submitVisaRequest = async (data: VisaRequestInput) => {
  try {
    const { data: result, error } = await supabase
      .from("visa_requests")
      .insert([
        {
          user_id: data.user_id || null,
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          phone: data.phone,
          visa_type: data.visa_type,
          destination_country: data.destination_country,
          passport_number: data.passport_number,
          passport_expiry: data.passport_expiry,
          travel_date: data.travel_date,
          professional_status: data.professional_status,
          guarantor_status: data.guarantor_status,
          special_requests: data.special_requests,
          status: "pending",
          is_read: false,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: result };
  } catch (err) {
    console.error("Error submitting visa request:", err);
    return { success: false, error: err };
  }
};

export interface HotelRequestInput {
  user_id?: string;
  nom: string;
  prenom: string;
  email: string;
  phone: string;
  hotel_preference: "specific" | "suggest";
  hotel_name?: string;
  hotel_category?: string;
  city: string;
  check_in_date: string;
  check_out_date: string;
  number_of_rooms: number;
  number_of_people: number;
  room_type?: string;
  meal_basis?: string;
  special_requests?: string;
}

/**
 * Submit a Hotel Reservation request
 */
export const submitHotelRequest = async (data: HotelRequestInput) => {
  try {
    const { data: result, error } = await supabase
      .from("hotel_requests")
      .insert([
        {
          user_id: data.user_id || null,
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          phone: data.phone,
          hotel_preference: data.hotel_preference,
          hotel_name: data.hotel_name,
          hotel_category: data.hotel_category,
          city: data.city,
          check_in_date: data.check_in_date,
          check_out_date: data.check_out_date,
          number_of_rooms: data.number_of_rooms,
          number_of_people: data.number_of_people,
          room_type: data.room_type,
          meal_basis: data.meal_basis,
          special_requests: data.special_requests,
          status: "pending",
          is_read: false,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: result };
  } catch (err) {
    console.error("Error submitting hotel request:", err);
    return { success: false, error: err };
  }
};

export interface DevisRequestInput {
  user_id?: string;
  nom: string;
  prenom: string;
  email: string;
  phone: string;
  destination: string;
  visa_needed: boolean;
  flight_with_without: string;
  hotel_name?: string;
  hotel_stars?: number;
  number_of_rooms: number;
  room_type?: string;
  meal_plan?: string;
  number_of_adults: number;
  number_of_children: number;
  children_age?: string;
  departure_date: string;
  return_date: string;
  special_requests?: string;
}

/**
 * Submit a Devis (Quote) request - covers Omrah, Voyage Organisé, Séjour
 */
export const submitDevisRequest = async (data: DevisRequestInput) => {
  try {
    const { data: result, error } = await supabase
      .from("devis_requests")
      .insert([
        {
          user_id: data.user_id || null,
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          phone: data.phone,
          destination: data.destination,
          visa_needed: data.visa_needed,
          flight_with_without: data.flight_with_without,
          hotel_name: data.hotel_name,
          hotel_stars: data.hotel_stars,
          number_of_rooms: data.number_of_rooms,
          room_type: data.room_type,
          meal_plan: data.meal_plan,
          number_of_adults: data.number_of_adults,
          number_of_children: data.number_of_children,
          children_age: data.children_age,
          departure_date: data.departure_date,
          return_date: data.return_date,
          special_requests: data.special_requests,
          status: "pending",
          is_read: false,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: result };
  } catch (err) {
    console.error("Error submitting devis request:", err);
    return { success: false, error: err };
  }
};

// ============================================================================
// ADMIN INBOX - FETCH REQUESTS
// ============================================================================

/**
 * Fetch all requests (all types) for admin inbox
 * Optional: filter by type or status
 */
export const fetchAllRequests = async (type?: string, status?: string) => {
  try {
    let query = supabase.from("billetterie_requests").select("*, 'billetterie' as type");

    if (type === "billetterie") {
      return fetchBilletterieRequests(status);
    } else if (type === "visa") {
      return fetchVisaRequests(status);
    } else if (type === "hotel") {
      return fetchHotelRequests(status);
    } else if (type === "devis") {
      return fetchDevisRequests(status);
    }

    // Return all if no type specified
    const results = await Promise.all([
      fetchBilletterieRequests(status),
      fetchVisaRequests(status),
      fetchHotelRequests(status),
      fetchDevisRequests(status),
    ]);

    return results.flat();
  } catch (err) {
    console.error("Error fetching all requests:", err);
    return [];
  }
};

export const fetchBilletterieRequests = async (status?: string) => {
  try {
    let query = supabase.from("billetterie_requests").select("*").order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data?.map((req) => ({ ...req, type: "billetterie" })) || [];
  } catch (err) {
    console.error("Error fetching billetterie requests:", err);
    return [];
  }
};

export const fetchVisaRequests = async (status?: string) => {
  try {
    let query = supabase.from("visa_requests").select("*").order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data?.map((req) => ({ ...req, type: "visa" })) || [];
  } catch (err) {
    console.error("Error fetching visa requests:", err);
    return [];
  }
};

export const fetchHotelRequests = async (status?: string) => {
  try {
    let query = supabase.from("hotel_requests").select("*").order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data?.map((req) => ({ ...req, type: "hotel" })) || [];
  } catch (err) {
    console.error("Error fetching hotel requests:", err);
    return [];
  }
};

export const fetchDevisRequests = async (status?: string) => {
  try {
    let query = supabase.from("devis_requests").select("*").order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data?.map((req) => ({ ...req, type: "devis" })) || [];
  } catch (err) {
    console.error("Error fetching devis requests:", err);
    return [];
  }
};

/**
 * Mark a request as read
 */
export const markRequestAsRead = async (id: string, type: string): Promise<boolean> => {
  try {
    const table = `${type}_requests`;
    const { error } = await supabase.from(table).update({ is_read: true }).eq("id", id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error marking request as read:", err);
    return false;
  }
};

/**
 * Update request status
 */
export const updateRequestStatus = async (id: string, type: string, status: string): Promise<boolean> => {
  try {
    const table = `${type}_requests`;
    const { error } = await supabase.from(table).update({ status }).eq("id", id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error updating request status:", err);
    return false;
  }
};

/**
 * Delete a request
 */
export const deleteRequest = async (id: string, type: string): Promise<boolean> => {
  try {
    const table = `${type}_requests`;
    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error deleting request:", err);
    return false;
  }
};

// ============================================================================
// VOYAGES - PUBLIC PAGE & ADMIN
// ============================================================================

export interface VoyageInput {
  title: string;
  description: string;
  category: "Omrah" | "Voyage Organisé" | "Voyage à la Carte" | "Voyage National";
  price: number;
  duration: string;
  start_date: string;
  end_date: string;
  max_capacity: number;
  image_url?: string;
  created_by?: string;
}

/**
 * Fetch all active voyages for public display
 */
export const fetchPublicVoyages = async () => {
  try {
    const { data, error } = await supabase
      .from("voyages")
      .select("*")
      .eq("status", "normal")
      .order("start_date", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Error fetching public voyages:", err);
    return [];
  }
};

/**
 * Fetch all voyages (admin view)
 */
export const fetchAllVoyages = async () => {
  try {
    const { data, error } = await supabase.from("voyages").select("*").order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Error fetching all voyages:", err);
    return [];
  }
};

/**
 * Create a new voyage
 */
export const createVoyage = async (voyage: VoyageInput) => {
  try {
    const { data, error } = await supabase
      .from("voyages")
      .insert([
        {
          ...voyage,
          status: "normal",
          current_bookings: 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error("Error creating voyage:", err);
    return { success: false, error: err };
  }
};

/**
 * Update a voyage
 */
export const updateVoyage = async (id: string, updates: Partial<VoyageInput>) => {
  try {
    const { data, error } = await supabase.from("voyages").update(updates).eq("id", id).select().single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error("Error updating voyage:", err);
    return { success: false, error: err };
  }
};

/**
 * Delete a voyage
 */
export const deleteVoyage = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from("voyages").delete().eq("id", id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error deleting voyage:", err);
    return false;
  }
};

/**
 * Get a single voyage with all details (stages, features, details)
 */
export const fetchVoyageWithDetails = async (id: string) => {
  try {
    const { data: voyage, error: voyageError } = await supabase
      .from("voyages")
      .select("*")
      .eq("id", id)
      .single();

    if (voyageError) throw voyageError;

    const { data: stages, error: stagesError } = await supabase
      .from("voyage_stages")
      .select("*")
      .eq("voyage_id", id)
      .order("stage_number", { ascending: true });

    if (stagesError) throw stagesError;

    const { data: features, error: featuresError } = await supabase
      .from("voyage_features")
      .select("feature")
      .eq("voyage_id", id);

    if (featuresError) throw featuresError;

    const { data: details, error: detailsError } = await supabase
      .from("voyage_details")
      .select("*")
      .eq("voyage_id", id)
      .single();

    if (detailsError && detailsError.code !== "PGRST116") throw detailsError;

    return {
      ...voyage,
      stages: stages || [],
      features: features?.map((f) => f.feature) || [],
      details: details || null,
    };
  } catch (err) {
    console.error("Error fetching voyage with details:", err);
    return null;
  }
};
