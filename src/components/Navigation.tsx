import { memo, useCallback } from "react";
import { NavLink } from "@/components/NavLink";
import { Recycle, Package, Users, LayoutDashboard, Plus, LogIn, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const Navigation = memo(() => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Memoize navigation handlers
  const handleHomeClick = useCallback(() => navigate('/'), [navigate]);
  const handleAddMaterialClick = useCallback(() => navigate('/materials/new'), [navigate]);
  const handleAuthClick = useCallback(() => navigate('/auth'), [navigate]);

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleHomeClick}>
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
          {user && (
            <>
              <NavLink 
                to="/connections" 
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                activeClassName="text-foreground font-medium"
              >
                <Users className="h-4 w-4" />
                Connections
              </NavLink>
              <NavLink 
                to="/messages" 
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                activeClassName="text-foreground font-medium"
              >
                <MessageCircle className="h-4 w-4" />
                Messages
              </NavLink>
              <NavLink 
                to="/dashboard" 
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                activeClassName="text-foreground font-medium"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </NavLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button variant="default" className="gap-2" onClick={handleAddMaterialClick}>
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">List Materials</span>
              </Button>
              <UserMenu />
            </>
          ) : (
            <Button onClick={handleAuthClick} className="gap-2">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
});

Navigation.displayName = "Navigation";
