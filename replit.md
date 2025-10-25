# Cheesecake - Club & Event Management Portal

## Overview

Cheesecake is a college club and event management platform that centralizes club announcements, event management, and registrations. The platform enables clubs to create profiles, manage events, and engage with students through a visual-first, community-focused interface. Built with a modern tech stack, it provides a seamless experience for discovering clubs, browsing events, and managing registrations with QR code-based check-ins.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing (alternative to React Router)
- File-based organization with `/client` as the root directory

**UI Component System**
- Shadcn/ui component library with Radix UI primitives providing accessible, composable components
- Tailwind CSS for utility-first styling with custom design tokens
- Design system inspired by Eventbrite (event layouts), Instagram (visual engagement), Linear (typography), and Airbnb (card aesthetics)
- Custom color system supporting light/dark modes through CSS variables
- Typography using Inter for headings/body and Space Grotesk for accent numbers

**State Management**
- TanStack Query (React Query) for server state management, caching, and data fetching
- Custom query client with automatic refetch disabled (staleTime: Infinity)
- Hook-based local state with React's built-in useState/useEffect

**Form Handling**
- React Hook Form for performant form management
- Zod schemas for runtime validation via @hookform/resolvers
- Form components integrated with Shadcn UI form primitives

### Backend Architecture

**Server Framework**
- Express.js running on Node.js with TypeScript
- ES modules (type: "module") for modern JavaScript imports
- Development mode uses `tsx` for TypeScript execution without compilation
- Production build uses `esbuild` for fast bundling

**API Design**
- RESTful API with resource-based endpoints (`/api/clubs`, `/api/events`, `/api/registrations`, `/api/followers`, `/api/announcements`)
- JSON request/response format with express.json middleware
- Route handler separation in `/server/routes.ts`
- Request logging middleware tracking method, path, status, duration, and response preview

**Data Layer**
- Storage abstraction through `IStorage` interface in `/server/storage.ts`
- In-memory storage implementation for development (can be replaced with database implementation)
- UUID generation using Node.js crypto module for entity IDs

### Database Schema

**ORM & Schema Definition**
- Drizzle ORM for type-safe database operations
- PostgreSQL as the target database (configured via `@neondatabase/serverless`)
- Schema defined in `/shared/schema.ts` using drizzle-orm/pg-core
- Zod schemas auto-generated from Drizzle tables for validation

**Core Entities**

*Clubs Table*
- Auto-generated UUID primary key
- Name, description, category classification
- Banner and logo images (URLs)
- Member count tracking with default 0
- Timestamp for creation tracking

*Events Table*
- Auto-generated UUID primary key
- Foreign key reference to club (clubId)
- Title, description, category, cover image
- Location and date range (startDate, endDate)
- Optional max attendees capacity
- RSVP count tracking with default 0
- Creation timestamp

*Registrations Table*
- Links students to events via email
- Student name and email fields
- Check-in status tracking (boolean)
- Registration timestamp

*Followers Table*
- Many-to-many relationship between students and clubs
- Tracks club following via student email
- Follow timestamp

*Announcements Table*
- Club-authored announcements (foreign key to clubId)
- Title and content fields
- Creation timestamp for chronological ordering

### External Dependencies

**Database & Hosting**
- Neon Serverless PostgreSQL for cloud-hosted database
- Connection via DATABASE_URL environment variable
- Drizzle Kit for schema migrations (`db:push` script)

**UI Component Libraries**
- Radix UI primitives (accordion, dialog, dropdown, popover, tabs, toast, etc.) for accessible component foundations
- Embla Carousel for image carousels
- CMDK for command palette interfaces
- Lucide React for icon system
- QRCode.react for generating registration QR codes
- date-fns for date formatting and manipulation

**Development Tools**
- Replit-specific plugins for development banner, error overlay, and cartographer (code navigation)
- TypeScript strict mode enabled for comprehensive type checking
- Path aliases configured (@/, @shared/, @assets/) for clean imports

**Session Management**
- connect-pg-simple for PostgreSQL-backed session storage
- Session middleware integration with Express (configured for future authentication)

**Design Principles**
- Mobile-first responsive design with Tailwind breakpoints (md:, lg:)
- Visual-first content presentation prioritizing imagery
- Card-based layouts for clubs and events
- Consistent spacing system (4, 8, 12, 16, 20 units)
- Shadow and elevation system for depth hierarchy
- Border radius system (sm: 3px, md: 6px, lg: 9px)