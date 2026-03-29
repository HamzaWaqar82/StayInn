import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface SearchFiltersProps {
  onFilterChange: (filters: PropertyFilters) => void;
}

export interface PropertyFilters {
  minRent?: number;
  maxRent?: number;
  propertyType?: string[];
  amenities?: string[];
  city?: string;
}

const PROPERTY_TYPES = ["hostel", "flat", "house"];
const AMENITIES = ["wifi", "laundry", "gym", "parking", "ac", "kitchen", "security", "elevator"];

export function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [rentRange, setRentRange] = useState<[number, number]>([0, 50000]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [city, setCity] = useState("");

  const handleApply = () => {
    onFilterChange({
      minRent: rentRange[0],
      maxRent: rentRange[1],
      propertyType: selectedTypes.length > 0 ? selectedTypes : undefined,
      amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
      city: city || undefined,
    });
  };

  const handleClear = () => {
    setRentRange([0, 50000]);
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setCity("");
    onFilterChange({});
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  return (
    <Card className="p-6 space-y-6 sticky top-24">
      <div>
        <h3 className="font-semibold text-lg mb-4">Filters</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="city-filter">City</Label>
          <Input
            id="city-filter"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            data-testid="input-city-filter"
          />
        </div>

        <div>
          <Label className="mb-4 block">
            Rent Range: ₹{rentRange[0].toLocaleString()} - ₹{rentRange[1].toLocaleString()}
          </Label>
          <Slider
            value={rentRange}
            onValueChange={(value) => setRentRange(value as [number, number])}
            min={0}
            max={50000}
            step={1000}
            className="mt-2"
            data-testid="slider-rent-range"
          />
        </div>

        <div>
          <Label className="mb-3 block">Property Type</Label>
          <div className="space-y-2">
            {PROPERTY_TYPES.map((type) => (
              <div key={type} className="flex items-center gap-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={() => toggleType(type)}
                  data-testid={`checkbox-type-${type}`}
                />
                <Label htmlFor={`type-${type}`} className="capitalize cursor-pointer">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-3 block">Amenities</Label>
          <div className="space-y-2">
            {AMENITIES.map((amenity) => (
              <div key={amenity} className="flex items-center gap-2">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={selectedAmenities.includes(amenity)}
                  onCheckedChange={() => toggleAmenity(amenity)}
                  data-testid={`checkbox-amenity-${amenity}`}
                />
                <Label htmlFor={`amenity-${amenity}`} className="capitalize cursor-pointer">
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button variant="outline" onClick={handleClear} className="flex-1" data-testid="button-clear-filters">
          Clear All
        </Button>
        <Button onClick={handleApply} className="flex-1" data-testid="button-apply-filters">
          Apply
        </Button>
      </div>
    </Card>
  );
}
