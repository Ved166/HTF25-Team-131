import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Calendar, Users, MapPin, Clock, Filter, Grid3x3, List, Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Event, Club } from "@shared/schema";
import concertImage from "@assets/generated_images/Concert_event_card_image_7ecb3d54.png";
import workshopImage from "@assets/generated_images/Workshop_event_card_image_d6cb6d14.png";
import sportsImage from "@assets/generated_images/Sports_event_card_image_1dba9f07.png";

const eventImages = [concertImage, workshopImage, sportsImage];

export default function Events() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: eventsData = [], isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: clubs = [] } = useQuery<Club[]>({
    queryKey: ["/api/clubs"],
  });

  const events = eventsData.map((event, idx) => {
    const eventDate = new Date(event.startDate);
    return {
      ...event,
      date: eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      club: clubs.find(c => c.id === event.clubId)?.name || 'Unknown Club',
      image: eventImages[idx % eventImages.length],
      rsvps: event.rsvpCount,
    };
  });

  const categories = ["Music", "Workshop", "Sports", "Arts", "Technology", "Social"];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold text-primary font-mono">Cheesecake</div>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" data-testid="button-dashboard">Dashboard</Button>
              </Link>
              <Link href="/clubs">
                <Button variant="ghost" size="sm" data-testid="button-clubs">Clubs</Button>
              </Link>
              <Link href="/admin/login">
                <Button variant="ghost" size="sm">Admin</Button>
              </Link>
              <Button variant="ghost" size="icon" data-testid="button-notifications">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">JS</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <Card className="sticky top-24">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <h2 className="text-lg font-semibold">Filters</h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Categories */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Categories</Label>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox id={category} data-testid={`checkbox-category-${category.toLowerCase()}`} />
                        <label
                          htmlFor={category}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Date Range</Label>
                  <div className="space-y-2">
                    <Input type="date" className="h-10" data-testid="input-date-start" />
                    <Input type="date" className="h-10" data-testid="input-date-end" />
                  </div>
                </div>

                <Button className="w-full" variant="outline" data-testid="button-clear-filters">
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and View Toggle */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search events..."
                  className="pl-10 h-12"
                  data-testid="input-search-events"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  data-testid="button-grid-view"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  data-testid="button-list-view"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Results Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Discover Events</h1>
              <p className="text-muted-foreground">
                Showing {events.length} events
              </p>
            </div>

            {/* Events Grid/List */}
            {eventsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="aspect-video w-full" />
                    <CardHeader className="gap-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-32" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover-elevate" data-testid={`card-event-${event.id}`}>
                    <div className="relative aspect-video">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                      <Badge className="absolute top-4 left-4 px-3 py-1.5 text-xs font-bold uppercase bg-primary text-primary-foreground">
                        {event.date}
                      </Badge>
                    </div>
                    <CardHeader className="gap-2">
                      <Badge variant="secondary" className="w-fit text-xs">{event.category}</Badge>
                      <h3 className="text-xl md:text-2xl font-semibold">{event.title}</h3>
                      <p className="text-sm font-medium text-muted-foreground">{event.club}</p>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between border-t pt-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{event.rsvps} RSVPs</span>
                      </div>
                      <Link href={`/events/${event.id}`}>
                        <Button size="sm" data-testid={`button-view-event-${event.id}`}>
                          View Details
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover-elevate transition-all duration-300" data-testid={`card-event-list-${event.id}`}>
                    <div className="flex flex-col sm:flex-row">
                      <div className="w-full sm:w-64 h-40 sm:h-auto">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">{event.category}</Badge>
                              <Badge className="px-3 py-1 text-xs font-bold uppercase">{event.date}</Badge>
                            </div>
                            <h3 className="text-2xl font-semibold mb-1">{event.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{event.club}</p>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{event.rsvps} RSVPs</span>
                          </div>
                        </div>
                        <Link href={`/events/${event.id}`}>
                          <Button data-testid={`button-view-event-list-${event.id}`}>View Details</Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
