# ⚡ Admin Authentication - Quick Start

## 🚀 5-Minute Setup

### Step 1: Run Database Migration (2 min)
```sql
-- Copy/paste this into Supabase SQL Editor
-- File: database/migrations/001_add_admin_profiles.sql
```
1. Open Supabase Dashboard → SQL Editor
2. Copy entire contents of `001_add_admin_profiles.sql`
3. Click **Run**

### Step 2: Create Admin User (2 min)
**In Supabase Dashboard**:
1. Go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter:
   - Email: `Houseoftravel@admin.dz`
   - Password: `admin123`
   - ✅ Auto Confirm User
4. Click **Create User**
5. **Copy the user_id** (UUID)

### Step 3: Link to admin_users Table (1 min)
```sql
-- Replace <user_id> with the UUID from Step 2
INSERT INTO admin_users (user_id, role, is_active)
VALUES ('<user_id>', 'admin', TRUE);
```

### Step 4: Test Login
1. Run: `npm run dev`
2. Navigate to: `http://localhost:5173/admin`
3. Login with:
   - Email: `Houseoftravel@admin.dz`
   - Password: `admin123`

---

## ✅ Quick Test

### Test Login
```
✓ Valid credentials → Success
✓ Invalid credentials → Error toast
✓ Non-admin user → Access denied
```

### Test Password Change
```
✓ Navigate to "Paramètres Admin"
✓ Enter current password: admin123
✓ Enter new password: newpassword123
✓ Confirm new password: newpassword123
✓ Click "Mettre à jour le mot de passe"
✓ See success toast
✓ Logout and login with new password
```

---

## 🔧 Troubleshooting

### "Identifiants invalides"
→ Check user exists in Supabase Auth  
→ Verify email is confirmed

### "Accès non autorisé"
→ Check user exists in `admin_users` table  
→ Run: `SELECT * FROM admin_users WHERE user_id = '<your_id>';`

### Build Errors
→ Run: `npm run build`  
→ Check console output

---

## 📚 Full Documentation

- **Setup Guide**: `ADMIN_AUTH_SETUP_GUIDE.md`
- **Testing Guide**: `ADMIN_AUTH_TEST_GUIDE.md`
- **Migration Summary**: `ADMIN_AUTH_MIGRATION_SUMMARY.md`

---

## 🎯 What Changed

### Login (AdminLogin component)
```typescript
// OLD: Mock validation
if (email === "Houseoftravel@admin.dz" && password === "admin123") {
  onLogin();
}

// NEW: Supabase Auth
const { data, error } = await supabase.auth.signInWithPassword({
  email, password
});
// + Admin verification via admin_users table
```

### Password Change (AdminSettingsView component)
```typescript
// OLD: In-memory update
updateAdminPassword(currentPassword, newPassword);

// NEW: Supabase Auth
await supabase.auth.updateUser({
  password: newPassword
});
```

---

## ✨ Key Features

- ✅ Secure password hashing (bcrypt)
- ✅ Session management (JWT)
- ✅ Admin verification via database
- ✅ Password validation (min 6 chars)
- ✅ Current password verification
- ✅ Error handling with toast notifications
- ✅ Row Level Security (RLS)

---

**Status**: ✅ Ready to Use  
**Build**: ✅ Passing  
**Docs**: ✅ Complete
