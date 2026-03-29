# StayInn - Hostel Accommodation Management System

## Overview
StayInn is a comprehensive web platform connecting students with verified hostels, flats, and houses. The system includes intelligent roommate matching, peer-to-peer bike rentals, and transparent review systems.

## Project Architecture

### Frontend (React + TypeScript)
- **Landing Page**: Hero section with search, feature showcase, trust indicators
- **Authentication**: Dual login/register forms for students and property owners
- **Property Search**: Advanced filtering by city, rent, type, and amenities
- **Roommate Matching**: Algorithm-based matching using lifestyle preferences
- **Bike Rentals**: Peer-to-peer marketplace for student bike sharing
- **Dashboards**: Separate interfaces for students and property owners
- **Review System**: Transparent ratings and reviews for properties

### Backend (Express.js + TypeScript)
- **Authentication**: Passport.js with local strategy and session management
- **Storage**: In-memory database (MemStorage) for MVP
- **API Routes**: RESTful endpoints for all features
- **Business Logic**: Roommate matching algorithm, review aggregation

### Key Features
1. **Dual User Roles**: Students and Property Owners
2. **Property Management**: CRUD operations for hostel/flat/house listings
3. **Smart Roommate Matching**: Based on sleep schedule, cleanliness, noise level, lifestyle, budget
4. **Bike Rental Marketplace**: Students can list and rent bikes from each other
5. **Review & Rating System**: For properties and nearby restaurants
6. **Shortlisting**: Save and compare multiple properties
7. **Dashboard Analytics**: Stats and insights for both user types

## Data Models

### User
- id, username, password, email, fullName, role (student/owner), phone, createdAt

### Property
- id, ownerId, title, description, type, location, city, address, rent, deposit
- availableRooms, totalRooms, amenities[], images[], verified, rating, reviewCount

### Student Profile
- id, userId, bio, budget, sleepSchedule, cleanliness, noiseLevel, studyHabits, lifestyle

### Bike Rental
- id, ownerId, title, description, bikeType, dailyRate, weeklyRate, available, location, images[]

### Review
- id, userId, targetId, targetType, rating, title, content, images[]

### Shortlist
- id, userId, propertyId, createdAt

## API Endpoints

### Authentication
- POST /api/register - Create new user account
- POST /api/login - Login user
- POST /api/logout - Logout user
- GET /api/user - Get current user

### Properties
- GET /api/properties - List all properties (with filters)
- GET /api/properties/:id - Get single property
- POST /api/properties - Create new property (owner only)
- PATCH /api/properties/:id - Update property (owner only)
- DELETE /api/properties/:id - Delete property (owner only)
- GET /api/properties/my-listings - Get owner's properties

### Bikes
- GET /api/bikes - List all bikes
- POST /api/bikes - Create bike listing
- PATCH /api/bikes/:id - Update bike
- DELETE /api/bikes/:id - Delete bike
- GET /api/bikes/my-listings - Get user's bike listings

### Profiles
- GET /api/profile - Get user profile
- POST /api/profile - Create profile
- PATCH /api/profile - Update profile

### Roommates
- GET /api/roommates/matches - Get matching roommate suggestions

### Reviews
- GET /api/reviews/:targetType/:targetId - Get reviews for target
- POST /api/reviews - Create review

### Shortlists
- GET /api/shortlists - Get user's shortlisted property IDs
- GET /api/shortlists/properties - Get full shortlisted properties
- POST /api/shortlists - Add to shortlist
- DELETE /api/shortlists/:propertyId - Remove from shortlist

### Stats
- GET /api/stats/student - Get student dashboard stats
- GET /api/stats/owner - Get owner dashboard stats

## Roommate Matching Algorithm
Calculates match percentage based on:
- Sleep schedule compatibility (early/night-owl/flexible)
- Cleanliness preferences (very-clean/moderate/relaxed)
- Noise level preferences (quiet/moderate/social)
- Lifestyle compatibility (active/homebody/social)
- Budget similarity (within ₹2000 = 100%, within ₹5000 = 50%)

Minimum 30% match required, sorted by highest match percentage.

## Design System
- **Fonts**: Inter (UI), Merriweather (Headings)
- **Colors**: Primary blue (#2563eb), semantic color tokens
- **Components**: Shadcn UI library with custom styling
- **Spacing**: Consistent 4/6/8/12/16/24px scale
- **Interactions**: Hover elevations, smooth transitions

## Technology Stack
- Frontend: React, TypeScript, Tailwind CSS, Shadcn UI, Wouter, TanStack Query
- Backend: Express.js, Passport.js, TypeScript
- Database: In-memory (MemStorage) for MVP
- Session: Memory Store with Express Session

## Development Notes
- All passwords are hashed using scrypt
- Sessions stored in memory (will need Redis/PostgreSQL for production)
- Images stored as URLs (will need CDN/S3 for production)
- Review ratings update property averages automatically

## Future Enhancements
- PostgreSQL database for persistent storage
- Real-time messaging between students and owners
- Booking and availability management
- Payment gateway integration (Stripe/PayPal)
- Admin panel for content moderation
- Mobile apps (iOS/Android)
- AI-powered roommate recommendations
- Google Maps integration

## Recent Changes
- October 24, 2025: Initial MVP implementation with all core features
