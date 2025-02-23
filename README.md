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
  - Add to Google Calendar via custom link
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
```

### 4. Database Setup (Supabase)

Run these SQL commands in your Supabase project:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  is_staff BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
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
  current_attendees INT DEFAULT 0 CHECK (current_attendees >= 0),
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create event registrations table
CREATE TABLE event_registrations (
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (event_id, user_id)
);

-- Attendee count functions
CREATE OR REPLACE FUNCTION increment_attendees(event_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE events
  SET current_attendees = current_attendees + 1
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_attendees(event_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE events
  SET current_attendees = GREATEST(current_attendees - 1, 0)
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Row Level Security Policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Enable read access" ON events
FOR SELECT USING (true);

CREATE POLICY "Allow staff management" ON events
FOR ALL USING (
  (SELECT is_staff FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "Allow attendee updates" ON events
FOR UPDATE USING (true) WITH CHECK (
  current_attendees BETWEEN 0 AND COALESCE(max_attendees, 999999)
);

-- Registrations policies
CREATE POLICY "Enable user registrations" ON event_registrations
FOR INSERT WITH CHECK (
  user_id = auth.uid() AND
  (SELECT max_attendees FROM events WHERE id = event_id) >
  (SELECT current_attendees FROM events WHERE id = event_id)
);

CREATE POLICY "Enable user unregistrations" ON event_registrations
FOR DELETE USING (user_id = auth.uid());
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

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
