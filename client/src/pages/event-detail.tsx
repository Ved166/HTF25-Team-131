import { useState } from "react";
import { Link, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, MapPin, Clock, Users, ArrowLeft, Share2, Bell, Download } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Event, Club, Registration } from "@shared/schema";
import concertImage from "@assets/generated_images/Concert_event_card_image_7ecb3d54.png";

export default function EventDetail() {
  const params = useParams();
  const { toast } = useToast();
  const [isRegistered, setIsRegistered] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [registrationId, setRegistrationId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");

  const { data: event, isLoading } = useQuery<Event>({
    queryKey: ["/api/events", params.id],
    enabled: !!params.id,
  });

  const { data: club } = useQuery<Club>({
    queryKey: ["/api/clubs", event?.clubId],
    enabled: !!event?.clubId,
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { eventId: string; studentName: string; studentEmail: string }) => {
      return apiRequest<Registration>("POST", "/api/registrations", data);
    },
    onSuccess: (data) => {
      setIsRegistered(true);
      setRegistrationId(data.id);
      setShowQRCode(true);
      queryClient.invalidateQueries({ queryKey: ["/api/events", params.id] });
      toast({
        title: "Registration Successful!",
        description: "You're all set for the event. Check-in with your QR code at the venue.",
      });
    },
    onError: () => {
      toast({
        title: "Registration Failed",
        description: "Could not complete registration. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleRegister = () => {
    if (!params.id || !studentName || !studentEmail) return;
    
    registerMutation.mutate({
      eventId: params.id,
      studentName,
      studentEmail,
    });
  };

  if (isLoading || !event) {
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
          <Skeleton className="h-96 w-full mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-64" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  
  const agenda = [
    { time: eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }), activity: "Event Begins" },
    { time: endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }), activity: "Event Concludes" }
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
        <Link href="/events">
          <Button variant="ghost" size="sm" data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="relative h-96 overflow-hidden">
        <img src={concertImage} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-8">
            <Badge className="mb-4 px-4 py-2 text-sm font-bold uppercase">{event.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{event.title}</h1>
            <Link href={`/clubs/${event.clubId}`}>
              <p className="text-lg text-white/90 hover:text-white transition-colors">
                by {club?.name || 'Loading...'}
              </p>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Details */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold">Event Details</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Date</div>
                      <div className="font-semibold">{eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Time</div>
                      <div className="font-semibold">{eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - {endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Location</div>
                      <div className="font-semibold">{event.location}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Capacity</div>
                      <div className="font-semibold">{event.rsvpCount} / {event.maxAttendees || 'Unlimited'}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">About this Event</h3>
                  <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Event Agenda */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold">Event Agenda</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agenda.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start" data-testid={`agenda-item-${idx}`}>
                      <div className="w-24 shrink-0 text-sm font-semibold text-primary">{item.time}</div>
                      <div className="flex-1 text-sm">{item.activity}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Attendees Preview */}
            {event.rsvpCount > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold">Who's Going</h2>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {event.rsvpCount} {event.rsvpCount === 1 ? 'person has' : 'people have'} registered for this event
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Registration Sidebar */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold font-mono text-primary mb-2">
                    {event.rsvpCount}
                  </div>
                  <div className="text-sm text-muted-foreground">people registered</div>
                </div>

                {!isRegistered ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full h-12 text-base font-semibold" data-testid="button-register">
                        Register for Event
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Register for Event</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            placeholder="John Doe" 
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            data-testid="input-name" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="john@college.edu"
                            value={studentEmail}
                            onChange={(e) => setStudentEmail(e.target.value)}
                            data-testid="input-email" 
                          />
                        </div>
                        <Button 
                          className="w-full" 
                          onClick={handleRegister}
                          disabled={registerMutation.isPending || !studentName || !studentEmail}
                          data-testid="button-confirm-register"
                        >
                          {registerMutation.isPending ? "Registering..." : "Confirm Registration"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-primary/10 border-2 border-primary/20 text-center">
                      <div className="text-sm font-semibold text-primary mb-1">You're Registered!</div>
                      <div className="text-xs text-muted-foreground">Check-in with QR code at venue</div>
                    </div>

                    <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full" data-testid="button-show-qr">
                          Show QR Code
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Event Check-in QR Code</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="flex justify-center">
                            <div className="p-4 bg-white rounded-lg">
                              <QRCodeSVG
                                value={`event-checkin-${event.id}-${registrationId}`}
                                size={256}
                                level="H"
                                data-testid="qr-code"
                              />
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold mb-1">{event.title}</p>
                            <p className="text-sm text-muted-foreground mb-4">Scan at venue to check in</p>
                            <Button variant="outline" className="w-full" data-testid="button-download-qr">
                              <Download className="h-4 w-4 mr-2" />
                              Download QR Code
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}

                <div className="pt-6 border-t space-y-3">
                  <Button variant="outline" className="w-full" data-testid="button-share">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Event
                  </Button>
                  <Link href={`/clubs/${event.clubId}`} className="block">
                    <Button variant="ghost" className="w-full" data-testid="button-view-club">
                      View {event.club}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
