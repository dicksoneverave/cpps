
import React from "react";
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
  LogIn, 
  HelpCircle,
  ClipboardList,
  User,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DesktopMenuProps {
  userRole?: string;
  onLogout?: () => void;
}

const DesktopMenu: React.FC<DesktopMenuProps> = ({ userRole, onLogout }) => {
  return (
    <div className="hidden md:flex space-x-1 items-center">
      <NavigationMenu>
        <NavigationMenuList>
          {!userRole ? (
            <NavigationMenuItem>
              <Link to="/login">
                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-white/10")}>
                  <LogIn className="w-4 h-4 mr-2" />
                  LOGIN
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onLogout} 
                className="bg-transparent border border-white text-white hover:bg-white/20"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </NavigationMenuItem>
          )}

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
  );
};

export default DesktopMenu;
