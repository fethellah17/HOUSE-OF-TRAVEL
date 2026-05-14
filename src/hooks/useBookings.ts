import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import {
  getUserBookings,
  getBookingDetails,
  CreateBookingRequest,
  createBooking,
} from "@/services/bookingService";
import { IBooking } from "@/types/database";

export function useUserBookings(page: number = 1, pageSize: number = 10) {
  const { user, isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      const fetchBookings = async () => {
        try {
          setIsLoading(true);
          const result = await getUserBookings(user.id, { page, pageSize });

          if (result.success) {
            setBookings(result.bookings);
            setTotal(result.total);
            setError(null);
          } else {
            setError(result.error);
            setBookings([]);
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchBookings();
    }
  }, [user, authLoading, page, pageSize]);

  return { bookings, total, isLoading, error };
}

export function useBookingDetails(bookingId: string | null) {
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) return;

    const fetchBooking = async () => {
      try {
        setIsLoading(true);
        const result = await getBookingDetails(bookingId);

        if (result.success) {
          setBooking(result.booking);
          setError(null);
        } else {
          setError(result.error);
          setBooking(null);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  return { booking, isLoading, error };
}

export function useCreateBooking() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (bookingData: CreateBookingRequest) => {
    if (!user) {
      setError("You must be logged in to create a booking");
      return { success: false, error: "Not authenticated" };
    }

    try {
      setIsLoading(true);
      const result = await createBooking(user.id, bookingData);

      if (result.success) {
        setError(null);
      } else {
        setError(result.error);
      }

      return result;
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return { create, isLoading, error };
}
