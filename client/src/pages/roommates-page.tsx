import { useQuery } from "@tanstack/react-query";
import { StudentProfileWithUser } from "@shared/schema";
import { RoommateCard } from "@/components/roommate-card";
import { Button } from "@/components/ui/button";
import { Home, Users } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function RoommatesPage() {
  const { data: matches, isLoading } = useQuery<Array<{ profile: StudentProfileWithUser; matchPercentage: number }>>({
    queryKey: ["/api/roommates/matches"],
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
                <span className="text-sm font-medium text-primary cursor-pointer">
                  Roommates
                </span>
              </Link>
              <Link href="/bikes">
                <span className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                  Bikes
                </span>
              </Link>
            </nav>

            <Link href="/dashboard">
              <Button variant="outline" data-testid="button-dashboard">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif mb-2">Find Your Perfect Roommate</h1>
          <p className="text-muted-foreground">
            Connect with students who share similar preferences and lifestyle
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-6">
                <div className="flex gap-4">
                  <Skeleton className="w-20 h-20 rounded-full" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : matches && matches.length > 0 ? (
          <div className="space-y-4">
            {matches.map(({ profile, matchPercentage }) => (
              <RoommateCard
                key={profile.id}
                profile={profile}
                matchPercentage={matchPercentage}
                onConnect={() => {}}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No roommate matches yet</h3>
            <p className="text-muted-foreground mb-4">
              Complete your profile to get personalized roommate suggestions
            </p>
            <Link href="/profile/setup">
              <Button data-testid="button-setup-profile">
                Complete Profile
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
