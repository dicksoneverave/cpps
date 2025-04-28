
import React from "react";

const AuthHeader = () => {
  return (
    <div className="text-center mb-8">
      <img
        src="/lovable-uploads/e926ba6c-9a52-4f9e-aaf0-a97f1feea9e5.png"
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
