import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Building2, Loader2, X } from "lucide-react";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(200, "Title must be less than 200 characters"),
  description: z.string().trim().min(20, "Description must be at least 20 characters").max(2000, "Description must be less than 2000 characters"),
  location: z.string().trim().min(2, "Location is required").max(200, "Location must be less than 200 characters"),
  budget_range: z.string().trim().optional(),
  timeline: z.string().trim().optional(),
});

export default function AddProject() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    budget_range: "",
    timeline: "",
  });
  const [materialsNeeded, setMaterialsNeeded] = useState<string[]>([]);
  const [currentMaterial, setCurrentMaterial] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleAddMaterial = () => {
    const trimmed = currentMaterial.trim();
    if (trimmed && !materialsNeeded.includes(trimmed)) {
      setMaterialsNeeded([...materialsNeeded, trimmed]);
      setCurrentMaterial("");
    }
  };

  const handleRemoveMaterial = (material: string) => {
    setMaterialsNeeded(materialsNeeded.filter(m => m !== material));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      // Validate form data
      const validatedData = projectSchema.parse(formData);
      
      setIsSubmitting(true);

      const { error } = await supabase
        .from("projects")
        .insert({
          title: validatedData.title,
          description: validatedData.description,
          location: validatedData.location,
          budget_range: validatedData.budget_range || null,
          timeline: validatedData.timeline || null,
          materials_needed: materialsNeeded.length > 0 ? materialsNeeded : null,
          created_by: user.id,
          status: "active",
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your project has been submitted successfully.",
      });
      
      navigate("/projects");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast({
          title: "Validation Error",
          description: "Please check the form for errors.",
          variant: "destructive",
        });
      } else {
        console.error("Error submitting project:", error);
        toast({
          title: "Error",
          description: "Failed to submit project. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Submit Your Project</CardTitle>
                  <CardDescription>
                    List your construction project to find materials and partners in the circular economy network
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Sustainable Office Building Renovation"
                    maxLength={200}
                  />
                  {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Project Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your project, its goals, and what you're looking for..."
                    rows={5}
                    maxLength={2000}
                  />
                  {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                  <p className="text-xs text-muted-foreground">
                    {formData.description.length}/2000 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Amsterdam, Netherlands"
                    maxLength={200}
                  />
                  {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget_range">Budget Range</Label>
                    <Input
                      id="budget_range"
                      value={formData.budget_range}
                      onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                      placeholder="e.g., €50,000 - €100,000"
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeline">Timeline</Label>
                    <Input
                      id="timeline"
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      placeholder="e.g., 6-12 months"
                      maxLength={100}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="materials">Materials Needed</Label>
                  <div className="flex gap-2">
                    <Input
                      id="materials"
                      value={currentMaterial}
                      onChange={(e) => setCurrentMaterial(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddMaterial();
                        }
                      }}
                      placeholder="e.g., Reclaimed Wood, Bricks, Steel"
                      maxLength={100}
                    />
                    <Button type="button" onClick={handleAddMaterial} variant="outline">
                      Add
                    </Button>
                  </div>
                  {materialsNeeded.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {materialsNeeded.map((material) => (
                        <Badge key={material} variant="secondary" className="gap-1">
                          {material}
                          <button
                            type="button"
                            onClick={() => handleRemoveMaterial(material)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t space-y-3">
                  <p className="text-sm text-muted-foreground">
                    By submitting this project, you agree to be contacted by platform members interested in collaboration or providing materials.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Project"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/projects")}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
