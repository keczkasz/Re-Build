import { NavLink } from "@/components/NavLink";
import { Recycle, Package, Users, UserCircle, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  return (
    <nav className="border-b border-border bg-card sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Recycle className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Re:Build</h1>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <NavLink 
            to="/" 
            className="text-muted-foreground hover:text-foreground transition-colors"
            activeClassName="text-foreground font-medium"
          >
            Home
          </NavLink>
          <NavLink 
            to="/marketplace" 
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            activeClassName="text-foreground font-medium"
          >
            <Package className="h-4 w-4" />
            Marketplace
          </NavLink>
          <NavLink 
            to="/connections" 
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            activeClassName="text-foreground font-medium"
          >
            <Users className="h-4 w-4" />
            Connections
          </NavLink>
          <NavLink 
            to="/dashboard" 
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            activeClassName="text-foreground font-medium"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </NavLink>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <UserCircle className="h-5 w-5" />
          </Button>
          <Button variant="default">List Materials</Button>
        </div>
      </div>
    </nav>
  );
};
