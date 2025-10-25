import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Calendar, Search, Users, Plus, TrendingUp, Clock, MapPin } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Event, Club, Announcement } from "@shared/schema";
import concertImage from "@assets/generated_images/Concert_event_card_image_7ecb3d54.png";
import workshopImage from "@assets/generated_images/Workshop_event_card_image_d6cb6d14.png";

const eventImages = [concertImage, workshopImage];

export default function Dashboard() {
  const [location] = useLocation();

  const { data: events = [], isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: clubs = [], isLoading: clubsLoading } = useQuery<Club[]>({
    queryKey: ["/api/clubs"],
  });

  const { data: announcements = [], isLoading: announcementsLoading } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements"],
  });

  const upcomingEvents = events.slice(0, 2).map((event, idx) => {
    const eventDate = new Date(event.startDate);
    return {
      ...event,
      club: clubs.find(c => c.id === event.clubId)?.name || 'Unknown Club',
      date: eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
      image: eventImages[idx % eventImages.length],
      registered: false,
    };
  });

  const myClubs = clubs.slice(0, 2).map(club => ({
    id: club.id,
    name: club.name,
    members: club.memberCount,
  }));

  const recentAnnouncements = announcements.slice(0, 2).map(announcement => {
    const club = clubs.find(c => c.id === announcement.clubId);
    const timeAgo = Math.floor((Date.now() - new Date(announcement.createdAt).getTime()) / (1000 * 60 * 60));
    return {
      id: announcement.id,
      club: club?.name || 'Unknown Club',
      title: announcement.title,
      time: timeAgo < 24 ? `${timeAgo} hours ago` : `${Math.floor(timeAgo / 24)} days ago`,
    };
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold text-primary font-mono">Cheesecake</div>
            </Link>
            
            <div className="flex-1 max-w-xl mx-8 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search events, clubs..."
                  className="pl-10 h-10"
                  data-testid="input-search"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
              </Button>
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">JS</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Welcome Section */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, Student!</h1>
              <p className="text-base text-muted-foreground">Here's what's happening in your community</p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <Link href="/events">
                <Button data-testid="button-browse-all-events">
                  <Calendar className="h-4 w-4 mr-2" />
                  Browse All Events
                </Button>
              </Link>
              <Link href="/clubs">
                <Button variant="outline" data-testid="button-discover-clubs">
                  <Users className="h-4 w-4 mr-2" />
                  Discover Clubs
                </Button>
              </Link>
            </div>

            {/* My Upcoming Events */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">My Upcoming Events</h2>
                <Link href="/events">
                  <Button variant="ghost" size="sm" data-testid="button-view-all-events">View All</Button>
                </Link>
              </div>
              
              {eventsLoading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <Card key={i} className="p-6">
                      <Skeleton className="h-24 w-full" />
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden hover-elevate transition-all duration-300" data-testid={`card-upcoming-event-${event.id}`}>
                    <div className="flex flex-col sm:flex-row">
                      <div className="w-full sm:w-48 h-32 sm:h-auto">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">{event.title}</h3>
                            <p className="text-sm text-muted-foreground">{event.club}</p>
                          </div>
                          {event.registered && (
                            <Badge variant="secondary" className="text-xs">Registered</Badge>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Link href={`/events/${event.id}`}>
                            <Button size="sm" variant={event.registered ? "outline" : "default"} data-testid={`button-event-action-${event.id}`}>
                              {event.registered ? "View Details" : "Register Now"}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              )}
            </div>

            {/* Recent Announcements */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Recent Announcements</h2>
              <div className="space-y-3">
                {recentAnnouncements.map((announcement) => (
                  <Card key={announcement.id} className="p-4 hover-elevate transition-all duration-300" data-testid={`card-announcement-${announcement.id}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">{announcement.club}</Badge>
                          <span className="text-xs text-muted-foreground">{announcement.time}</span>
                        </div>
                        <h3 className="text-base font-semibold">{announcement.title}</h3>
                      </div>
                      <Button variant="ghost" size="sm" data-testid={`button-read-announcement-${announcement.id}`}>Read</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* My Clubs */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">My Clubs</h3>
                  <Button variant="ghost" size="icon" className="h-8 w-8" data-testid="button-add-club">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {myClubs.map((club) => (
                  <Link key={club.id} href={`/clubs/${club.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-md hover-elevate transition-all cursor-pointer" data-testid={`club-item-${club.id}`}>
                      <div>
                        <div className="font-medium text-sm">{club.name}</div>
                        <div className="text-xs text-muted-foreground">{club.members} members</div>
                      </div>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Trending Events */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <h3 className="text-lg font-semibold">Trending Events</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-md border border-border hover-elevate transition-all cursor-pointer" data-testid="trending-event-1">
                  <div className="font-medium text-sm mb-1">Basketball Finals</div>
                  <div className="text-xs text-muted-foreground">203 interested</div>
                </div>
                <div className="p-3 rounded-md border border-border hover-elevate transition-all cursor-pointer" data-testid="trending-event-2">
                  <div className="font-medium text-sm mb-1">Art Exhibition</div>
                  <div className="text-xs text-muted-foreground">156 interested</div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Your Activity</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Events Attended</span>
                  <span className="text-2xl font-bold font-mono text-primary">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Clubs Joined</span>
                  <span className="text-2xl font-bold font-mono text-primary">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Upcoming RSVPs</span>
                  <span className="text-2xl font-bold font-mono text-primary">3</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
