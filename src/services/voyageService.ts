import { supabase } from "@/lib/supabase";
import { IVoyage, PaginationParams, VoyageCategoryEnum } from "@/types/database";
import { getPaginationParams } from "@/lib/database";

/**
 * Get all voyages with optional filtering
 */
export async function getAllVoyages(
  params?: PaginationParams & {
    category?: VoyageCategoryEnum;
    status?: string;
    search?: string;
  }
) {
  try {
    const { skip, take } = getPaginationParams(params || {});

    let query = supabase
      .from("voyages")
      .select(
        `
        *,
        stages:voyage_stages(*),
        features:voyage_features(*),
        details:voyage_details(*)
      `,
        { count: "exact" }
      );

    if (params?.category) {
      query = query.eq("category", params.category);
    }

    if (params?.status) {
      query = query.eq("status", params.status);
    }

    if (params?.search) {
      query = query.or(
        `title.ilike.%${params.search}%,description.ilike.%${params.search}%`
      );
    }

    query = query.order("created_at", { ascending: false });

    if (params?.sortBy) {
      query = query.order(params.sortBy, {
        ascending: params.sortOrder === "asc",
      });
    }

    const { data, count, error } = await query.range(skip, skip + take - 1);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, voyages: data, total: count || 0 };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get voyage by ID
 */
export async function getVoyageById(voyageId: string) {
  try {
    const { data, error } = await supabase
      .from("voyages")
      .select(
        `
        *,
        stages:voyage_stages(*),
        features:voyage_features(*),
        details:voyage_details(*)
      `
      )
      .eq("id", voyageId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, voyage: data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get voyages by category
 */
export async function getVoyagesByCategory(
  category: VoyageCategoryEnum,
  params?: PaginationParams
) {
  try {
    const { skip, take } = getPaginationParams(params || {});

    const { data, count, error } = await supabase
      .from("voyages")
      .select(
        `
        *,
        stages:voyage_stages(*),
        features:voyage_features(*),
        details:voyage_details(*)
      `,
        { count: "exact" }
      )
      .eq("category", category)
      .order("created_at", { ascending: false })
      .range(skip, skip + take - 1);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, voyages: data, total: count || 0 };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get available voyages (not full)
 */
export async function getAvailableVoyages(params?: PaginationParams) {
  try {
    const { skip, take } = getPaginationParams(params || {});

    const { data, count, error } = await supabase
      .from("voyages")
      .select(
        `
        *,
        stages:voyage_stages(*),
        features:voyage_features(*),
        details:voyage_details(*)
      `,
        { count: "exact" }
      )
      .neq("status", "full")
      .order("start_date", { ascending: true })
      .range(skip, skip + take - 1);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, voyages: data, total: count || 0 };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Update voyage capacity
 */
export async function updateVoyageCapacity(voyageId: string, increment: number) {
  try {
    const { data: voyage, error: fetchError } = await supabase
      .from("voyages")
      .select("max_capacity, current_bookings")
      .eq("id", voyageId)
      .single();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    const newBookings = voyage.current_bookings + increment;
    const status =
      newBookings >= voyage.max_capacity
        ? "full"
        : newBookings >= voyage.max_capacity * 0.9
          ? "almost-full"
          : "normal";

    const { data, error } = await supabase
      .from("voyages")
      .update({
        current_bookings: newBookings,
        status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", voyageId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, voyage: data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Search voyages
 */
export async function searchVoyages(
  searchTerm: string,
  params?: PaginationParams
) {
  try {
    const { skip, take } = getPaginationParams(params || {});

    const { data, count, error } = await supabase
      .from("voyages")
      .select(
        `
        *,
        stages:voyage_stages(*),
        features:voyage_features(*),
        details:voyage_details(*)
      `,
        { count: "exact" }
      )
      .or(
        `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`
      )
      .order("created_at", { ascending: false })
      .range(skip, skip + take - 1);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, voyages: data, total: count || 0 };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
