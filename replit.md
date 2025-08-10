# Overview

This is a full-stack gaming platform called "RoboGame Hub" built with React, Express, and PostgreSQL. The application provides Roblox player authentication, game management, and user session tracking. It features a modern gaming-themed UI with shadcn/ui components and connects to a Roblox player database for authentication instead of using external auth providers.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with conditional rendering based on authentication state
- **UI Components**: shadcn/ui component library with Radix UI primitives and Tailwind CSS styling
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Styling**: Tailwind CSS with custom gaming-themed color scheme and CSS variables

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Replit OpenID Connect (OIDC) integration with Passport.js
- **Session Management**: Express sessions stored in PostgreSQL using connect-pg-simple
- **API Design**: RESTful endpoints with error handling middleware and request logging

## Database Design
- **Users Table**: Stores user profiles with gaming stats (level, XP, rank, achievements)
- **Games Table**: Catalog of available games with metadata
- **User Game Sessions Table**: Tracks user gameplay sessions and statistics
- **Sessions Table**: Server-side session storage for authentication persistence

## Authentication & Authorization
- **Provider**: Custom Roblox player authentication system
- **Session Storage**: PostgreSQL-backed sessions with configurable TTL
- **Authorization**: Route-level protection with requireAuth middleware
- **User Management**: Roblox players authenticate with username/password stored in database
- **Database Schema**: Users table includes Roblox-specific fields (robloxUserId, gaming stats)

## Development Workflow
- **Build Process**: Vite for frontend bundling, esbuild for backend compilation
- **Database Migrations**: Drizzle Kit for schema management and migrations
- **Development Server**: Concurrent frontend (Vite) and backend (tsx) with hot reloading
- **Static Assets**: Vite-managed client assets served through Express in production

# External Dependencies

## Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection pooling and serverless compatibility
- **drizzle-orm**: Type-safe SQL query builder and ORM
- **@tanstack/react-query**: Server state management and data fetching
- **express**: Node.js web application framework
- **passport**: Authentication middleware with OpenID Connect strategy

## UI Framework
- **@radix-ui/***: Comprehensive set of accessible React primitives
- **tailwindcss**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component library built on Radix UI and Tailwind

## Authentication
- **openid-client**: OpenID Connect client implementation
- **express-session**: Session middleware for Express
- **connect-pg-simple**: PostgreSQL session store

## Development Tools
- **vite**: Frontend build tool and development server
- **tsx**: TypeScript execution engine for development
- **esbuild**: Fast JavaScript/TypeScript bundler for production builds
- **drizzle-kit**: Database migration and introspection toolkit