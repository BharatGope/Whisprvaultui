import { useState } from "react";
import { Lock, Eye, EyeOff, Fingerprint } from "lucide-react";

interface UnlockScreenProps {
  onUnlock: (password: string) => void;
  darkMode?: boolean;
}

export function UnlockScreen({ onUnlock, darkMode }: UnlockScreenProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleUnlock = () => {
    if (!password) {
      setError("Please enter your password");
      return;
    }
    // In a real app, verify the password
    onUnlock(password);
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 backdrop-blur-sm bg-opacity-95 h-full flex flex-col justify-center`}>
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
          <Lock className="text-white" size={28} />
        </div>
        <h1 className={`${darkMode ? 'text-white' : 'text-indigo-600'} mb-2 text-xl sm:text-2xl`}>WhisprVault</h1>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm sm:text-base`}>Welcome back</p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div>
          <h2 className={`${darkMode ? 'text-white' : 'text-gray-800'} mb-4 sm:mb-6 text-base sm:text-lg`}>Enter Master Password</h2>

          <div className="relative mb-3 sm:mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Master Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200'} border-2 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:outline-none ${darkMode ? 'focus:bg-gray-600' : 'focus:bg-white'} transition-all text-sm sm:text-base`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <div className="mb-3 sm:mb-4 text-red-500 text-center text-sm">{error}</div>
          )}

          <button
            onClick={handleUnlock}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base min-h-[44px]"
          >
            Unlock Vault
          </button>

          <div className={`mt-4 sm:mt-6 flex items-center justify-center gap-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'} text-xs sm:text-sm`}>
            <Fingerprint size={18} />
            <span>Use Fingerprint (coming soon)</span>
          </div>
        </div>
      </div>
    </div>
  );
}