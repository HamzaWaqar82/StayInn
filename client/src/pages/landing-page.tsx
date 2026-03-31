import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Search, Home, Users, Bike, Star, Shield, Clock, MessageSquare, CheckCircle2, MapPin, ChevronRight } from "lucide-react";
import { useState } from "react";
import heroImage from "@assets/generated_images/Modern_student_accommodation_hero_b86bf213.png";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCity, setSearchCity] = useState("");

  const handleSearch = () => {
    if (searchCity || searchQuery) {
      window.location.href = `/search?city=${searchCity}&q=${searchQuery}`;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer group">
                <Home className="w-6 h-6 text-primary" />
                <span className="text-xl font-serif font-bold">StayInn</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/search">
                <span className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                  Find Properties
                </span>
              </Link>
              <Link href="/roommates">
                <span className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                  Find Roommates
                </span>
              </Link>
              <Link href="/bikes">
                <span className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                  Rent Bikes
                </span>
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/auth">
                <Button variant="outline" data-testid="button-login">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth">
                <Button data-testid="button-signup">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Modern student accommodation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 font-serif">
              Find Your Perfect StayInn
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Connect with verified hostels, find compatible roommates, and discover your ideal student accommodation with transparency and ease.
            </p>

            {/* Hero Search Bar */}
            <Card className="p-2 bg-background/95 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center gap-2 px-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Enter city"
                    className="border-0 focus-visible:ring-0 px-0"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    data-testid="input-hero-city"
                  />
                </div>
                <div className="hidden sm:block w-px bg-border" />
                <div className="flex-1 flex items-center gap-2 px-3">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search hostels, flats..."
                    className="border-0 focus-visible:ring-0 px-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    data-testid="input-hero-search"
                  />
                </div>
                <Button 
                  size="lg" 
                  onClick={handleSearch}
                  data-testid="button-hero-search"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold font-serif mb-4">
              How StayInn Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Finding your perfect accommodation is just three steps away
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center space-y-4 hover-elevate transition-all">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold font-serif">Search & Filter</h3>
              <p className="text-muted-foreground">
                Browse verified hostels, flats, and houses. Filter by location, rent, and amenities to find your perfect match.
              </p>
            </Card>

            <Card className="p-8 text-center space-y-4 hover-elevate transition-all">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold font-serif">Compare & Review</h3>
              <p className="text-muted-foreground">
                Read authentic reviews, compare properties, and shortlist your favorites. Make informed decisions with transparent information.
              </p>
            </Card>

            <Card className="p-8 text-center space-y-4 hover-elevate transition-all">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Home className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold font-serif">Connect & Move In</h3>
              <p className="text-muted-foreground">
                Contact property owners, find compatible roommates, and secure your accommodation with confidence.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold font-serif">
                Find Your Perfect Roommate
              </h2>
              <p className="text-muted-foreground text-lg">
                Our intelligent matching algorithm connects you with compatible roommates based on lifestyle preferences, budget, and habits.
              </p>
              <div className="space-y-4">
                {[
                  "Match based on sleep schedules and cleanliness preferences",
                  "Connect with students who share similar budgets",
                  "Build a supportive living community",
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              <Link href="/roommates">
                <Button size="lg" data-testid="button-find-roommates">
                  Find Roommates
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            <Card className="p-8 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-card rounded-lg border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">85% Match</div>
                  <div className="text-sm text-muted-foreground">Based on your preferences</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Early riser", "Very clean", "Quiet study", "Active lifestyle"].map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Bike Rental Section */}
      <section className="py-16 lg:py-24 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <Card className="p-8 space-y-4">
                <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                  <Bike className="w-24 h-24 text-muted-foreground" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary">Rs150</span>
                  <span className="text-muted-foreground">/day</span>
                </div>
                <Badge>Available Now</Badge>
              </Card>
            </div>

            <div className="space-y-6 order-1 lg:order-2">
              <h2 className="text-3xl lg:text-4xl font-bold font-serif">
                Peer-to-Peer Bike Rentals
              </h2>
              <p className="text-muted-foreground text-lg">
                Rent bikes from fellow students or list your own. Save money while building community connections.
              </p>
              <div className="space-y-4">
                {[
                  "Affordable daily and weekly rates",
                  "Rent from verified student owners",
                  "List your bike and earn extra income",
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              <Link href="/bikes">
                <Button size="lg" data-testid="button-browse-bikes">
                  Browse Bikes
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold font-serif mb-4">
              Why Trust StayInn?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Your safety and satisfaction are our top priorities
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "Verified Listings", desc: "All properties are verified before listing" },
              { icon: Star, title: "Authentic Reviews", desc: "Real reviews from real students" },
              { icon: Clock, title: "24/7 Support", desc: "We're here to help anytime" },
              { icon: MessageSquare, title: "Direct Communication", desc: "Connect directly with owners and roommates" },
            ].map((item, idx) => (
              <Card key={idx} className="p-6 text-center space-y-3 hover-elevate transition-all">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 space-y-4 bg-primary-foreground text-foreground">
              <Users className="w-12 h-12 text-primary" />
              <h3 className="text-2xl font-bold font-serif">For Students</h3>
              <p className="text-muted-foreground">
                Find your perfect accommodation, connect with roommates, and settle into student life with ease.
              </p>
              <Link href="/auth">
                <Button size="lg" variant="default" className="w-full" data-testid="button-student-signup">
                  Find Your Home
                </Button>
              </Link>
            </Card>

            <Card className="p-8 space-y-4 bg-primary-foreground text-foreground">
              <Home className="w-12 h-12 text-primary" />
              <h3 className="text-2xl font-bold font-serif">For Property Owners</h3>
              <p className="text-muted-foreground">
                List your properties, reach thousands of students, and manage everything from one dashboard.
              </p>
              <Link href="/auth">
                <Button size="lg" variant="default" className="w-full" data-testid="button-owner-signup">
                  List Your Property
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">About StayInn</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Students</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/search"><span className="hover:text-foreground transition-colors cursor-pointer">Find Properties</span></Link></li>
                <li><Link href="/roommates"><span className="hover:text-foreground transition-colors cursor-pointer">Find Roommates</span></Link></li>
                <li><Link href="/bikes"><span className="hover:text-foreground transition-colors cursor-pointer">Rent Bikes</span></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Owners</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">List Property</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Owner Guidelines</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-primary" />
              <span className="font-serif font-bold">StayInn</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 StayInn. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
