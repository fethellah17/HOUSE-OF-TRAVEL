import { useEffect, useState } from "react";
import {
  getAllVoyages,
  getVoyageById,
  getVoyagesByCategory,
  getAvailableVoyages,
  searchVoyages,
} from "@/services/voyageService";
import { IVoyage, VoyageCategoryEnum, PaginationParams } from "@/types/database";

export function useVoyages(
  params?: PaginationParams & { category?: VoyageCategoryEnum }
) {
  const [voyages, setVoyages] = useState<IVoyage[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVoyages = async () => {
      try {
        setIsLoading(true);
        const result = await getAllVoyages(params);

        if (result.success) {
          setVoyages(result.voyages);
          setTotal(result.total);
          setError(null);
        } else {
          setError(result.error);
          setVoyages([]);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVoyages();
  }, [params?.page, params?.category]);

  return { voyages, total, isLoading, error };
}

export function useVoyageDetails(voyageId: string | null) {
  const [voyage, setVoyage] = useState<IVoyage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!voyageId) return;

    const fetchVoyage = async () => {
      try {
        setIsLoading(true);
        const result = await getVoyageById(voyageId);

        if (result.success) {
          setVoyage(result.voyage);
          setError(null);
        } else {
          setError(result.error);
          setVoyage(null);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVoyage();
  }, [voyageId]);

  return { voyage, isLoading, error };
}

export function useVoyagesByCategory(
  category: VoyageCategoryEnum | null,
  params?: PaginationParams
) {
  const [voyages, setVoyages] = useState<IVoyage[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category) return;

    const fetchVoyages = async () => {
      try {
        setIsLoading(true);
        const result = await getVoyagesByCategory(category, params);

        if (result.success) {
          setVoyages(result.voyages);
          setTotal(result.total);
          setError(null);
        } else {
          setError(result.error);
          setVoyages([]);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVoyages();
  }, [category, params?.page]);

  return { voyages, total, isLoading, error };
}

export function useAvailableVoyages(params?: PaginationParams) {
  const [voyages, setVoyages] = useState<IVoyage[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVoyages = async () => {
      try {
        setIsLoading(true);
        const result = await getAvailableVoyages(params);

        if (result.success) {
          setVoyages(result.voyages);
          setTotal(result.total);
          setError(null);
        } else {
          setError(result.error);
          setVoyages([]);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVoyages();
  }, [params?.page]);

  return { voyages, total, isLoading, error };
}

export function useVoyageSearch(searchTerm: string, params?: PaginationParams) {
  const [voyages, setVoyages] = useState<IVoyage[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setVoyages([]);
      setTotal(0);
      return;
    }

    const delayTimer = setTimeout(async () => {
      try {
        setIsLoading(true);
        const result = await searchVoyages(searchTerm, params);

        if (result.success) {
          setVoyages(result.voyages);
          setTotal(result.total);
          setError(null);
        } else {
          setError(result.error);
          setVoyages([]);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }, 300); // Debounce search

    return () => clearTimeout(delayTimer);
  }, [searchTerm, params?.page]);

  return { voyages, total, isLoading, error };
}
