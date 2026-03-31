import { Property } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Heart, Star } from "lucide-react";
import { Link } from "wouter";

interface PropertyCardProps {
  property: Property;
  onToggleShortlist?: (propertyId: string) => void;
  isShortlisted?: boolean;
}

export function PropertyCard({ property, onToggleShortlist, isShortlisted }: PropertyCardProps) {
  const mainImage = property.images[0] || "https://via.placeholder.com/400x300";
  const rating = property.rating / 10;

  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-300 group">
      <Link href={`/property/${property.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {property.verified && (
            <Badge className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm">
              Verified
            </Badge>
          )}
          {onToggleShortlist && (
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background/90"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleShortlist(property.id);
              }}
              data-testid={`button-shortlist-${property.id}`}
            >
              <Heart className={`w-5 h-5 ${isShortlisted ? "fill-destructive text-destructive" : ""}`} />
            </Button>
          )}
        </div>
      </Link>

      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <Link href={`/property/${property.id}`}>
            <h3 className="font-serif text-xl font-medium hover:text-primary transition-colors line-clamp-1" data-testid={`text-property-title-${property.id}`}>
              {property.title}
            </h3>
          </Link>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{property.location}, {property.city}</span>
          </div>

          {rating > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                <span className="font-medium">{rating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-muted-foreground">({property.reviewCount} reviews)</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">{property.type}</Badge>
          {property.amenities.slice(0, 3).map((amenity) => (
            <Badge key={amenity} variant="outline" className="text-xs capitalize">
              {amenity}
            </Badge>
          ))}
          {property.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{property.amenities.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-end justify-between pt-2 border-t">
          <div>
            <div className="text-2xl font-bold text-primary">
              Rs{property.rent.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">per month</div>
          </div>
          <div className="text-sm text-muted-foreground">
            {property.availableRooms}/{property.totalRooms} available
          </div>
        </div>
      </div>
    </Card>
  );
}
