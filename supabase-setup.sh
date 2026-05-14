#!/bin/bash

# HOUSE OF TRAVEL - SUPABASE QUICK START

echo "================================"
echo "House of Travel - Supabase Setup"
echo "================================"
echo ""

# Check if @supabase/supabase-js is installed
if ! npm list @supabase/supabase-js > /dev/null 2>&1; then
  echo "Installing @supabase/supabase-js..."
  npm install @supabase/supabase-js
  echo "✓ Installation complete"
else
  echo "✓ @supabase/supabase-js already installed"
fi

echo ""
echo "================================"
echo "Next Steps:"
echo "================================"
echo ""
echo "1. Verify your .env file has these variables:"
echo "   - VITE_SUPABASE_URL"
echo "   - VITE_SUPABASE_KEY"
echo ""
echo "2. Import services in your components:"
echo "   import { useAuth } from '@/hooks/useAuth'"
echo "   import { useVoyages } from '@/hooks/useVoyages'"
echo "   import { useUserBookings } from '@/hooks/useBookings'"
echo ""
echo "3. Use the hooks in your React components:"
echo "   const { user, isAuthenticated } = useAuth()"
echo "   const { voyages } = useVoyages()"
echo ""
echo "4. For more details, see SUPABASE_SETUP.txt"
echo ""
echo "✓ Setup complete! Happy coding!"
