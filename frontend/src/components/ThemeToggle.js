import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="transition-all duration-300 hover:scale-105"
      title={isDarkMode ? 'Zur hellen Ansicht wechseln' : 'Zur dunklen Ansicht wechseln'}
    >
      {isDarkMode ? (
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      ) : (
        <Moon className="h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      )}
      <span className="sr-only">
        {isDarkMode ? 'Tagmodus aktivieren' : 'Nachtmodus aktivieren'}
      </span>
    </Button>
  );
};

export default ThemeToggle;