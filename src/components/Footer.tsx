import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Recycle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#2c2c2c] text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Left Section - Logo and Tagline */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Recycle className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Re:Build</span>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Building the future of sustainable construction through circular economy principles
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary rounded-md">
              <Recycle className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-primary-foreground">Circular Economy Certified</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/marketplace" className="text-gray-300 hover:text-white transition-colors">
                  Material Marketplace
                </Link>
              </li>
              <li>
                <Link to="/connections" className="text-gray-300 hover:text-white transition-colors">
                  Network Connect
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Best Practices
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Case Studies
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Material Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Sustainability Reports
                </a>
              </li>
            </ul>
          </div>

          {/* Stay Updated */}
          <div>
            <h3 className="font-semibold mb-4">Stay Updated</h3>
            <p className="text-sm text-gray-300 mb-3">
              Get the latest news on sustainable construction
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button variant="default" className="bg-primary hover:bg-primary/90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <div className="text-center md:text-left">
              <p>© 2025 Dawid Konopka. All rights reserved.</p>
              <p className="text-xs mt-1 text-gray-500">
                You may NOT copy, modify, distribute, or use this code without explicit written permission.
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
