import { useState } from "react";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, ArrowLeft, Bell, Share2, MapPin, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Club, Event, Announcement } from "@shared/schema";
import techClubImage from "@assets/generated_images/Tech_club_banner_image_36eb5fcc.png";
import concertImage from "@assets/generated_images/Concert_event_card_image_7ecb3d54.png";
import workshopImage from "@assets/generated_images/Workshop_event_card_image_d6cb6d14.png";

const eventImages = [workshopImage, concertImage];

export default function ClubDetail() {
  const params = useParams();
  const [isFollowing, setIsFollowing] = useState(false);

  const { data: club, isLoading: clubLoading } = useQuery<Club>({
    queryKey: ["/api/clubs", params.id],
    enabled: !!params.id,
  });

  const { data: allEvents = [] } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: announcements = [] } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements"],
  });

  if (clubLoading || !club) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="text-2xl font-bold text-primary font-mono">Cheesecake</div>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  const events = allEvents
    .filter(e => e.clubId === club.id)
    .map((event, idx) => {
      const eventDate = new Date(event.startDate);
      return {
        ...event,
        date: eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        time: eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        image: eventImages[idx % eventImages.length],
        rsvps: event.rsvpCount,
      };
    });

  const clubAnnouncements = announcements
    .filter(a => a.clubId === club.id)
    .map(a => ({
      ...a,
      date: new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));

  const members = [
    { name: "Alex", initials: "AS", role: "President" },
    { name: "Jordan", initials: "JM", role: "Vice President" },
    { name: "Taylor", initials: "TW", role: "Secretary" },
    { name: "Morgan", initials: "MB", role: "Treasurer" },
    { name: "Casey", initials: "CJ", role: "Member" },
    { name: "Riley", initials: "RK", role: "Member" },
  ];

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
              <Link href="/events">
                <Button variant="ghost" size="sm" data-testid="button-events">Events</Button>
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

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
        <Link href="/clubs">
          <Button variant="ghost" size="sm" data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clubs
          </Button>
        </Link>
      </div>

      {/* Banner with Logo Overlay */}
      <div className="relative">
        <div className="h-64 overflow-hidden">
          <img src={club.bannerImage} alt={club.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="relative -mt-16 flex flex-col sm:flex-row items-start sm:items-end gap-6">
            <div className="w-32 h-32 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-4xl font-bold shadow-xl border-4 border-background">
              {club.name.split(' ').map(w => w[0]).join('')}
            </div>
            <div className="flex-1 pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">{club.name}</h1>
                <Badge variant="secondary" className="w-fit">{club.category}</Badge>
              </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{club.memberCount} members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{events.length} upcoming events</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 pb-2">
              <Button
                variant={isFollowing ? "outline" : "default"}
                onClick={() => setIsFollowing(!isFollowing)}
                data-testid="button-follow"
              >
                {isFollowing ? "Following" : "Follow Club"}
              </Button>
              <Button variant="outline" size="icon" data-testid="button-share">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <Tabs defaultValue="about" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="about" data-testid="tab-about">About</TabsTrigger>
            <TabsTrigger value="events" data-testid="tab-events">Events</TabsTrigger>
            <TabsTrigger value="members" data-testid="tab-members">Members</TabsTrigger>
            <TabsTrigger value="announcements" data-testid="tab-announcements">Announcements</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold">About {club.name}</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-base text-muted-foreground leading-relaxed">{club.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                      <div className="text-sm font-semibold mb-1">Founded</div>
                      <div className="text-muted-foreground">{(club as any).founded ?? '—'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold mb-1">Contact</div>
                      <div className="text-muted-foreground">{(club as any).email ?? 'n/a'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold mb-1">Meetings</div>
                      <div className="text-muted-foreground">{(club as any).meetings ?? '—'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold mb-1">Location</div>
                      <div className="text-muted-foreground">{(club as any).location ?? '—'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover-elevate" data-testid={`card-event-${event.id}`}>
                  <div className="relative aspect-video">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    <Badge className="absolute top-4 left-4 px-3 py-1.5 text-xs font-bold uppercase bg-primary text-primary-foreground">
                      {event.date}
                    </Badge>
                  </div>
                  <CardHeader>
                    <h3 className="text-xl font-semibold">{event.title}</h3>
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
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{event.rsvps} RSVPs</span>
                    </div>
                  </CardContent>
                  <CardContent className="border-t pt-4">
                    <Link href={`/events/${event.id}`}>
                      <Button className="w-full" data-testid={`button-view-event-${event.id}`}>
                        View Event
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold">Club Members ({club.memberCount})</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {members.map((member, idx) => (
                    <div key={idx} className="text-center" data-testid={`member-${idx}`}>
                      <Avatar className="w-16 h-16 mx-auto mb-2">
                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-lg">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-semibold text-sm">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.role}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements" className="space-y-4">
            {clubAnnouncements.map((announcement) => (
              <Card key={announcement.id} data-testid={`announcement-${announcement.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-semibold">{announcement.title}</h3>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">{announcement.date}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-muted-foreground leading-relaxed">{announcement.content}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
