import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MaterialCard } from "@/components/MaterialCard";
import { Building2, MapPin, Calendar, DollarSign, MessageCircle, Loader2, Award, Leaf, Recycle, TrendingDown } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { useMaterials } from "@/hooks/useMaterials";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

// Import project images
import project1Floor from "/images/project-1-floorplan.jpg";
import project1Visual from "/images/project-1-visualization.jpg";
import project2Floor from "/images/project-2-floorplan.jpg";
import project2Visual from "/images/project-2-visualization.jpg";
import project3Floor from "/images/project-3-floorplan-v3.jpg";
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
  "Forest Residence": {
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
  "Forest Residence": {
    name: "Anna Kowalska",
    role: "Private Homeowner & Sustainability Advocate",
  },
};

// EU Programs for each project
const projectEUPrograms: Record<string, string[]> = {
  "Green Quarter Mixed-Use Development": ["LIFE Programme", "Horizon Europe", "European Regional Development Fund"],
  "Heritage Factory Adaptive Reuse": ["LIFE Programme", "Creative Europe", "European Regional Development Fund"],
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
  "Forest Residence": {
    materialReuse: "95%",
    co2Savings: "65 tons",
    certifications: ["Passive House", "Circular Economy Certified", "Zero Waste Design"],
  },
};

export default function Projects() {
  const { data: projects, isLoading } = useProjects();
  const { data: materials = [] } = useMaterials();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  // Match materials to projects based on materials_needed
  const getMatchedMaterials = (materialsNeeded: string[]) => {
    return materials.filter(material => {
      const categoryMatch = materialsNeeded.some(need => 
        need.toLowerCase().includes(material.category.toLowerCase()) ||
        material.category.toLowerCase().includes(need.toLowerCase()) ||
        material.title.toLowerCase().includes(need.toLowerCase())
      );
      return categoryMatch;
    }).slice(0, 6); // Limit to 6 matched materials per project
  };

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
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-foreground">Circular Economy Projects</h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                Explore large-scale construction projects committed to circular economy principles. 
                These projects actively seek recovered materials and sustainable partnerships.
              </p>
            </div>
            {user && (
              <Button onClick={() => navigate("/projects/new")} className="gap-2 shrink-0">
                <Building2 className="h-4 w-4" />
                Submit Project
              </Button>
            )}
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
                const euPrograms = projectEUPrograms[project.title] || [];
                
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

                          {/* EU Programs */}
                          {euPrograms.length > 0 && (
                            <div className="bg-[#003399]/5 border border-[#003399]/20 rounded-lg p-4 space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded bg-[#003399] flex items-center justify-center flex-shrink-0">
                                  <span className="text-[#FFCC00] font-bold text-sm">EU</span>
                                </div>
                                <div>
                                  <h3 className="text-xs font-semibold text-foreground">Co-funded by the European Union</h3>
                                  <div className="flex flex-wrap gap-1.5 mt-1">
                                    {euPrograms.map((program) => (
                                      <Badge key={program} variant="outline" className="text-xs border-[#003399]/30 bg-[#003399]/5 text-[#003399]">
                                        {program}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

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

                          {/* Materials Matching Section */}
                          {project.materials_needed && project.materials_needed.length > 0 && (
                            <div className="mt-6 pt-6 border-t">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                  <Recycle className="h-4 w-4 text-primary" />
                                  Matching Materials Available ({getMatchedMaterials(project.materials_needed).length})
                                </h4>
                                {getMatchedMaterials(project.materials_needed).length > 3 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                                  >
                                    {expandedProject === project.id ? 'Show Less' : 'View All'}
                                  </Button>
                                )}
                              </div>
                              
                              {getMatchedMaterials(project.materials_needed).length > 0 ? (
                                <div className={`grid grid-cols-1 gap-3 ${expandedProject === project.id ? '' : 'max-h-[400px] overflow-hidden'}`}>
                                  {getMatchedMaterials(project.materials_needed)
                                    .slice(0, expandedProject === project.id ? undefined : 3)
                                    .map((material) => (
                                      <div key={material.id} className="border rounded-lg p-3 bg-primary/5 hover:bg-primary/10 transition-colors">
                                        <div className="flex gap-3">
                                          {material.images && material.images[0] && (
                                            <img 
                                              src={material.images[0]} 
                                              alt={material.title}
                                              className="w-20 h-20 object-cover rounded"
                                            />
                                          )}
                                          <div className="flex-1 min-w-0">
                                            <h5 className="font-semibold text-sm text-foreground truncate">{material.title}</h5>
                                            <div className="flex items-center gap-2 mt-1">
                                              <Badge variant="secondary" className="text-xs">{material.category}</Badge>
                                              <Badge variant="outline" className="text-xs">{material.condition}</Badge>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                              <span className="text-xs text-muted-foreground">{material.location}</span>
                                              <span className="text-sm font-bold text-primary">€{material.price}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              ) : (
                                <p className="text-muted-foreground text-xs">
                                  No matching materials currently available in marketplace.
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Project Visualizations */}
                        {images && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <h3 className="text-sm font-semibold text-foreground">Architectural Visualization</h3>
                              <div className="rounded-lg overflow-hidden border relative">
                                <img 
                                  src={images.visualization} 
                                  alt={`${project.title} - Visualization`}
                                  className="w-full h-64 object-cover"
                                />
                                {euPrograms.length > 0 && (
                                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded px-2 py-1.5 shadow-md">
                                    <img 
                                      src="/images/eu-logo.png" 
                                      alt="Co-funded by the European Union" 
                                      className="h-8 w-auto"
                                    />
                                  </div>
                                )}
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
      
      <Footer />
    </div>
  );
}
