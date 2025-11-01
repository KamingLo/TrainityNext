import { ReactNode } from "react";

export default function AuthLayout ({ children }:  { children: ReactNode }) {
  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-black rounded-lg shadow-md">
      {children}
    </div>
  );
};
