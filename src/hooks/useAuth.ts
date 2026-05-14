import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  getUserProfile,
  onAuthStateChange,
} from "@/services/authService";
import { IUser } from "@/types/database";

export function useAuth() {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Function to reload user profile from database
  const reloadUserProfile = async () => {
    try {
      const result = await getCurrentUser();
      if (result.success && result.user) {
        const profileResult = await getUserProfile(result.user.id);
        if (profileResult.success) {
          setUser(profileResult.user);
          localStorage.setItem(
            "currentUser",
            JSON.stringify(profileResult.user)
          );
        }
      }
    } catch (err) {
      console.error("Error reloading user profile:", err);
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const result = await getCurrentUser();

        if (result.success && result.user) {
          // Get full user profile from database
          const profileResult = await getUserProfile(result.user.id);

          if (profileResult.success) {
            setUser(profileResult.user);
            // Store in localStorage for persistence
            localStorage.setItem(
              "currentUser",
              JSON.stringify(profileResult.user)
            );
          }
        } else {
          setUser(null);
          localStorage.removeItem("currentUser");
        }
      } catch (err: any) {
        setError(err.message);
        setUser(null);
        localStorage.removeItem("currentUser");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = onAuthStateChange(async (authUser) => {
      if (authUser) {
        const profileResult = await getUserProfile(authUser.id);
        if (profileResult.success) {
          setUser(profileResult.user);
          localStorage.setItem(
            "currentUser",
            JSON.stringify(profileResult.user)
          );
        }
      } else {
        setUser(null);
        localStorage.removeItem("currentUser");
      }
      setIsLoading(false);
    });

    // Listen for profile updates from other components (e.g., LoginModal)
    const handleProfileUpdated = () => {
      reloadUserProfile();
    };

    window.addEventListener("profileUpdated", handleProfileUpdated);

    return () => {
      subscription?.unsubscribe();
      window.removeEventListener("profileUpdated", handleProfileUpdated);
    };
  }, []);

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
  };
}

/**
 * Hook for protected routes
 */
export function useRequireAuth() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  return { user, isLoading };
}
