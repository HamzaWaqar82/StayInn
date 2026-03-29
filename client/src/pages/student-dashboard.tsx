import { useQuery } from "@tanstack/react-query";
import { Property, BikeRental, StudentProfile } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Heart, Users, Bike, Star, Plus } from "lucide-react";
import { Link } from "wouter";
import { PropertyCard } from "@/components/property-card";
import { BikeRentalCard } from "@/components/bike-rental-card";

export default function StudentDashboard() {
  const { data: profile } = useQuery<StudentProfile>({
    queryKey: ["/api/profile"],
  });

  const { data: shortlistedProperties } = useQuery<Property[]>({
    queryKey: ["/api/shortlists/properties"],
  });

  const { data: myBikes } = useQuery<BikeRental[]>({
    queryKey: ["/api/bikes/my-listings"],
  });

  const { data: stats } = useQuery<{
    shortlisted: number;
    rentals: number;
    matches: number;
    reviews: number;
  }>({
    queryKey: ["/api/stats/student"],
  });

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

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/search">
                <span className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                  Search
                </span>
              </Link>
              <Link href="/roommates">
                <span className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                  Roommates
                </span>
              </Link>
              <Link href="/bikes">
                <span className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                  Bikes
                </span>
              </Link>
              <Link href="/dashboard">
                <span className="text-sm font-medium text-primary cursor-pointer">
                  Dashboard
                </span>
              </Link>
            </nav>

            <Button variant="outline" data-testid="button-logout">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">
            Manage your searches, roommate matches, and rentals
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 space-y-3 hover-elevate transition-all">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <Badge variant="secondary">{stats?.shortlisted || 0}</Badge>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats?.shortlisted || 0}</div>
              <div className="text-sm text-muted-foreground">Saved Properties</div>
            </div>
          </Card>

          <Card className="p-6 space-y-3 hover-elevate transition-all">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <Badge variant="secondary">{stats?.matches || 0}</Badge>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats?.matches || 0}</div>
              <div className="text-sm text-muted-foreground">Roommate Matches</div>
            </div>
          </Card>

          <Card className="p-6 space-y-3 hover-elevate transition-all">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Bike className="w-6 h-6 text-primary" />
              </div>
              <Badge variant="secondary">{stats?.rentals || 0}</Badge>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats?.rentals || 0}</div>
              <div className="text-sm text-muted-foreground">Active Rentals</div>
            </div>
          </Card>

          <Card className="p-6 space-y-3 hover-elevate transition-all">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <Badge variant="secondary">{stats?.reviews || 0}</Badge>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats?.reviews || 0}</div>
              <div className="text-sm text-muted-foreground">Reviews Written</div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Link href="/search">
            <Button className="w-full justify-start gap-3" size="lg" data-testid="button-find-property">
              <Home className="w-5 h-5" />
              Find Property
            </Button>
          </Link>
          <Link href="/roommates">
            <Button className="w-full justify-start gap-3" size="lg" variant="outline" data-testid="button-find-roommate">
              <Users className="w-5 h-5" />
              Find Roommate
            </Button>
          </Link>
          <Link href="/bikes/new">
            <Button className="w-full justify-start gap-3" size="lg" variant="outline" data-testid="button-list-bike">
              <Plus className="w-5 h-5" />
              List Bike
            </Button>
          </Link>
        </div>

        {/* Shortlisted Properties */}
        {!profile && (
          <Card className="p-6 mb-8 bg-accent/20 border-accent">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Complete Your Profile</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add your preferences to get better roommate matches and personalized recommendations
                </p>
                <Link href="/profile/setup">
                  <Button size="sm" data-testid="button-complete-profile">
                    Complete Profile
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-serif">Shortlisted Properties</h2>
              <Link href="/search">
                <Button variant="outline" size="sm" data-testid="button-view-all-properties">
                  View All
                </Button>
              </Link>
            </div>

            {shortlistedProperties && shortlistedProperties.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {shortlistedProperties.slice(0, 3).map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    isShortlisted={true}
                    onToggleShortlist={() => {}}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No saved properties yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start searching and save properties to shortlist
                </p>
                <Link href="/search">
                  <Button data-testid="button-start-searching">
                    Start Searching
                  </Button>
                </Link>
              </Card>
            )}
          </div>

          {/* My Bike Listings */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-serif">My Bike Listings</h2>
              <Link href="/bikes/new">
                <Button size="sm" data-testid="button-add-bike">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Bike
                </Button>
              </Link>
            </div>

            {myBikes && myBikes.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {myBikes.map((bike) => (
                  <BikeRentalCard key={bike.id} bike={bike} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Bike className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No bike listings yet</h3>
                <p className="text-muted-foreground mb-4">
                  List your bike to earn extra income
                </p>
                <Link href="/bikes/new">
                  <Button data-testid="button-list-first-bike">
                    List Your Bike
                  </Button>
                </Link>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
