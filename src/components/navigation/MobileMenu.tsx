
import React from "react";
import { Link } from "react-router-dom";
import { Home, FileText, Cloud, LogIn, HelpCircle, ClipboardList, LogOut } from "lucide-react";

interface MobileMenuProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  userRole?: string;
  onLogout?: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isMenuOpen, toggleMenu, userRole, onLogout }) => {
  if (!isMenuOpen) return null;
  
  return (
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
        {!userRole ? (
          <li>
            <Link to="/login" className="flex items-center p-2 hover:bg-white/10 rounded" onClick={toggleMenu}>
              <LogIn className="w-4 h-4 mr-2" />
              LOGIN
            </Link>
          </li>
        ) : (
          <li>
            <button 
              onClick={() => {
                if (onLogout) {
                  onLogout();
                }
                toggleMenu();
              }} 
              className="flex items-center p-2 w-full text-left hover:bg-white/10 rounded text-red-400"
            >
              <LogOut className="w-4 h-4 mr-2" />
              LOGOUT
            </button>
          </li>
        )}
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
        {userRole && (
          <li className="px-2 py-1 mt-2 border-t border-white/10 pt-2">
            <div className="text-sm text-white/60">
              Role: {userRole}
            </div>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default MobileMenu;
