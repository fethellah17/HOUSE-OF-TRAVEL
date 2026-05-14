# 🧪 Quick Test Guide - Test Changes Right Now!

## ✅ What You Can Test Immediately

These features are **fully implemented and ready to test**:

### Test 1: Billetterie Form → Database
**Location:** Navigate to Billetterie page  
**Steps:**
1. Fill out the flight booking form (all required fields)
2. Make sure you're logged in
3. Click "Submit" button
4. Should see success toast: "Votre demande a été envoyée avec succès !"
5. **Verify in Supabase:**
   - Go to Supabase dashboard
   - Table: `billetterie_requests`
   - Should see new row with your data
6. **Verify persistence:**
   - Refresh the page
   - Form should reset (normal behavior)
   - Data is in Supabase (not lost)

**Expected Result:** ✅ Data appears in billetterie_requests table

---

### Test 2: Devis Form - Visa Path → Database
**Location:** Devis page → Select "Assistant Visa"  
**Steps:**
1. Navigate to /devis page
2. Scroll to the form section
3. Select "Assistant Visa" option
4. Fill in visa form details:
   - Choose E-visa or Dossier
   - Select destination country
   - Fill in other required fields
5. Click "Submit"
6. Should see success toast
7. **Verify in Supabase:**
   - Go to Supabase dashboard
   - Table: `visa_requests`
   - Should see new row with your data
8. **Test persistence:**
   - Refresh page
   - Data remains in Supabase

**Expected Result:** ✅ Data appears in visa_requests table

---

### Test 3: Devis Form - Travel Path → Database
**Location:** Devis page → Select Omrah/Voyage Organisé  
**Steps:**
1. Navigate to /devis page
2. Select a travel/omrah option
3. Fill in all travel details:
   - Hotel type, room type, dates, etc.
4. Click "Submit"
5. Should see success toast
6. **Verify in Supabase:**
   - Go to Supabase dashboard
   - Table: `devis_requests`
   - Should see new row with your data

**Expected Result:** ✅ Data appears in devis_requests table

---

## 🔍 How to Check Supabase

1. **Open Supabase Dashboard:**
   - Go to: https://supabase.co
   - Login with your account
   - Select your House of Travel project

2. **View Your Data:**
   - Left sidebar → "SQL Editor"
   - Or click on table name directly
   - View rows in your tables:
     - `billetterie_requests`
     - `visa_requests`
     - `devis_requests`
     - `hotel_requests`

3. **See Columns:**
   - nom, prenom, email, phone
   - destination, departure_date, etc.
   - status, is_read, created_at
   - All data from your form!

---

## 🐛 Troubleshooting if Tests Fail

### Issue: Form doesn't submit (no success toast)
**Possible Causes:**
- User not logged in (required for submission)
- Form validation failed (check required fields)
- Supabase connection issue

**Solution:**
1. Check browser console for errors (F12 → Console)
2. Verify you're logged in (check Navbar greeting)
3. Fill all required fields (look for red error messages)
4. Check Supabase URL/API key in `src/lib/supabase.ts`

### Issue: Form submits but data doesn't appear in Supabase
**Possible Causes:**
- RLS policy blocking inserts
- Wrong Supabase credentials
- Network error (but you'd see an error message)

**Solution:**
1. Check Supabase RLS policies:
   - Go to Supabase dashboard
   - Table: `billetterie_requests` (or other table)
   - Click "RLS" tab
   - Should have policy allowing authenticated users to INSERT
2. Verify API key is valid:
   - Supabase → Settings → API Keys
   - Copy the "anon" public key
   - Should match `src/lib/supabase.ts`

### Issue: Data persists but reload shows old form data
**This is expected behavior!**
- Form resets after submit (good UX)
- But YOUR DATA is saved in Supabase
- To verify: refresh page AND check Supabase table

---

## ✅ Success Indicators

### You'll know it's working when you see:

**On Form Submission:**
✅ Success toast appears: "Votre demande a été envoyée avec succès !"  
✅ Form fields clear  
✅ No console errors (F12 → Console)  

**In Supabase Dashboard:**
✅ New row appears in the table  
✅ All form fields are populated  
✅ `is_read` is `false`  
✅ `status` is `"pending"`  
✅ `created_at` has current timestamp  

**After Refresh:**
✅ Form is empty (reset)  
✅ Data still exists in Supabase  
✅ No data loss!  

---

## 📝 Test Scenarios

### Scenario 1: Complete Happy Path (5 min)
1. Login to the app
2. Go to Billetterie page
3. Fill form completely
4. Click submit
5. See success message
6. Open Supabase → Check billetterie_requests
7. See your data with all fields

### Scenario 2: Multiple Submissions (10 min)
1. Submit a billetterie form
2. Refresh page
3. Submit visa form
4. Refresh page
5. Go back to billetterie page
6. Submit another form
7. Check Supabase → Should have 2-3 rows

### Scenario 3: Data Validation (10 min)
1. Try to submit Billetterie form with empty email
2. Should see red error message (no submit)
3. Fill all required fields
4. Submit
5. Success!

---

## 🎯 What This Proves

✅ **User input is captured correctly**  
✅ **Supabase connection is working**  
✅ **Data is persisting in the database**  
✅ **No data loss on page refresh**  
✅ **Forms are properly validated**  
✅ **User ID is correctly linked**  

---

## 📊 Expected Data in Supabase

When you submit a **Billetterie form**, you should see:
```
Column Name          | Your Value
--------------------|------------------
id                   | [auto-generated UUID]
user_id              | [your auth user id]
nom                  | Your last name
prenom               | Your first name
email                | your@email.com
phone                | Your phone number
departure_city       | Paris, France
arrival_city         | New York, USA
trip_type            | aller-retour
departure_date       | 2026-06-15
return_date          | 2026-06-25
number_of_adults     | 2
number_of_children   | 1
number_of_babies     | 0
children_ages        | 8 ans
airline_preference   | AIR FRANCE
visa_needed          | true
special_requests     | Your message
status               | pending
is_read              | false
created_at           | 2026-05-14T15:30:00Z
updated_at           | 2026-05-14T15:30:00Z
```

---

## 🚀 Ready to Test Now?

1. **Make sure you're logged in** → Check Navbar for your name
2. **Go to Billetterie page** → `/billetterie`
3. **Fill and submit form** → Click the big submit button
4. **Check success message** → Should pop up in top right
5. **Verify in Supabase** → See your data in real-time!

---

## ⏱️ Time to Test Everything
- Billetterie form: 2 minutes
- Visa form: 2 minutes  
- Devis form: 2 minutes
- Verify in Supabase: 2 minutes
- **Total: 8 minutes** ⚡

---

**Happy Testing! 🎉**

If tests pass → You have working database integration ✅  
If tests fail → Check console for specific error and refer to troubleshooting above
