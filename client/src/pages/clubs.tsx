import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Users, Calendar, Bell, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Club, Event } from "@shared/schema";
import techClubImage from "@assets/generated_images/Tech_club_banner_image_36eb5fcc.png";
import artClubImage from "@assets/generated_images/Art_club_banner_image_24dfe265.png";

const clubImages = [techClubImage, artClubImage];

export default function Clubs() {
  const { data: clubsData = [], isLoading: clubsLoading } = useQuery<Club[]>({
    queryKey: ["/api/clubs"],
  });

  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const clubs = clubsData.map((club, idx) => ({
    ...club,
    members: club.memberCount,
    upcomingEvents: events.filter(e => e.clubId === club.id).length,
    image: clubImages[idx % clubImages.length],
    trending: idx % 2 === 0,
  }));

  const categories = ["All", "Technology", "Arts", "Music", "Sports", "Academic", "Social"];

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

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Clubs</h1>
          <p className="text-base md:text-lg text-muted-foreground mb-6">
            Find communities that share your interests and passions
          </p>

          {/* Search */}
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search clubs..."
              className="pl-10 h-12"
              data-testid="input-search-clubs"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={category === "All" ? "default" : "outline"}
              className="px-4 py-2 text-sm cursor-pointer hover-elevate transition-all"
              data-testid={`badge-category-${category.toLowerCase()}`}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Clubs Grid */}
        {clubsLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-full mb-4" />
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {clubs.map((club) => (
            <Card key={club.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover-elevate" data-testid={`card-club-${club.id}`}>
              <div className="relative h-48">
                <img src={club.image} alt={club.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                {club.trending && (
                  <Badge className="absolute top-4 right-4 px-3 py-1.5 text-xs font-bold bg-primary/90 backdrop-blur-sm">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Trending
                  </Badge>
                )}
                <div className="absolute bottom-4 left-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{club.name}</h3>
                  <Badge variant="secondary" className="text-xs">{club.category}</Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <p className="text-base text-muted-foreground leading-relaxed mb-4">{club.description}</p>
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
              
              <CardFooter className="border-t p-6 flex gap-3">
                <Link href={`/clubs/${club.id}`} className="flex-1">
                  <Button className="w-full" data-testid={`button-view-club-${club.id}`}>View Club</Button>
                </Link>
                <Button variant="outline" data-testid={`button-follow-club-${club.id}`}>
                  Follow
                </Button>
              </CardFooter>
            </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
