-- ============================================
-- HOUSE OF TRAVEL - DATABASE SCHEMA
-- ============================================

-- ============================================
-- 1. USERS & AUTHENTICATION
-- ============================================

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  is_email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- ============================================

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  passport_number VARCHAR(50),
  passport_expiry DATE,
  nationality VARCHAR(100),
  date_of_birth DATE,
  gender VARCHAR(20),
  address VARCHAR(255),
  city VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  marital_status VARCHAR(50),
  occupation VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- ============================================

CREATE TABLE email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_email_verification_tokens_token ON email_verification_tokens(token);
CREATE INDEX idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);

-- ============================================

CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);

-- ============================================

CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  role VARCHAR(50) DEFAULT 'moderator' CHECK (role IN ('admin', 'moderator', 'agent')),
  permissions JSON,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX idx_admin_users_role ON admin_users(role);

-- ============================================
-- 2. VOYAGES & TRAVEL PACKAGES
-- ============================================

CREATE TABLE voyages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Omrah', 'Voyage Organisé', 'Voyage à la Carte', 'Voyage National')),
  price DECIMAL(10, 2) NOT NULL,
  duration VARCHAR(50),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'normal' CHECK (status IN ('normal', 'almost-full', 'full', 'limited-offer')),
  max_capacity INT DEFAULT 0,
  current_bookings INT DEFAULT 0,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL
);

CREATE INDEX idx_voyages_category ON voyages(category);
CREATE INDEX idx_voyages_status ON voyages(status);
CREATE INDEX idx_voyages_start_date ON voyages(start_date);
CREATE INDEX idx_voyages_created_at ON voyages(created_at);

-- ============================================

CREATE TABLE voyage_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voyage_id UUID NOT NULL,
  stage_number INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  hotel_name VARCHAR(255),
  city VARCHAR(100),
  google_maps_url VARCHAR(500),
  duration_days INT,
  icon VARCHAR(50) DEFAULT 'default' CHECK (icon IN ('kaaba', 'dome', 'default')),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (voyage_id) REFERENCES voyages(id) ON DELETE CASCADE
);

CREATE INDEX idx_voyage_stages_voyage_id ON voyage_stages(voyage_id);

-- ============================================

CREATE TABLE voyage_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voyage_id UUID NOT NULL,
  feature VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (voyage_id) REFERENCES voyages(id) ON DELETE CASCADE
);

CREATE INDEX idx_voyage_features_voyage_id ON voyage_features(voyage_id);

-- ============================================

CREATE TABLE voyage_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voyage_id UUID NOT NULL UNIQUE,
  flight_type VARCHAR(100),
  visa_required BOOLEAN DEFAULT FALSE,
  room_type VARCHAR(100),
  meal_plan VARCHAR(100),
  guide_language VARCHAR(100),
  departure_city VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (voyage_id) REFERENCES voyages(id) ON DELETE CASCADE
);

CREATE INDEX idx_voyage_details_voyage_id ON voyage_details(voyage_id);

-- ============================================
-- 3. BOOKINGS & ORDERS
-- ============================================

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  voyage_id UUID NOT NULL,
  booking_number VARCHAR(50) UNIQUE NOT NULL,
  total_adults INT DEFAULT 0,
  total_children INT DEFAULT 0,
  total_babies INT DEFAULT 0,
  total_price DECIMAL(10, 2) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'cancelled', 'refunded')),
  booking_status VARCHAR(50) DEFAULT 'pending' CHECK (booking_status IN ('confirmed', 'pending', 'cancelled')),
  departure_date DATE,
  return_date DATE,
  special_requests TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (voyage_id) REFERENCES voyages(id) ON DELETE CASCADE
);

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_voyage_id ON bookings(voyage_id);
CREATE INDEX idx_bookings_booking_number ON bookings(booking_number);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);

-- ============================================

CREATE TABLE booking_travelers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  gender VARCHAR(20),
  passport_number VARCHAR(50),
  passport_expiry DATE,
  traveler_type VARCHAR(50) CHECK (traveler_type IN ('adult', 'child', 'baby')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

CREATE INDEX idx_booking_travelers_booking_id ON booking_travelers(booking_id);

-- ============================================

CREATE TABLE booking_room_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL,
  room_number INT,
  room_type VARCHAR(100),
  number_of_guests INT,
  special_requests TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

CREATE INDEX idx_booking_room_details_booking_id ON booking_room_details(booking_id);

-- ============================================
-- 4. REQUESTS & COMMUNICATIONS
-- ============================================

CREATE TABLE devis_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  destination VARCHAR(255),
  voyage_id UUID,
  visa_needed BOOLEAN DEFAULT FALSE,
  flight_with_without VARCHAR(50),
  hotel_name VARCHAR(255),
  hotel_stars INT,
  number_of_rooms INT,
  room_type VARCHAR(100),
  meal_plan VARCHAR(100),
  number_of_adults INT DEFAULT 0,
  number_of_children INT DEFAULT 0,
  children_ages VARCHAR(255),
  departure_date DATE,
  return_date DATE,
  special_requests TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'quoted', 'cancelled')),
  assigned_to UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (voyage_id) REFERENCES voyages(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_to) REFERENCES admin_users(id) ON DELETE SET NULL
);

CREATE INDEX idx_devis_requests_user_id ON devis_requests(user_id);
CREATE INDEX idx_devis_requests_status ON devis_requests(status);
CREATE INDEX idx_devis_requests_assigned_to ON devis_requests(assigned_to);
CREATE INDEX idx_devis_requests_created_at ON devis_requests(created_at);
CREATE INDEX idx_devis_requests_is_read ON devis_requests(is_read);

-- ============================================

CREATE TABLE billetterie_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  destination VARCHAR(255),
  departure_city VARCHAR(100),
  arrival_city VARCHAR(100),
  airline_preference VARCHAR(255),
  visa_needed BOOLEAN DEFAULT FALSE,
  number_of_adults INT DEFAULT 0,
  number_of_children INT DEFAULT 0,
  number_of_babies INT DEFAULT 0,
  children_ages VARCHAR(255),
  departure_date DATE,
  return_date DATE,
  special_requests TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'quoted', 'booked', 'cancelled')),
  assigned_to UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_to) REFERENCES admin_users(id) ON DELETE SET NULL
);

CREATE INDEX idx_billetterie_requests_user_id ON billetterie_requests(user_id);
CREATE INDEX idx_billetterie_requests_status ON billetterie_requests(status);
CREATE INDEX idx_billetterie_requests_assigned_to ON billetterie_requests(assigned_to);
CREATE INDEX idx_billetterie_requests_created_at ON billetterie_requests(created_at);
CREATE INDEX idx_billetterie_requests_is_read ON billetterie_requests(is_read);

-- ============================================

CREATE TABLE visa_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  visa_type VARCHAR(50) CHECK (visa_type IN ('e-visa', 'dossier')),
  destination_country VARCHAR(100),
  passport_number VARCHAR(50),
  passport_expiry DATE,
  travel_date DATE,
  professional_status VARCHAR(255),
  guarantor_status VARCHAR(255),
  special_requests TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'approved', 'rejected')),
  assigned_to UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_to) REFERENCES admin_users(id) ON DELETE SET NULL
);

CREATE INDEX idx_visa_requests_user_id ON visa_requests(user_id);
CREATE INDEX idx_visa_requests_status ON visa_requests(status);
CREATE INDEX idx_visa_requests_assigned_to ON visa_requests(assigned_to);
CREATE INDEX idx_visa_requests_created_at ON visa_requests(created_at);
CREATE INDEX idx_visa_requests_is_read ON visa_requests(is_read);

-- ============================================

CREATE TABLE hotel_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  hotel_preference VARCHAR(50) CHECK (hotel_preference IN ('specific', 'suggest')),
  hotel_name VARCHAR(255),
  hotel_category VARCHAR(100),
  city VARCHAR(100),
  check_in_date DATE,
  check_out_date DATE,
  number_of_rooms INT,
  number_of_people INT,
  room_type VARCHAR(100),
  meal_basis VARCHAR(100),
  special_requests TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'proposed', 'confirmed', 'cancelled')),
  assigned_to UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_to) REFERENCES admin_users(id) ON DELETE SET NULL
);

CREATE INDEX idx_hotel_requests_user_id ON hotel_requests(user_id);
CREATE INDEX idx_hotel_requests_status ON hotel_requests(status);
CREATE INDEX idx_hotel_requests_assigned_to ON hotel_requests(assigned_to);
CREATE INDEX idx_hotel_requests_created_at ON hotel_requests(created_at);
CREATE INDEX idx_hotel_requests_is_read ON hotel_requests(is_read);

-- ============================================
-- 5. MESSAGING
-- ============================================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  subject VARCHAR(255),
  content TEXT,
  message_type VARCHAR(50) CHECK (message_type IN ('Billetterie', 'Devis')),
  related_request_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_is_read ON messages(is_read);

-- ============================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title VARCHAR(255),
  message TEXT,
  type VARCHAR(50) CHECK (type IN ('booking', 'devis', 'visa', 'hotel', 'system')),
  related_entity_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- ============================================
-- 6. PAYMENTS
-- ============================================

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL,
  user_id UUID NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  payment_method VARCHAR(50) CHECK (payment_method IN ('card', 'bank_transfer', 'paypal')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id VARCHAR(255) UNIQUE,
  payment_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);

-- ============================================

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL,
  user_id UUID NOT NULL,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  issued_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'issued', 'paid', 'overdue', 'cancelled')),
  pdf_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_invoices_booking_id ON invoices(booking_id);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_status ON invoices(status);

-- ============================================
-- 7. AUDIT & LOGS
-- ============================================
-- 8. CONFIGURATION TABLES (DYNAMIC)
-- ============================================

CREATE TABLE visa_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_name VARCHAR(100) UNIQUE NOT NULL,
  visa_type VARCHAR(50) CHECK (visa_type IN ('e-visa', 'dossier', 'both')) DEFAULT 'both',
  required_documents JSONB,
  processing_days INT DEFAULT 5,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_visa_configs_country_name ON visa_configs(country_name);
CREATE INDEX idx_visa_configs_is_active ON visa_configs(is_active);

-- ============================================

CREATE TABLE sejour_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name VARCHAR(100) UNIQUE NOT NULL,
  service_label VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sejour_configs_is_active ON sejour_configs(is_active);
CREATE INDEX idx_sejour_configs_display_order ON sejour_configs(display_order);

-- ============================================
-- 7. AUDIT & LOGS
-- ============================================

CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  entity_type VARCHAR(100),
  entity_id UUID,
  action VARCHAR(50) CHECK (action IN ('create', 'update', 'delete', 'view')),
  changes JSON,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity_type ON activity_logs(entity_type);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

