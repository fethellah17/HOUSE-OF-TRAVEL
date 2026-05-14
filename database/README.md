# DATABASE SETUP GUIDE

## Installation & Setup

### 1. Install Prisma
```bash
npm install @prisma/client
npm install -D prisma
```

### 2. Initialize Database Connection
Create or update `.env` file in the project root:

```env
# Database Connection
DATABASE_URL="postgresql://user:password@localhost:5432/house_of_travel_db"

# Alternative databases:
# MySQL: DATABASE_URL="mysql://user:password@localhost:3306/house_of_travel_db"
# SQLite: DATABASE_URL="file:./dev.db"

# Application
APP_URL="http://localhost:5173"
API_URL="http://localhost:3001"

# JWT & Security
JWT_SECRET="your-secret-key-here-min-32-chars"
JWT_EXPIRY="24h"
REFRESH_TOKEN_SECRET="your-refresh-secret-key-here"
REFRESH_TOKEN_EXPIRY="7d"

# Email Service
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="noreply@houseoftravel.com"

# Payment Gateway (if using Stripe)
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# File Upload (if using AWS S3)
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_S3_BUCKET="house-of-travel-bucket"
AWS_REGION="us-east-1"

# Admin Panel
ADMIN_EMAIL="admin@houseoftravel.com"
ADMIN_DEFAULT_PASSWORD="ChangeMe123!"
