import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
 const { theme, toggleTheme } = useTheme();

 return (
 <button
 onClick={toggleTheme}
 className="p-2 rounded-full transition-all duration-300 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
 aria-label="Toggle Theme"
 >
 {theme === 'light' ? (
 <Moon className="w-5 h-5 text-foreground transition-all duration-300 rotate-0 scale-100" />
 ) : (
 <Sun className="w-5 h-5 text-foreground transition-all duration-300 rotate-0 scale-100" />
 )}
 </button>
 );
};

export default ThemeToggle;


