
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Menu, 
  X, 
  FileText, 
  Cloud, 
  LogIn, 
  HelpCircle, 
  ClipboardList,
  User,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  userRole?: string;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ userRole, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-[#8B2303] text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/public/lovable-uploads/35515f7c-2d42-4daa-a0c4-828f51baeb92.png" 
                alt="PNG Logo" 
                className="h-8 w-8"
              />
              <div className="hidden md:block">
                <div className="font-bold text-sm">OFFICE OF WORKERS COMPENSATION</div>
                <div className="text-xs">CLAIMS PROCESSING AND PAYMENT SYSTEM</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-white/10")}>
                      <Home className="w-4 h-4 mr-2" />
                      HOME
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-white/10">
                    <FileText className="w-4 h-4 mr-2" />
                    ABOUT
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-1 p-2">
                      <li>
                        <Link to="/about/vision">
                          <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-accent justify-start")}>
                            Vision
                          </NavigationMenuLink>
                        </Link>
                      </li>
                      <li>
                        <Link to="/about/contact">
                          <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-accent justify-start")}>
                            Contact Us
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/services">
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-white/10")}>
                      SERVICES
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-white/10">
                    <Cloud className="w-4 h-4 mr-2" />
                    CPPS ONLINE
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[240px] gap-1 p-2">
                      <li>
                        <Link to="/cpps-online/employer-registration">
                          <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-accent justify-start")}>
                            Employer Registration
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/login">
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-white/10")}>
                      <LogIn className="w-4 h-4 mr-2" />
                      LOGIN
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/help">
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-white/10")}>
                      <HelpCircle className="w-4 h-4 mr-2" />
                      HELP
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/pending-list">
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-white/10")}>
                      <ClipboardList className="w-4 h-4 mr-2" />
                      PENDING LIST
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                {userRole && (
                  <NavigationMenuItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="hover:bg-white/10">
                          <User className="w-4 h-4 mr-2" />
                          Account
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem disabled>
                          Role: {userRole}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/profile">My Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onLogout} className="text-red-600">
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="text-white hover:bg-white/10"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4">
            <ul className="space-y-2">
              <li>
                <Link to="/" className="flex items-center p-2 hover:bg-white/10 rounded" onClick={toggleMenu}>
                  <Home className="w-4 h-4 mr-2" />
                  HOME
                </Link>
              </li>
              <li>
                <div className="flex flex-col">
                  <div className="flex items-center p-2">
                    <FileText className="w-4 h-4 mr-2" />
                    ABOUT
                  </div>
                  <ul className="pl-8 space-y-2">
                    <li>
                      <Link to="/about/vision" className="block p-2 hover:bg-white/10 rounded" onClick={toggleMenu}>
                        Vision
                      </Link>
                    </li>
                    <li>
                      <Link to="/about/contact" className="block p-2 hover:bg-white/10 rounded" onClick={toggleMenu}>
                        Contact Us
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <Link to="/services" className="flex items-center p-2 hover:bg-white/10 rounded" onClick={toggleMenu}>
                  SERVICES
                </Link>
              </li>
              <li>
                <div className="flex flex-col">
                  <div className="flex items-center p-2">
                    <Cloud className="w-4 h-4 mr-2" />
                    CPPS ONLINE
                  </div>
                  <ul className="pl-8 space-y-2">
                    <li>
                      <Link to="/cpps-online/employer-registration" className="block p-2 hover:bg-white/10 rounded" onClick={toggleMenu}>
                        Employer Registration
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <Link to="/login" className="flex items-center p-2 hover:bg-white/10 rounded" onClick={toggleMenu}>
                  <LogIn className="w-4 h-4 mr-2" />
                  LOGIN
                </Link>
              </li>
              <li>
                <Link to="/help" className="flex items-center p-2 hover:bg-white/10 rounded" onClick={toggleMenu}>
                  <HelpCircle className="w-4 h-4 mr-2" />
                  HELP
                </Link>
              </li>
              <li>
                <Link to="/pending-list" className="flex items-center p-2 hover:bg-white/10 rounded" onClick={toggleMenu}>
                  <ClipboardList className="w-4 h-4 mr-2" />
                  PENDING LIST
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
