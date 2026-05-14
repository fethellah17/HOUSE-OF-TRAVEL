// Database types and interfaces for House of Travel

// ============================================
// USERS & AUTHENTICATION
// ============================================

export interface IUser {
  id: string;
  email: string;
  password: string;
  nom: string;
  prenom: string;
  phone?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface IUserProfile {
  id: string;
  userId: string;
  passportNumber?: string;
  passportExpiry?: Date;
  nationality?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  maritalStatus?: string;
  occupation?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEmailVerificationToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface IPasswordResetToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

// ============================================
// VOYAGES & TRAVEL PACKAGES
// ============================================

export enum VoyageCategoryEnum {
  OMRAH = "Omrah",
  VOYAGE_ORGANISE = "Voyage Organisé",
  VOYAGE_A_LA_CARTE = "Voyage à la Carte",
  VOYAGE_NATIONAL = "Voyage National",
}

export enum VoyageStatusEnum {
  NORMAL = "normal",
  ALMOST_FULL = "almost-full",
  FULL = "full",
  LIMITED_OFFER = "limited-offer",
}

export interface IVoyage {
  id: string;
  title: string;
  description?: string;
  category: VoyageCategoryEnum;
  price: number;
  duration?: string;
  startDate: Date;
  endDate: Date;
  status: VoyageStatusEnum;
  maxCapacity: number;
  currentBookings: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

export interface IVoyageStage {
  id: string;
  voyageId: string;
  stageNumber: number;
  name: string;
  hotelName?: string;
  city?: string;
  googleMapsUrl?: string;
  durationDays?: number;
  icon: "kaaba" | "dome" | "default";
  description?: string;
  createdAt: Date;
}

export interface IVoyageFeature {
  id: string;
  voyageId: string;
  feature: string;
  createdAt: Date;
}

export interface IVoyageDetails {
  id: string;
  voyageId: string;
  flightType?: string;
  visaRequired?: boolean;
  roomType?: string;
  mealPlan?: string;
  guideLanguage?: string;
  departureCity?: string;
  createdAt: Date;
}

// ============================================
// BOOKINGS & ORDERS
// ============================================

export enum PaymentStatusEnum {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export enum BookingStatusEnum {
  CONFIRMED = "confirmed",
  PENDING = "pending",
  CANCELLED = "cancelled",
}

export interface IBooking {
  id: string;
  userId: string;
  voyageId: string;
  bookingNumber: string;
  totalAdults: number;
  totalChildren: number;
  totalBabies: number;
  totalPrice: number;
  paymentStatus: PaymentStatusEnum;
  bookingStatus: BookingStatusEnum;
  departureDate?: Date;
  returnDate?: Date;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBookingTraveler {
  id: string;
  bookingId: string;
  nom: string;
  prenom: string;
  dateOfBirth?: Date;
  gender?: string;
  passportNumber?: string;
  passportExpiry?: Date;
  travelerType: "adult" | "child" | "baby";
  createdAt: Date;
}

export interface IBookingRoomDetail {
  id: string;
  bookingId: string;
  roomNumber?: number;
  roomType?: string;
  numberOfGuests?: number;
  specialRequests?: string;
  createdAt: Date;
}

// ============================================
// REQUESTS & COMMUNICATIONS
// ============================================

export enum DevisRequestStatusEnum {
  PENDING = "pending",
  REVIEWED = "reviewed",
  QUOTED = "quoted",
  CANCELLED = "cancelled",
}

export interface IDevisRequest {
  id: string;
  userId?: string;
  nom: string;
  prenom: string;
  email: string;
  phone?: string;
  destination?: string;
  voyageId?: string;
  visaNeeded?: boolean;
  flightWithWithout?: "avec" | "sans";
  hotelName?: string;
  hotelStars?: number;
  numberOfRooms?: number;
  roomType?: string;
  mealPlan?: string;
  numberOfAdults: number;
  numberOfChildren: number;
  childrenAges?: string;
  departureDate?: Date;
  returnDate?: Date;
  specialRequests?: string;
  status: DevisRequestStatusEnum;
  assignedTo?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum BilletterieRequestStatusEnum {
  PENDING = "pending",
  QUOTED = "quoted",
  BOOKED = "booked",
  CANCELLED = "cancelled",
}

export interface IBilletterieRequest {
  id: string;
  userId?: string;
  nom: string;
  prenom: string;
  email: string;
  phone?: string;
  destination?: string;
  departureCity?: string;
  arrivalCity?: string;
  airlinePreference?: string;
  visaNeeded?: boolean;
  numberOfAdults: number;
  numberOfChildren: number;
  numberOfBabies: number;
  childrenAges?: string;
  departureDate?: Date;
  returnDate?: Date;
  specialRequests?: string;
  status: BilletterieRequestStatusEnum;
  assignedTo?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum VisaRequestStatusEnum {
  PENDING = "pending",
  IN_PROGRESS = "in-progress",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum VisaTypeEnum {
  E_VISA = "e-visa",
  DOSSIER = "dossier",
}

export interface IVisaRequest {
  id: string;
  userId?: string;
  nom: string;
  prenom: string;
  email: string;
  phone?: string;
  visaType: VisaTypeEnum;
  destinationCountry: string;
  passportNumber?: string;
  passportExpiry?: Date;
  travelDate?: Date;
  professionalStatus?: string;
  guarantorStatus?: string;
  specialRequests?: string;
  status: VisaRequestStatusEnum;
  assignedTo?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum HotelPreferenceEnum {
  SPECIFIC = "specific",
  SUGGEST = "suggest",
}

export enum HotelRequestStatusEnum {
  PENDING = "pending",
  PROPOSED = "proposed",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
}

export interface IHotelRequest {
  id: string;
  userId?: string;
  nom: string;
  prenom: string;
  email: string;
  phone?: string;
  hotelPreference: HotelPreferenceEnum;
  hotelName?: string;
  hotelCategory?: string;
  city: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfRooms: number;
  numberOfPeople: number;
  roomType?: string;
  mealBasis?: string;
  specialRequests?: string;
  status: HotelRequestStatusEnum;
  assignedTo?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// ADMIN & MESSAGING
// ============================================

export enum AdminRoleEnum {
  ADMIN = "admin",
  MODERATOR = "moderator",
  AGENT = "agent",
}

export interface IAdminUser {
  id: string;
  userId: string;
  role: AdminRoleEnum;
  permissions?: Record<string, boolean>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum MessageTypeEnum {
  BILLETTERIE = "Billetterie",
  DEVIS = "Devis",
}

export interface IMessage {
  id: string;
  senderId: string;
  recipientId: string;
  subject?: string;
  content?: string;
  messageType?: MessageTypeEnum;
  relatedRequestId?: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

export enum NotificationTypeEnum {
  BOOKING = "booking",
  DEVIS = "devis",
  VISA = "visa",
  HOTEL = "hotel",
  SYSTEM = "system",
}

export interface INotification {
  id: string;
  userId: string;
  title?: string;
  message?: string;
  type: NotificationTypeEnum;
  relatedEntityId?: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

// ============================================
// PAYMENTS
// ============================================

export enum PaymentMethodEnum {
  CARD = "card",
  BANK_TRANSFER = "bank_transfer",
  PAYPAL = "paypal",
}

export interface IPayment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethodEnum;
  status: PaymentStatusEnum;
  transactionId?: string;
  paymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum InvoiceStatusEnum {
  DRAFT = "draft",
  ISSUED = "issued",
  PAID = "paid",
  OVERDUE = "overdue",
  CANCELLED = "cancelled",
}

export interface IInvoice {
  id: string;
  bookingId: string;
  userId: string;
  invoiceNumber: string;
  amount: number;
  issuedDate: Date;
  dueDate: Date;
  status: InvoiceStatusEnum;
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// AUDIT & LOGS
// ============================================

export enum AuditActionEnum {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  VIEW = "view",
}

export interface IActivityLog {
  id: string;
  userId?: string;
  entityType: string;
  entityId: string;
  action: AuditActionEnum;
  changes?: Record<string, any>;
  ipAddress?: string;
  createdAt: Date;
}

// ============================================
// REQUEST/RESPONSE DTOS
// ============================================

export interface SignupRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  nom?: string;
  prenom?: string;
  phone?: string;
  passportNumber?: string;
  passportExpiry?: Date;
  nationality?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  maritalStatus?: string;
  occupation?: string;
}

export interface CreateBookingRequest {
  voyageId: string;
  totalAdults: number;
  totalChildren: number;
  totalBabies: number;
  departureDate: Date;
  returnDate?: Date;
  travelers: Array<{
    nom: string;
    prenom: string;
    dateOfBirth: Date;
    gender: string;
    passportNumber: string;
    passportExpiry: Date;
    travelerType: "adult" | "child" | "baby";
  }>;
  roomDetails: Array<{
    roomType: string;
    numberOfGuests: number;
    specialRequests?: string;
  }>;
  specialRequests?: string;
}

export interface CreateDevisRequest {
  nom: string;
  prenom: string;
  email: string;
  phone?: string;
  destination: string;
  voyageId?: string;
  visaNeeded?: boolean;
  flightWithWithout?: string;
  hotelName?: string;
  hotelStars?: number;
  numberOfRooms?: number;
  roomType?: string;
  mealPlan?: string;
  numberOfAdults: number;
  numberOfChildren: number;
  childrenAges?: string;
  departureDate: Date;
  returnDate?: Date;
  specialRequests?: string;
}

export interface CreateBilletterieRequest {
  nom: string;
  prenom: string;
  email: string;
  phone?: string;
  destination: string;
  departureCity?: string;
  arrivalCity?: string;
  airlinePreference?: string;
  visaNeeded?: boolean;
  numberOfAdults: number;
  numberOfChildren: number;
  numberOfBabies: number;
  childrenAges?: string;
  departureDate: Date;
  returnDate?: Date;
  specialRequests?: string;
}

export interface CreateVisaRequest {
  nom: string;
  prenom: string;
  email: string;
  phone?: string;
  visaType: VisaTypeEnum;
  destinationCountry: string;
  passportNumber: string;
  passportExpiry: Date;
  travelDate: Date;
  professionalStatus?: string;
  guarantorStatus?: string;
  specialRequests?: string;
}

export interface CreateHotelRequest {
  nom: string;
  prenom: string;
  email: string;
  phone?: string;
  hotelPreference: HotelPreferenceEnum;
  hotelName?: string;
  hotelCategory?: string;
  city: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfRooms: number;
  numberOfPeople: number;
  roomType?: string;
  mealBasis?: string;
  specialRequests?: string;
}

export interface PaymentRequest {
  bookingId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethodEnum;
}

// ============================================
// RESPONSE DTOS
// ============================================

export interface AuthResponse {
  user: Omit<IUser, "password">;
  token: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}
