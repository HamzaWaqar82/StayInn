# StayInn Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from Airbnb's accommodation marketplace aesthetics combined with modern student-focused platforms like Notion and Linear for dashboard interfaces. This creates a trustworthy, visually appealing experience that balances property showcase with functional utility.

**Core Principles**:
- Visual trust-building through high-quality property imagery
- Clean, spacious layouts that reduce cognitive load for students
- Mobile-first design (students primarily browse on phones)
- Distinct visual language for student vs owner experiences
- Transparency and clarity in reviews, pricing, and amenities

---

## Typography

**Primary Font**: Inter (Google Fonts) - for UI elements, navigation, buttons
**Secondary Font**: Crimson Pro or Merriweather (Google Fonts) - for property titles and feature headings

**Hierarchy**:
- Hero Headlines: 3xl to 6xl (48-60px desktop), bold weight
- Section Headings: 2xl to 4xl (32-36px), semibold
- Property Titles: xl to 2xl (24-30px), medium weight
- Body Text: base to lg (16-18px), regular weight
- Captions/Metadata: sm to base (14-16px), regular weight
- Buttons: base (16px), medium to semibold weight

---

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Micro spacing (2, 4): Between related elements, icon-text gaps
- Component spacing (6, 8): Card padding, form field spacing
- Section spacing (12, 16, 24): Between major sections, page margins

**Grid Structure**:
- Container: max-w-7xl with px-4 to px-8 responsive padding
- Property Cards: 3-column grid on desktop (grid-cols-3), 2-column tablet, single mobile
- Dashboard Layouts: Sidebar + main content (sidebar: w-64, main: flex-1)

---

## Component Library

### Navigation
**Main Header**:
- Fixed top navigation with subtle shadow on scroll
- Logo left, search bar center (on property pages), user menu right
- Height: h-16 to h-20
- Spacing: px-6 to px-8, items centered with gap-8

**Student vs Owner Navigation**:
- Student: "Search Properties", "Find Roommates", "Rent Bikes", "My Dashboard"
- Owner: "My Properties", "Add Listing", "Inquiries", "Analytics"

### Property Cards (Airbnb-inspired)
- Aspect ratio 4:3 for main property image
- Rounded corners: rounded-xl (12px)
- Hover: Subtle scale transform (scale-105), shadow elevation
- Layout: Image top, title, location icon + text, price (bold, larger), amenities row
- Spacing: p-0 for image container, p-4 to p-6 for content
- Heart icon (top-right absolute) for shortlisting

### Search & Filters
**Hero Search Bar** (Landing Page):
- Large, prominent centered search: rounded-full, h-14 to h-16
- Sections: Location | Check-in/out | Rent Range | Search button
- Elevated shadow, appears above hero image with blurred background

**Filter Sidebar** (Search Results):
- Sticky position, w-72
- Collapsible sections: Price Range (slider), Property Type (checkboxes), Amenities (checkboxes), Location
- Spacing: p-6, gap-6 between filter groups
- "Clear All" and "Apply" buttons at bottom

### Roommate Matching Cards
- Horizontal card layout (flex row)
- Avatar left (w-20, h-20, rounded-full)
- Content: Name, bio snippet, match percentage badge (top-right)
- Preference tags: Wrapped flex with rounded-full badges, gap-2
- "Connect" button: Secondary style
- Spacing: p-6, gap-4

### Bike Rental Listings
- Grid cards similar to properties but smaller (grid-cols-4)
- Square image aspect ratio (1:1)
- Bike type, daily/weekly rate, availability status badge
- Owner profile mini-card at bottom

### Review Components
- Star rating prominent (text-xl to 2xl)
- Avatar + name + date (flex row, items-center, gap-3)
- Review text: max-w-prose, line-clamp-3 with "Read more" expansion
- Photos grid if included (grid-cols-3, gap-2)
- Spacing: p-6, border-b between reviews

### Dashboards

**Student Dashboard**:
- Grid layout: 2-column stats cards (Saved Properties, Active Rentals, Roommate Requests, Reviews Written)
- "Recent Activity" feed with timeline design
- "Recommended for You" carousel
- Quick action buttons: "Find Property", "Search Roommates", "List Bike"

**Owner Dashboard**:
- Stats row: Total Properties, Active Bookings, Total Revenue, Average Rating
- Property management table with actions (Edit, View Inquiries, Analytics)
- Chart/graph for occupancy trends (use Chart.js)
- "Add New Property" prominent CTA

### Forms
**Property Listing Form** (Owner):
- Multi-step wizard with progress indicator (Step 1: Basic Info, Step 2: Amenities, Step 3: Photos, Step 4: Pricing)
- Full-width inputs: h-12, rounded-lg, px-4
- Photo upload: Drag-and-drop zone with preview grid
- Amenities: Checkbox grid (grid-cols-3)
- Spacing: gap-6 between form sections

**Student Profile/Preferences**:
- Sections: Personal Info, Lifestyle Preferences, Budget, Roommate Preferences
- Toggle switches for preferences (Sleep Schedule, Cleanliness, Noise Level)
- Slider inputs for budget range
- Bio textarea: min-h-32

### Buttons
- Primary CTA: h-12, px-8, rounded-lg, font-medium
- Secondary: h-10, px-6, rounded-lg, border-2
- Icon buttons: w-10, h-10, rounded-full
- Blurred background for buttons on images (backdrop-blur-md, bg-opacity-80)

### Modals & Overlays
- Booking modal: max-w-2xl, p-8, rounded-2xl
- Image gallery lightbox: Full-screen with navigation arrows
- Confirmation dialogs: max-w-md, p-6, rounded-xl

---

## Landing Page Structure

**Hero Section** (80vh):
- Full-width background image showcasing a modern student accommodation
- Centered search bar (as described above) with blurred button backgrounds
- Headline: "Find Your Perfect StayInn" (text-5xl, font-bold)
- Subheading: Trust-building statement (text-xl)

**Featured Properties Section**:
- 3-column grid showcasing top-rated hostels
- Section heading: "Popular Near You" or "Top-Rated Stays"
- "View All" link

**How It Works Section**:
- 3-column layout with icons
- Steps: Search → Compare → Book
- Icon-title-description pattern, centered alignment

**Roommate Matching Showcase**:
- Split layout: Feature description left, sample matching interface right
- Visual of the matching algorithm in action

**Bike Rental Feature**:
- Horizontal scrolling carousel of available bikes
- "Rent or List Your Bike" CTA

**Reviews & Testimonials**:
- Masonry grid layout (3 columns, varied heights)
- Student photos, quotes, ratings
- Background: subtle texture or pattern

**Trust & Safety Section**:
- Icon grid: Verified Listings, Secure Payments, 24/7 Support, Review System
- 4-column layout

**CTA Section**:
- Split: Students (left) vs Owners (right)
- Distinct CTAs: "Find Your Home" vs "List Your Property"

**Footer**:
- 4-column layout: About, For Students, For Owners, Legal
- Newsletter signup with email input
- Social links (Heroicons)

---

## Images

**Hero Section**: Large, inspiring image of a modern, clean student accommodation interior or a diverse group of students in a welcoming common area (1920x1080)

**Featured Properties**: 3 high-quality property photos showing exteriors or well-lit bedrooms/common areas

**How It Works**: Use Heroicons for steps (SearchIcon, ClipboardCheckIcon, HomeIcon)

**Roommate Matching**: Visual mockup of matching interface or diverse students collaborating

**Testimonials**: 6-9 authentic student profile photos (circular, varied)

**Trust Section**: Heroicons (ShieldCheckIcon, LockClosedIcon, ChatAlt2Icon, StarIcon)

---

## Icon Library

Use **Heroicons** (Outline style) via CDN for consistency throughout the application.