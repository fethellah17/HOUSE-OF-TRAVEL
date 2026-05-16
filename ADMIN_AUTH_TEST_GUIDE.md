# 🧪 Admin Authentication Testing Guide

## Quick Test Checklist

### ✅ Prerequisites
- [ ] Database migration executed (`001_add_admin_profiles.sql`)
- [ ] Admin user created in Supabase Auth
- [ ] Admin user linked to `admin_users` table
- [ ] Application built successfully (`npm run build`)
- [ ] Development server running (`npm run dev`)

---

## 🔐 Test 1: Admin Login

### Test Case 1.1: Valid Admin Login
**Steps**:
1. Navigate to `http://localhost:5173/admin`
2. Enter credentials:
   - Email: `Houseoftravel@admin.dz`
   - Password: `admin123` (or your configured password)
3. Click **Se connecter**

**Expected Result**:
- ✅ Toast notification: "Connexion réussie !"
- ✅ Redirected to Admin Panel dashboard
- ✅ Sidebar shows admin navigation items
- ✅ No console errors

### Test Case 1.2: Invalid Credentials
**Steps**:
1. Navigate to `http://localhost:5173/admin`
2. Enter incorrect credentials:
   - Email: `wrong@email.com`
   - Password: `wrongpassword`
3. Click **Se connecter**

**Expected Result**:
- ❌ Toast notification: "Identifiants invalides"
- ❌ Remains on login page
- ❌ Password field cleared
- ✅ No console errors (except expected auth error)

### Test Case 1.3: Non-Admin User Login
**Steps**:
1. Create a regular user in Supabase Auth (not in `admin_users` table)
2. Navigate to `http://localhost:5173/admin`
3. Enter regular user credentials
4. Click **Se connecter**

**Expected Result**:
- ❌ Toast notification: "Accès non autorisé. Compte administrateur requis."
- ❌ User automatically signed out
- ❌ Remains on login page
- ✅ No access to admin panel

### Test Case 1.4: Empty Fields
**Steps**:
1. Navigate to `http://localhost:5173/admin`
2. Leave email and password empty
3. Click **Se connecter**

**Expected Result**:
- ❌ Toast notification: "Veuillez remplir tous les champs"
- ❌ Remains on login page
- ✅ No API calls made

---

## 🔑 Test 2: Password Change

### Test Case 2.1: Successful Password Change
**Steps**:
1. Log in as admin
2. Navigate to **Paramètres Admin** tab
3. Enter:
   - Ancien mot de passe: `admin123`
   - Nouveau mot de passe: `newpassword123`
   - Confirmer le nouveau mot de passe: `newpassword123`
4. Click **Mettre à jour le mot de passe**

**Expected Result**:
- ✅ Toast notification: "✅ Mot de passe mis à jour avec succès !"
- ✅ Green success banner appears for 3 seconds
- ✅ All password fields cleared
- ✅ No console errors

**Verification**:
1. Log out
2. Log in with new password: `newpassword123`
3. Should successfully log in

### Test Case 2.2: Incorrect Current Password
**Steps**:
1. Log in as admin
2. Navigate to **Paramètres Admin** tab
3. Enter:
   - Ancien mot de passe: `wrongpassword`
   - Nouveau mot de passe: `newpassword123`
   - Confirmer le nouveau mot de passe: `newpassword123`
4. Click **Mettre à jour le mot de passe**

**Expected Result**:
- ❌ Toast notification: "Le mot de passe actuel est incorrect"
- ❌ Error message under "Ancien mot de passe" field
- ❌ Password not updated
- ✅ Fields not cleared

### Test Case 2.3: Password Too Short
**Steps**:
1. Log in as admin
2. Navigate to **Paramètres Admin** tab
3. Enter:
   - Ancien mot de passe: `admin123`
   - Nouveau mot de passe: `12345` (only 5 characters)
   - Confirmer le nouveau mot de passe: `12345`
4. Click **Mettre à jour le mot de passe**

**Expected Result**:
- ❌ Error message: "Le mot de passe doit contenir au moins 6 caractères"
- ❌ Password not updated
- ❌ No API call made (frontend validation)

### Test Case 2.4: Password Mismatch
**Steps**:
1. Log in as admin
2. Navigate to **Paramètres Admin** tab
3. Enter:
   - Ancien mot de passe: `admin123`
   - Nouveau mot de passe: `newpassword123`
   - Confirmer le nouveau mot de passe: `differentpassword`
4. Click **Mettre à jour le mot de passe**

**Expected Result**:
- ❌ Error message: "Les mots de passe ne correspondent pas"
- ❌ Password not updated
- ❌ No API call made (frontend validation)

### Test Case 2.5: Empty Fields
**Steps**:
1. Log in as admin
2. Navigate to **Paramètres Admin** tab
3. Leave all fields empty
4. Click **Mettre à jour le mot de passe**

**Expected Result**:
- ❌ Error messages for all required fields
- ❌ Password not updated
- ❌ No API call made

---

## 🔍 Test 3: Session Management

### Test Case 3.1: Session Persistence
**Steps**:
1. Log in as admin
2. Refresh the page (F5)

**Expected Result**:
- ✅ Still logged in
- ✅ Admin panel remains accessible
- ✅ No redirect to login page

### Test Case 3.2: Logout
**Steps**:
1. Log in as admin
2. Click **Déconnexion** button
3. Confirm logout in modal

**Expected Result**:
- ✅ Toast notification: "Déconnexion réussie, à bientôt !"
- ✅ Redirected to home page (`/`)
- ✅ Session cleared
- ✅ Accessing `/admin` redirects to login

---

## 🛠️ Test 4: Error Handling

### Test Case 4.1: Network Error Simulation
**Steps**:
1. Open browser DevTools → Network tab
2. Set throttling to "Offline"
3. Navigate to `/admin`
4. Enter valid credentials
5. Click **Se connecter**

**Expected Result**:
- ❌ Toast notification: "Erreur lors de la connexion"
- ❌ Remains on login page
- ✅ Loading state ends
- ✅ No app crash

### Test Case 4.2: Supabase Connection Error
**Steps**:
1. Temporarily modify `.env` with invalid Supabase URL
2. Restart dev server
3. Navigate to `/admin`
4. Enter credentials

**Expected Result**:
- ❌ Error toast displayed
- ✅ App doesn't crash
- ✅ Error logged to console

---

## 📊 Test Results Template

```
Test Date: _______________
Tester: _______________

| Test Case | Status | Notes |
|-----------|--------|-------|
| 1.1 Valid Admin Login | ☐ Pass ☐ Fail | |
| 1.2 Invalid Credentials | ☐ Pass ☐ Fail | |
| 1.3 Non-Admin User | ☐ Pass ☐ Fail | |
| 1.4 Empty Fields | ☐ Pass ☐ Fail | |
| 2.1 Successful Password Change | ☐ Pass ☐ Fail | |
| 2.2 Incorrect Current Password | ☐ Pass ☐ Fail | |
| 2.3 Password Too Short | ☐ Pass ☐ Fail | |
| 2.4 Password Mismatch | ☐ Pass ☐ Fail | |
| 2.5 Empty Fields | ☐ Pass ☐ Fail | |
| 3.1 Session Persistence | ☐ Pass ☐ Fail | |
| 3.2 Logout | ☐ Pass ☐ Fail | |
| 4.1 Network Error | ☐ Pass ☐ Fail | |
| 4.2 Supabase Error | ☐ Pass ☐ Fail | |

Overall Status: ☐ All Pass ☐ Some Failures
```

---

## 🐛 Common Issues & Solutions

### Issue: "Session expirée" message
**Cause**: Supabase session expired (default: 1 hour)  
**Solution**: Log in again

### Issue: Password change succeeds but can't log in with new password
**Cause**: Browser cached old session  
**Solution**: Clear browser cache or use incognito mode

### Issue: "Accès non autorisé" for valid admin
**Cause**: Missing entry in `admin_users` table  
**Solution**: Run SQL:
```sql
INSERT INTO admin_users (user_id, role, is_active)
VALUES ('<your_auth_user_id>', 'admin', TRUE);
```

### Issue: Build errors after changes
**Cause**: TypeScript compilation errors  
**Solution**: Run `npm run build` and check console output

---

## 📝 Manual Testing Script

Copy and paste this into your testing notes:

```
✅ ADMIN LOGIN TESTS
[ ] Valid credentials → Success
[ ] Invalid email → Error toast
[ ] Invalid password → Error toast
[ ] Non-admin user → Access denied
[ ] Empty fields → Validation error

✅ PASSWORD CHANGE TESTS
[ ] Valid change → Success + fields cleared
[ ] Wrong current password → Error
[ ] Short password (< 6 chars) → Validation error
[ ] Mismatched passwords → Validation error
[ ] Empty fields → Validation errors

✅ SESSION TESTS
[ ] Page refresh → Still logged in
[ ] Logout → Redirected to home
[ ] Access /admin after logout → Redirected to login

✅ ERROR HANDLING
[ ] Offline mode → Graceful error
[ ] Invalid Supabase config → Error message
```

---

**Testing Completed**: ☐  
**All Tests Passed**: ☐  
**Issues Found**: _______________  
**Date**: _______________
