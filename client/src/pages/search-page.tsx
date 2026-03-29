import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PropertyCard } from "@/components/property-card";
import { SearchFilters, PropertyFilters } from "@/components/search-filters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, Search, SlidersHorizontal } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function SearchPage() {
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [searchQuery, setSearchQuery] = useState("");

  // Build query string from filters
  const buildQueryString = (filters: PropertyFilters) => {
    const params = new URLSearchParams();
    if (filters.city) params.append("city", filters.city);
    if (filters.minRent !== undefined) params.append("minRent", filters.minRent.toString());
    if (filters.maxRent !== undefined) params.append("maxRent", filters.maxRent.toString());
    // Use repeated query params for arrays to match backend expectations
    if (filters.propertyType && filters.propertyType.length > 0) {
      filters.propertyType.forEach(type => params.append("type", type));
    }
    if (filters.amenities && filters.amenities.length > 0) {
      filters.amenities.forEach(amenity => params.append("amenities", amenity));
    }
    return params.toString();
  };

  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties", filters],
    queryFn: async () => {
      const queryString = buildQueryString(filters);
      const url = queryString ? `/api/properties?${queryString}` : "/api/properties";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch properties");
      return res.json();
    },
  });

  const { data: shortlists } = useQuery<string[]>({
    queryKey: ["/api/shortlists"],
  });

  const toggleShortlistMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      const isCurrentlyShortlisted = shortlists?.includes(propertyId);
      if (isCurrentlyShortlisted) {
        await apiRequest("DELETE", `/api/shortlists/${propertyId}`);
      } else {
        await apiRequest("POST", "/api/shortlists", { propertyId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shortlists"] });
    },
  });

  const handleToggleShortlist = (propertyId: string) => {
    toggleShortlistMutation.mutate(propertyId);
  };

  const filteredProperties = properties?.filter((property) => {
    if (searchQuery && !property.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !property.location.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
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

            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search properties..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-properties"
                />
              </div>
            </div>

            <Link href="/dashboard">
              <Button variant="outline" data-testid="button-dashboard">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block">
            <SearchFilters onFilterChange={setFilters} />
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden fixed bottom-6 right-6 z-40">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="lg" className="rounded-full shadow-lg" data-testid="button-mobile-filters">
                  <SlidersHorizontal className="w-5 h-5 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <SearchFilters onFilterChange={setFilters} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Results */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold font-serif">
                {filteredProperties
                  ? `${filteredProperties.length} Properties Found`
                  : "Search Results"}
              </h1>
            </div>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-[4/3] w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
              </div>
            ) : filteredProperties && filteredProperties.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    isShortlisted={shortlists?.includes(property.id)}
                    onToggleShortlist={handleToggleShortlist}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No properties found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
