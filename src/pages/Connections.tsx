import { Navigation } from "@/components/Navigation";
import { ConnectionCard } from "@/components/ConnectionCard";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const connections = [
  {
    name: "EcoBuild Demolition",
    type: "Demolition Contractor",
    location: "Amsterdam, NL",
    specialty: "Selective Demolition",
    description: "Specialized in careful dismantling and material recovery from commercial buildings. 15+ years experience.",
    tags: ["Concrete", "Steel", "Wood"]
  },
  {
    name: "Studio Verde",
    type: "Architecture Firm",
    location: "Rotterdam, NL",
    specialty: "Circular Design",
    description: "Award-winning architects focusing on sustainable and circular building practices. Looking for reclaimed materials.",
    tags: ["Sustainable Design", "Renovations", "Upcycling"]
  },
  {
    name: "RecycleWorks NL",
    type: "Material Processor",
    location: "Utrecht, NL",
    specialty: "Material Processing",
    description: "Processing and preparing recovered materials for reuse. We connect suppliers with buyers.",
    tags: ["Processing", "Quality Control", "Logistics"]
  },
  {
    name: "Green Builder Co.",
    type: "Construction Company",
    location: "Den Haag, NL",
    specialty: "Sustainable Construction",
    description: "Building new homes and offices using 80%+ recovered materials. Seeking long-term material suppliers.",
    tags: ["Residential", "Commercial", "Sustainable"]
  }
];

const Connections = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Connections</h1>
          <p className="text-muted-foreground">Find partners, suppliers, and collaborators in the circular economy</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, location, or specialty..." 
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Connections</TabsTrigger>
            <TabsTrigger value="contractors">Contractors</TabsTrigger>
            <TabsTrigger value="designers">Designers</TabsTrigger>
            <TabsTrigger value="processors">Processors</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {connections.map((connection, index) => (
                <ConnectionCard key={index} {...connection} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contractors" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {connections.filter(c => c.type.includes("Contractor") || c.type.includes("Construction")).map((connection, index) => (
                <ConnectionCard key={index} {...connection} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="designers" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {connections.filter(c => c.type.includes("Architecture") || c.type.includes("Design")).map((connection, index) => (
                <ConnectionCard key={index} {...connection} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="processors" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {connections.filter(c => c.type.includes("Processor")).map((connection, index) => (
                <ConnectionCard key={index} {...connection} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Connections;
