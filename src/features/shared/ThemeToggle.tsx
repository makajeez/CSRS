import { useEffect, useState } from "react";
import DarkModeTwoToneIcon from '@mui/icons-material/DarkModeTwoTone'
import LightModeTwoToneIcon from '@mui/icons-material/LightModeTwoTone'


// Restrictng theme types to these 2
type Theme = "light" | "dark";

export default function ThemeToggle(){
  // Initialize state cleanly with explicit Theme type casting
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme") as Theme | null;
      if (saved === "light" || saved === "dark") return saved;
      
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return systemPreference ? "dark" : "light";
    }
    return "light";
  });

  

  useEffect(() => {
    const root: HTMLElement = document.documentElement;
    
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = (): void => {
    setTheme((prev: Theme) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-1 py-1 rounded-lg dark:bg-white/20 bg-black/20 border border-black/50 dark:border-white/50 transition-colors duration-200"
    >
      {theme === "light" ? <DarkModeTwoToneIcon /> : <LightModeTwoToneIcon className="text-white/50"/>}
    </button>
  );
}
