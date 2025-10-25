# Cheesecake - Club & Event Management Portal Design Guidelines

## Design Approach

**Reference-Based Approach** drawing inspiration from:
- **Eventbrite**: Event card layouts and registration flows
- **Instagram**: Visual-first content presentation and engagement patterns
- **Linear**: Clean typography and modern component design
- **Airbnb**: Card aesthetics and browsing experiences

**Design Principles:**
1. **Indulgent Simplicity**: Like its namesake dessert, the design should feel premium and smooth without overwhelming users
2. **Visual-First Engagement**: Events and clubs are visual experiences - prioritize imagery
3. **Effortless Discovery**: Students should find relevant clubs/events with minimal friction
4. **Community Warmth**: Foster connection through approachable, inviting design

---

## Typography System

**Font Families** (via Google Fonts CDN):
- **Primary (Headings)**: Inter (weights: 600, 700, 800)
- **Secondary (Body)**: Inter (weights: 400, 500)
- **Accent (Stats/Numbers)**: Space Grotesk (weight: 700)

**Hierarchy:**
- Hero Headlines: text-5xl md:text-6xl lg:text-7xl, font-bold, tracking-tight
- Section Headers: text-3xl md:text-4xl, font-bold
- Card Titles: text-xl md:text-2xl, font-semibold
- Body Text: text-base md:text-lg, font-normal, leading-relaxed
- Metadata/Labels: text-sm, font-medium, uppercase tracking-wide
- Button Text: text-base, font-semibold

---

## Layout System

**Spacing Primitives** (Tailwind units):
- **Primary spacing**: 4, 8, 12, 16, 20
- **Section padding**: py-16 md:py-24 lg:py-32
- **Container padding**: px-4 md:px-6 lg:px-8
- **Component gaps**: gap-6 md:gap-8 lg:gap-12

**Container Widths:**
- Full-width sections: w-full with inner max-w-7xl mx-auto
- Content sections: max-w-6xl mx-auto
- Forms/Text: max-w-2xl mx-auto

**Grid Patterns:**
- Event Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Club Listings: grid-cols-1 lg:grid-cols-2 (larger cards)
- Feature Sections: grid-cols-1 md:grid-cols-3 (stats, benefits)

---

## Page Structures

### Landing Page
1. **Hero Section** (h-screen min-h-[600px])
   - Full-width background image (students at vibrant campus event)
   - Centered content with max-w-4xl
   - Large headline + subtitle + dual CTA buttons (blurred button backgrounds)
   - Subtle trust indicator below: "Join 2,500+ students at [College Name]"

2. **Featured Events Grid** (py-20)
   - Section header with "Happening This Week"
   - 3-column grid of upcoming events with imagery
   - Each card: Image, date badge, title, club name, RSVP count

3. **Popular Clubs Showcase** (py-24)
   - 2-column asymmetric layout
   - Left: Large featured club card with member count, upcoming events
   - Right: Stacked smaller club cards (2 rows)

4. **How It Works** (py-20)
   - 3-column feature grid with icons from Heroicons
   - Each: Icon, title, description
   - Clean, minimal icons (outline style)

5. **Stats Bar** (py-16)
   - 4-column metrics: Active Clubs, Events This Month, Students Engaged, QR Check-ins
   - Large numbers with Space Grotesk, labels below

6. **Call to Action** (py-24)
   - Centered content, gradient background treatment
   - Headline, supporting text, primary button

### Dashboard (Student View)
- **Top Navigation**: Sticky header with logo, search bar (prominent), notifications bell, profile avatar
- **Left Sidebar** (w-64): Navigation menu (Discover, My Events, My Clubs, Calendar, Notifications)
- **Main Content Area**: 
  - Top: Personalized greeting + quick action buttons row
  - Feed: Mixed content cards (upcoming events, club updates, recommended clubs)
  - Right rail (w-80): Calendar widget, trending events, suggested clubs

### Event Discovery Page
- **Filter Sidebar** (w-72): Category tags (checkboxes), date range picker, club filter
- **Main Grid**: Masonry-style event cards with varied heights based on image aspect ratios
- **Top Bar**: Search + view toggles (grid/list) + sort dropdown

### Event Detail Page
- **Hero Banner**: Full-width event cover image (h-96)
- **Content Grid** (2-column on desktop):
  - Left (60%): Event details, description, agenda, media gallery
  - Right (40%): Sticky registration card (club logo, date/time, location, RSVP button, QR code for registered users, attendee avatars)

### Club Profile Page
- **Header Banner**: Cover photo (h-64) with club logo overlay (-mt-16 on logo for overlap effect)
- **Tabs Navigation**: About, Events, Members, Gallery
- **Content Area**: Tab-specific layouts

---

## Component Library

### Navigation
- **Top Nav**: Horizontal flex with logo left, menu items center, CTA + user menu right, h-16
- **Mobile Menu**: Slide-in drawer from right, full-height overlay

### Cards
- **Event Card**: Rounded-2xl overflow-hidden, shadow-lg hover:shadow-2xl transition
  - Image area (aspect-video)
  - Content padding: p-6
  - Date badge: Absolute positioned top-4 left-4
  
- **Club Card**: Similar structure, includes member count badge, "Follow" button in footer

### Forms
- **Input Fields**: 
  - Height: h-12
  - Padding: px-4
  - Rounded: rounded-xl
  - Border width: border-2
  - Font: text-base
  
- **Buttons**:
  - Primary: px-8 py-4 rounded-xl font-semibold text-base
  - Secondary: Same sizing, different styling
  - Icon buttons: w-10 h-10 rounded-full (for filters, actions)

### QR Code Component
- Centered container (max-w-sm mx-auto)
- QR code image/canvas: 256x256px
- Event name below, "Scan at venue" instruction
- Download button underneath

### Badges & Tags
- Category tags: px-4 py-2 rounded-full text-sm font-medium
- Date badges: px-3 py-1.5 rounded-lg text-xs font-bold uppercase
- Status indicators: w-2 h-2 rounded-full (online/offline dots)

### Modals
- Max-w-2xl centered overlay
- Backdrop blur effect
- Rounded-3xl with p-8 padding
- Close button (absolute top-4 right-4)

---

## Images

**Hero Section Image:**
- Large, vibrant campus event photo showing students engaged and happy
- Should convey community, energy, excitement
- Resolution: 1920x1080 minimum
- Position: Center, cover fit

**Event Cards:**
- Event-specific imagery (concerts, workshops, sports, meetups)
- Aspect ratio: 16:9
- High-quality, professional-looking photos

**Club Profile Banners:**
- Club branding or activity photos
- Aspect ratio: 3:1 for cover photos
- Club logos: Square format, 400x400px minimum

**Marketing Sections:**
- Authentic campus life photography
- Diverse student representation
- Action shots (not posed)

---

## Icons
**Library**: Heroicons (outline and solid variants via CDN)
**Common Icons:**
- Calendar (events)
- Users (clubs, attendance)
- Bell (notifications)
- QR Code (check-ins)
- Map Pin (location)
- Clock (time)
- Star (featured/favorites)
- Filter (discovery)

---

## Animations
**Minimal, purposeful motion:**
- Card hover: Slight scale (1.02) + shadow lift - transition duration-300
- Button hover: Subtle transform translateY(-2px) - transition duration-200
- Page transitions: Fade in content on load
- Modal entry: Scale from 0.95 to 1, fade in backdrop
**No** scroll-triggered animations, parallax effects, or decorative motion

---

## Accessibility
- Form inputs: h-12 minimum touch target
- Buttons: h-12 minimum (h-14 for primary CTAs)
- Color contrast: Ensure sufficient contrast for all text
- Focus states: Visible outline ring-2 ring-offset-2
- ARIA labels on icon-only buttons
- Skip to main content link