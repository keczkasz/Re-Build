import { Button } from "@/components/ui/button";
import { ArrowRight, Recycle } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Subtle texture background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/20 to-background" />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
            <Recycle className="h-4 w-4" />
            <span className="text-sm font-medium">Circular Economy Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Building Tomorrow with
            <span className="text-primary"> Yesterday's Materials</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with demolition contractors, designers, and recyclers. 
            Buy recovered materials. Build sustainably. Join the circular economy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="gap-2">
              Browse Materials
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              List Your Materials
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
