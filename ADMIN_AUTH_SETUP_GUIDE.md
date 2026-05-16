# 🔐 Admin Authentication Migration Guide

## Overview
This guide documents the migration from static mock authentication to live Supabase Auth integration for administrative users.

## ✅ What Has Been Implemented

### 1. **Live Login Logic** (`AdminLogin` Component)
- **Location**: `src/pages/AdminPage.tsx` (AdminLogin component)
- **Changes**:
  - Replaced hardcoded credential check with `supabase.auth.signInWithPassword()`
  - Added verification against `admin_users` table to ensure only admin accounts can access
  - Proper error handling with user-friendly toast notifications
  - Automatic session management via Supabase Auth

**Code Flow**:
```typescript
1. User submits email + password
2. Call supabase.auth.signInWithPassword({ email, password })
3. If error → Show "Identifiants invalides" toast
4. If success → Verify user exists in admin_users table
5. If not admin → Sign out + Show "Accès non autorisé" toast
6. If admin → Navigate to Admin Panel
```

### 2. **Real Password Update Handler** (`AdminSettingsView` Component)
- **Location**: `src/pages/AdminPage.tsx` (AdminSettingsView component)
- **Changes**:
  - Replaced in-memory password update with `supabase.auth.updateUser()`
  - Added current password verification via re-authentication
  - Frontend validation:
    - New password minimum 6 characters
    - Confirmation password must match
  - Clear input fields on success
  - Success toast: "✅ Mot de passe mis à jour avec succès !"

**Code Flow**:
```typescript
1. Validate form inputs (length, match)
2. Get current authenticated user
3. Verify current password by re-authenticating
4. If verification fails → Show error toast
5. Call supabase.auth.updateUser({ password: newPassword })
6. If success → Clear fields + Show success toast
7. If error → Show error toast
```

### 3. **Database Schema** (`admin_profiles` Table)
- **Location**: `database/migrations/001_add_admin_profiles.sql`
- **Features**:
  - Links to Supabase Auth users via `user_id`
  - Role-based access control (super_admin, admin, moderator)
  - Row Level Security (RLS) policies
  - Automatic `updated_at` timestamp trigger
  - Indexes for performance optimization

**Table Structure**:
```sql
admin_profiles (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE → auth.users(id),
  email VARCHAR(255) UNIQUE,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## 🚀 Setup Instructions

### Step 1: Run Database Migration

1. **Open Supabase SQL Editor**:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor

2. **Execute Migration**:
   ```bash
   # Copy and paste the contents of:
   database/migrations/001_add_admin_profiles.sql
   ```
   - Click "Run" to execute the migration

### Step 2: Create Admin User in Supabase Auth

**Option A: Via Supabase Dashboard**
1. Go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter:
   - Email: `Houseoftravel@admin.dz`
   - Password: `admin123` (or your preferred secure password)
   - Auto Confirm User: ✅ **Enabled**
4. Click **Create User**
5. Copy the generated `user_id` (UUID)

**Option B: Via SQL**
```sql
-- This creates a user in auth.users
-- Note: You may need to use Supabase Dashboard for this
-- as direct auth.users inserts require service role key
```

### Step 3: Link Admin User to admin_users Table

After creating the auth user, insert the admin profile:

```sql
-- Replace <auth_user_id> with the UUID from Step 2
INSERT INTO admin_users (user_id, role, is_active)
VALUES (
  '<auth_user_id>',
  'admin',
  TRUE
);
```

**Example**:
```sql
INSERT INTO admin_users (user_id, role, is_active)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'admin',
  TRUE
);
```

### Step 4: (Optional) Create admin_profiles Record

If you want to use the new `admin_profiles` table:

```sql
INSERT INTO admin_profiles (user_id, email, full_name, role)
VALUES (
  '<auth_user_id>',
  'Houseoftravel@admin.dz',
  'House of Travel Admin',
  'super_admin'
);
```

### Step 5: Test the Integration

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Test Login**:
   - Navigate to `/admin`
   - Enter credentials:
     - Email: `Houseoftravel@admin.dz`
     - Password: `admin123` (or your password)
   - Should successfully log in to Admin Panel

4. **Test Password Change**:
   - Navigate to **Paramètres Admin** tab
   - Enter:
     - Ancien mot de passe: `admin123`
     - Nouveau mot de passe: `newpassword123`
     - Confirmer: `newpassword123`
   - Click **Mettre à jour le mot de passe**
   - Should see success toast
   - Log out and log back in with new password

## 🔒 Security Features

### Authentication
- ✅ Passwords hashed by Supabase Auth (bcrypt)
- ✅ Session tokens managed securely
- ✅ Automatic session expiration
- ✅ HTTPS-only cookies (production)

### Authorization
- ✅ Admin verification via `admin_users` table
- ✅ Non-admin users cannot access admin panel
- ✅ Row Level Security (RLS) policies on admin_profiles

### Password Management
- ✅ Current password verification before update
- ✅ Minimum 6 character requirement
- ✅ Password confirmation validation
- ✅ No plaintext password storage

## 📋 Validation Checklist

- [ ] Database migration executed successfully
- [ ] Admin user created in Supabase Auth
- [ ] Admin user linked to `admin_users` table
- [ ] Login works with Supabase credentials
- [ ] Non-admin users are blocked from admin panel
- [ ] Password change updates Supabase Auth
- [ ] Old password verification works
- [ ] New password validation works (min 6 chars)
- [ ] Password confirmation matching works
- [ ] Success/error toasts display correctly
- [ ] Build completes without errors

## 🐛 Troubleshooting

### Issue: "Identifiants invalides" on correct credentials
**Solution**: 
- Verify user exists in Supabase Auth Dashboard
- Check email is confirmed (auto_confirm should be enabled)
- Verify Supabase credentials in `.env` file

### Issue: "Accès non autorisé" after successful login
**Solution**:
- Verify user exists in `admin_users` table
- Run query: `SELECT * FROM admin_users WHERE user_id = '<your_user_id>';`
- If missing, insert the record (see Step 3)

### Issue: Password change fails
**Solution**:
- Check browser console for detailed error
- Verify current password is correct
- Ensure new password meets minimum requirements (6 chars)
- Check Supabase Auth logs in dashboard

### Issue: RLS policy errors
**Solution**:
- Verify RLS policies are created correctly
- Check if user has proper role in `admin_profiles`
- Temporarily disable RLS for testing: `ALTER TABLE admin_profiles DISABLE ROW LEVEL SECURITY;`

## 🔄 Migration from Old System

### Removed Dependencies
The following mock authentication code is **no longer used**:
- `DEFAULT_ADMIN_CREDENTIALS` in `DataContext.tsx`
- `validateAdminLogin()` function
- `updateAdminPassword()` function
- `adminCredentials` state

### Backward Compatibility
- Old mock data for demo users and requests remains unchanged
- Only admin authentication has been migrated
- User authentication (LoginModal) already uses Supabase Auth

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Password Reset Flow](https://supabase.com/docs/guides/auth/auth-password-reset)

## 🎯 Next Steps

1. **Add Password Reset Flow**: Implement forgot password for admin users
2. **Multi-Factor Authentication**: Add 2FA for enhanced security
3. **Audit Logging**: Track admin login/logout events
4. **Session Management**: Add "Remember Me" functionality
5. **Role-Based Permissions**: Implement granular permissions per admin role

---

**Migration Completed**: ✅  
**Last Updated**: May 16, 2026  
**Version**: 1.0.0
