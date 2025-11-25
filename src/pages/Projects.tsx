import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Calendar, DollarSign, MessageCircle, Loader2, Award, Leaf, Recycle, TrendingDown } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Import project images
import project1Floor from "/images/project-1-floorplan.jpg";
import project1Visual from "/images/project-1-visualization.jpg";
import project2Floor from "/images/project-2-floorplan.jpg";
import project2Visual from "/images/project-2-visualization.jpg";
import project3Floor from "/images/project-3-floorplan.jpg";
import project3Visual from "/images/project-3-visualization.jpg";

const projectImages: Record<string, { floorplan: string; visualization: string }> = {
  "Green Quarter Mixed-Use Development": {
    floorplan: project1Floor,
    visualization: project1Visual,
  },
  "Heritage Factory Adaptive Reuse": {
    floorplan: project2Floor,
    visualization: project2Visual,
  },
  "Eco-Luxury Designer Residence": {
    floorplan: project3Floor,
    visualization: project3Visual,
  },
};

// Fictional contact persons for each project
const projectContacts: Record<string, { name: string; role: string }> = {
  "Green Quarter Mixed-Use Development": {
    name: "Arch. Magdalena Wiśniewska",
    role: "Lead Architect & Sustainability Coordinator",
  },
  "Heritage Factory Adaptive Reuse": {
    name: "Eng. Piotr Zieliński",
    role: "Project Manager & Heritage Conservation Specialist",
  },
  "Eco-Luxury Designer Residence": {
    name: "Katarzyna Lewandowska",
    role: "Private Client & Design Enthusiast",
  },
};

// Sustainability metrics for each project
const projectMetrics: Record<string, { 
  materialReuse: string; 
  co2Savings: string;
  certifications: string[];
}> = {
  "Green Quarter Mixed-Use Development": {
    materialReuse: "85%",
    co2Savings: "420 tons",
    certifications: ["LEED Platinum", "BREEAM Outstanding", "Circular Economy Certified"],
  },
  "Heritage Factory Adaptive Reuse": {
    materialReuse: "90%",
    co2Savings: "280 tons",
    certifications: ["Heritage Conservation Award", "BREEAM Excellent", "EU Green Building"],
  },
  "Eco-Luxury Designer Residence": {
    materialReuse: "95%",
    co2Savings: "65 tons",
    certifications: ["Passive House", "Circular Economy Certified", "Zero Waste Design"],
  },
};

export default function Projects() {
  const { data: projects, isLoading } = useProjects();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleContact = (projectId: string, contactName: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to contact project owners.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    toast({
      title: "Contact request",
      description: `Messaging feature coming soon! You want to contact ${contactName}.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Circular Economy Projects</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Explore large-scale construction projects committed to circular economy principles. 
              These projects actively seek recovered materials and sustainable partnerships.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="space-y-8">
              {projects.map((project) => {
                const images = projectImages[project.title];
                const contact = projectContacts[project.title] || { 
                  name: "Project Manager", 
                  role: "Project Coordinator" 
                };
                const metrics = projectMetrics[project.title] || {
                  materialReuse: "N/A",
                  co2Savings: "N/A",
                  certifications: [],
                };
                
                return (
                  <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-0">
                      <div className="grid md:grid-cols-2 gap-6 p-6">
                        {/* Project Details */}
                        <div className="space-y-6">
                          <div>
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <Building2 className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                  <h2 className="text-2xl font-bold text-foreground">{project.title}</h2>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{project.location}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                          </div>

                          {/* Sustainability Metrics */}
                          <div className="bg-primary/5 rounded-lg p-4 space-y-3">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                              <Leaf className="h-4 w-4 text-primary" />
                              Sustainability Impact
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-start gap-2">
                                <Recycle className="h-4 w-4 text-primary mt-0.5" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Material Reuse</p>
                                  <p className="text-lg font-bold text-primary">{metrics.materialReuse}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <TrendingDown className="h-4 w-4 text-primary mt-0.5" />
                                <div>
                                  <p className="text-xs text-muted-foreground">CO₂ Savings</p>
                                  <p className="text-lg font-bold text-primary">{metrics.co2Savings}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Certifications */}
                          {metrics.certifications.length > 0 && (
                            <div className="space-y-2">
                              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Award className="h-4 w-4 text-primary" />
                                Certifications
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {metrics.certifications.map((cert) => (
                                  <Badge key={cert} variant="outline" className="gap-1.5 border-primary/20 bg-primary/5">
                                    <Award className="h-3 w-3" />
                                    {cert}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <DollarSign className="h-4 w-4" />
                                <span className="font-medium">Budget</span>
                              </div>
                              <p className="text-sm font-semibold text-foreground">{project.budget_range}</p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span className="font-medium">Timeline</span>
                              </div>
                              <p className="text-sm font-semibold text-foreground">{project.timeline}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-foreground">Materials Needed:</h3>
                            <div className="flex flex-wrap gap-2">
                              {project.materials_needed?.map((material) => (
                                <Badge key={material} variant="secondary" className="text-xs">
                                  {material}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="pt-4 border-t">
                            <div className="mb-3">
                              <p className="text-sm font-medium text-foreground">{contact.name}</p>
                              <p className="text-sm text-muted-foreground">{contact.role}</p>
                            </div>
                            <Button 
                              className="w-full gap-2" 
                              onClick={() => handleContact(project.id, contact.name)}
                            >
                              <MessageCircle className="h-4 w-4" />
                              Contact Project Team
                            </Button>
                          </div>
                        </div>

                        {/* Project Visualizations */}
                        {images && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <h3 className="text-sm font-semibold text-foreground">Architectural Visualization</h3>
                              <div className="rounded-lg overflow-hidden border">
                                <img 
                                  src={images.visualization} 
                                  alt={`${project.title} - Visualization`}
                                  className="w-full h-64 object-cover"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-sm font-semibold text-foreground">Floor Plan</h3>
                              <div className="rounded-lg overflow-hidden border">
                                <img 
                                  src={images.floorplan} 
                                  alt={`${project.title} - Floor Plan`}
                                  className="w-full h-64 object-cover"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No active projects found.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
