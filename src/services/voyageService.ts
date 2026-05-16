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

// ============================================
// VOYAGE INSERT PAYLOAD TYPES
// ============================================

/** Matches the `voyages` table columns exactly — no DB columns added/dropped. */
export interface VoyageInsertPayload {
  title: string;
  description?: string;
  category: string;           // VoyageCategoryEnum value
  price: number;
  duration?: string;
  start_date: string;         // ISO date string  e.g. "2025-12-01"
  end_date: string;           // ISO date string
  status?: string;            // VoyageStatusEnum value  (default: 'normal')
  max_capacity?: number;
  current_bookings?: number;
  image_url?: string;
  points_forts?: string;      // Points Forts stored as comma-separated string or raw text
  created_by?: string;        // admin_users.id UUID
}

/** Matches the `voyage_stages` table columns exactly. */
export interface VoyageStageInsertPayload {
  name: string;               // Nom de la ville / étape  — NOT NULL in DB
  city?: string;
  hotel_name?: string;
  google_maps_url?: string;
  duration_days?: number | string; // accept string so forms don't need to pre-parse
  icon?: "kaaba" | "dome" | "default";
  description?: string;
}

// ============================================
// TRANSACTIONAL INSERT — VOYAGE + STAGES
// ============================================

/**
 * Atomically inserts a parent voyage record into `voyages` and then maps
 * and inserts its child stages into `voyage_stages`.
 *
 * @param voyageData - Columns for the `voyages` table (no ID required).
 * @param stages     - Array of stage objects; each is mapped to `voyage_stages`.
 * @returns          - The newly created voyage row returned by Supabase.
 */
export const createVoyageWithStages = async (
  voyageData: VoyageInsertPayload,
  stages: VoyageStageInsertPayload[]
) => {
  try {
    // ── Step 1: Insert the parent voyage ──────────────────────────────────
    console.log("📥 Inserting Parent Voyage Record:", voyageData);

    const { data: newVoyage, error: voyageError } = await supabase
      .from("voyages")
      .insert([voyageData])
      .select()
      .single();

    if (voyageError) {
      console.error("❌ Error inserting parent voyage:", voyageError.message);
      throw voyageError;
    }

    console.log("✅ Parent Voyage Created with ID:", newVoyage.id);

    // ── Step 2: Insert child stages (if any) ──────────────────────────────
    if (stages && stages.length > 0) {
      const mappedStages = stages.map((stage, index) => ({
        voyage_id:       newVoyage.id,
        stage_number:    index + 1,
        name:            stage.name || stage.city || "Étape",  // required NOT NULL
        city:            stage.city            ?? null,
        hotel_name:      stage.hotel_name      ?? null,
        google_maps_url: stage.google_maps_url ?? null,
        duration_days:   stage.duration_days != null
                           ? Number(stage.duration_days)
                           : null,
        icon:            stage.icon            ?? "default",
        description:     stage.description     ?? "",
      }));

      console.log("📥 Inserting Child Stages:", mappedStages);

      const { error: stagesError } = await supabase
        .from("voyage_stages")
        .insert(mappedStages);

      if (stagesError) {
        console.error("❌ Error inserting voyage stages:", stagesError.message);
        throw stagesError;
      }

      console.log(`✅ ${mappedStages.length} stage(s) inserted for voyage ${newVoyage.id}`);
    }

    return newVoyage;
  } catch (err) {
    console.error("❌ Crash in createVoyageWithStages transaction:", err);
    throw err;
  }
};

// ============================================
// TRANSACTIONAL UPDATE — VOYAGE + STAGES
// ============================================

/**
 * Atomically updates a parent voyage record in `voyages` and refreshes
 * its child stages in `voyage_stages` by deleting old stages and inserting new ones.
 *
 * @param voyageId      - The UUID of the voyage to update.
 * @param voyagePayload - Partial columns for the `voyages` table to update.
 * @param stagesPayload - Array of stage objects; old stages are deleted and these are inserted.
 * @returns             - The updated voyage row returned by Supabase.
 */
export const updateVoyageWithStages = async (
  voyageId: string,
  voyagePayload: Partial<VoyageInsertPayload>,
  stagesPayload: VoyageStageInsertPayload[]
) => {
  try {
    // ── Step 1: Update the parent voyage ──────────────────────────────────
    console.log("🔄 Updating Parent Voyage Record:", voyageId, voyagePayload);

    const { data: updatedVoyage, error: voyageError } = await supabase
      .from("voyages")
      .update({
        ...voyagePayload,
        updated_at: new Date().toISOString(),
      })
      .eq("id", voyageId)
      .select()
      .single();

    if (voyageError) {
      console.error("❌ Error updating parent voyage:", voyageError.message);
      throw voyageError;
    }

    console.log("✅ Parent Voyage Updated:", updatedVoyage.id);

    // ── Step 2: Delete old stages ─────────────────────────────────────────
    console.log("🗑️ Deleting old stages for voyage:", voyageId);

    const { error: deleteError } = await supabase
      .from("voyage_stages")
      .delete()
      .eq("voyage_id", voyageId);

    if (deleteError) {
      console.error("❌ Error deleting old stages:", deleteError.message);
      throw deleteError;
    }

    console.log("✅ Old stages deleted successfully");

    // ── Step 3: Insert new stages ─────────────────────────────────────────
    if (stagesPayload && stagesPayload.length > 0) {
      const mappedStages = stagesPayload.map((stage, index) => ({
        voyage_id:       voyageId,
        stage_number:    index + 1,
        name:            stage.name || stage.city || "Étape",  // required NOT NULL
        city:            stage.city            ?? null,
        hotel_name:      stage.hotel_name      ?? null,
        google_maps_url: stage.google_maps_url ?? null,
        duration_days:   stage.duration_days != null
                           ? Number(stage.duration_days)
                           : null,
        icon:            stage.icon            ?? "default",
        description:     stage.description     ?? "",
      }));

      console.log("📥 Inserting Updated Child Stages:", mappedStages);

      const { error: stagesError } = await supabase
        .from("voyage_stages")
        .insert(mappedStages);

      if (stagesError) {
        console.error("❌ Error inserting updated stages:", stagesError.message);
        throw stagesError;
      }

      console.log(`✅ ${mappedStages.length} stage(s) inserted for voyage ${voyageId}`);
    }

    return updatedVoyage;
  } catch (err) {
    console.error("❌ Crash in updateVoyageWithStages transaction:", err);
    throw err;
  }
};
