import { StudentProfileWithUser } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail } from "lucide-react";

interface RoommateCardProps {
  profile: StudentProfileWithUser;
  matchPercentage?: number;
  onConnect?: (userId: string) => void;
}

export function RoommateCard({ profile, matchPercentage, onConnect }: RoommateCardProps) {
  const initials = profile.user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const preferences = [
    profile.sleepSchedule,
    profile.cleanliness,
    profile.noiseLevel,
    profile.lifestyle,
  ].filter(Boolean);

  return (
    <Card className="p-6 hover-elevate transition-all">
      <div className="flex gap-4">
        <Avatar className="w-20 h-20">
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-lg" data-testid={`text-roommate-${profile.userId}`}>
                {profile.user.fullName}
              </h3>
              {profile.budget && (
                <p className="text-sm text-muted-foreground">
                  Budget: ₹{profile.budget.toLocaleString()}/month
                </p>
              )}
            </div>
            {matchPercentage !== undefined && (
              <Badge className="bg-primary/10 text-primary border-primary/20">
                {matchPercentage}% Match
              </Badge>
            )}
          </div>

          {profile.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2">{profile.bio}</p>
          )}

          {preferences.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {preferences.map((pref) => (
                <Badge key={pref} variant="outline" className="text-xs capitalize">
                  {pref?.replace("-", " ")}
                </Badge>
              ))}
            </div>
          )}

          {onConnect && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onConnect(profile.userId)}
              data-testid={`button-connect-${profile.userId}`}
            >
              <Mail className="w-4 h-4 mr-2" />
              Connect
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
