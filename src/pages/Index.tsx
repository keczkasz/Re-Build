import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { MaterialCard } from "@/components/MaterialCard";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { ArrowRight, Leaf, Users, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const featuredMaterials = [
  {
    title: "Reclaimed Oak Floorboards",
    category: "Wood",
    location: "Amsterdam, NL",
    quantity: "~150 m²",
    price: "€45/m²",
    postedDate: "2 days ago",
    image: "/images/oak-floorboards.jpg",
    condition: "Excellent"
  },
  {
    title: "Industrial Steel Beams",
    category: "Metal",
    location: "Rotterdam, NL",
    quantity: "25 units",
    price: "€120/unit",
    postedDate: "5 days ago",
    image: "/images/steel-beams.jpg",
    condition: "Good"
  },
  {
    title: "Clay Bricks - Vintage",
    category: "Masonry",
    location: "Utrecht, NL",
    quantity: "~5000 pieces",
    price: "€0.85/piece",
    postedDate: "1 week ago",
    image: "/images/clay-bricks.jpg",
    condition: "Very Good"
  }
];

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      
      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            How Re:Build Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Browse Materials</h3>
              <p className="text-muted-foreground">
                Discover recovered building materials from demolition projects across the region
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Connect</h3>
              <p className="text-muted-foreground">
                Network with contractors, designers, and recyclers in the circular economy
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Build Sustainable</h3>
              <p className="text-muted-foreground">
                Create beautiful projects while reducing waste and environmental impact
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Materials */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Featured Materials</h2>
              <p className="text-muted-foreground">Recently added recovered materials</p>
            </div>
            <Button variant="outline" className="gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {featuredMaterials.map((material, index) => (
              <MaterialCard key={index} {...material} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Join the Circular Economy Movement
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Whether you're demolishing, building, or designing — Re:Build connects you with the right materials and people.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate(user ? '/dashboard' : '/auth')}
            >
              {user ? 'Go to Dashboard' : 'Get Started'}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              onClick={() => navigate('/marketplace')}
            >
              Browse Marketplace
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
