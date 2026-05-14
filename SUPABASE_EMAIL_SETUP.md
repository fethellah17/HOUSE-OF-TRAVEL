# Supabase Email OTP Configuration Guide

## Overview

This guide explains how to set up Supabase to send professional OTP (One-Time Password) emails for user signup verification.

## Prerequisites

- Supabase project created
- Admin access to Supabase dashboard
- SMTP credentials (if using custom email provider) OR use Supabase's built-in email service

## Steps to Configure Email Templates

### Option 1: Using Supabase Built-in Email Service (Recommended)

#### Step 1: Enable Email Confirmations
1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **Authentication** → **Providers**
3. Click on **Email**
4. Enable **Email Confirmations** toggle
5. Set **OTP Expiry** to 600 seconds (10 minutes)
6. Save changes

#### Step 2: Customize Email Template
1. Go to **Authentication** → **Email Templates**
2. Click on **Confirm signup email**
3. Select **HTML** tab
4. Replace the default template with the content from `SUPABASE_EMAIL_TEMPLATE.html`
5. Click **Save**

#### Step 3: Test the Setup
1. Run your app locally: `npm run dev`
2. Try signing up with a test email
3. Check your email for the OTP code
4. Verify the email contains the formatting from your template

### Option 2: Using Custom SMTP Provider (SendGrid, Mailgun, etc.)

#### Step 1: Get SMTP Credentials
Contact your email provider and obtain:
- SMTP Host
- SMTP Port (usually 587 for TLS or 465 for SSL)
- SMTP Username
- SMTP Password

#### Step 2: Configure in Supabase
1. Go to **Project Settings** → **Auth** → **Email**
2. Under "SMTP Settings", enable **Use custom SMTP**
3. Enter your SMTP credentials:
   - SMTP Host
   - SMTP Port
   - SMTP User
   - SMTP Password
   - From Email (e.g., noreply@houseoftravel.com)
4. Save changes

#### Step 3: Set Email Template
1. Go to **Authentication** → **Email Templates**
2. Customize the "Confirm signup email" template
3. Paste the HTML from `SUPABASE_EMAIL_TEMPLATE.html`
4. Save

### Option 3: Using SendGrid (Popular Choice)

#### Step 1: Create SendGrid Account
- Sign up at https://sendgrid.com
- Verify your sender email/domain
- Create an API key

#### Step 2: Connect to Supabase
1. In **Project Settings** → **Auth** → **Email**
2. Enable **Use custom SMTP**
3. Configure as:
   ```
   SMTP Host: smtp.sendgrid.net
   SMTP Port: 587
   SMTP User: apikey
   SMTP Password: [Your SendGrid API Key]
   From Email: noreply@yourdomain.com
   ```

#### Step 3: Update Email Template
1. In **Email Templates**, edit "Confirm signup email"
2. Replace content with `SUPABASE_EMAIL_TEMPLATE.html`
3. Save

## Email Template Variables

The template uses the following Supabase variables:
- `{{ .Token }}` - The 6-digit OTP code
- `{{ .ConfirmationURL }}` - Link to confirm email (if needed)
- `{{ .Email }}` - User's email address (optional, can be added)

## Testing the OTP Flow

### Manual Testing

```bash
# 1. Start your app
npm run dev

# 2. Go to signup page
# 3. Fill in registration form
# 4. Check email for OTP code
# 5. Enter code in verification step
# 6. Account should be confirmed
```

### Using Supabase CLI for Testing

```bash
# 1. Install Supabase CLI
npm install -g supabase

# 2. Start local Supabase instance
supabase start

# 3. Check email inbox at: http://localhost:54324/functions/v1/smtp-debug

# 4. View OTP in console
```

## Frontend Code - Already Implemented

Your app now has:

✅ **src/services/authService.ts**
- `signUp(request)` - Sends OTP email
- `verifyOTP(email, token)` - Verifies the code
- `resendOTP(email)` - Resends OTP code

✅ **src/components/LoginModal.tsx**
- Step 1: Collect nom, prenom, email
- Step 2: Verify OTP with resend capability
- Step 3: Collect phone number
- Step 4: Set password & create account

## Email OTP Flow

```
User Registration
    ↓
Step 1: Fill form (nom, prenom, email)
    ↓
Step 2: Supabase sends OTP email → User receives email with PIN
    ↓
Step 3: User enters 6-digit PIN
    ↓
Step 4: Frontend calls verifyOTP()
    ↓
Step 5: Email confirmed, user profile created
    ↓
Step 6: Complete registration (phone, password)
    ↓
Account Active!
```

## Troubleshooting

### Issue: Email not received

**Solution:**
1. Check spam/junk folder
2. Verify email address is correct
3. Check Supabase logs: **Auth** → **Logs**
4. Verify email provider settings

### Issue: OTP code shows as `{{ .Token }}`

**Solution:**
1. Check template was saved correctly
2. Clear browser cache
3. Re-login to Supabase dashboard
4. Template variable should be: `{{ .Token }}` (with double braces)

### Issue: Code expired too quickly

**Solution:**
1. In Email Provider settings, increase **OTP Expiry**
2. Current setting: 600 seconds (10 minutes)
3. Can increase up to 3600 seconds (1 hour)

### Issue: SMTP Authentication Failed

**Solution:**
1. Double-check SMTP credentials
2. Verify email provider account is active
3. Check if API key is still valid
4. Ensure from_email is verified with provider

## Environment Variables

Make sure your `.env` file contains:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-public-key
```

These should already be set in your `.env` file.

## Security Best Practices

✅ **Implemented:**
- OTP code expires in 10 minutes
- OTP is only valid once
- Email verification required before account activation
- Password set during account creation (not sent via email)

✅ **Email contains security notice:**
- Warns users not to share OTP
- Clarifies HOUSE OF TRAVEL never requests OTP via email
- Provides security contact info

## Testing Different Scenarios

### Test Successful Registration

1. Go to signup
2. Fill form with test data
3. Enter received OTP
4. Complete phone and password
5. Verify redirect to home page

### Test OTP Resend

1. Start signup
2. Click "Renvoyer le code" in step 2
3. Verify new OTP received (usually different from first)
4. Use new OTP to verify

### Test Invalid OTP

1. Start signup
2. Enter wrong code
3. Verify error message: "Code invalide ou expiré"
4. Can retry with correct code

### Test Expired OTP

1. Start signup
2. Wait more than 10 minutes
3. Try to verify
4. Verify error message
5. Click "Renvoyer le code" to get new OTP

## Monitoring

### View OTP Delivery Logs

1. Go to **Supabase Dashboard** → **Auth** → **Logs**
2. Filter by "signup_confirm" events
3. Check for any errors

### Monitor Email Provider

- **SendGrid**: Dashboard → **Mail Activity**
- **Mailgun**: Dashboard → **Logs**
- **Gmail**: Gmail sent folder + bounce notifications
- **Supabase**: Built-in logs in **Auth** section

## Customization

To modify email template styling:

1. Edit `SUPABASE_EMAIL_TEMPLATE.html` locally
2. Update colors (currently using #4B2C7F and #2C5F2D)
3. Modify company name and URLs
4. Update social links
5. Paste updated HTML into Supabase Email Templates
6. Test with new signup

## Next Steps

1. ✅ Configure email provider (built-in or custom SMTP)
2. ✅ Add HTML template to Supabase
3. ✅ Enable email confirmations
4. ✅ Test signup flow with real email
5. ✅ Monitor email delivery
6. 🔄 Customize template with your branding
7. 🔄 Set up email bounce handling
8. 🔄 Create automated email for password reset

## Support

For issues with:
- **Supabase Email**: Check https://supabase.com/docs/guides/auth/auth-email-otp
- **SendGrid**: https://sendgrid.com/docs/
- **Mailgun**: https://www.mailgun.com/docs/
- **Your App**: Check browser console for errors

