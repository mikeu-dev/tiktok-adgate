import { ThemeToggle } from "./theme-toggle";
import { Tv2, Languages, LogOut, User as UserIcon, History } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "./ui/button";
import { useAuth } from "@/components/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const { t, setLanguage, language } = useLanguage();
  const { user, signInWithGoogle, logout } = useAuth();

  const toggleLanguage = () => {
    const newLang = language === 'id' ? 'en' : 'id';
    setLanguage(newLang);
  };

  return (
    <header className="border-b sticky top-0 z-50 glass bg-white/70 dark:bg-black/40">
      <div className="container mx-auto px-4 flex items-center justify-between h-16 text-foreground dark:text-white">
        <div className="flex items-center gap-2">
          <Tv2 className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold font-headline tracking-tight text-foreground dark:text-white">{t('header.title')}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleLanguage} aria-label="Toggle language">
            <Languages className="h-[1.2rem] w-[1.2rem]" />
          </Button>
          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                    <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/history" className="cursor-pointer">
                    <History className="mr-2 h-4 w-4" />
                    <span>History</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" onClick={signInWithGoogle}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
