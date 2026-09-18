import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKES(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

export function formatPhone(phone: string): string {
  // Normalize Kenyan phone numbers
  let cleaned = phone.replace(/\s+/g, "").replace(/-/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "+254" + cleaned.slice(1);
  } else if (cleaned.startsWith("254") && !cleaned.startsWith("+")) {
    cleaned = "+" + cleaned;
  }
  return cleaned;
}

export function generateWhatsAppLink(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function readingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function generateIdempotencyKey(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export const WORKOUT_CATEGORIES = [
  "Strength",
  "Conditioning",
  "Hypertrophy",
  "Mobility",
  "Core",
  "Olympic",
] as const;

export const MUSCLE_GROUPS = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
  "Full Body",
  "Quads",
  "Glutes",
  "Hamstrings",
  "Lats",
  "Mid back",
  "Posterior chain",
  "Triceps",
  "Biceps",
  "Lower abs",
  "Grip",
  "Hips",
] as const;

export const EQUIPMENT_LIST = [
  "Barbell",
  "Dumbbell",
  "Kettlebell",
  "Machine",
  "Bodyweight",
  "Cable",
  "Bench",
  "Rack",
  "Bar",
  "Battle ropes",
  "Air bike",
  "Plyo box",
  "Mat",
  "Cable machine",
  "Leg press machine",
  "Dumbbells",
  "Dumbbells/handles",
] as const;
