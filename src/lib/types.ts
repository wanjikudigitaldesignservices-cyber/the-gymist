// ============================================
// THE GYMIST — Database Types
// ============================================

export interface SiteSettings {
  id: number;
  gym_name: string;
  tagline: string | null;
  phone: string;
  whatsapp_number: string;
  whatsapp_default_message: string | null;
  email: string | null;
  address: string | null;
  map_embed_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  facebook_url: string | null;
  x_url: string | null;
  mpesa_paybill: string | null;
  mpesa_account: string | null;
  logo_url: string | null;
  og_image_url: string | null;
  updated_at: string;
}

export interface OpeningHour {
  id: string;
  day_of_week: number;
  opens: string | null;
  closes: string | null;
  is_closed: boolean;
  sort_order: number | null;
}

export interface PageSection {
  id: string;
  page_slug: string;
  section_key: string;
  heading: string | null;
  subheading: string | null;
  body: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_href: string | null;
  is_visible: boolean;
  sort_order: number;
}

export interface Stat {
  id: string;
  label: string;
  value: number;
  suffix: string | null;
  sort_order: number | null;
  is_visible: boolean;
}

export interface Workout {
  id: string;
  slug: string;
  name: string;
  category: "Strength" | "Conditioning" | "Hypertrophy" | "Mobility" | "Core" | "Olympic";
  tier: 1 | 2 | 3;
  short_description: string;
  image_url: string;
  image_alt: string;
  image_prompt: string | null;
  primary_muscles: string[];
  secondary_muscles: string[] | null;
  equipment: string[];
  steps: string[];
  cues: string[];
  mistakes: { mistake: string; fix: string }[];
  progressions: string[] | null;
  regressions: string[] | null;
  sets_reps: string | null;
  rest_seconds: number | null;
  tempo: string | null;
  programming_notes: string | null;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Instructor {
  id: string;
  slug: string;
  full_name: string;
  role: string;
  philosophy: string | null;
  bio: string;
  portrait_url: string;
  portrait_alt: string | null;
  gallery_urls: string[] | null;
  specialities: string[] | null;
  categories: string[] | null;
  certifications: { name: string; body: string; year: number }[] | null;
  years_coaching: number | null;
  sessions_delivered: number | null;
  members_coached: number | null;
  availability: Record<string, string[]> | null;
  instagram_url: string | null;
  whatsapp_number: string | null;
  is_published: boolean;
  sort_order: number;
}

export interface Testimonial {
  id: string;
  author_name: string;
  author_image_url: string | null;
  quote: string;
  rating: number | null;
  instructor_id: string | null;
  is_featured: boolean;
  is_published: boolean;
  instructor?: Instructor;
}

export interface GymClass {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  intensity: number | null;
  duration_minutes: number;
  capacity: number;
  what_to_bring: string | null;
  who_its_for: string | null;
  instructor_id: string | null;
  color_hex: string | null;
  is_published: boolean;
  instructor?: Instructor;
}

export interface ClassSession {
  id: string;
  class_id: string;
  day_of_week: number;
  start_time: string;
  instructor_id: string | null;
  capacity_override: number | null;
  is_active: boolean;
  class?: GymClass;
  instructor?: Instructor;
}

export interface BlockedDate {
  id: string;
  blocked_on: string;
  reason: string | null;
}

export interface MembershipPlan {
  id: string;
  slug: string;
  name: string;
  price_kes: number;
  annual_price_kes: number | null;
  period: string;
  description: string | null;
  features: string[];
  is_highlighted: boolean;
  is_published: boolean;
  sort_order: number;
}

export interface Booking {
  id: string;
  reference: string;
  booking_type: "intro" | "class" | "personal_training" | "day_pass";
  class_id: string | null;
  class_session_id: string | null;
  instructor_id: string | null;
  booking_date: string;
  booking_time: string;
  full_name: string;
  phone: string;
  email: string;
  goal: string | null;
  injuries: string | null;
  heard_from: string | null;
  notes: string | null;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no_show";
  amount_kes: number;
  payment_status: "unpaid" | "paid" | "refunded";
  payment_ref: string | null;
  idempotency_key: string | null;
  created_at: string;
  updated_at: string;
  class?: GymClass;
  instructor?: Instructor;
}

export interface BlogCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body_md: string;
  cover_image_url: string;
  cover_image_alt: string | null;
  category_id: string | null;
  author_id: string | null;
  tags: string[] | null;
  reading_minutes: number | null;
  meta_title: string | null;
  meta_description: string | null;
  status: "draft" | "published" | "archived";
  is_featured: boolean;
  published_at: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
  category?: BlogCategory;
  author?: Instructor;
}

export interface Food {
  id: string;
  name: string;
  local_name: string | null;
  category: string | null;
  serving_description: string | null;
  serving_grams: number | null;
  kcal_per_100g: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number | null;
  is_published: boolean;
}

export interface NutritionLead {
  id: string;
  email: string;
  full_name: string | null;
  inputs: Record<string, unknown> | null;
  results: Record<string, unknown> | null;
  created_at: string;
}

export interface Enquiry {
  id: string;
  full_name: string;
  phone: string | null;
  email: string;
  subject: string | null;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  created_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sort_order: number | null;
  is_published: boolean;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  alt_text: string;
  caption: string | null;
  category: string | null;
  sort_order: number | null;
  is_published: boolean;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  role: "admin" | "editor" | "staff";
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  action: string;
  entity: string | null;
  entity_id: string | null;
  meta: Record<string, unknown> | null;
  created_at: string;
}

// ============================================
// Nutrition Calculator Types
// ============================================

export interface NutritionInputs {
  sex: "male" | "female";
  age: number;
  height: number; // cm
  weight: number; // kg
  activityLevel: number; // multiplier
  goal: "lose" | "maintain" | "gain";
  ratePerWeek: number; // kg per week
  bodyFatPercent?: number;
  unit: "metric" | "imperial";
}

export interface NutritionResults {
  bmr: number;
  tdee: number;
  targetCalories: number;
  floorApplied: boolean;
  protein: { grams: number; calories: number; percent: number };
  carbs: { grams: number; calories: number; percent: number };
  fat: { grams: number; calories: number; percent: number };
  bmi: number;
  bmiCategory: string;
  waterMl: number;
  weeksToGoal: number | null;
  method: "mifflin" | "katch";
}

// ============================================
// Booking Form Types
// ============================================

export interface BookingFormData {
  bookingType: "intro" | "class" | "personal_training" | "day_pass";
  classId?: string;
  classSessionId?: string;
  instructorId?: string;
  date: string;
  time: string;
  fullName: string;
  phone: string;
  email: string;
  goal?: string;
  injuries?: string;
  heardFrom?: string;
  acceptTerms: boolean;
}

// ============================================
// Available Slot Type (from Postgres function)
// ============================================

export interface AvailableSlot {
  session_id: string;
  class_id: string;
  class_name: string;
  class_slug: string;
  start_time: string;
  duration_minutes: number;
  capacity: number;
  booked: number;
  remaining: number;
  instructor_name: string | null;
  instructor_slug: string | null;
}
