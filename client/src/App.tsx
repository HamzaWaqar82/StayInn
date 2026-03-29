import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing-page";
import AuthPage from "@/pages/auth-page";
import SearchPage from "@/pages/search-page";
import PropertyDetailsPage from "@/pages/property-details-page";
import StudentDashboard from "@/pages/student-dashboard";
import OwnerDashboard from "@/pages/owner-dashboard";
import RoommatesPage from "@/pages/roommates-page";
import BikesPage from "@/pages/bikes-page";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/property/:id" component={PropertyDetailsPage} />
      <ProtectedRoute path="/search" component={SearchPage} />
      <ProtectedRoute path="/dashboard" component={StudentDashboard} />
      <ProtectedRoute path="/owner/dashboard" component={OwnerDashboard} />
      <ProtectedRoute path="/roommates" component={RoommatesPage} />
      <ProtectedRoute path="/bikes" component={BikesPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
