
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HelpCircle, ClipboardList, User, LogOut } from "lucide-react";

interface DesktopMenuProps {
  isAuthenticated: boolean;
  userRole?: string;
  onLogout?: () => void;
}

const DesktopMenu: React.FC<DesktopMenuProps> = ({ isAuthenticated, userRole, onLogout }) => {
  const isAdmin = userRole?.toLowerCase().includes('admin');

  return (
    <nav className="hidden md:flex space-x-1">
      {!isAuthenticated ? (
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" asChild>
          <Link to="/login">LOGIN</Link>
        </Button>
      ) : (
        <>
          {isAdmin && (
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" asChild>
              <Link to="/admin">ADMIN</Link>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            LOGOUT
          </Button>
        </>
      )}

      <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" asChild>
        <Link to="/help">
          <HelpCircle className="h-4 w-4 mr-2" />
          HELP
        </Link>
      </Button>

      <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" asChild>
        <Link to="/pending-list">
          <ClipboardList className="h-4 w-4 mr-2" />
          PENDING LIST
        </Link>
      </Button>

      {isAuthenticated && (
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" asChild>
          <Link to="/dashboard">
            <User className="h-4 w-4 mr-2" />
            ACCOUNT
          </Link>
        </Button>
      )}
    </nav>
  );
};

export default DesktopMenu;
