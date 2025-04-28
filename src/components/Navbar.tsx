
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Logo from "./navigation/Logo";
import DesktopMenu from "./navigation/DesktopMenu";
import MobileMenu from "./navigation/MobileMenu";

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
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <DesktopMenu userRole={userRole} onLogout={onLogout} />

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
        <MobileMenu 
          isMenuOpen={isMenuOpen} 
          toggleMenu={toggleMenu} 
          userRole={userRole} 
          onLogout={onLogout}
        />
      </div>
    </header>
  );
};

export default Navbar;
