import { Home, Plus, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useAppContext } from "../context/AppContext";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, setAutoLockTimer } = useAppContext();

  const isHome = location.pathname === "/home";
  const isSettings = location.pathname.startsWith("/settings");

  const handleAddNote = () => {
    setAutoLockTimer(120);
    navigate("/note/new");
  };

  const navItems = [
    { key: "home", path: "/home", icon: Home, label: "Home", isActive: isHome },
    { key: "add", path: "add", icon: Plus, label: "Add", isActive: false },
    { key: "settings", path: "/settings", icon: Settings, label: "Settings", isActive: isSettings },
  ];

  return (
    <div className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-t px-2 sm:px-4 py-2 sm:py-3 safe-area-bottom flex-shrink-0`}>
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => item.key === "add" ? handleAddNote() : navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 sm:gap-1 px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl transition-all active:scale-95 min-w-[60px] min-h-[52px] ${
                item.isActive
                  ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg scale-105"
                  : darkMode
                    ? "text-gray-400 hover:text-indigo-400 hover:bg-gray-700"
                    : "text-gray-500 hover:text-indigo-600 hover:bg-gray-50"
              }`}
            >
              <Icon size={20} />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
