import {
  type User,
  type InsertUser,
  type Property,
  type InsertProperty,
  type StudentProfile,
  type InsertStudentProfile,
  type BikeRental,
  type InsertBikeRental,
  type Review,
  type InsertReview,
  type Shortlist,
  type InsertShortlist,
  type StudentProfileWithUser,
  type PropertyWithOwner,
  type ReviewWithUser,
  type BikeRentalWithOwner,
} from "@shared/schema";
import { randomUUID } from "crypto";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Session store
  sessionStore: session.Store;

  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Property methods
  getProperty(id: string): Promise<Property | undefined>;
  getProperties(filters?: { city?: string; type?: string[]; minRent?: number; maxRent?: number; amenities?: string[] }): Promise<Property[]>;
  getPropertiesByOwner(ownerId: string): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: string): Promise<boolean>;

  // Student profile methods
  getProfileByUserId(userId: string): Promise<StudentProfile | undefined>;
  getAllProfiles(): Promise<StudentProfile[]>;
  createProfile(profile: InsertStudentProfile): Promise<StudentProfile>;
  updateProfile(userId: string, profile: Partial<InsertStudentProfile>): Promise<StudentProfile | undefined>;

  // Bike rental methods
  getBike(id: string): Promise<BikeRental | undefined>;
  getBikes(available?: boolean): Promise<BikeRental[]>;
  getBikesByOwner(ownerId: string): Promise<BikeRental[]>;
  createBike(bike: InsertBikeRental): Promise<BikeRental>;
  updateBike(id: string, bike: Partial<InsertBikeRental>): Promise<BikeRental | undefined>;
  deleteBike(id: string): Promise<boolean>;

  // Review methods
  getReviewsByTarget(targetId: string, targetType: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Shortlist methods
  getShortlistsByUser(userId: string): Promise<Shortlist[]>;
  addToShortlist(shortlist: InsertShortlist): Promise<Shortlist>;
  removeFromShortlist(userId: string, propertyId: string): Promise<boolean>;
  isShortlisted(userId: string, propertyId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  sessionStore: session.Store;
  private users: Map<string, User>;
  private properties: Map<string, Property>;
  private profiles: Map<string, StudentProfile>;
  private bikes: Map<string, BikeRental>;
  private reviews: Map<string, Review>;
  private shortlists: Map<string, Shortlist>;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    this.users = new Map();
    this.properties = new Map();
    this.profiles = new Map();
    this.bikes = new Map();
    this.reviews = new Map();
    this.shortlists = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      phone: insertUser.phone || null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Property methods
  async getProperty(id: string): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getProperties(filters?: {
    city?: string;
    type?: string[];
    minRent?: number;
    maxRent?: number;
    amenities?: string[];
  }): Promise<Property[]> {
    let properties = Array.from(this.properties.values());

    if (filters) {
      if (filters.city) {
        properties = properties.filter((p) =>
          p.city.toLowerCase().includes(filters.city!.toLowerCase())
        );
      }
      if (filters.type && filters.type.length > 0) {
        properties = properties.filter((p) => filters.type!.includes(p.type));
      }
      if (filters.minRent !== undefined) {
        properties = properties.filter((p) => p.rent >= filters.minRent!);
      }
      if (filters.maxRent !== undefined) {
        properties = properties.filter((p) => p.rent <= filters.maxRent!);
      }
      if (filters.amenities && filters.amenities.length > 0) {
        properties = properties.filter((p) =>
          filters.amenities!.every((a) => p.amenities.includes(a))
        );
      }
    }

    return properties;
  }

  async getPropertiesByOwner(ownerId: string): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (p) => p.ownerId === ownerId
    );
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = randomUUID();
    const property: Property = {
      ...insertProperty,
      id,
      deposit: insertProperty.deposit || null,
      verified: false,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date(),
    };
    this.properties.set(id, property);
    return property;
  }

  async updateProperty(
    id: string,
    updates: Partial<InsertProperty>
  ): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;

    const updated = { ...property, ...updates };
    this.properties.set(id, updated);
    return updated;
  }

  async deleteProperty(id: string): Promise<boolean> {
    return this.properties.delete(id);
  }

  // Student profile methods
  async getProfileByUserId(userId: string): Promise<StudentProfile | undefined> {
    return Array.from(this.profiles.values()).find((p) => p.userId === userId);
  }

  async getAllProfiles(): Promise<StudentProfile[]> {
    return Array.from(this.profiles.values());
  }

  async createProfile(insertProfile: InsertStudentProfile): Promise<StudentProfile> {
    const id = randomUUID();
    const profile: StudentProfile = {
      ...insertProfile,
      id,
      bio: insertProfile.bio || null,
      budget: insertProfile.budget || null,
      sleepSchedule: insertProfile.sleepSchedule || null,
      cleanliness: insertProfile.cleanliness || null,
      noiseLevel: insertProfile.noiseLevel || null,
      studyHabits: insertProfile.studyHabits || null,
      lifestyle: insertProfile.lifestyle || null,
      createdAt: new Date(),
    };
    this.profiles.set(id, profile);
    return profile;
  }

  async updateProfile(
    userId: string,
    updates: Partial<InsertStudentProfile>
  ): Promise<StudentProfile | undefined> {
    const profile = await this.getProfileByUserId(userId);
    if (!profile) return undefined;

    const updated = { ...profile, ...updates };
    this.profiles.set(profile.id, updated);
    return updated;
  }

  // Bike rental methods
  async getBike(id: string): Promise<BikeRental | undefined> {
    return this.bikes.get(id);
  }

  async getBikes(available?: boolean): Promise<BikeRental[]> {
    let bikes = Array.from(this.bikes.values());
    if (available !== undefined) {
      bikes = bikes.filter((b) => b.available === available);
    }
    return bikes;
  }

  async getBikesByOwner(ownerId: string): Promise<BikeRental[]> {
    return Array.from(this.bikes.values()).filter((b) => b.ownerId === ownerId);
  }

  async createBike(insertBike: InsertBikeRental): Promise<BikeRental> {
    const id = randomUUID();
    const bike: BikeRental = {
      ...insertBike,
      id,
      weeklyRate: insertBike.weeklyRate || null,
      available: true,
      createdAt: new Date(),
    };
    this.bikes.set(id, bike);
    return bike;
  }

  async updateBike(
    id: string,
    updates: Partial<InsertBikeRental>
  ): Promise<BikeRental | undefined> {
    const bike = this.bikes.get(id);
    if (!bike) return undefined;

    const updated = { ...bike, ...updates };
    this.bikes.set(id, updated);
    return updated;
  }

  async deleteBike(id: string): Promise<boolean> {
    return this.bikes.delete(id);
  }

  // Review methods
  async getReviewsByTarget(targetId: string, targetType: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (r) => r.targetId === targetId && r.targetType === targetType
    );
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = {
      ...insertReview,
      id,
      images: insertReview.images || null,
      createdAt: new Date(),
    };
    this.reviews.set(id, review);

    // Update property rating if it's a property review
    if (review.targetType === "property") {
      const property = await this.getProperty(review.targetId);
      if (property) {
        const reviews = await this.getReviewsByTarget(review.targetId, "property");
        const avgRating = Math.round(
          (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10
        );
        await this.updateProperty(review.targetId, {
          rating: avgRating,
          reviewCount: reviews.length,
        });
      }
    }

    return review;
  }

  // Shortlist methods
  async getShortlistsByUser(userId: string): Promise<Shortlist[]> {
    return Array.from(this.shortlists.values()).filter((s) => s.userId === userId);
  }

  async addToShortlist(insertShortlist: InsertShortlist): Promise<Shortlist> {
    const id = randomUUID();
    const shortlist: Shortlist = {
      ...insertShortlist,
      id,
      createdAt: new Date(),
    };
    this.shortlists.set(id, shortlist);
    return shortlist;
  }

  async removeFromShortlist(userId: string, propertyId: string): Promise<boolean> {
    const shortlist = Array.from(this.shortlists.values()).find(
      (s) => s.userId === userId && s.propertyId === propertyId
    );
    if (!shortlist) return false;
    return this.shortlists.delete(shortlist.id);
  }

  async isShortlisted(userId: string, propertyId: string): Promise<boolean> {
    return Array.from(this.shortlists.values()).some(
      (s) => s.userId === userId && s.propertyId === propertyId
    );
  }
}

export const storage = new MemStorage();
