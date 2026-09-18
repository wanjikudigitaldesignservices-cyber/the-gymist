# The Gymist — Administrator Guide

Welcome to The Gymist Admin Dashboard. This guide will help you manage the website content.

## Accessing the Dashboard
- Navigate to `https://yourdomain.com/admin` (or `http://localhost:3000/admin` locally).
- Log in with your admin credentials.

## Overview
The dashboard provides a quick snapshot of pending bookings, new enquiries, and active records (workouts, classes, instructors). Use the quick links to add new content.

## Managing Content

### 1. Workouts
- **Add Workout:** Click "+ Add Workout" from the overview or go to the Workouts section. Provide a title, description, category, and difficulty.
- **Images:** Ensure images strictly depict the movement (e.g., a barbell deadlift for a deadlift workout).
- **Publishing:** Toggle the "Published" status to make the workout visible on the public site.

### 2. Classes & Timetable
- Define the core class types (e.g., HIIT, Yoga) and their properties (duration, color code).
- Schedule instances of these classes under "Class Sessions" (coming soon to the UI, currently manageable via Supabase directly) to populate the timetable.

### 3. Instructors
- Add new coaches with their roles, bios, and portraits.
- Manage their specializations and social links.

### 4. Journal / Blog
- Write SEO-friendly blog posts using standard Markdown.
- Set a catchy title, excerpt, and upload a thumbnail image.

### 5. Settings
- Update the global site settings such as Contact Email, WhatsApp Number, M-Pesa Till Number, and Address. These changes immediately reflect on the public site footer and contact page.

## Managing Bookings & Enquiries
- **Bookings:** View all incoming bookings. Note that the M-Pesa integration is currently a manual verification step. Users pay via Till, and you mark their booking as 'Confirmed' once you verify the transaction.
- **Enquiries:** View messages submitted via the Contact Form.

## Technical Support
If you need to edit the database schema or manage admin users, please access the Supabase dashboard directly.
