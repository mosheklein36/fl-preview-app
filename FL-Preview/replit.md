# FL Preview

## Overview

FL Preview is a mobile-first web application for instantly listening to audio previews of FL Studio projects. The app reads MP3 preview files and JSON metadata uploaded by an auto-render script, groups them by project, and displays them in a clean UI with audio playback capabilities. It does NOT interpret .flp files - it only works with rendered MP3 previews and their associated metadata.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for page transitions and list animations
- **Build Tool**: Vite with custom path aliases (@/, @shared/, @assets/)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **File Storage**: Local filesystem (uploads/ directory) with static file serving
- **API Pattern**: REST endpoints defined in shared/routes.ts with Zod validation

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: shared/schema.ts
- **Tables**:
  - `uploads`: Stores project metadata (projectName, filename, timestamp, url, metadata JSON)
  - `user_notes`: Stores user notes per project

### Key Design Patterns
- **Monorepo Structure**: client/, server/, and shared/ directories
- **Shared Types**: Zod schemas in shared/schema.ts used for both validation and TypeScript types
- **API Contract**: Route definitions with request/response schemas in shared/routes.ts
- **Component Library**: shadcn/ui with custom dark theme (FL Studio-inspired orange/green accents)

### File Upload Flow
1. Files uploaded via multer to uploads/ directory
2. Metadata stored in PostgreSQL uploads table
3. Files served statically via /api/files/ endpoint
4. Frontend groups uploads by project name for display

## External Dependencies

### Database
- **PostgreSQL**: Primary database accessed via DATABASE_URL environment variable
- **Drizzle ORM**: Database queries and schema management
- **drizzle-kit**: Database migrations (db:push command)

### Frontend Libraries
- **@tanstack/react-query**: Server state management and caching
- **framer-motion**: Smooth animations and page transitions
- **date-fns**: Date formatting (relative timestamps like "2 hours ago")
- **lucide-react**: Icon library
- **Radix UI**: Headless UI primitives for shadcn/ui components

### Development
- **Vite**: Development server with HMR
- **esbuild**: Production server bundling
- **@replit/vite-plugin-***: Replit-specific development tools

### Optional/Planned
- **@supabase/supabase-js**: Listed in dependencies (may be used for future Firebase-to-Supabase migration)
- **Firebase Storage**: Originally planned for cloud storage (see attached_assets requirements)