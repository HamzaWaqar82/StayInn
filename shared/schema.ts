import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table with role differentiation
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull(), // "student" or "owner"
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Student profiles with roommate preferences
export const studentProfiles = pgTable("student_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  bio: text("bio"),
  budget: integer("budget"),
  sleepSchedule: text("sleep_schedule"), // "early", "night-owl", "flexible"
  cleanliness: text("cleanliness"), // "very-clean", "moderate", "relaxed"
  noiseLevel: text("noise_level"), // "quiet", "moderate", "social"
  studyHabits: text("study_habits"), // "library", "home", "flexible"
  lifestyle: text("lifestyle"), // "active", "homebody", "social"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Properties/Hostels
export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // "hostel", "flat", "house"
  location: text("location").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  rent: integer("rent").notNull(),
  deposit: integer("deposit"),
  availableRooms: integer("available_rooms").notNull(),
  totalRooms: integer("total_rooms").notNull(),
  amenities: text("amenities").array().notNull(), // ["wifi", "laundry", "gym", etc.]
  images: text("images").array().notNull(),
  verified: boolean("verified").default(false),
  rating: integer("rating").default(0), // Average rating * 10 (e.g., 45 = 4.5 stars)
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Bike rentals
export const bikeRentals = pgTable("bike_rentals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  bikeType: text("bike_type").notNull(), // "mountain", "road", "hybrid", "electric"
  dailyRate: integer("daily_rate").notNull(),
  weeklyRate: integer("weekly_rate"),
  available: boolean("available").default(true),
  location: text("location").notNull(),
  images: text("images").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reviews (for properties and restaurants)
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  targetId: varchar("target_id").notNull(), // Property or restaurant ID
  targetType: text("target_type").notNull(), // "property" or "restaurant"
  rating: integer("rating").notNull(), // 1-5
  title: text("title").notNull(),
  content: text("content").notNull(),
  images: text("images").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Shortlisted properties
export const shortlists = pgTable("shortlists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  propertyId: varchar("property_id").notNull().references(() => properties.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  role: z.enum(["student", "owner"]),
}).omit({ id: true, createdAt: true });

export const insertStudentProfileSchema = createInsertSchema(studentProfiles, {
  sleepSchedule: z.enum(["early", "night-owl", "flexible"]).optional(),
  cleanliness: z.enum(["very-clean", "moderate", "relaxed"]).optional(),
  noiseLevel: z.enum(["quiet", "moderate", "social"]).optional(),
  studyHabits: z.enum(["library", "home", "flexible"]).optional(),
  lifestyle: z.enum(["active", "homebody", "social"]).optional(),
}).omit({ id: true, createdAt: true });

export const insertPropertySchema = createInsertSchema(properties).omit({ 
  id: true, 
  createdAt: true,
  verified: true,
  rating: true,
  reviewCount: true,
});

export const insertBikeRentalSchema = createInsertSchema(bikeRentals).omit({ 
  id: true, 
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews, {
  rating: z.number().min(1).max(5),
  targetType: z.enum(["property", "restaurant"]),
}).omit({ id: true, createdAt: true });

export const insertShortlistSchema = createInsertSchema(shortlists).omit({ 
  id: true, 
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertStudentProfile = z.infer<typeof insertStudentProfileSchema>;
export type StudentProfile = typeof studentProfiles.$inferSelect;

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

export type InsertBikeRental = z.infer<typeof insertBikeRentalSchema>;
export type BikeRental = typeof bikeRentals.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export type InsertShortlist = z.infer<typeof insertShortlistSchema>;
export type Shortlist = typeof shortlists.$inferSelect;

// Extended types with related data
export type PropertyWithOwner = Property & { owner: User };
export type ReviewWithUser = Review & { user: User };
export type BikeRentalWithOwner = BikeRental & { owner: User };
export type StudentProfileWithUser = StudentProfile & { user: User };
