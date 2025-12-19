# NURTW Digital Passenger Safety & Insurance Platform

## Nigeria E-Manifest System

A comprehensive Next.js 15 application for the National Union of Road Transport Workers (NURTW) to manage passenger manifests, ensure safety, and provide digital insurance tracking.

![NURTW Platform](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-316192?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)

## 🚀 Features

### Core Functionality
- **Homepage (Landing Page)**: Nigeria E-Manifest with three main user flows
- **Passenger Flow**: No login required vehicle plate validation and manifest assignment
- **Agent Flow**: Agent code authentication with step-by-step manifest creation
- **Admin Flow**: Secure dashboard for system administration and oversight

### Technical Features
- **Next.js 15** with App Router and TypeScript
- **Prisma ORM** with PostgreSQL database
- **NextAuth.js** for secure authentication
- **React Query (TanStack)** for API state management
- **Tailwind CSS** with ShadCN UI components
- **Mobile-first responsive design**
- **Docker containerization** for easy deployment
- **QR Code generation** for manifests
- **Real-time passenger synchronization**

## 📋 Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- PostgreSQL 15+ (if running locally without Docker)

## 🚀 Quick Start (Docker - Recommended)

1. **Start the application**:
   ```bash
   docker-compose up --build
   ```

2. **Access the application**:
   - Website: http://localhost:3000
   - Database: PostgreSQL on port 5432

3. **Default Admin Login**:
   - Email: admin@nurtw.gov.ng
   - Password: admin123

## 💻 Local Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

3. **Set up the database**:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:

- **Admin**: System administrators with secure authentication
- **Park**: Transport parks/terminals with unique codes
- **Agent**: Transport agents assigned to parks with 4-digit codes
- **Manifest**: Vehicle journey records with passenger capacity
- **Passenger**: Individual passenger records with next-of-kin details

## 🚗 User Workflows

### Passenger Journey
1. Enter vehicle plate number on homepage
2. System validates and finds active manifest
3. Auto-assigns next available seat
4. Collect passenger and next-of-kin details
5. Confirmation with journey summary

### Agent Workflow
1. Login with 4-digit agent code
2. **Step 1**: Set up vehicle details (origin, destination, capacity)
3. **Step 2**: Manage passenger manifest table
4. **Step 3**: Generate QR code and finalize manifest

### Admin Dashboard
- **Overview**: System statistics and analytics
- **Agents**: Create/manage agent codes and park assignments
- **Parks**: Manage transport parks and default origins
- **Manifests**: Search, filter, and export manifest data
- **Compliance**: Passenger detail reports

## 🎨 Design System

- **NURTW Brand Colors**: Green (#008000), Red (#FF0000), White
- **Mobile-first responsive design**
- **Accessible UI components**
- **Loading states and error handling**

## 📱 API Endpoints

### Core Routes
- `POST /api/manifests/validate-plate` - Validate vehicle plate
- `POST /api/passengers` - Register passenger
- `POST /api/auth/[...nextauth]` - Authentication

### Admin Routes
- `GET /api/agents` - List agents
- `POST /api/agents` - Create agent
- `GET /api/parks` - List parks
- `POST /api/parks` - Create park

## 🐳 Docker Configuration

The application includes production-ready Docker configuration:

- Multi-stage build for optimized image size
- PostgreSQL service with persistent data
- Environment variable management
- Automatic database migrations

## 📊 Environment Variables

| Variable | Description | Default |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | - |
| `NEXTAUTH_URL` | Application base URL | http://localhost:3000 |
| `DEFAULT_ADMIN_EMAIL` | Initial admin email | admin@nurtw.gov.ng |
| `DEFAULT_ADMIN_PASSWORD` | Initial admin password | admin123 |
| `NEXT_PUBLIC_APP_NAME` | Application display name | NURTW Digital Platform |

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio
npx prisma migrate dev # Run database migrations
```

## 🔐 Security Features

- Input validation with Zod schemas
- SQL injection prevention via Prisma ORM
- CSRF protection with NextAuth.js
- Password hashing with bcryptjs
- Environment variable protection

## 📞 Support

For support and questions:
- Email: support@nurtw.gov.ng
- Documentation: Project Wiki
- Issues: GitHub Issues

---

**Built with ❤️ for the National Union of Road Transport Workers (NURTW)**

*Ensuring safe and secure transport for all Nigerians*
