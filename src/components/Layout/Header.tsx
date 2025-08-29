import { Search, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useEffect, useState } from "react";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/products": "Products",
  "/orders": "Orders",
  "/analytics": "Analytics",
};

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    </Button>
  );
}

function SearchTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      className="h-9 w-64 justify-between items-center px-3 text-muted-foreground hover:text-foreground"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4" />
        <span>Search...</span>
      </div>
      <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded-sm">
        ⌘K
      </span>
    </Button>
  );
}

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = pageTitles[location.pathname] || "Dashboard";
  const [isCommandMenuOpen, setCommandMenuOpen] = useState(false);

  // keyboard shortcut: ⌘K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === "k" &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement) &&
        !(e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        e.preventDefault();
        setCommandMenuOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (path: string) => {
    navigate(path);
    setCommandMenuOpen(false);
  };

  return (
    <>
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="font-semibold text-xl">{pageTitle}</h1>
        </div>
        <div className="flex items-center gap-2">
          <SearchTrigger onClick={() => setCommandMenuOpen(true)} />
          <ThemeToggle />
        </div>
      </header>

      <CommandDialog open={isCommandMenuOpen} onOpenChange={setCommandMenuOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => runCommand("/")}>
              Dashboard
            </CommandItem>
            <CommandItem onSelect={() => runCommand("/products")}>
              Products
            </CommandItem>
            <CommandItem onSelect={() => runCommand("/orders")}>
              Orders
            </CommandItem>
            <CommandItem onSelect={() => runCommand("/analytics")}>
              Analytics
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
