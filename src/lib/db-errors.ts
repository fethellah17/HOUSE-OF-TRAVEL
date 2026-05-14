// Database error handling utilities

export class DatabaseError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = "DatabaseError";
  }
}

/**
 * Common database error codes
 */
export const DATABASE_ERROR_CODES = {
  // Authentication errors
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",
  ACCOUNT_LOCKED: "ACCOUNT_LOCKED",

  // Validation errors
  INVALID_EMAIL: "INVALID_EMAIL",
  INVALID_PHONE: "INVALID_PHONE",
  INVALID_PASSWORD: "INVALID_PASSWORD",
  INVALID_DATES: "INVALID_DATES",
  MISSING_REQUIRED_FIELD: "MISSING_REQUIRED_FIELD",

  // Permission errors
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",

  // Resource errors
  NOT_FOUND: "NOT_FOUND",
  ALREADY_EXISTS: "ALREADY_EXISTS",
  CONFLICT: "CONFLICT",

  // Booking/Payment errors
  BOOKING_CAPACITY_EXCEEDED: "BOOKING_CAPACITY_EXCEEDED",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  INVALID_BOOKING_STATE: "INVALID_BOOKING_STATE",
  VOYAGE_NOT_AVAILABLE: "VOYAGE_NOT_AVAILABLE",

  // System errors
  DATABASE_CONNECTION_ERROR: "DATABASE_CONNECTION_ERROR",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  TRANSACTION_FAILED: "TRANSACTION_FAILED",
  DUPLICATE_ENTRY: "DUPLICATE_ENTRY",
};

/**
 * Error messages mapping
 */
const ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: "Email ou mot de passe incorrect",
  USER_NOT_FOUND: "Utilisateur non trouvé",
  EMAIL_ALREADY_EXISTS: "Cet email est déjà utilisé",
  ACCOUNT_LOCKED: "Le compte est verrouillé",

  INVALID_EMAIL: "Veuillez entrer un email valide",
  INVALID_PHONE: "Veuillez entrer un numéro de téléphone valide",
  INVALID_PASSWORD:
    "Le mot de passe doit contenir au moins 8 caractères avec des majuscules, minuscules et chiffres",
  INVALID_DATES: "Les dates saisies ne sont pas valides",
  MISSING_REQUIRED_FIELD: "Des champs obligatoires sont manquants",

  UNAUTHORIZED: "Authentification requise",
  FORBIDDEN: "Accès refusé",
  INSUFFICIENT_PERMISSIONS: "Vous n'avez pas les permissions nécessaires",

  NOT_FOUND: "Ressource non trouvée",
  ALREADY_EXISTS: "Cette ressource existe déjà",
  CONFLICT: "Un conflit a été détecté",

  BOOKING_CAPACITY_EXCEEDED: "Aucune place disponible pour ce voyage",
  PAYMENT_FAILED: "Le paiement a échoué",
  INVALID_BOOKING_STATE: "L'état de la réservation ne permet pas cette opération",
  VOYAGE_NOT_AVAILABLE: "Ce voyage n'est pas disponible",

  DATABASE_CONNECTION_ERROR: "Erreur de connexion à la base de données",
  INTERNAL_SERVER_ERROR: "Une erreur serveur s'est produite",
  TRANSACTION_FAILED: "La transaction a échoué",
  DUPLICATE_ENTRY: "Une entrée dupliquée a été détectée",
};

/**
 * Get user-friendly error message
 */
export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] || "Une erreur s'est produite";
}

/**
 * Format database error for response
 */
export function formatDatabaseError(
  error: any
): {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
} {
  // Handle custom DatabaseError
  if (error instanceof DatabaseError) {
    return {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
    };
  }

  // Handle Prisma specific errors
  if (error.code === "P2002") {
    return {
      code: DATABASE_ERROR_CODES.DUPLICATE_ENTRY,
      message: getErrorMessage(DATABASE_ERROR_CODES.DUPLICATE_ENTRY),
      statusCode: 409,
      details: { field: error.meta?.target?.[0] || "unknown" },
    };
  }

  if (error.code === "P2025") {
    return {
      code: DATABASE_ERROR_CODES.NOT_FOUND,
      message: getErrorMessage(DATABASE_ERROR_CODES.NOT_FOUND),
      statusCode: 404,
    };
  }

  if (error.code === "P2003") {
    return {
      code: DATABASE_ERROR_CODES.CONFLICT,
      message: "La référence à cette ressource n'existe pas",
      statusCode: 400,
    };
  }

  // Handle validation errors
  if (error.code === "P2004") {
    return {
      code: DATABASE_ERROR_CODES.MISSING_REQUIRED_FIELD,
      message: getErrorMessage(DATABASE_ERROR_CODES.MISSING_REQUIRED_FIELD),
      statusCode: 400,
    };
  }

  // Handle connection errors
  if (error.code === "ECONNREFUSED" || error.message?.includes("connect")) {
    return {
      code: DATABASE_ERROR_CODES.DATABASE_CONNECTION_ERROR,
      message: getErrorMessage(DATABASE_ERROR_CODES.DATABASE_CONNECTION_ERROR),
      statusCode: 503,
    };
  }

  // Default error
  return {
    code: DATABASE_ERROR_CODES.INTERNAL_SERVER_ERROR,
    message: getErrorMessage(DATABASE_ERROR_CODES.INTERNAL_SERVER_ERROR),
    statusCode: 500,
    details: process.env.NODE_ENV === "development" ? error.message : undefined,
  };
}

/**
 * Validators for common database operations
 */
export const Validators = {
  /**
   * Validate password requirements
   */
  validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Le mot de passe doit contenir au moins 8 caractères");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Le mot de passe doit contenir au moins une majuscule");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Le mot de passe doit contenir au moins une minuscule");
    }

    if (!/[0-9]/.test(password)) {
      errors.push("Le mot de passe doit contenir au moins un chiffre");
    }

    if (!/[!@#$%^&*]/.test(password)) {
      errors.push("Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*)");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate email format
   */
  validateEmail(email: string): { valid: boolean; error?: string } {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return { valid: false, error: "Veuillez entrer un email valide" };
    }

    if (email.length > 255) {
      return { valid: false, error: "L'email est trop long" };
    }

    return { valid: true };
  },

  /**
   * Validate phone format
   */
  validatePhone(phone: string): { valid: boolean; error?: string } {
    const phoneRegex =
      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

    if (!phoneRegex.test(phone)) {
      return { valid: false, error: "Veuillez entrer un numéro de téléphone valide" };
    }

    return { valid: true };
  },

  /**
   * Validate names
   */
  validateName(
    name: string,
    fieldName: string = "Nom"
  ): { valid: boolean; error?: string } {
    if (!name || name.trim().length === 0) {
      return { valid: false, error: `${fieldName} est requis` };
    }

    if (name.length > 100) {
      return { valid: false, error: `${fieldName} est trop long` };
    }

    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(name)) {
      return { valid: false, error: `${fieldName} contient des caractères invalides` };
    }

    return { valid: true };
  },

  /**
   * Validate passport number
   */
  validatePassport(passport: string): { valid: boolean; error?: string } {
    if (!passport || passport.trim().length === 0) {
      return { valid: true }; // Optional field
    }

    // Basic validation for common passport formats
    if (passport.length < 5 || passport.length > 20) {
      return { valid: false, error: "Le numéro de passeport est invalide" };
    }

    if (!/^[A-Z0-9]+$/.test(passport)) {
      return {
        valid: false,
        error: "Le numéro de passeport doit contenir uniquement des lettres majuscules et des chiffres",
      };
    }

    return { valid: true };
  },

  /**
   * Validate required field
   */
  validateRequired(
    value: any,
    fieldName: string = "Champ"
  ): { valid: boolean; error?: string } {
    if (value === null || value === undefined || value === "") {
      return { valid: false, error: `${fieldName} est requis` };
    }

    return { valid: true };
  },

  /**
   * Validate numeric range
   */
  validateRange(
    value: number,
    min: number,
    max: number,
    fieldName: string = "Valeur"
  ): { valid: boolean; error?: string } {
    if (value < min || value > max) {
      return {
        valid: false,
        error: `${fieldName} doit être entre ${min} et ${max}`,
      };
    }

    return { valid: true };
  },
};

/**
 * Helper to safely handle async database operations
 */
export async function tryCatch<T>(
  operation: () => Promise<T>
): Promise<[T | null, DatabaseError | null]> {
  try {
    const result = await operation();
    return [result, null];
  } catch (error: any) {
    const dbError = new DatabaseError(
      DATABASE_ERROR_CODES.INTERNAL_SERVER_ERROR,
      getErrorMessage(DATABASE_ERROR_CODES.INTERNAL_SERVER_ERROR),
      500,
      error
    );
    return [null, dbError];
  }
}

/**
 * Throw database error with proper details
 */
export function throwDatabaseError(
  code: string,
  message?: string,
  statusCode: number = 500,
  details?: any
): never {
  throw new DatabaseError(code, message || getErrorMessage(code), statusCode, details);
}
