import { supabase } from "@/lib/supabase";
import { SignupRequest, LoginRequest, IUser } from "@/types/database";

/**
 * Sign up a new user with email OTP verification
 */
export async function signUp(request: SignupRequest) {
  try {
    // Sign up with Supabase Auth - this will trigger OTP email
    const { data, error } = await supabase.auth.signUp({
      email: request.email,
      password: request.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          nom: request.nom,
          prenom: request.prenom,
          phone: request.phone,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    // User created but not confirmed yet - they need to verify their email
    return { 
      success: true, 
      user: data.user,
      message: "Vérification d'email requise. Vérifiez votre boîte de réception." 
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Verify OTP code sent to email
 * NOTE: This only verifies the email OTP. The profile is NOT created here.
 * Profile creation happens in completeSignUp() after user completes all signup steps.
 */
export async function verifyOTP(email: string, token: string) {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: token,
      type: 'signup',
    });

    if (error) {
      throw new Error(error.message);
    }

    // Email is verified but profile NOT created yet
    // Profile will be created in completeSignUp() after password setup
    return { 
      success: true, 
      user: data.user,
      session: data.session,
      message: "Email vérifié avec succès!" 
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Complete signup: Create user profile in database after all signup steps complete
 * Called after user verifies OTP, enters phone number, and sets password
 */
export async function completeSignUp(
  userId: string,
  email: string,
  nom: string,
  prenom: string,
  phone: string
) {
  try {
    // Create user profile in users table only now, after email verification and password setup
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          id: userId,
          email: email,
          nom: nom,
          prenom: prenom,
          phone: phone || null,
          is_email_verified: true,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      // If user already exists, just update with final data
      if (error.code === '23505') {
        // Unique constraint violation - user already exists
        const { data: updateData, error: updateError } = await supabase
          .from("users")
          .update({
            nom: nom,
            prenom: prenom,
            phone: phone || null,
            is_email_verified: true,
            is_active: true,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)
          .select()
          .single();

        if (updateError) throw updateError;
        return { success: true, user: updateData, message: "Profil finalisé avec succès!" };
      } else {
        throw error;
      }
    }

    return { success: true, user: data, message: "Profil créé avec succès!" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Resend OTP code to email
 */
export async function resendOTP(email: string) {
  try {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { 
      success: true,
      message: "Code de vérification renvoyé à votre email" 
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Log in user
 */
export async function login(request: LoginRequest) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: request.email,
      password: request.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    // Update last login
    if (data.user) {
      await supabase
        .from("users")
        .update({ last_login: new Date().toISOString() })
        .eq("id", data.user.id);
    }

    return { success: true, user: data.user, session: data.session };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Log out user
 */
export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, user: data.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get user profile from users table
 */
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, user: data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<IUser>
) {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, user: data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string) {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Verify OTP for password reset (recovery flow)
 * Must be called before resetPassword to establish temporary session
 */
export async function verifyRecoveryOTP(email: string, token: string) {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: token,
      type: 'recovery',
    });

    if (error) {
      console.error('Recovery OTP verification failed:', error);
      throw new Error(error.message);
    }

    // Session established - user can now reset password
    return { 
      success: true, 
      user: data.user,
      session: data.session,
      message: "Code de vérification accepté. Vous pouvez maintenant définir un nouveau mot de passe."
    };
  } catch (error: any) {
    console.error('Recovery OTP error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Reset password with verified session
 * MUST be called AFTER verifyRecoveryOTP establishes a session
 */
export async function resetPassword(newPassword: string) {
  try {
    // Validate password strength
    if (!newPassword || newPassword.length < 6) {
      throw new Error('Le mot de passe doit contenir au moins 6 caractères');
    }

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error('Password update failed:', error);
      throw new Error(error.message);
    }

    console.log('Password updated successfully');
    return { success: true, user: data.user, message: "Mot de passe réinitialisé avec succès!" };
  } catch (error: any) {
    console.error('Reset password error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Listen for auth changes
 */
export function onAuthStateChange(callback: (user: any) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });
}
