git branch -# Cheesecake - Club & Event Management Portal

A modern college club and event management platform that centralizes club announcements, event management, and registrations.

## Features

- 📢 **Club Management** - Browse and follow clubs
- 📅 **Event Management** - Discover and register for upcoming events
- 👥 **Member Management** - Track club members and event registrations
- 🎫 **QR Code Check-ins** - Easy event check-ins with QR codes
- 🔔 **Announcements** - Stay updated with club announcements
- 👨‍💼 **Admin Dashboard** - Manage clubs and events

## Tech Stack

- **Frontend**: React 18, TypeScript, Wouter, Tailwind CSS, Shadcn/ui
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM (or in-memory storage for development)
- **State Management**: TanStack Query
- **Form Handling**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CheesecakeClub
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (if using PostgreSQL):
```bash
cp .env.example .env
# Add your DATABASE_URL
```

4. Run database migrations (if using PostgreSQL):
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Admin Access

A default super admin is seeded for development:

- **Email**: admin@cheesecakeclub.com
- **Password**: admin123

Access the admin panel at `/admin/login`

## Project Structure

```
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and configuration
├── server/              # Backend Express API
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Data storage layer
│   └── index.ts         # Server entry point
├── shared/              # Shared TypeScript definitions
│   └── schema.ts        # Database schemas and types
└── attached_assets/     # Static assets and images
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes


MIT
