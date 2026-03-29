import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import {
  insertPropertySchema,
  insertBikeRentalSchema,
  insertReviewSchema,
  insertStudentProfileSchema,
  insertShortlistSchema,
} from "@shared/schema";

// Auth middleware
function requireAuth(req: Request, res: Response, next: Function) {
  if (!req.isAuthenticated()) {
    return res.status(401).send("Unauthorized");
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Property routes
  app.get("/api/properties", async (req, res) => {
    try {
      const { city, type, minRent, maxRent, amenities } = req.query;
      const filters = {
        city: city as string | undefined,
        type: type ? (Array.isArray(type) ? type : [type as string]) : undefined,
        minRent: minRent ? parseInt(minRent as string) : undefined,
        maxRent: maxRent ? parseInt(maxRent as string) : undefined,
        amenities: amenities ? (Array.isArray(amenities) ? amenities as string[] : [amenities as string]) : undefined,
      };
      const properties = await storage.getProperties(filters);
      res.json(properties);
    } catch (error) {
      res.status(500).send("Failed to fetch properties");
    }
  });

  app.get("/api/properties/my-listings", requireAuth, async (req, res) => {
    try {
      const properties = await storage.getPropertiesByOwner(req.user!.id);
      res.json(properties);
    } catch (error) {
      res.status(500).send("Failed to fetch properties");
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const property = await storage.getProperty(req.params.id);
      if (!property) {
        return res.status(404).send("Property not found");
      }
      res.json(property);
    } catch (error) {
      res.status(500).send("Failed to fetch property");
    }
  });

  app.post("/api/properties", requireAuth, async (req, res) => {
    try {
      const validated = insertPropertySchema.parse({
        ...req.body,
        ownerId: req.user!.id,
      });
      const property = await storage.createProperty(validated);
      res.status(201).json(property);
    } catch (error) {
      res.status(400).send("Invalid property data");
    }
  });

  app.patch("/api/properties/:id", requireAuth, async (req, res) => {
    try {
      const property = await storage.getProperty(req.params.id);
      if (!property || property.ownerId !== req.user!.id) {
        return res.status(403).send("Forbidden");
      }
      const updated = await storage.updateProperty(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      res.status(400).send("Failed to update property");
    }
  });

  app.delete("/api/properties/:id", requireAuth, async (req, res) => {
    try {
      const property = await storage.getProperty(req.params.id);
      if (!property || property.ownerId !== req.user!.id) {
        return res.status(403).send("Forbidden");
      }
      await storage.deleteProperty(req.params.id);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).send("Failed to delete property");
    }
  });

  // Bike rental routes
  app.get("/api/bikes", async (req, res) => {
    try {
      const available = req.query.available === "true" ? true : undefined;
      const bikes = await storage.getBikes(available);
      res.json(bikes);
    } catch (error) {
      res.status(500).send("Failed to fetch bikes");
    }
  });

  app.get("/api/bikes/my-listings", requireAuth, async (req, res) => {
    try {
      const bikes = await storage.getBikesByOwner(req.user!.id);
      res.json(bikes);
    } catch (error) {
      res.status(500).send("Failed to fetch bikes");
    }
  });

  app.post("/api/bikes", requireAuth, async (req, res) => {
    try {
      const validated = insertBikeRentalSchema.parse({
        ...req.body,
        ownerId: req.user!.id,
      });
      const bike = await storage.createBike(validated);
      res.status(201).json(bike);
    } catch (error) {
      res.status(400).send("Invalid bike data");
    }
  });

  app.patch("/api/bikes/:id", requireAuth, async (req, res) => {
    try {
      const bike = await storage.getBike(req.params.id);
      if (!bike || bike.ownerId !== req.user!.id) {
        return res.status(403).send("Forbidden");
      }
      const updated = await storage.updateBike(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      res.status(400).send("Failed to update bike");
    }
  });

  app.delete("/api/bikes/:id", requireAuth, async (req, res) => {
    try {
      const bike = await storage.getBike(req.params.id);
      if (!bike || bike.ownerId !== req.user!.id) {
        return res.status(403).send("Forbidden");
      }
      await storage.deleteBike(req.params.id);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).send("Failed to delete bike");
    }
  });

  // Student profile routes
  app.get("/api/profile", requireAuth, async (req, res) => {
    try {
      const profile = await storage.getProfileByUserId(req.user!.id);
      res.json(profile || null);
    } catch (error) {
      res.status(500).send("Failed to fetch profile");
    }
  });

  app.post("/api/profile", requireAuth, async (req, res) => {
    try {
      const validated = insertStudentProfileSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      const profile = await storage.createProfile(validated);
      res.status(201).json(profile);
    } catch (error) {
      res.status(400).send("Invalid profile data");
    }
  });

  app.patch("/api/profile", requireAuth, async (req, res) => {
    try {
      const updated = await storage.updateProfile(req.user!.id, req.body);
      res.json(updated);
    } catch (error) {
      res.status(400).send("Failed to update profile");
    }
  });

  // Roommate matching routes
  app.get("/api/roommates/matches", requireAuth, async (req, res) => {
    try {
      const userProfile = await storage.getProfileByUserId(req.user!.id);
      if (!userProfile) {
        return res.json([]);
      }

      const allProfiles = await storage.getAllProfiles();
      const matches = allProfiles
        .filter((p) => p.userId !== req.user!.id)
        .map((profile) => {
          // Calculate match percentage based on preferences
          let matchScore = 0;
          let totalCriteria = 0;

          if (userProfile.sleepSchedule && profile.sleepSchedule) {
            totalCriteria++;
            if (userProfile.sleepSchedule === profile.sleepSchedule) matchScore++;
          }
          if (userProfile.cleanliness && profile.cleanliness) {
            totalCriteria++;
            if (userProfile.cleanliness === profile.cleanliness) matchScore++;
          }
          if (userProfile.noiseLevel && profile.noiseLevel) {
            totalCriteria++;
            if (userProfile.noiseLevel === profile.noiseLevel) matchScore++;
          }
          if (userProfile.lifestyle && profile.lifestyle) {
            totalCriteria++;
            if (userProfile.lifestyle === profile.lifestyle) matchScore++;
          }
          if (userProfile.budget && profile.budget) {
            totalCriteria++;
            const budgetDiff = Math.abs(userProfile.budget - profile.budget);
            if (budgetDiff < 2000) matchScore += 1;
            else if (budgetDiff < 5000) matchScore += 0.5;
          }

          const matchPercentage = totalCriteria > 0
            ? Math.round((matchScore / totalCriteria) * 100)
            : 50;

          return { profile, matchPercentage };
        })
        .filter((m) => m.matchPercentage >= 30)
        .sort((a, b) => b.matchPercentage - a.matchPercentage);

      // Get user data for each profile
      const matchesWithUsers = await Promise.all(
        matches.map(async ({ profile, matchPercentage }) => {
          const user = await storage.getUser(profile.userId);
          return {
            profile: { ...profile, user },
            matchPercentage,
          };
        })
      );

      res.json(matchesWithUsers);
    } catch (error) {
      res.status(500).send("Failed to fetch matches");
    }
  });

  // Review routes
  app.get("/api/reviews/:targetType/:targetId", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByTarget(
        req.params.targetId,
        req.params.targetType
      );

      // Get user data for each review
      const reviewsWithUsers = await Promise.all(
        reviews.map(async (review) => {
          const user = await storage.getUser(review.userId);
          return { ...review, user };
        })
      );

      res.json(reviewsWithUsers);
    } catch (error) {
      res.status(500).send("Failed to fetch reviews");
    }
  });

  app.post("/api/reviews", requireAuth, async (req, res) => {
    try {
      const validated = insertReviewSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      const review = await storage.createReview(validated);
      res.status(201).json(review);
    } catch (error) {
      res.status(400).send("Invalid review data");
    }
  });

  // Shortlist routes
  app.get("/api/shortlists", requireAuth, async (req, res) => {
    try {
      const shortlists = await storage.getShortlistsByUser(req.user!.id);
      res.json(shortlists.map((s) => s.propertyId));
    } catch (error) {
      res.status(500).send("Failed to fetch shortlists");
    }
  });

  app.get("/api/shortlists/properties", requireAuth, async (req, res) => {
    try {
      const shortlists = await storage.getShortlistsByUser(req.user!.id);
      const properties = await Promise.all(
        shortlists.map((s) => storage.getProperty(s.propertyId))
      );
      res.json(properties.filter(Boolean));
    } catch (error) {
      res.status(500).send("Failed to fetch shortlisted properties");
    }
  });

  app.post("/api/shortlists", requireAuth, async (req, res) => {
    try {
      const validated = insertShortlistSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      
      // Check if already shortlisted
      const exists = await storage.isShortlisted(req.user!.id, validated.propertyId);
      if (exists) {
        return res.status(400).send("Already shortlisted");
      }

      const shortlist = await storage.addToShortlist(validated);
      res.status(201).json(shortlist);
    } catch (error) {
      res.status(400).send("Invalid shortlist data");
    }
  });

  app.delete("/api/shortlists/:propertyId", requireAuth, async (req, res) => {
    try {
      await storage.removeFromShortlist(req.user!.id, req.params.propertyId);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).send("Failed to remove from shortlist");
    }
  });

  // Stats routes
  app.get("/api/stats/student", requireAuth, async (req, res) => {
    try {
      const shortlists = await storage.getShortlistsByUser(req.user!.id);
      const bikes = await storage.getBikesByOwner(req.user!.id);
      const profile = await storage.getProfileByUserId(req.user!.id);
      
      // Calculate matches count (simplified)
      let matchesCount = 0;
      if (profile) {
        const allProfiles = await storage.getAllProfiles();
        matchesCount = allProfiles.filter((p) => p.userId !== req.user!.id).length;
      }

      const stats = {
        shortlisted: shortlists.length,
        rentals: bikes.length,
        matches: matchesCount,
        reviews: 0, // Would need to track reviews by user
      };

      res.json(stats);
    } catch (error) {
      res.status(500).send("Failed to fetch stats");
    }
  });

  app.get("/api/stats/owner", requireAuth, async (req, res) => {
    try {
      const properties = await storage.getPropertiesByOwner(req.user!.id);
      
      const totalRooms = properties.reduce((sum, p) => sum + p.totalRooms, 0);
      const availableRooms = properties.reduce((sum, p) => sum + p.availableRooms, 0);
      const totalReviews = properties.reduce((sum, p) => sum + p.reviewCount, 0);
      const avgRating = properties.length > 0
        ? Math.round(properties.reduce((sum, p) => sum + p.rating, 0) / properties.length)
        : 0;

      const stats = {
        totalProperties: properties.length,
        totalRooms,
        availableRooms,
        averageRating: avgRating,
        totalReviews,
      };

      res.json(stats);
    } catch (error) {
      res.status(500).send("Failed to fetch stats");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
