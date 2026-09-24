import { Download, Upload, Key, Clock, Info, FileText, ChevronRight, Shield, Moon, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";
import { useAutoLock } from "../hooks/useAutoLock";
import { BottomNav } from "./BottomNav";

export function SettingsScreen() {
  const {
    darkMode, setDarkMode,
    masterPassword, setMasterPassword,
    autoLockDuration, setAutoLockDuration, setAutoLockTimer,
    setIsUnlocked,
    setShowExportDialog, setShowImportDialog,
  } = useAppContext();
  const navigate = useNavigate();
  const autoLockTimer = useAutoLock();

  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showTimerDialog, setShowTimerDialog] = useState(false);
  const [showCustomTimer, setShowCustomTimer] = useState(false);
  const [customTimerValue, setCustomTimerValue] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleDarkModeToggle = (enabled: boolean) => {
    setDarkMode(enabled);
    try { localStorage.setItem("darkMode", JSON.stringify(enabled)); } catch {}
  };

  const handleChangePassword = () => {
    setPasswordError("");
    if (!oldPassword || !newPassword || !confirmPassword) { setPasswordError("All fields are required"); return; }
    if (newPassword !== confirmPassword) { setPasswordError("New passwords do not match"); return; }
    if (newPassword.length < 6) { setPasswordError("Password must be at least 6 characters"); return; }
    if (oldPassword !== masterPassword) { setPasswordError("Current password is incorrect"); return; }
    setMasterPassword(newPassword);
    setShowPasswordDialog(false);
    setOldPassword(""); setNewPassword(""); setConfirmPassword("");
    alert("Master password changed successfully!");
  };

  const handleTimerChange = (duration: number) => {
    setAutoLockDuration(duration);
    setAutoLockTimer(duration);
    setShowTimerDialog(false);
  };

  const handleLogout = () => {
    setIsUnlocked(false);
    setAutoLockTimer(autoLockDuration);
    navigate("/unlock", { replace: true });
  };

  const timerOptions = [
    { value: 30, label: "30 seconds" },
    { value: 60, label: "1 minute" },
    { value: 120, label: "2 minutes" },
    { value: 300, label: "5 minutes" },
    { value: 600, label: "10 minutes" },
  ];

  return (
    <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl sm:rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-95 flex flex-col h-full`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-3 sm:px-6 py-3 sm:py-5 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-white bg-opacity-20 rounded-lg">
              <Shield className="text-black" size={18} />
            </div>
            <h1 className="text-white text-base sm:text-lg">Settings</h1>
          </div>
          <div className="flex items-center gap-2 bg-white bg-opacity-20 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
            <Clock size={14} className="text-black" />
            <span className="text-black text-xs sm:text-sm">{autoLockTimer}s</span>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="flex-1 p-3 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto custom-scrollbar">
        {/* Backup & Restore */}
        <div>
          <h3 className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-2 sm:mb-3 flex items-center gap-2 text-sm`}>
            <Download size={14} />
            Backup & Restore
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => setShowExportDialog(true)}
              className={`w-full ${darkMode ? "bg-gradient-to-br from-blue-900 to-cyan-900 hover:from-blue-800 hover:to-cyan-800 border-blue-800" : "bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border-blue-100 hover:border-blue-200"} rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 transition-all group border-2 active:scale-[0.98]`}
            >
              <div className={`p-2 sm:p-2.5 ${darkMode ? "bg-gray-700 text-blue-400" : "bg-white text-blue-600"} rounded-lg sm:rounded-xl group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-cyan-500 group-hover:text-white transition-all shadow-sm flex-shrink-0`}>
                <Download size={16} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className={`${darkMode ? "text-gray-200" : "text-gray-800"} text-sm sm:text-base`}>Export Encrypted Backup</p>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-xs truncate`}>Save your vault to a file</p>
              </div>
              <ChevronRight className={`${darkMode ? "text-gray-500 group-hover:text-blue-400" : "text-gray-400 group-hover:text-blue-600"} flex-shrink-0`} size={18} />
            </button>

            <button
              onClick={() => setShowImportDialog(true)}
              className={`w-full ${darkMode ? "bg-gradient-to-br from-green-900 to-emerald-900 hover:from-green-800 hover:to-emerald-800 border-green-800" : "bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-100 hover:border-green-200"} rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 transition-all group border-2 active:scale-[0.98]`}
            >
              <div className={`p-2 sm:p-2.5 ${darkMode ? "bg-gray-700 text-green-400" : "bg-white text-green-600"} rounded-lg sm:rounded-xl group-hover:bg-gradient-to-br group-hover:from-green-500 group-hover:to-emerald-500 group-hover:text-white transition-all shadow-sm flex-shrink-0`}>
                <Upload size={16} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className={`${darkMode ? "text-gray-200" : "text-gray-800"} text-sm sm:text-base`}>Import Encrypted Backup</p>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-xs truncate`}>Restore from a backup file</p>
              </div>
              <ChevronRight className={`${darkMode ? "text-gray-500 group-hover:text-green-400" : "text-gray-400 group-hover:text-green-600"} flex-shrink-0`} size={18} />
            </button>
          </div>
        </div>

        {/* Security */}
        <div>
          <h3 className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-2 sm:mb-3 flex items-center gap-2 text-sm`}>
            <Shield size={14} />
            Security
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => setShowPasswordDialog(true)}
              className={`w-full ${darkMode ? "bg-gradient-to-br from-purple-900 to-pink-900 hover:from-purple-800 hover:to-pink-800 border-purple-800" : "bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-100 hover:border-purple-200"} rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 transition-all group border-2 active:scale-[0.98]`}
            >
              <div className={`p-2 sm:p-2.5 ${darkMode ? "bg-gray-700 text-purple-400" : "bg-white text-purple-600"} rounded-lg sm:rounded-xl group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-pink-500 group-hover:text-white transition-all shadow-sm flex-shrink-0`}>
                <Key size={16} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className={`${darkMode ? "text-gray-200" : "text-gray-800"} text-sm sm:text-base`}>Change Master Password</p>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-xs truncate`}>Update your vault password</p>
              </div>
              <ChevronRight className={`${darkMode ? "text-gray-500 group-hover:text-purple-400" : "text-gray-400 group-hover:text-purple-600"} flex-shrink-0`} size={18} />
            </button>

            <button
              onClick={() => setShowTimerDialog(true)}
              className={`w-full ${darkMode ? "bg-gradient-to-br from-orange-900 to-amber-900 hover:from-orange-800 hover:to-amber-800 border-orange-800" : "bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 border-orange-100 hover:border-orange-200"} rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 transition-all group border-2 active:scale-[0.98]`}
            >
              <div className={`p-2 sm:p-2.5 ${darkMode ? "bg-gray-700 text-orange-400" : "bg-white text-orange-600"} rounded-lg sm:rounded-xl group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-amber-500 group-hover:text-white transition-all shadow-sm flex-shrink-0`}>
                <Clock size={16} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className={`${darkMode ? "text-gray-200" : "text-gray-800"} text-sm sm:text-base`}>Auto-Lock Timer</p>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-xs truncate`}>
                  Currently: {autoLockDuration >= 60 ? `${autoLockDuration / 60} minute${autoLockDuration > 60 ? "s" : ""}` : `${autoLockDuration} seconds`}
                </p>
              </div>
              <ChevronRight className={`${darkMode ? "text-gray-500 group-hover:text-orange-400" : "text-gray-400 group-hover:text-orange-600"} flex-shrink-0`} size={18} />
            </button>
          </div>
        </div>

        {/* Appearance */}
        <div>
          <h3 className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-2 sm:mb-3 flex items-center gap-2 text-sm`}>
            <Moon size={14} />
            Appearance
          </h3>
          <div className={`w-full ${darkMode ? "bg-gradient-to-br from-indigo-900 to-violet-900 border-indigo-800" : "bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-100"} rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 border-2`}>
            <div className={`p-2 sm:p-2.5 ${darkMode ? "bg-gray-700 text-indigo-400" : "bg-white text-indigo-600"} rounded-lg sm:rounded-xl shadow-sm flex-shrink-0`}>
              <Moon size={16} />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className={`${darkMode ? "text-gray-200" : "text-gray-800"} text-sm sm:text-base`}>Dark Mode</p>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-xs`}>Toggle dark theme</p>
            </div>
            <button
              onClick={() => handleDarkModeToggle(!darkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${darkMode ? "bg-indigo-600" : "bg-gray-300"}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </div>

        {/* About */}
        <div>
          <h3 className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-2 sm:mb-3 flex items-center gap-2 text-sm`}>
            <Info size={14} />
            About
          </h3>
          <div className="space-y-2">
            <div className={`w-full ${darkMode ? "bg-gradient-to-br from-gray-700 to-slate-700 border-gray-600" : "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-100"} rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 border-2`}>
              <div className={`p-2 sm:p-2.5 ${darkMode ? "bg-gray-600 text-gray-300" : "bg-white text-gray-600"} rounded-lg sm:rounded-xl shadow-sm flex-shrink-0`}>
                <Info size={16} />
              </div>
              <div className="flex-1 text-left">
                <p className={`${darkMode ? "text-gray-200" : "text-gray-800"} text-sm sm:text-base`}>Version</p>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-xs`}>1.0.0</p>
              </div>
            </div>

            <button
              onClick={() => navigate("/settings/privacy")}
              className={`w-full ${darkMode ? "bg-gradient-to-br from-indigo-900 to-purple-900 hover:from-indigo-800 hover:to-purple-800 border-indigo-800" : "bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border-indigo-100 hover:border-indigo-200"} rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 transition-all group border-2 active:scale-[0.98]`}
            >
              <div className={`p-2 sm:p-2.5 ${darkMode ? "bg-gray-700 text-indigo-400" : "bg-white text-indigo-600"} rounded-lg sm:rounded-xl group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-500 group-hover:text-white transition-all shadow-sm flex-shrink-0`}>
                <FileText size={16} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className={`${darkMode ? "text-gray-200" : "text-gray-800"} text-sm sm:text-base`}>Privacy Policy</p>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-xs truncate`}>How we protect your data</p>
              </div>
              <ChevronRight className={`${darkMode ? "text-gray-500 group-hover:text-indigo-400" : "text-gray-400 group-hover:text-indigo-600"} flex-shrink-0`} size={18} />
            </button>
          </div>
        </div>

        {/* Logout */}
        <div>
          <h3 className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-2 sm:mb-3 flex items-center gap-2 text-sm`}>
            <LogOut size={14} />
            Logout
          </h3>
          <button
            onClick={handleLogout}
            className={`w-full ${darkMode ? "bg-gradient-to-br from-red-900 to-rose-900 hover:from-red-800 hover:to-rose-800 border-red-800" : "bg-gradient-to-br from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border-red-100 hover:border-red-200"} rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 transition-all group border-2 active:scale-[0.98]`}
          >
            <div className={`p-2 sm:p-2.5 ${darkMode ? "bg-gray-700 text-red-400" : "bg-white text-red-600"} rounded-lg sm:rounded-xl group-hover:bg-gradient-to-br group-hover:from-red-500 group-hover:to-rose-500 group-hover:text-white transition-all shadow-sm flex-shrink-0`}>
              <LogOut size={16} />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className={`${darkMode ? "text-gray-200" : "text-gray-800"} text-sm sm:text-base`}>Logout</p>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-xs truncate`}>Sign out of your account</p>
            </div>
            <ChevronRight className={`${darkMode ? "text-gray-500 group-hover:text-red-400" : "text-gray-400 group-hover:text-red-600"} flex-shrink-0`} size={18} />
          </button>
        </div>
      </div>

      <BottomNav />

      {/* Change Password Dialog */}
      {showPasswordDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl p-6 w-full max-w-md shadow-xl`}>
            <h2 className={`${darkMode ? "text-white" : "text-gray-800"} mb-4`}>Change Master Password</h2>
            <div className="space-y-4">
              {(["Current Password", "New Password", "Confirm New Password"] as const).map((label, i) => {
                const values = [oldPassword, newPassword, confirmPassword];
                const setters = [setOldPassword, setNewPassword, setConfirmPassword];
                return (
                  <div key={label}>
                    <label className={`block ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>{label}</label>
                    <input
                      type="password"
                      value={values[i]}
                      onChange={(e) => setters[i](e.target.value)}
                      className={`w-full px-4 py-3 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"} border-2 rounded-xl focus:border-indigo-500 focus:outline-none transition-all`}
                    />
                  </div>
                );
              })}
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowPasswordDialog(false); setOldPassword(""); setNewPassword(""); setConfirmPassword(""); setPasswordError(""); }}
                  className={`flex-1 py-3 rounded-xl ${darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"} transition-all`}
                >
                  Cancel
                </button>
                <button onClick={handleChangePassword} className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timer Dialog */}
      {showTimerDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl p-6 w-full max-w-md shadow-xl`}>
            <h2 className={`${darkMode ? "text-white" : "text-gray-800"} mb-4`}>Auto-Lock Timer</h2>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-4 text-sm`}>
              Choose how long the app stays unlocked before automatically locking
            </p>
            <div className="space-y-2">
              {timerOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleTimerChange(option.value)}
                  className={`w-full py-3 px-4 rounded-xl text-left transition-all ${
                    autoLockDuration === option.value
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                      : darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
              <button
                onClick={() => setShowCustomTimer(true)}
                className={`w-full py-3 px-4 rounded-xl text-left transition-all ${darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                Custom Timer
              </button>
            </div>
            <button
              onClick={() => setShowTimerDialog(false)}
              className={`w-full mt-4 py-3 rounded-xl ${darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"} transition-all`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Custom Timer Dialog */}
      {showCustomTimer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl p-6 w-full max-w-md shadow-xl`}>
            <h2 className={`${darkMode ? "text-white" : "text-gray-800"} mb-4`}>Custom Auto-Lock Timer</h2>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-4 text-sm`}>Enter the duration in seconds</p>
            <div className="space-y-4">
              <div>
                <label className={`block ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>Duration (seconds)</label>
                <input
                  type="number"
                  value={customTimerValue}
                  onChange={(e) => setCustomTimerValue(e.target.value)}
                  className={`w-full px-4 py-3 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"} border-2 rounded-xl focus:border-indigo-500 focus:outline-none transition-all`}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowCustomTimer(false); setCustomTimerValue(""); }}
                  className={`flex-1 py-3 rounded-xl ${darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"} transition-all`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const duration = parseInt(customTimerValue, 10);
                    if (!isNaN(duration) && duration > 0) { handleTimerChange(duration); setShowCustomTimer(false); }
                    else alert("Please enter a valid duration in seconds.");
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Set Timer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
