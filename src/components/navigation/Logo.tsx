
import React from "react";
import { Link } from "react-router-dom";

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <img 
        src="/lovable-uploads/1e7c5da5-cc17-4139-b5ce-6c3f07f2e259.png" 
        alt="Papua New Guinea Emblem" 
        className="h-10 w-10 object-contain"
      />
      <div className="hidden md:block">
        <div className="font-bold text-sm">OFFICE OF WORKERS COMPENSATION</div>
        <div className="text-xs">CLAIMS PROCESSING AND PAYMENT SYSTEM</div>
      </div>
    </Link>
  );
};

export default Logo;
