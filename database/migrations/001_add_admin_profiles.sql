-- ============================================
-- ADMIN PROFILES TABLE MIGRATION
-- ============================================
-- This migration adds a dedicated admin_profiles table
-- to support Supabase Auth integration for admin users
-- ============================================

-- Create admin_profiles table
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'moderator')),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_profiles_user_id ON admin_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_email ON admin_profiles(email);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_is_active ON admin_profiles(is_active);

-- Add RLS (Row Level Security) policies
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can read their own profile
CREATE POLICY "Admins can view their own profile"
  ON admin_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Admins can update their own profile
CREATE POLICY "Admins can update their own profile"
  ON admin_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Super admins can view all profiles
CREATE POLICY "Super admins can view all profiles"
  ON admin_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
      AND is_active = TRUE
    )
  );

-- Policy: Super admins can insert new admin profiles
CREATE POLICY "Super admins can insert admin profiles"
  ON admin_profiles
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
      AND is_active = TRUE
    )
  );

-- Policy: Super admins can update all profiles
CREATE POLICY "Super admins can update all profiles"
  ON admin_profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
      AND is_active = TRUE
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_admin_profiles_updated_at
  BEFORE UPDATE ON admin_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_profiles_updated_at();

-- ============================================
-- SEED DEFAULT ADMIN USER
-- ============================================
-- NOTE: You need to create the auth user first in Supabase Auth
-- Then insert the corresponding admin_profile record
-- 
-- Example:
-- 1. Create user in Supabase Auth Dashboard or via API:
--    Email: Houseoftravel@admin.dz
--    Password: admin123 (or your preferred password)
-- 
-- 2. After creating the auth user, insert the admin profile:
--    INSERT INTO admin_profiles (user_id, email, full_name, role)
--    VALUES (
--      '<auth_user_id_from_step_1>',
--      'Houseoftravel@admin.dz',
--      'House of Travel Admin',
--      'super_admin'
--    );
-- ============================================

-- Add comment to table
COMMENT ON TABLE admin_profiles IS 'Admin user profiles linked to Supabase Auth users';
COMMENT ON COLUMN admin_profiles.user_id IS 'References auth.users(id) from Supabase Auth';
COMMENT ON COLUMN admin_profiles.role IS 'Admin role: super_admin (full access), admin (standard), moderator (limited)';
