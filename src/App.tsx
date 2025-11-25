/**
 * Copyright © 2025 Dawid Konopka
 * All rights reserved.
 * 
 * You may NOT copy, modify, distribute, or use this code in any commercial 
 * or non-commercial project without explicit written permission from the author.
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Marketplace from "./pages/Marketplace";
import Connections from "./pages/Connections";
import Dashboard from "./pages/Dashboard";
import AddMaterial from "./pages/AddMaterial";
import EditProfile from "./pages/EditProfile";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/materials/new" element={<ProtectedRoute><AddMaterial /></ProtectedRoute>} />
            <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path="/connections" element={<ProtectedRoute><Connections /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/projects" element={<Projects />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
