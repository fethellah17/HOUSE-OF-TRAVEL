import { supabase } from "@/lib/supabase";
import { CreateBookingRequest, IBooking, PaginationParams } from "@/types/database";
import { getPaginationParams } from "@/lib/database";

/**
 * Create a new booking
 */
export async function createBooking(userId: string, bookingData: CreateBookingRequest) {
  try {
    // Generate booking number
    const bookingNumber = `BOOK-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert([
        {
          user_id: userId,
          voyage_id: bookingData.voyageId,
          booking_number: bookingNumber,
          total_adults: bookingData.totalAdults,
          total_children: bookingData.totalChildren,
          total_babies: bookingData.totalBabies,
          total_price: bookingData.totalAdults * 100, // Placeholder calculation
          payment_status: "pending",
          booking_status: "pending",
          departure_date: bookingData.departureDate,
          return_date: bookingData.returnDate,
          special_requests: bookingData.specialRequests,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (bookingError) {
      throw new Error(bookingError.message);
    }

    // Add travelers
    if (bookingData.travelers && booking) {
      const { error: travelersError } = await supabase
        .from("booking_travelers")
        .insert(
          bookingData.travelers.map((traveler) => ({
            booking_id: booking.id,
            nom: traveler.nom,
            prenom: traveler.prenom,
            date_of_birth: traveler.dateOfBirth,
            gender: traveler.gender,
            passport_number: traveler.passportNumber,
            passport_expiry: traveler.passportExpiry,
            traveler_type: traveler.travelerType,
            created_at: new Date().toISOString(),
          }))
        );

      if (travelersError) {
        throw new Error(travelersError.message);
      }
    }

    // Add room details
    if (bookingData.roomDetails && booking) {
      const { error: roomsError } = await supabase
        .from("booking_room_details")
        .insert(
          bookingData.roomDetails.map((room) => ({
            booking_id: booking.id,
            room_type: room.roomType,
            number_of_guests: room.numberOfGuests,
            special_requests: room.specialRequests,
            created_at: new Date().toISOString(),
          }))
        );

      if (roomsError) {
        throw new Error(roomsError.message);
      }
    }

    return { success: true, booking };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get user bookings
 */
export async function getUserBookings(userId: string, params?: PaginationParams) {
  try {
    const { skip, take } = getPaginationParams(params || {});

    let query = supabase
      .from("bookings")
      .select("*, voyage:voyages(*)", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (params?.sortBy) {
      query = query.order(params.sortBy, {
        ascending: params.sortOrder === "asc",
      });
    }

    const { data, count, error } = await query.range(skip, skip + take - 1);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, bookings: data, total: count || 0 };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get booking details
 */
export async function getBookingDetails(bookingId: string) {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        voyage:voyages(*),
        travelers:booking_travelers(*),
        rooms:booking_room_details(*),
        payments:payments(*)
      `
      )
      .eq("id", bookingId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, booking: data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Update booking status
 */
export async function updateBookingStatus(
  bookingId: string,
  bookingStatus: string,
  paymentStatus?: string
) {
  try {
    const updates: any = {
      booking_status: bookingStatus,
      updated_at: new Date().toISOString(),
    };

    if (paymentStatus) {
      updates.payment_status = paymentStatus;
    }

    const { data, error } = await supabase
      .from("bookings")
      .update(updates)
      .eq("id", bookingId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, booking: data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Cancel booking
 */
export async function cancelBooking(bookingId: string) {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .update({
        booking_status: "cancelled",
        payment_status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, booking: data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
