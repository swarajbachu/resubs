import Menu from "@/components/menu/menu";
import type React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <div className="absolute bottom-2 right-2">
        <Menu />
      </div>
    </div>
  );
}
