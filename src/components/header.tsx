import { ThemeToggle } from "./theme-toggle";
import { Tv2, Languages } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "./ui/button";

export function Header() {
  const { t, setLanguage, language } = useLanguage();

  const toggleLanguage = () => {
    const newLang = language === 'id' ? 'en' : 'id';
    setLanguage(newLang);
  };

  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <Tv2 className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold font-headline">{t('header.title')}</h1>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleLanguage} aria-label="Toggle language">
                <Languages className="h-[1.2rem] w-[1.2rem]" />
            </Button>
            <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
