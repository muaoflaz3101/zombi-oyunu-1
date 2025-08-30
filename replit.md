# Overview

A browser-based 3D zombie survival game built with React Three Fiber and Express.js. Players navigate a post-apocalyptic world with day/night cycles, combat zombies and bosses, collect items from buildings, interact with NPCs, and manage inventory and upgrades through a shop system. The game features immersive 3D graphics, real-time combat mechanics, and progression systems.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite for build tooling
- **3D Rendering**: React Three Fiber (@react-three/fiber) with Three.js for WebGL-based 3D graphics
- **UI Components**: Radix UI primitives with custom styled components using Tailwind CSS
- **State Management**: Zustand stores for game state, player data, world state, inventory, and audio
- **Game Controls**: @react-three/drei KeyboardControls for WASD movement and mouse interactions
- **Styling**: Tailwind CSS with custom design system using CSS variables for theming

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **Build System**: ESBuild for server bundling, Vite for client bundling
- **Development**: Hot module replacement (HMR) with Vite middleware in development
- **Storage Interface**: Abstracted storage layer with in-memory implementation (MemStorage class)
- **API Structure**: RESTful endpoints with `/api` prefix for backend routes

## Data Storage
- **Database**: PostgreSQL with Drizzle ORM for schema management and migrations
- **Database Driver**: Neon Database serverless driver (@neondatabase/serverless)
- **Schema Definition**: Centralized in shared/schema.ts with Zod validation
- **Migration Strategy**: Drizzle-kit for database migrations and schema synchronization
- **Current Implementation**: In-memory storage for development with database-ready interface

## Game State Management
- **Player State**: Health, ammo, position, level, experience, and money tracking
- **World State**: Time-of-day cycles, enemy spawning, wave management, and environmental conditions
- **Inventory System**: Item collection, shop interactions, and equipment management
- **Game Phases**: Ready, playing, and ended states with appropriate UI transitions

## 3D Graphics Pipeline
- **Scene Management**: React Three Fiber declarative 3D scene composition
- **Asset Loading**: Texture loading with @react-three/drei useTexture hook
- **Lighting System**: Dynamic directional lighting with day/night cycle integration
- **Performance**: Shadow mapping and optimized rendering for browser performance

# External Dependencies

## 3D Graphics and Game Engine
- **React Three Fiber**: Core 3D rendering framework
- **@react-three/drei**: 3D helpers and utilities for cameras, controls, and loaders
- **@react-three/postprocessing**: Visual effects and post-processing pipeline
- **Three.js**: Underlying WebGL 3D library
- **vite-plugin-glsl**: GLSL shader support for custom materials

## Database and Backend
- **Neon Database**: Serverless PostgreSQL hosting (@neondatabase/serverless)
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect
- **drizzle-kit**: Migration and schema management tools
- **connect-pg-simple**: PostgreSQL session store for Express.js

## UI and Styling
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **class-variance-authority**: Type-safe variant-based component styling
- **clsx**: Conditional CSS class composition utility
- **Lucide React**: Modern icon library for React applications

## State Management and Data Fetching
- **Zustand**: Lightweight state management without boilerplate
- **TanStack Query**: Server state management and data synchronization
- **React Hook Form**: Form handling with validation support
- **Zod**: Runtime type validation and schema definition

## Development and Build Tools
- **Vite**: Fast build tool with HMR and modern ES modules
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript/TypeScript bundler for production builds
- **@replit/vite-plugin-runtime-error-modal**: Development error reporting