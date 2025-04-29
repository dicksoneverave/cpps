
import React from "react";

const AuthHeader = () => {
  return (
    <div className="text-center mb-8">
      <img
        src="/lovable-uploads/1e7c5da5-cc17-4139-b5ce-6c3f07f2e259.png"
        alt="Papua New Guinea Emblem"
        className="mx-auto mb-4 w-32 h-32 object-contain"
        onError={(e) => {
          console.error("Image failed to load");
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
        }}
      />
      <h1 className="text-2xl font-bold text-white">OFFICE OF WORKERS COMPENSATION</h1>
      <h2 className="text-xl text-white">CLAIMS PROCESSING AND PAYMENT SYSTEM</h2>
    </div>
  );
};

export default AuthHeader;
