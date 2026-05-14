// Database utility functions and helpers

/**
 * Pagination utilities
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export function getPaginationParams(params: PaginationParams) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.min(Math.max(1, params.pageSize || 10), 100); // Max 100 items per page
  const skip = (page - 1) * pageSize;

  return {
    page,
    pageSize,
    skip,
    take: pageSize,
  };
}

export function buildPaginationResult<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
): PaginationResult<T> {
  const totalPages = Math.ceil(total / pageSize);

  return {
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

/**
 * Date utilities for database queries
 */
export function getStartOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

export function getEndOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}

export function getDateRange(days: number): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - days);
  return { start, end };
}

/**
 * Filter builder for complex queries
 */
export interface FilterOptions {
  [key: string]: any;
}

export function buildWhereClause(filters: FilterOptions): FilterOptions {
  const where: FilterOptions = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      where[key] = value;
    }
  });

  return where;
}

/**
 * Status badge helpers
 */
export function getStatusColor(status: string): string {
  const statusColorMap: Record<string, string> = {
    // Payment statuses
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-blue-100 text-blue-800",

    // Booking statuses
    confirmed: "bg-green-100 text-green-800",

    // Request statuses
    reviewed: "bg-blue-100 text-blue-800",
    quoted: "bg-purple-100 text-purple-800",

    // Voyage statuses
    "almost-full": "bg-orange-100 text-orange-800",
    full: "bg-red-100 text-red-800",
    "limited-offer": "bg-pink-100 text-pink-800",
    normal: "bg-gray-100 text-gray-800",

    // Visa statuses
    "in-progress": "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",

    // Invoice statuses
    draft: "bg-gray-100 text-gray-800",
    issued: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800",

    // Hotel statuses
    proposed: "bg-purple-100 text-purple-800",
  };

  return statusColorMap[status] || "bg-gray-100 text-gray-800";
}

export function getStatusLabel(status: string): string {
  const statusLabelMap: Record<string, string> = {
    pending: "En attente",
    completed: "Complété",
    cancelled: "Annulé",
    refunded: "Remboursé",
    confirmed: "Confirmé",
    reviewed: "Examiné",
    quoted: "Devis fourni",
    "almost-full": "Presque complet",
    full: "Complet",
    "limited-offer": "Offre limitée",
    normal: "Normal",
    "in-progress": "En cours",
    approved: "Approuvé",
    rejected: "Rejeté",
    draft: "Brouillon",
    issued: "Émis",
    paid: "Payé",
    overdue: "En retard",
    proposed: "Proposé",
  };

  return statusLabelMap[status] || status;
}

/**
 * Request status helpers
 */
export function isRequestPending(status: string): boolean {
  return status === "pending";
}

export function isRequestResolved(status: string): boolean {
  return ["quoted", "confirmed", "approved", "cancelled", "rejected"].includes(
    status
  );
}

/**
 * Price formatting
 */
export function formatPrice(price: number, currency = "EUR"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency,
  }).format(price);
}

/**
 * Booking reference generation
 */
export function generateBookingNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `BOOK-${timestamp}-${random}`;
}

/**
 * Invoice number generation
 */
export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `INV-${year}-${timestamp}-${random}`;
}

/**
 * Email validation
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Phone validation (basic international)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
}

/**
 * Date validation for travel dates
 */
export function isValidTravelDates(
  startDate: Date,
  endDate: Date
): { valid: boolean; error?: string } {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  // Start date cannot be in the past
  if (start < today) {
    return { valid: false, error: "La date de départ ne peut pas être antérieure à aujourd'hui" };
  }

  // End date must be after start date
  if (end <= start) {
    return { valid: false, error: "La date de retour doit être après la date de départ" };
  }

  // Trip should not exceed 180 days
  const daysDifference = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDifference > 180) {
    return { valid: false, error: "Le voyage ne peut pas dépasser 180 jours" };
  }

  return { valid: true };
}

/**
 * Database transaction wrapper
 */
export async function withTransaction<T>(
  callback: () => Promise<T>
): Promise<T> {
  try {
    return await callback();
  } catch (error) {
    console.error("Transaction error:", error);
    throw error;
  }
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .substring(0, 255); // Limit length
}

/**
 * Convert database boolean to frontend display
 */
export function formatBoolean(value: boolean | null | undefined): string {
  if (value === true) return "Oui";
  if (value === false) return "Non";
  return "Non spécifié";
}

/**
 * Age calculation from date of birth
 */
export function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())
  ) {
    age--;
  }

  return age;
}

/**
 * Classify travelers by age
 */
export function classifyTraveler(
  dateOfBirth: Date
): "adult" | "child" | "baby" {
  const age = calculateAge(dateOfBirth);

  if (age < 2) return "baby";
  if (age < 12) return "child";
  return "adult";
}

/**
 * Calculate total trip cost
 */
export function calculateTripCost(
  basePrice: number,
  numberOfAdults: number,
  numberOfChildren: number,
  numberOfBabies: number,
  childDiscount: number = 0.25 // 25% discount for children
): {
  subtotal: number;
  discount: number;
  total: number;
} {
  const adultCost = basePrice * numberOfAdults;
  const childCost = basePrice * childDiscount * numberOfChildren;
  const babyCost = 0; // Babies usually free

  const subtotal = adultCost + childCost + babyCost;
  const discount = basePrice * numberOfChildren * (1 - childDiscount);

  return {
    subtotal,
    discount,
    total: subtotal,
  };
}
