import { useState } from "react";
import { Lock, Eye, EyeOff, Fingerprint } from "lucide-react";

interface UnlockScreenProps {
  onUnlock: (password: string) => void;
}

export function UnlockScreen({ onUnlock }: UnlockScreenProps) {
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
    <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
          <Lock className="text-white" size={32} />
        </div>
        <h1 className="text-indigo-600 mb-2">WhisprVault</h1>
        <p className="text-gray-500">Welcome back</p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-gray-800 mb-6">Enter Master Password</h2>

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Master Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && (
            <div className="mb-4 text-red-500 text-center">{error}</div>
          )}

          <button
            onClick={handleUnlock}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
          >
            Unlock Vault
          </button>

          <div className="mt-6 flex items-center justify-center gap-2 text-gray-400">
            <Fingerprint size={20} />
            <span>Use Fingerprint (coming soon)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
