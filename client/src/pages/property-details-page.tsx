import { useQuery, useMutation } from "@tanstack/react-query";
import { Property, ReviewWithUser } from "@shared/schema";
import { useParams, Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ReviewCard } from "@/components/review-card";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Home,
  MapPin,
  Star,
  Heart,
  Users,
  ArrowLeft,
  Wifi,
  Car,
  Dumbbell,
  Wind,
  Utensils,
  Shield,
  Tv,
  Building,
} from "lucide-react";
import { useState } from "react";

const AMENITY_ICONS: Record<string, any> = {
  wifi: Wifi,
  parking: Car,
  gym: Dumbbell,
  ac: Wind,
  kitchen: Utensils,
  security: Shield,
  tv: Tv,
  elevator: Building,
};

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: property, isLoading } = useQuery<Property>({
    queryKey: ["/api/properties", id],
    queryFn: async () => {
      const res = await fetch(`/api/properties/${id}`);
      if (!res.ok) throw new Error("Failed to fetch property");
      return res.json();
    },
  });

  const { data: reviews } = useQuery<ReviewWithUser[]>({
    queryKey: ["/api/reviews", "property", id],
    queryFn: async () => {
      const res = await fetch(`/api/reviews/property/${id}`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    },
    enabled: !!property,
  });

  const { data: shortlists } = useQuery<string[]>({
    queryKey: ["/api/shortlists"],
    enabled: !!user,
  });

  const isShortlisted = shortlists?.includes(id!);

  const toggleShortlistMutation = useMutation({
    mutationFn: async () => {
      if (isShortlisted) {
        await apiRequest("DELETE", `/api/shortlists/${id}`);
      } else {
        await apiRequest("POST", "/api/shortlists", { propertyId: id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shortlists"] });
      queryClient.invalidateQueries({ queryKey: ["/api/properties", id] });
      toast({
        title: isShortlisted ? "Removed from shortlist" : "Added to shortlist",
        description: isShortlisted
          ? "Property removed from your saved list"
          : "Property saved to your shortlist",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update shortlist",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-96 w-full mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
          <Link href="/search">
            <Button>Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  const rating = property.rating / 10;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <Home className="w-6 h-6 text-primary" />
                <span className="text-xl font-serif font-bold">StayInn</span>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              {user ? (
                <Link href="/dashboard">
                  <Button variant="outline" data-testid="button-dashboard">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/auth">
                  <Button data-testid="button-login">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => setLocation("/search")}
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>

        {/* Image Gallery */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="col-span-4 lg:col-span-3">
            <div className="aspect-video rounded-xl overflow-hidden">
              <img
                src={property.images[selectedImage] || "https://via.placeholder.com/800x600"}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="col-span-4 lg:col-span-1 grid grid-cols-4 lg:grid-cols-1 gap-2">
            {property.images.slice(0, 4).map((image, idx) => (
              <div
                key={idx}
                className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                  selectedImage === idx ? "border-primary" : "border-transparent"
                }`}
                onClick={() => setSelectedImage(idx)}
              >
                <img src={image} alt={`${property.title} ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Section */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold font-serif" data-testid="text-property-title">
                      {property.title}
                    </h1>
                    {property.verified && (
                      <Badge className="bg-primary">Verified</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{property.location}, {property.city}</span>
                  </div>
                  {rating > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                        <span className="font-semibold text-lg">{rating.toFixed(1)}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({property.reviewCount} reviews)
                      </span>
                    </div>
                  )}
                </div>

                {user && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-shrink-0"
                    onClick={() => toggleShortlistMutation.mutate()}
                    disabled={toggleShortlistMutation.isPending}
                    data-testid="button-toggle-shortlist"
                  >
                    <Heart
                      className={`w-5 h-5 mr-2 ${isShortlisted ? "fill-destructive text-destructive" : ""}`}
                    />
                    {isShortlisted ? "Saved" : "Save"}
                  </Button>
                )}
              </div>
            </div>

            {/* Description */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold font-serif mb-4">About this property</h2>
              <p className="text-muted-foreground leading-relaxed">{property.description}</p>
            </Card>

            {/* Property Details */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold font-serif mb-4">Property Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Type</div>
                  <div className="font-medium capitalize">{property.type}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Rooms</div>
                  <div className="font-medium">{property.totalRooms}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Available Rooms</div>
                  <div className="font-medium">{property.availableRooms}</div>
                </div>
                {property.deposit && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Deposit</div>
                    <div className="font-medium">₹{property.deposit.toLocaleString()}</div>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <div className="text-sm text-muted-foreground mb-1">Address</div>
                  <div className="font-medium">{property.address}</div>
                </div>
              </div>
            </Card>

            {/* Amenities */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold font-serif mb-4">Amenities</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {property.amenities.map((amenity) => {
                  const Icon = AMENITY_ICONS[amenity.toLowerCase()] || Shield;
                  return (
                    <div key={amenity} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="capitalize">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Reviews */}
            <div>
              <h2 className="text-xl font-semibold font-serif mb-4">
                Reviews ({reviews?.length || 0})
              </h2>
              {reviews && reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground">Be the first to review this property</p>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="p-6 sticky top-24">
              <div className="space-y-6">
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">
                    ₹{property.rent.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Available Rooms</span>
                    <span className="font-medium">
                      {property.availableRooms} of {property.totalRooms}
                    </span>
                  </div>
                  {property.deposit && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Security Deposit</span>
                      <span className="font-medium">₹{property.deposit.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  disabled={property.availableRooms === 0}
                  data-testid="button-contact-owner"
                >
                  {property.availableRooms === 0 ? "Fully Booked" : "Contact Owner"}
                </Button>

                <div className="pt-4 border-t space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Verified property</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Safe community</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
