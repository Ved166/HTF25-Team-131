import {
  type Club,
  type InsertClub,
  type Event,
  type InsertEvent,
  type Registration,
  type InsertRegistration,
  type Follower,
  type InsertFollower,
  type Announcement,
  type InsertAnnouncement,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Clubs
  getAllClubs(): Promise<Club[]>;
  getClubById(id: string): Promise<Club | undefined>;
  createClub(club: InsertClub): Promise<Club>;
  updateClub(id: string, club: Partial<InsertClub>): Promise<Club | undefined>;
  deleteClub(id: string): Promise<boolean>;
  incrementClubMembers(clubId: string): Promise<void>;
  decrementClubMembers(clubId: string): Promise<void>;

  // Events
  getAllEvents(): Promise<Event[]>;
  getEventById(id: string): Promise<Event | undefined>;
  getEventsByClubId(clubId: string): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<boolean>;
  incrementEventRSVP(eventId: string): Promise<void>;

  // Registrations
  getAllRegistrations(): Promise<Registration[]>;
  getRegistrationById(id: string): Promise<Registration | undefined>;
  getRegistrationsByEventId(eventId: string): Promise<Registration[]>;
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  checkInRegistration(id: string): Promise<Registration | undefined>;

  // Followers
  getAllFollowers(): Promise<Follower[]>;
  getFollowersByClubId(clubId: string): Promise<Follower[]>;
  createFollower(follower: InsertFollower): Promise<Follower>;
  deleteFollower(clubId: string, studentEmail: string): Promise<boolean>;

  // Announcements
  getAllAnnouncements(): Promise<Announcement[]>;
  getAnnouncementsByClubId(clubId: string): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
}

export class MemStorage implements IStorage {
  private clubs: Map<string, Club>;
  private events: Map<string, Event>;
  private registrations: Map<string, Registration>;
  private followers: Map<string, Follower>;
  private announcements: Map<string, Announcement>;

  constructor() {
    this.clubs = new Map();
    this.events = new Map();
    this.registrations = new Map();
    this.followers = new Map();
    this.announcements = new Map();

    this.seedData();
  }

  private seedData() {
    // Seed clubs
    const techClub = this.createClubSync({
      name: "Tech Club",
      description: "Explore the latest in technology, coding, and innovation. Join us for workshops, hackathons, and tech talks.",
      category: "Technology",
      bannerImage: "/tech-banner.jpg",
      logoImage: "/tech-logo.jpg",
      memberCount: 342,
    });

    const musicSociety = this.createClubSync({
      name: "Music Society",
      description: "For music lovers and performers. Regular concerts, jam sessions, and music appreciation events.",
      category: "Music",
      bannerImage: "/music-banner.jpg",
      logoImage: "/music-logo.jpg",
      memberCount: 275,
    });

    const artClub = this.createClubSync({
      name: "Art & Design Society",
      description: "Express creativity through various art forms including painting, digital design, and sculpture.",
      category: "Arts",
      bannerImage: "/art-banner.jpg",
      logoImage: "/art-logo.jpg",
      memberCount: 218,
    });

    const sportsClub = this.createClubSync({
      name: "Sports Club",
      description: "Stay active with various sports activities, tournaments, and fitness programs for all skill levels.",
      category: "Sports",
      bannerImage: "/sports-banner.jpg",
      logoImage: "/sports-logo.jpg",
      memberCount: 456,
    });

    // Seed events
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    this.createEventSync({
      clubId: musicSociety.id,
      title: "Spring Concert ft. Local Bands",
      description: "Join us for an unforgettable evening of live music featuring talented local bands.",
      category: "Music",
      coverImage: "/concert.jpg",
      location: "Main Auditorium, Building A",
      startDate: nextWeek,
      endDate: new Date(nextWeek.getTime() + 3 * 60 * 60 * 1000),
      maxAttendees: 300,
      rsvpCount: 156,
    });

    this.createEventSync({
      clubId: techClub.id,
      title: "Web Development Workshop",
      description: "Learn modern web development techniques with React and Node.js.",
      category: "Workshop",
      coverImage: "/workshop.jpg",
      location: "Computer Lab 3",
      startDate: new Date(nextWeek.getTime() + 3 * 24 * 60 * 60 * 1000),
      endDate: new Date(nextWeek.getTime() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      maxAttendees: 50,
      rsvpCount: 42,
    });

    this.createEventSync({
      clubId: sportsClub.id,
      title: "Basketball Championship Finals",
      description: "Championship game of the season. Come support your team!",
      category: "Sports",
      coverImage: "/basketball.jpg",
      location: "Sports Complex",
      startDate: new Date(nextWeek.getTime() + 5 * 24 * 60 * 60 * 1000),
      endDate: new Date(nextWeek.getTime() + 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      maxAttendees: 500,
      rsvpCount: 203,
    });

    this.createEventSync({
      clubId: techClub.id,
      title: "AI/ML Tech Talk",
      description: "Industry experts discuss the latest trends in artificial intelligence and machine learning.",
      category: "Workshop",
      coverImage: "/tech-talk.jpg",
      location: "Auditorium B",
      startDate: twoWeeks,
      endDate: new Date(twoWeeks.getTime() + 2 * 60 * 60 * 1000),
      maxAttendees: 100,
      rsvpCount: 67,
    });

    // Seed announcements
    this.createAnnouncementSync({
      clubId: techClub.id,
      title: "New Workshop Series Starting",
      content: "We're excited to announce a new series of hands-on workshops covering React, Node.js, and cloud deployment!",
    });

    this.createAnnouncementSync({
      clubId: musicSociety.id,
      title: "Tickets Now Available",
      content: "Get your tickets for the Spring Concert now! Limited seats available.",
    });
  }

  private createClubSync(club: InsertClub): Club {
    const id = randomUUID();
    const newClub: Club = { ...club, id, createdAt: new Date() };
    this.clubs.set(id, newClub);
    return newClub;
  }

  private createEventSync(event: InsertEvent): Event {
    const id = randomUUID();
    const newEvent: Event = { ...event, id, createdAt: new Date() };
    this.events.set(id, newEvent);
    return newEvent;
  }

  private createAnnouncementSync(announcement: InsertAnnouncement): Announcement {
    const id = randomUUID();
    const newAnnouncement: Announcement = { ...announcement, id, createdAt: new Date() };
    this.announcements.set(id, newAnnouncement);
    return newAnnouncement;
  }

  // Clubs
  async getAllClubs(): Promise<Club[]> {
    return Array.from(this.clubs.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getClubById(id: string): Promise<Club | undefined> {
    return this.clubs.get(id);
  }

  async createClub(club: InsertClub): Promise<Club> {
    return this.createClubSync(club);
  }

  async updateClub(id: string, clubUpdate: Partial<InsertClub>): Promise<Club | undefined> {
    const club = this.clubs.get(id);
    if (!club) return undefined;
    
    const updated: Club = { ...club, ...clubUpdate };
    this.clubs.set(id, updated);
    return updated;
  }

  async deleteClub(id: string): Promise<boolean> {
    return this.clubs.delete(id);
  }

  async incrementClubMembers(clubId: string): Promise<void> {
    const club = this.clubs.get(clubId);
    if (club) {
      club.memberCount++;
      this.clubs.set(clubId, club);
    }
  }

  async decrementClubMembers(clubId: string): Promise<void> {
    const club = this.clubs.get(clubId);
    if (club && club.memberCount > 0) {
      club.memberCount--;
      this.clubs.set(clubId, club);
    }
  }

  // Events
  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).sort((a, b) => 
      a.startDate.getTime() - b.startDate.getTime()
    );
  }

  async getEventById(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getEventsByClubId(clubId: string): Promise<Event[]> {
    return Array.from(this.events.values())
      .filter(event => event.clubId === clubId)
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    return this.createEventSync(event);
  }

  async updateEvent(id: string, eventUpdate: Partial<InsertEvent>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    
    const updated: Event = { ...event, ...eventUpdate };
    this.events.set(id, updated);
    return updated;
  }

  async deleteEvent(id: string): Promise<boolean> {
    return this.events.delete(id);
  }

  async incrementEventRSVP(eventId: string): Promise<void> {
    const event = this.events.get(eventId);
    if (event) {
      event.rsvpCount++;
      this.events.set(eventId, event);
    }
  }

  // Registrations
  async getAllRegistrations(): Promise<Registration[]> {
    return Array.from(this.registrations.values());
  }

  async getRegistrationById(id: string): Promise<Registration | undefined> {
    return this.registrations.get(id);
  }

  async getRegistrationsByEventId(eventId: string): Promise<Registration[]> {
    return Array.from(this.registrations.values())
      .filter(reg => reg.eventId === eventId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createRegistration(registration: InsertRegistration): Promise<Registration> {
    const id = randomUUID();
    const newRegistration: Registration = {
      ...registration,
      id,
      checkedIn: false,
      createdAt: new Date(),
    };
    this.registrations.set(id, newRegistration);
    await this.incrementEventRSVP(registration.eventId);
    return newRegistration;
  }

  async checkInRegistration(id: string): Promise<Registration | undefined> {
    const registration = this.registrations.get(id);
    if (!registration) return undefined;
    
    registration.checkedIn = true;
    this.registrations.set(id, registration);
    return registration;
  }

  // Followers
  async getAllFollowers(): Promise<Follower[]> {
    return Array.from(this.followers.values());
  }

  async getFollowersByClubId(clubId: string): Promise<Follower[]> {
    return Array.from(this.followers.values())
      .filter(follower => follower.clubId === clubId);
  }

  async createFollower(follower: InsertFollower): Promise<Follower> {
    const id = randomUUID();
    const newFollower: Follower = { ...follower, id, createdAt: new Date() };
    this.followers.set(id, newFollower);
    await this.incrementClubMembers(follower.clubId);
    return newFollower;
  }

  async deleteFollower(clubId: string, studentEmail: string): Promise<boolean> {
    const follower = Array.from(this.followers.values())
      .find(f => f.clubId === clubId && f.studentEmail === studentEmail);
    
    if (!follower) return false;
    
    const deleted = this.followers.delete(follower.id);
    if (deleted) {
      await this.decrementClubMembers(clubId);
    }
    return deleted;
  }

  // Announcements
  async getAllAnnouncements(): Promise<Announcement[]> {
    return Array.from(this.announcements.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAnnouncementsByClubId(clubId: string): Promise<Announcement[]> {
    return Array.from(this.announcements.values())
      .filter(announcement => announcement.clubId === clubId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    return this.createAnnouncementSync(announcement);
  }
}

export const storage = new MemStorage();
