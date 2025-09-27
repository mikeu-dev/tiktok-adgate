import { ThemeToggle } from "./theme-toggle";
import { Tv2 } from "lucide-react";

export function Header() {
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <Tv2 className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold font-headline">TikTok AdGate</h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
