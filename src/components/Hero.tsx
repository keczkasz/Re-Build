import { Button } from "@/components/ui/button";
import { ArrowRight, Recycle, Users, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-sustainable-construction.jpg";

export const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative py-12 px-4 overflow-hidden bg-background">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-4">
                Re:Build<br />
                <span className="text-primary">Tomorrow</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl">
                Connect with demolition contractors, designers, and recyclers. Transform waste into resources in the circular construction economy.
              </p>
            </div>
            
            {/* Feature Icons */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Recycle className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">Materials Recovered</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">Trusted Network</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">Sustainable Projects</span>
              </div>
            </div>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="gap-2"
                onClick={() => navigate('/marketplace')}
              >
                Explore Materials
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/connections')}
              >
                Join Network
              </Button>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative lg:h-[600px] h-[400px]">
            <img 
              src={heroImage} 
              alt="Sustainable construction with eco-friendly building materials" 
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
