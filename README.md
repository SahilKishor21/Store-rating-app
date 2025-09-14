# Store Rating Application

A modern, full-stack web application that allows users to submit ratings for stores registered on the platform. Built with React, Express.js, and PostgreSQL, featuring role-based authentication, real-time rating calculations, and a beautiful responsive UI.

## 🌟 Features

### Core Functionality
- **User Authentication & Authorization** - JWT-based authentication with role management
- **Store Management** - Complete CRUD operations for stores
- **Rating System** - 1-5 star rating system with real-time average calculations
- **Role-Based Access Control** - Three distinct user roles with different permissions
- **Responsive Design** - Mobile-first design with dark/light theme support
- **Real-time Updates** - Database triggers for automatic rating calculations
- **Search & Filtering** - Advanced filtering and sorting capabilities
- **Data Validation** - Comprehensive form validation on both client and server

### User Roles & Permissions

#### System Administrator
- Add/edit/delete stores, users, and admin accounts
- Access comprehensive dashboard with system statistics
- View all users with filtering by name, email, address, and role
- Monitor all ratings and platform activity
- Full system management capabilities

#### Normal User
- Register and manage their account
- Browse and search stores by name and address
- Submit and modify ratings for stores (1-5 stars)
- View their rating history
- Update profile and password

#### Store Owner
- View their store's performance dashboard
- See detailed customer ratings and feedback
- Monitor average rating and total rating count
- Access customer insights and analytics

## 🛠 Tech Stack

### Backend
- **Framework**: Express.js
- **Database**: PostgreSQL with advanced triggers
- **Authentication**: JWT tokens with bcrypt password hashing
- **Validation**: Express Validator with custom validation rules
- **Security**: Helmet, CORS, Rate limiting

### Frontend
- **Framework**: React 18 with Vite
- **State Management**: Zustand for clean, simple state management
- **UI Components**: Shadcn/ui with Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React

### Database Features
- **Triggers**: Automatic rating calculations on insert/update/delete
- **Indexing**: Optimized queries with strategic indexes
- **Constraints**: Data integrity with comprehensive check constraints
- **Relationships**: Proper foreign key relationships with cascade options

## 📋 Requirements

- Node.js 18+
- PostgreSQL 12+ (local) or cloud database (Neon, Supabase)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/store-rating-app.git
cd store-rating-app
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure your `.env` file:**
```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (for cloud database like Neon)
DATABASE_URL=postgresql://username:password@host:5432/database?sslmode=require

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRE=7d

# CORS Configuration
CLIENT_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Database Setup

#### Option A: Cloud Database (Recommended)
1. Create a free account on [Neon](https://neon.tech) or [Supabase](https://supabase.com)
2. Create a new database
3. Copy the connection string to your `.env` file
4. Run the SQL schema in the database console

#### Option B: Local PostgreSQL
```bash
# Create local database
createdb store_rating_app

# Update .env with local database config
DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_rating_app
DB_USER=postgres
DB_PASSWORD=your_password
```

**Execute the database schema:**
```sql
-- Run the contents of migrations/create-tables.sql in your database
-- This creates all tables, triggers, indexes, and sample data
```

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure frontend `.env` file:**
```bash
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Store Rating App
```

### 5. Start the Application

```bash
# Terminal 1 - Start backend
cd backend
npm start

# Terminal 2 - Start frontend
cd frontend
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 👤 Default Admin Account

**Demo Credentials:**
- Email: `test@admin.com`
- Password: `Test123!`

*Note: Create this account through registration, then update the role to 'admin' in your database.*

## 📁 Project Structure

```
store-rating-app/
├── backend/
│   ├── src/
│   │   ├── config/         # Database and authentication configuration
│   │   ├── controllers/    # Request handlers for each entity
│   │   ├── middleware/     # Authentication and validation middleware
│   │   ├── routes/         # API route definitions
│   │   └── utils/          # Helper functions and validation
│   ├── migrations/         # Database schema and sample data
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   │   ├── ui/         # Shadcn/ui components
│   │   │   ├── layout/     # Layout components
│   │   │   ├── auth/       # Authentication forms
│   │   │   ├── admin/      # Admin-specific components
│   │   │   ├── stores/     # Store-related components
│   │   │   └── common/     # Shared components
│   │   ├── pages/          # Page-level components
│   │   ├── stores/         # Zustand state management
│   │   ├── utils/          # API calls and utilities
│   │   └── lib/            # Shared utility functions
│   └── package.json
└── README.md
```

## 🔧 Development Commands

### Backend
```bash
npm start        # Start production server
npm run dev      # Start development server with nodemon (if configured)
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🎨 Key Features Explained

### Authentication System
- JWT-based authentication with secure token storage
- Role-based access control with middleware protection
- Password hashing using bcrypt with salt rounds
- Automatic token refresh and logout on expiry

### Rating System
- 1-5 star rating system with half-star display support
- Real-time average calculation using PostgreSQL triggers
- Users can update their ratings for any store
- Rating history and analytics for store owners

### Database Design
- **Normalized schema** with proper relationships
- **Automatic triggers** for rating calculations
- **Indexes** on frequently queried columns
- **Data integrity** with check constraints and foreign keys

### UI/UX Features
- **Responsive design** that works on all device sizes
- **Dark/light theme** with system preference detection
- **Loading states** and error handling throughout
- **Smooth animations** and hover effects
- **Accessibility** with proper ARIA labels

## 🔒 Security Features

### Backend Security
- Helmet.js for security headers
- CORS configuration for cross-origin requests
- Rate limiting to prevent abuse
- SQL injection prevention with parameterized queries
- Input validation and sanitization
- JWT token expiration and rotation

### Frontend Security
- XSS prevention with proper data sanitization
- CSRF protection through JWT tokens
- Secure API communication with interceptors
- Client-side validation with server-side verification

## 🚀 Deployment

### Backend Deployment Options
- **Render**: Free tier with PostgreSQL support
- **Railway**: Easy deployment with database integration
- **Vercel**: Serverless functions with database connections
- **DigitalOcean**: Traditional VPS deployment

### Frontend Deployment Options
- **Vercel**: Automatic deployments from Git
- **Netlify**: JAMstack deployment with form handling
- **Cloudflare Pages**: Fast global CDN deployment

### Environment Variables for Production
Update your `.env` files with production URLs:
```bash
# Backend
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com

# Frontend
VITE_API_URL=https://your-backend-domain.com/api
```

## 🔍 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/password` - Update password

### Store Endpoints
- `GET /api/stores` - Get all stores (with pagination, search, sort)
- `GET /api/stores/:id` - Get store by ID
- `POST /api/stores` - Create store (admin only)
- `PUT /api/stores/:id` - Update store
- `DELETE /api/stores/:id` - Delete store (admin only)
- `GET /api/stores/:id/ratings` - Get store ratings (store owner only)

### Rating Endpoints
- `POST /api/ratings` - Submit/update rating
- `GET /api/ratings/my-ratings` - Get user's ratings
- `GET /api/ratings` - Get all ratings (admin only)
- `DELETE /api/ratings/:id` - Delete rating

### User Management Endpoints (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/dashboard-stats` - Get dashboard statistics

## 🧪 Form Validation Rules

### User Registration/Profile
- **Name**: 20-60 characters (as per requirements)
- **Email**: Valid email format with normalization
- **Password**: 8-16 characters, must include uppercase letter and special character
- **Address**: Optional, maximum 400 characters

### Store Management
- **Store Name**: 1-100 characters
- **Email**: Valid email format
- **Address**: Required, maximum 400 characters

### Rating System
- **Rating**: Integer between 1-5 (inclusive)
- **One rating per user per store** (enforced by database constraint)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with proper commit messages
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request with detailed description

### Development Guidelines
- Follow existing code style and conventions
- Add comments for complex logic
- Update README if adding new features
- Test thoroughly before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🛟 Troubleshooting

### Common Issues

**Database Connection Errors:**
- Ensure your database is running and accessible
- Check connection string format and credentials
- For cloud databases, verify SSL requirements

**Authentication Issues:**
- Verify JWT_SECRET is set and consistent
- Check token expiration settings
- Ensure CORS is properly configured

**Build Errors:**
- Clear node_modules and reinstall dependencies
- Check Node.js version compatibility
- Verify all environment variables are set

### Getting Help
- Check the [Issues](https://github.com/yourusername/store-rating-app/issues) page
- Review the troubleshooting section above
- Contact the maintainers for support

## 🙏 Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Zustand](https://github.com/pmndrs/zustand) for simple state management
- [Lucide](https://lucide.dev/) for the comprehensive icon set
- [Neon](https://neon.tech/) for reliable PostgreSQL hosting

---

**Built with ❤️ using React, Express.js, and PostgreSQL**

For questions or support, please open an issue or contact the development team.