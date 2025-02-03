# Community Events Platform

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://community-events-online.web.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A community events platform that allows users to discover, register for, and manage local events. Staff members can create and manage events while regular users can browse and participate.

![Events Platform Preview](./screenshots//Events%20Platform.png "Events Platform Preview")

---

## Features

- **User Authentication**: Secure sign-up/sign-in with Supabase Auth
- **Event Management**:
  - Browse upcoming events
  - Event registration/unregistration
  - Google Calendar integration
  - Staff-only event creation
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: WCAG compliant components and keyboard navigation
- **Real-time Updates**: Event attendance tracking and status indicators

---

## Tech Stack

**Frontend:**

- React + TypeScript
- React Router
- Tailwind CSS
- Google Calendar API

**Backend:**

- Supabase (Auth & Database)

**Hosting:**

- Firebase (for frontend)
- Supabase (for backend)

---

## Project Structure

```
src/
├── components/   # Reusable UI components
├── context/      # Auth context provider
├── pages/        # Application routes
├── types/        # TypeScript type definitions
├── utils/        # API clients and helpers
└── index.css     # Global styles
```

---

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- npm (v9+)
- Supabase account
- Google Cloud account (for Calendar API)

### 1. Clone Repository

```bash
git clone https://github.com/michael-farah/community-events-platform.git
cd community-events-platform
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Variables

Create a `.env` file with the following content:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GOOGLE_API_KEY=your-google-api-key
```

### 4. Database Setup (Supabase)

Run these SQL commands in your Supabase project:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT,
  is_staff BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  organizer_id UUID REFERENCES profiles(id) NOT NULL,
  max_attendees INT,
  current_attendees INT DEFAULT 0,
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create event registrations table
CREATE TABLE event_registrations (
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Run Development Server

```bash
pnpm dev
```

---

## Test Accounts

**Regular User:**

- **Email:** user@example.com
- **Password:** password123

**Staff User:**

- **Email:** staff@example.com
- **Password:** password123

> **Note:** Set `is_staff` to `TRUE` in the Supabase `profiles` table for staff access.

---

## Hosted Version

The platform is hosted on Firebase.

---

## Google Calendar Integration

To enable calendar functionality:

1. Create a Google Cloud Project.
2. Enable the Calendar API.
3. Create OAuth 2.0 credentials.
4. Add authorized JavaScript origins.

---

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---
