import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import {
  createDevisRequest,
  getUserDevisRequests,
  createBilletterieRequest,
  getUserBilletterieRequests,
  createVisaRequest,
  getUserVisaRequests,
  createHotelRequest,
  getUserHotelRequests,
} from "@/services/requestService";
import {
  CreateDevisRequest,
  CreateBilletterieRequest,
  CreateVisaRequest,
  CreateHotelRequest,
  PaginationParams,
} from "@/types/database";

// ============================================
// DEVIS REQUESTS
// ============================================

export function useUserDevisRequests(page: number = 1, pageSize: number = 10) {
  const { user, isLoading: authLoading } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      const fetchRequests = async () => {
        try {
          setIsLoading(true);
          const result = await getUserDevisRequests(user.id, { page, pageSize });

          if (result.success) {
            setRequests(result.requests);
            setTotal(result.total);
            setError(null);
          } else {
            setError(result.error);
            setRequests([]);
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchRequests();
    }
  }, [user, authLoading, page, pageSize]);

  return { requests, total, isLoading, error };
}

export function useCreateDevisRequest() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (requestData: CreateDevisRequest) => {
    try {
      setIsLoading(true);
      const result = await createDevisRequest(user?.id, requestData);

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

// ============================================
// BILLETTERIE REQUESTS
// ============================================

export function useUserBilletterieRequests(page: number = 1, pageSize: number = 10) {
  const { user, isLoading: authLoading } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      const fetchRequests = async () => {
        try {
          setIsLoading(true);
          const result = await getUserBilletterieRequests(user.id, { page, pageSize });

          if (result.success) {
            setRequests(result.requests);
            setTotal(result.total);
            setError(null);
          } else {
            setError(result.error);
            setRequests([]);
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchRequests();
    }
  }, [user, authLoading, page, pageSize]);

  return { requests, total, isLoading, error };
}

export function useCreateBilletterieRequest() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (requestData: CreateBilletterieRequest) => {
    try {
      setIsLoading(true);
      const result = await createBilletterieRequest(user?.id, requestData);

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

// ============================================
// VISA REQUESTS
// ============================================

export function useUserVisaRequests(page: number = 1, pageSize: number = 10) {
  const { user, isLoading: authLoading } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      const fetchRequests = async () => {
        try {
          setIsLoading(true);
          const result = await getUserVisaRequests(user.id, { page, pageSize });

          if (result.success) {
            setRequests(result.requests);
            setTotal(result.total);
            setError(null);
          } else {
            setError(result.error);
            setRequests([]);
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchRequests();
    }
  }, [user, authLoading, page, pageSize]);

  return { requests, total, isLoading, error };
}

export function useCreateVisaRequest() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (requestData: CreateVisaRequest) => {
    try {
      setIsLoading(true);
      const result = await createVisaRequest(user?.id, requestData);

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

// ============================================
// HOTEL REQUESTS
// ============================================

export function useUserHotelRequests(page: number = 1, pageSize: number = 10) {
  const { user, isLoading: authLoading } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      const fetchRequests = async () => {
        try {
          setIsLoading(true);
          const result = await getUserHotelRequests(user.id, { page, pageSize });

          if (result.success) {
            setRequests(result.requests);
            setTotal(result.total);
            setError(null);
          } else {
            setError(result.error);
            setRequests([]);
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchRequests();
    }
  }, [user, authLoading, page, pageSize]);

  return { requests, total, isLoading, error };
}

export function useCreateHotelRequest() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (requestData: CreateHotelRequest) => {
    try {
      setIsLoading(true);
      const result = await createHotelRequest(user?.id, requestData);

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
