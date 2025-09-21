# Overview

HealthApp is a cross-platform mobile health application built with Capacitor that wraps a React SPA. The app provides a healthcare appointment booking system with user authentication, specialty selection, unit browsing, and appointment scheduling. It's designed to work offline with mock data while maintaining compatibility with a future PHP/CodeIgniter 4 + MySQL backend through REST API endpoints.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built as a single-page application using React with TypeScript and Vite as the build tool. The UI leverages Shadcn/UI components built on Radix UI primitives with Tailwind CSS for styling. State management is handled through React Query for server state and local React state for UI interactions.

The app follows a screen-based navigation pattern with four main screens: Login, Dashboard, Appointment Flow, and Success. Navigation is managed through a centralized App component that controls which screen is displayed based on application state.

## Backend Architecture
The server is built with Express.js and TypeScript, designed to mock a PHP/CodeIgniter backend. It implements RESTful endpoints for authentication, specialty management, unit discovery, schedule browsing, and appointment creation. The server includes JWT-based authentication with a simple in-memory storage system that simulates database operations.

Mock data is provided for specialties (Cardiology, Dermatology, Orthopedics, Pediatrics), units with addresses, schedules with availability, and user appointments. All endpoints return consistent JSON responses that match the expected database schema structure.

## Data Storage Solutions
The application uses Drizzle ORM with PostgreSQL schema definitions, though currently operates with an in-memory storage implementation. The schema defines five main entities: users, specialties, units, schedules, and appointments with proper relationships and constraints.

User authentication tokens and data are persisted in localStorage for offline capability. The storage layer is abstracted through an IStorage interface, allowing easy switching between mock data and real database implementations.

## Authentication and Authorization
JWT-based authentication is implemented with a simple demo login (teste@teste.com / 123456). Tokens are stored in localStorage and included in API requests via Authorization headers. Protected routes use middleware to verify token validity and extract user information.

The authentication service provides methods for login, logout, token management, and user session persistence across app restarts.

## Mobile Architecture
Capacitor is configured for both Android and iOS deployment with push notifications and local notifications support. The app includes proper mobile viewport configuration, touch-friendly UI components, and responsive design patterns optimized for mobile devices.

The build process generates a dist/public folder that Capacitor can package into native mobile applications. The app maintains web compatibility for development and testing purposes.

# External Dependencies

## Core Framework Dependencies
- **React 18** with TypeScript for the frontend framework
- **Vite** for build tooling and development server
- **Capacitor 7** for cross-platform mobile deployment
- **Express.js** for the mock backend server

## UI and Styling
- **Shadcn/UI** component library built on Radix UI primitives
- **Tailwind CSS** for utility-first styling
- **Lucide React** for consistent iconography
- **Class Variance Authority** for component variant management

## State Management and Data Fetching
- **React Query (TanStack Query)** for server state management and caching
- **React Hook Form** with Zod for form handling and validation
- **Zustand** (implied through schema patterns) for local state management

## Database and Validation
- **Drizzle ORM** with PostgreSQL adapter for database schema and migrations
- **Zod** for runtime type validation and schema definition
- **Neon Database** serverless PostgreSQL for production database

## Authentication and Security
- **JSON Web Tokens (jsonwebtoken)** for authentication
- **bcrypt** (implied) for password hashing in production

## Mobile-Specific
- **Capacitor Push Notifications** for mobile notification support
- **Capacitor Local Notifications** for offline notification capability

## Development Tools
- **TypeScript** for type safety
- **date-fns** for date manipulation and formatting with Portuguese locale support
- **PostCSS** with Autoprefixer for CSS processing