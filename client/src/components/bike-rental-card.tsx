import { BikeRental } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bike } from "lucide-react";

interface BikeRentalCardProps {
  bike: BikeRental;
  onContact?: (bikeId: string) => void;
}

export function BikeRentalCard({ bike, onContact }: BikeRentalCardProps) {
  const mainImage = bike.images[0] || "https://via.placeholder.com/300x300";

  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-300">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={mainImage}
          alt={bike.title}
          className="w-full h-full object-cover"
        />
        {!bike.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm">Unavailable</Badge>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="font-medium line-clamp-1" data-testid={`text-bike-title-${bike.id}`}>
            {bike.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bike className="w-3 h-3" />
            <span className="capitalize text-xs">{bike.bikeType}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span className="text-xs line-clamp-1">{bike.location}</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">Rs{bike.dailyRate}</span>
            <span className="text-xs text-muted-foreground">/day</span>
          </div>
          {bike.weeklyRate && (
            <div className="text-xs text-muted-foreground">
              Rs{bike.weeklyRate}/week
            </div>
          )}
        </div>

        {onContact && (
          <Button
            className="w-full"
            size="sm"
            disabled={!bike.available}
            onClick={() => onContact(bike.id)}
            data-testid={`button-contact-${bike.id}`}
          >
            Contact Owner
          </Button>
        )}
      </div>
    </Card>
  );
}
