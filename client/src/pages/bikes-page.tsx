import { useQuery } from "@tanstack/react-query";
import { BikeRental } from "@shared/schema";
import { BikeRentalCard } from "@/components/bike-rental-card";
import { Button } from "@/components/ui/button";
import { Home, Bike, Plus } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function BikesPage() {
  const { data: bikes, isLoading } = useQuery<BikeRental[]>({
    queryKey: ["/api/bikes"],
  });

  const availableBikes = bikes?.filter((bike) => bike.available);

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
                <span className="text-sm font-medium text-primary cursor-pointer">
                  Bikes
                </span>
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/bikes/new">
                <Button size="sm" data-testid="button-list-bike">
                  <Plus className="w-4 h-4 mr-2" />
                  List Your Bike
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" data-testid="button-dashboard">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif mb-2">Rent Bikes from Students</h1>
          <p className="text-muted-foreground">
            Affordable peer-to-peer bike rentals for your daily commute
          </p>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : availableBikes && availableBikes.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {availableBikes.length} bikes available
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {availableBikes.map((bike) => (
                <BikeRentalCard
                  key={bike.id}
                  bike={bike}
                  onContact={() => {}}
                />
              ))}
            </div>
          </>
        ) : (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Bike className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No bikes available yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to list your bike and start earning
            </p>
            <Link href="/bikes/new">
              <Button data-testid="button-list-first-bike">
                <Plus className="w-4 h-4 mr-2" />
                List Your Bike
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
