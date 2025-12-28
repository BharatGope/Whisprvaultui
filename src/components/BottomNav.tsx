import { Home, Plus, Settings, Shield } from "lucide-react";
import { Screen } from "../App";

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onAddNote?: () => void;
  darkMode?: boolean;
}

export function BottomNav({ currentScreen, onNavigate, onAddNote, darkMode }: BottomNavProps) {
  const navItems = [
    { id: "home" as Screen, icon: Home, label: "Home" },
    { id: "add" as const, icon: Plus, label: "Add" },
    { id: "settings" as Screen, icon: Settings, label: "Settings" },
  ];

  const handleClick = (id: string) => {
    if (id === "add") {
      onAddNote?.();
    } else {
      onNavigate(id as Screen);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t px-4 py-3 safe-area-bottom`}>
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = 
            item.id === currentScreen || 
            (item.id === "home" && currentScreen === "home");
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
                isActive
                  ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg scale-105"
                  : darkMode 
                    ? "text-gray-400 hover:text-indigo-400 hover:bg-gray-700"
                    : "text-gray-500 hover:text-indigo-600 hover:bg-gray-50"
              }`}
            >
              <Icon size={22} />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}