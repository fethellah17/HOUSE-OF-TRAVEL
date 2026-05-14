import { supabase } from "@/lib/supabase";
import {
  CreateDevisRequest,
  CreateBilletterieRequest,
  CreateVisaRequest,
  CreateHotelRequest,
  PaginationParams,
} from "@/types/database";
import { getPaginationParams } from "@/lib/database";

// ============================================
// DEVIS REQUESTS
// ============================================

export async function createDevisRequest(
  userId: string | undefined,
  request: CreateDevisRequest
) {
  try {
    const { data, error } = await supabase
      .from("devis_requests")
      .insert([
        {
          user_id: userId || null,
          nom: request.nom,
          prenom: request.prenom,
          email: request.email,
          phone: request.phone,
          destination: request.destination,
          voyage_id: request.voyageId || null,
          visa_needed: request.visaNeeded,
          flight_with_without: request.flightWithWithout,
          hotel_name: request.hotelName,
          hotel_stars: request.hotelStars,
          number_of_rooms: request.numberOfRooms,
          room_type: request.roomType,
          meal_plan: request.mealPlan,
          number_of_adults: request.numberOfAdults,
          number_of_children: request.numberOfChildren,
          children_ages: request.childrenAges,
          departure_date: request.departureDate,
          return_date: request.returnDate,
          special_requests: request.specialRequests,
          status: "pending",
          is_read: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, request: data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserDevisRequests(userId: string, params?: PaginationParams) {
  try {
    const { skip, take } = getPaginationParams(params || {});

    const { data, count, error } = await supabase
      .from("devis_requests")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(skip, skip + take - 1);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, requests: data, total: count || 0 };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================
// BILLETTERIE REQUESTS
// ============================================

export async function createBilletterieRequest(
  userId: string | undefined,
  request: CreateBilletterieRequest
) {
  try {
    const { data, error } = await supabase
      .from("billetterie_requests")
      .insert([
        {
          user_id: userId || null,
          nom: request.nom,
          prenom: request.prenom,
          email: request.email,
          phone: request.phone,
          destination: request.destination,
          departure_city: request.departureCity,
          arrival_city: request.arrivalCity,
          airline_preference: request.airlinePreference,
          visa_needed: request.visaNeeded,
          number_of_adults: request.numberOfAdults,
          number_of_children: request.numberOfChildren,
          number_of_babies: request.numberOfBabies,
          children_ages: request.childrenAges,
          departure_date: request.departureDate,
          return_date: request.returnDate,
          special_requests: request.specialRequests,
          status: "pending",
          is_read: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, request: data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserBilletterieRequests(
  userId: string,
  params?: PaginationParams
) {
  try {
    const { skip, take } = getPaginationParams(params || {});

    const { data, count, error } = await supabase
      .from("billetterie_requests")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(skip, skip + take - 1);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, requests: data, total: count || 0 };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================
// VISA REQUESTS
// ============================================

export async function createVisaRequest(
  userId: string | undefined,
  request: CreateVisaRequest
) {
  try {
    const { data, error } = await supabase
      .from("visa_requests")
      .insert([
        {
          user_id: userId || null,
          nom: request.nom,
          prenom: request.prenom,
          email: request.email,
          phone: request.phone,
          visa_type: request.visaType,
          destination_country: request.destinationCountry,
          passport_number: request.passportNumber,
          passport_expiry: request.passportExpiry,
          travel_date: request.travelDate,
          professional_status: request.professionalStatus,
          guarantor_status: request.guarantorStatus,
          special_requests: request.specialRequests,
          status: "pending",
          is_read: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, request: data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserVisaRequests(userId: string, params?: PaginationParams) {
  try {
    const { skip, take } = getPaginationParams(params || {});

    const { data, count, error } = await supabase
      .from("visa_requests")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(skip, skip + take - 1);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, requests: data, total: count || 0 };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================
// HOTEL REQUESTS
// ============================================

export async function createHotelRequest(
  userId: string | undefined,
  request: CreateHotelRequest
) {
  try {
    const { data, error } = await supabase
      .from("hotel_requests")
      .insert([
        {
          user_id: userId || null,
          nom: request.nom,
          prenom: request.prenom,
          email: request.email,
          phone: request.phone,
          hotel_preference: request.hotelPreference,
          hotel_name: request.hotelName,
          hotel_category: request.hotelCategory,
          city: request.city,
          check_in_date: request.checkInDate,
          check_out_date: request.checkOutDate,
          number_of_rooms: request.numberOfRooms,
          number_of_people: request.numberOfPeople,
          room_type: request.roomType,
          meal_basis: request.mealBasis,
          special_requests: request.specialRequests,
          status: "pending",
          is_read: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, request: data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserHotelRequests(userId: string, params?: PaginationParams) {
  try {
    const { skip, take } = getPaginationParams(params || {});

    const { data, count, error } = await supabase
      .from("hotel_requests")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(skip, skip + take - 1);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, requests: data, total: count || 0 };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================
// ADMIN REQUEST MANAGEMENT
// ============================================

export async function getAllDevisRequests(status?: string, params?: PaginationParams) {
  try {
    const { skip, take } = getPaginationParams(params || {});

    let query = supabase
      .from("devis_requests")
      .select("*", { count: "exact" });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(skip, skip + take - 1);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, requests: data, total: count || 0 };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateRequestStatus(
  table: string,
  requestId: string,
  status: string,
  assignedTo?: string
) {
  try {
    const updates: any = {
      status: status,
      updated_at: new Date().toISOString(),
    };

    if (assignedTo) {
      updates.assigned_to = assignedTo;
    }

    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq("id", requestId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, request: data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function markRequestAsRead(table: string, requestId: string) {
  try {
    const { data, error } = await supabase
      .from(table)
      .update({
        is_read: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, request: data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
