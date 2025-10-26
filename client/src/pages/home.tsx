import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Users, QrCode, Bell, MapPin, Clock, ArrowRight } from "lucide-react";
import type { Event, Club } from "@shared/schema";
import heroImage from "@assets/generated_images/Campus_event_hero_image_9c023ae3.png";
import concertImage from "@assets/generated_images/Concert_event_card_image_7ecb3d54.png";
import workshopImage from "@assets/generated_images/Workshop_event_card_image_d6cb6d14.png";
import sportsImage from "@assets/generated_images/Sports_event_card_image_1dba9f07.png";
import techClubImage from "@assets/generated_images/Tech_club_banner_image_36eb5fcc.png";
import artClubImage from "@assets/generated_images/Art_club_banner_image_24dfe265.png";

const eventImages = [concertImage, workshopImage, sportsImage];
const clubImages = [techClubImage, artClubImage];

export default function Home() {
  const { data: events = [], isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: clubs = [], isLoading: clubsLoading } = useQuery<Club[]>({
    queryKey: ["/api/clubs"],
  });

  const featuredEvents = events.slice(0, 3).map((event, idx) => {
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

  const popularClubs = clubs.slice(0, 2).map((club, idx) => ({
    ...club,
    upcomingEvents: events.filter(e => e.clubId === club.id).length,
    image: clubImages[idx % clubImages.length],
    members: club.memberCount,
  }));

  const features = [
    {
      icon: Calendar,
      title: "Discover Events",
      description: "Browse upcoming events from all campus clubs in one place"
    },
    {
      icon: Bell,
      title: "Stay Notified",
      description: "Follow your favorite clubs and never miss an announcement"
    },
    {
      icon: QrCode,
      title: "Easy Check-in",
      description: "Quick QR code check-ins for hassle-free event attendance"
    }
  ];

  const stats = [
    { label: "Active Clubs", value: "45+", icon: Users },
    { label: "Events This Month", value: "127", icon: Calendar },
    { label: "Students Engaged", value: "2.5K", icon: Users },
    { label: "QR Check-ins", value: "8.9K", icon: QrCode }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold text-primary font-mono">Cheesecake</div>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/events" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md transition-colors" data-testid="link-events">
                Events
              </Link>
              <Link href="/clubs" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md transition-colors" data-testid="link-clubs">
                Clubs
              </Link>
              <Link href="/admin/login" className="text-sm font-medium text-muted-foreground hover:text-foreground hover-elevate px-3 py-2 rounded-md transition-colors">
                Admin
              </Link>
            </div>
            <Link href="/dashboard">
              <Button data-testid="button-get-started">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
            Your Campus Community,
            <br />
            All in One Place
          </h1>
          <p className="text-base md:text-lg text-white/90 leading-relaxed mb-8 max-w-2xl mx-auto">
            Discover clubs, register for events, and stay connected with your college community through Cheesecake.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/events">
              <Button size="lg" className="px-8 py-6 text-base font-semibold h-14 backdrop-blur-sm" data-testid="button-browse-events">
                Browse Events
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/clubs">
              <Button size="lg" variant="outline" className="px-8 py-6 text-base font-semibold h-14 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20" data-testid="button-explore-clubs">
                Explore Clubs
              </Button>
            </Link>
          </div>
          <p className="mt-8 text-sm text-white/70">
            Join 2,500+ students at your college
          </p>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 md:py-24 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Happening This Week</h2>
            <p className="text-base md:text-lg text-muted-foreground">Don't miss out on these exciting events</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredEvents.map((event) => (
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
                    <Button variant="ghost" size="sm" data-testid={`button-view-event-${event.id}`}>
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Clubs */}
      <section className="py-16 md:py-24 lg:py-32 bg-card">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Clubs</h2>
            <p className="text-base md:text-lg text-muted-foreground">Join communities that share your interests</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {popularClubs.map((club) => (
              <Card key={club.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover-elevate" data-testid={`card-club-${club.id}`}>
                <div className="relative h-48">
                  <img src={club.image} alt={club.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <h3 className="text-2xl font-bold text-white">{club.name}</h3>
                    <Badge variant="secondary" className="mt-2 text-xs">{club.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-base text-muted-foreground mb-4">{club.description}</p>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{club.members}</span>
                      <span className="text-muted-foreground">members</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{club.upcomingEvents}</span>
                      <span className="text-muted-foreground">events</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-6">
                  <Link href={`/clubs/${club.id}`} className="w-full">
                    <Button className="w-full" data-testid={`button-view-club-${club.id}`}>View Club</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-base md:text-lg text-muted-foreground">Get started in three simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {features.map((feature, idx) => (
              <div key={idx} className="text-center" data-testid={`feature-${idx}`}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-base text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center" data-testid={`stat-${idx}`}>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-4xl md:text-5xl font-bold font-mono text-primary mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students discovering events and connecting with clubs on campus
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="px-8 py-6 text-base font-semibold h-14" data-testid="button-join-now">
              Join Cheesecake Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary font-mono mb-4">Cheesecake</div>
            <p className="text-sm text-muted-foreground">
              Your campus community, all in one place
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
