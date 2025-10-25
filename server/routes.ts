import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertClubSchema,
  insertEventSchema,
  insertRegistrationSchema,
  insertFollowerSchema,
  insertAnnouncementSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // ===== CLUBS =====
  
  // Get all clubs
  app.get("/api/clubs", async (_req, res) => {
    try {
      const clubs = await storage.getAllClubs();
      res.json(clubs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch clubs" });
    }
  });

  // Get club by ID
  app.get("/api/clubs/:id", async (req, res) => {
    try {
      const club = await storage.getClubById(req.params.id);
      if (!club) {
        return res.status(404).json({ error: "Club not found" });
      }
      res.json(club);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch club" });
    }
  });

  // Create club
  app.post("/api/clubs", async (req, res) => {
    try {
      const validatedData = insertClubSchema.parse(req.body);
      const club = await storage.createClub(validatedData);
      res.status(201).json(club);
    } catch (error) {
      res.status(400).json({ error: "Invalid club data" });
    }
  });

  // Update club
  app.patch("/api/clubs/:id", async (req, res) => {
    try {
      const club = await storage.updateClub(req.params.id, req.body);
      if (!club) {
        return res.status(404).json({ error: "Club not found" });
      }
      res.json(club);
    } catch (error) {
      res.status(400).json({ error: "Failed to update club" });
    }
  });

  // Delete club
  app.delete("/api/clubs/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteClub(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Club not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete club" });
    }
  });

  // ===== EVENTS =====
  
  // Get all events
  app.get("/api/events", async (req, res) => {
    try {
      const clubId = req.query.clubId as string | undefined;
      
      if (clubId) {
        const events = await storage.getEventsByClubId(clubId);
        return res.json(events);
      }
      
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  // Get event by ID
  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEventById(req.params.id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch event" });
    }
  });

  // Create event
  app.post("/api/events", async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ error: "Invalid event data" });
    }
  });

  // Update event
  app.patch("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.updateEvent(req.params.id, req.body);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: "Failed to update event" });
    }
  });

  // Delete event
  app.delete("/api/events/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteEvent(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete event" });
    }
  });

  // ===== REGISTRATIONS =====
  
  // Get all registrations for an event
  app.get("/api/events/:eventId/registrations", async (req, res) => {
    try {
      const registrations = await storage.getRegistrationsByEventId(req.params.eventId);
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch registrations" });
    }
  });

  // Create registration
  app.post("/api/registrations", async (req, res) => {
    try {
      const validatedData = insertRegistrationSchema.parse(req.body);
      
      // Check if event exists and has capacity
      const event = await storage.getEventById(validatedData.eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      
      if (event.maxAttendees && event.rsvpCount >= event.maxAttendees) {
        return res.status(400).json({ error: "Event is at full capacity" });
      }
      
      const registration = await storage.createRegistration(validatedData);
      res.status(201).json(registration);
    } catch (error) {
      res.status(400).json({ error: "Invalid registration data" });
    }
  });

  // Check in registration
  app.patch("/api/registrations/:id/check-in", async (req, res) => {
    try {
      const registration = await storage.checkInRegistration(req.params.id);
      if (!registration) {
        return res.status(404).json({ error: "Registration not found" });
      }
      res.json(registration);
    } catch (error) {
      res.status(500).json({ error: "Failed to check in" });
    }
  });

  // ===== FOLLOWERS =====
  
  // Get followers for a club
  app.get("/api/clubs/:clubId/followers", async (req, res) => {
    try {
      const followers = await storage.getFollowersByClubId(req.params.clubId);
      res.json(followers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch followers" });
    }
  });

  // Follow a club
  app.post("/api/followers", async (req, res) => {
    try {
      const validatedData = insertFollowerSchema.parse(req.body);
      
      // Check if club exists
      const club = await storage.getClubById(validatedData.clubId);
      if (!club) {
        return res.status(404).json({ error: "Club not found" });
      }
      
      const follower = await storage.createFollower(validatedData);
      res.status(201).json(follower);
    } catch (error) {
      res.status(400).json({ error: "Invalid follower data" });
    }
  });

  // Unfollow a club
  app.delete("/api/clubs/:clubId/followers/:email", async (req, res) => {
    try {
      const deleted = await storage.deleteFollower(req.params.clubId, req.params.email);
      if (!deleted) {
        return res.status(404).json({ error: "Follower not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to unfollow club" });
    }
  });

  // ===== ANNOUNCEMENTS =====
  
  // Get announcements
  app.get("/api/announcements", async (req, res) => {
    try {
      const clubId = req.query.clubId as string | undefined;
      
      if (clubId) {
        const announcements = await storage.getAnnouncementsByClubId(clubId);
        return res.json(announcements);
      }
      
      const announcements = await storage.getAllAnnouncements();
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch announcements" });
    }
  });

  // Create announcement
  app.post("/api/announcements", async (req, res) => {
    try {
      const validatedData = insertAnnouncementSchema.parse(req.body);
      
      // Check if club exists
      const club = await storage.getClubById(validatedData.clubId);
      if (!club) {
        return res.status(404).json({ error: "Club not found" });
      }
      
      const announcement = await storage.createAnnouncement(validatedData);
      res.status(201).json(announcement);
    } catch (error) {
      res.status(400).json({ error: "Invalid announcement data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
