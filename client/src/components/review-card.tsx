import { ReviewWithUser } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { format } from "date-fns";

interface ReviewCardProps {
  review: ReviewWithUser;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const initials = review.user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium" data-testid={`text-reviewer-${review.id}`}>
              {review.user.fullName}
            </div>
            <div className="text-sm text-muted-foreground">
              {format(new Date(review.createdAt), "MMM d, yyyy")}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < review.rating
                  ? "fill-yellow-500 text-yellow-500"
                  : "text-muted-foreground"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">{review.title}</h4>
        <p className="text-sm text-muted-foreground">{review.content}</p>
      </div>

      {review.images && review.images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {review.images.map((image, idx) => (
            <div key={idx} className="aspect-square overflow-hidden rounded-md">
              <img
                src={image}
                alt={`Review image ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
