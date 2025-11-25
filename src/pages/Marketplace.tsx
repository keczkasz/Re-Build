import { Navigation } from "@/components/Navigation";
import { MaterialCard } from "@/components/MaterialCard";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMaterials } from "@/hooks/useMaterials";
import { useState, useMemo, useCallback } from "react";

const Marketplace = () => {
  const { data: materials = [], isLoading } = useMaterials();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Memoize filtered materials to avoid recalculation on every render
  const filteredMaterials = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return materials.filter(material => {
      const matchesSearch = material.title.toLowerCase().includes(searchLower) ||
                           material.description?.toLowerCase().includes(searchLower);
      const matchesCategory = categoryFilter === "all" || material.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [materials, searchQuery, categoryFilter]);

  // Memoize event handlers
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setCategoryFilter(value);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading materials...</div>
        </div>
      </div>
    );
  }

  const mockMaterials = [
  {
    title: "Reclaimed Oak Floorboards",
    category: "Wood",
    location: "Amsterdam, NL",
    quantity: "~150 m²",
    price: "€45/m²",
    postedDate: "2 days ago",
    image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&q=80",
    condition: "Excellent"
  },
  {
    title: "Industrial Steel Beams",
    category: "Metal",
    location: "Rotterdam, NL",
    quantity: "25 units",
    price: "€120/unit",
    postedDate: "5 days ago",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    condition: "Good"
  },
  {
    title: "Clay Bricks - Vintage",
    category: "Masonry",
    location: "Utrecht, NL",
    quantity: "~5000 pieces",
    price: "€0.85/piece",
    postedDate: "1 week ago",
    image: "https://images.unsplash.com/photo-1582735689869-f0e8e4e1e3d4?w=800&q=80",
    condition: "Very Good"
  },
  {
    title: "Double Glazed Windows",
    category: "Windows",
    location: "Den Haag, NL",
    quantity: "12 units",
    price: "€180/unit",
    postedDate: "3 days ago",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
    condition: "Excellent"
  },
  {
    title: "Concrete Slabs",
    category: "Concrete",
    location: "Eindhoven, NL",
    quantity: "~80 m²",
    price: "€25/m²",
    postedDate: "4 days ago",
    image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800&q=80",
    condition: "Good"
  },
  {
    title: "Copper Piping",
    category: "Plumbing",
    location: "Groningen, NL",
    quantity: "~200m",
    price: "€8/m",
    postedDate: "1 day ago",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80",
    condition: "Very Good"
  }
];

return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Material Marketplace</h1>
          <p className="text-muted-foreground">Browse and purchase recovered building materials</p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search materials..." 
                className="pl-10"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="wood">Wood</SelectItem>
                <SelectItem value="metal">Metal</SelectItem>
                <SelectItem value="masonry">Masonry</SelectItem>
                <SelectItem value="glass">Glass</SelectItem>
                <SelectItem value="concrete">Concrete</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="recent">
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Materials Grid */}
        {filteredMaterials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {materials.length === 0 
                ? "No materials listed yet. Be the first to add one!"
                : "No materials match your search."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => (
              <MaterialCard
                key={material.id}
                title={material.title}
                category={material.category}
                location={material.location}
                quantity={material.quantity || ''}
                price={`€${material.price}`}
                postedDate="Recently"
                image={material.images?.[0] || mockMaterials[0].image}
                condition={material.condition}
              />
          ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Marketplace;
