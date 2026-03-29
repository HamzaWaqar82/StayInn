import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Plus, Eye, Edit, TrendingUp, Star, Users } from "lucide-react";
import { Link } from "wouter";

export default function OwnerDashboard() {
  const { data: properties } = useQuery<Property[]>({
    queryKey: ["/api/properties/my-listings"],
  });

  const { data: stats } = useQuery<{
    totalProperties: number;
    totalRooms: number;
    availableRooms: number;
    averageRating: number;
    totalReviews: number;
  }>({
    queryKey: ["/api/stats/owner"],
  });

  const occupancyRate = stats
    ? ((stats.totalRooms - stats.availableRooms) / stats.totalRooms) * 100
    : 0;

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
              <Link href="/dashboard">
                <span className="text-sm font-medium text-primary cursor-pointer">
                  Dashboard
                </span>
              </Link>
              <Link href="/properties/new">
                <Button size="sm" data-testid="button-add-property">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Property
                </Button>
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
          <h1 className="text-3xl font-bold font-serif mb-2">Property Management</h1>
          <p className="text-muted-foreground">
            Manage your properties and track performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 space-y-3 hover-elevate transition-all">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Home className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats?.totalProperties || 0}</div>
              <div className="text-sm text-muted-foreground">Total Properties</div>
            </div>
          </Card>

          <Card className="p-6 space-y-3 hover-elevate transition-all">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">{occupancyRate.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Occupancy Rate</div>
            </div>
          </Card>

          <Card className="p-6 space-y-3 hover-elevate transition-all">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {stats?.averageRating ? (stats.averageRating / 10).toFixed(1) : "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
          </Card>

          <Card className="p-6 space-y-3 hover-elevate transition-all">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats?.totalReviews || 0}</div>
              <div className="text-sm text-muted-foreground">Total Reviews</div>
            </div>
          </Card>
        </div>

        {/* Properties Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-serif">My Properties</h2>
            <Link href="/properties/new">
              <Button data-testid="button-new-property">
                <Plus className="w-4 h-4 mr-2" />
                Add New Property
              </Button>
            </Link>
          </div>

          {properties && properties.length > 0 ? (
            <div className="space-y-4">
              {properties.map((property) => (
                <Card key={property.id} className="p-6 hover-elevate transition-all">
                  <div className="flex items-start gap-6">
                    <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={property.images[0] || "https://via.placeholder.com/300x200"}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-lg font-serif" data-testid={`text-property-${property.id}`}>
                            {property.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {property.location}, {property.city}
                          </p>
                        </div>
                        <Badge variant={property.verified ? "default" : "secondary"}>
                          {property.verified ? "Verified" : "Pending"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <div>
                          <span className="text-muted-foreground">Type:</span>{" "}
                          <span className="font-medium capitalize">{property.type}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Rent:</span>{" "}
                          <span className="font-medium">₹{property.rent.toLocaleString()}/mo</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Rooms:</span>{" "}
                          <span className="font-medium">
                            {property.availableRooms}/{property.totalRooms} available
                          </span>
                        </div>
                        {property.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            <span className="font-medium">{(property.rating / 10).toFixed(1)}</span>
                            <span className="text-muted-foreground">({property.reviewCount})</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/property/${property.id}`}>
                          <Button size="sm" variant="outline" data-testid={`button-view-${property.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </Link>
                        <Link href={`/properties/${property.id}/edit`}>
                          <Button size="sm" variant="outline" data-testid={`button-edit-${property.id}`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No properties listed yet</h3>
              <p className="text-muted-foreground mb-4">
                Start listing your properties to reach students
              </p>
              <Link href="/properties/new">
                <Button data-testid="button-list-first-property">
                  <Plus className="w-4 h-4 mr-2" />
                  List Your First Property
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
