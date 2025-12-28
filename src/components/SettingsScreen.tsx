import { Download, Upload, Key, Clock, Info, FileText, ChevronRight, Shield, Moon, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Screen } from "../App";
import { BottomNav } from "./BottomNav";

interface SettingsScreenProps {
  onBack: () => void;
  onExportBackup: () => void;
  onImportBackup: () => void;
  onPrivacyPolicy: () => void;
  onNavigate: (screen: Screen) => void;
  onAddNote: () => void;
  onLogout: () => void;
  autoLockTimer: number;
  setAutoLockTimer: (time: number) => void;
  onTimerExpire: () => void;
  autoLockDuration: number;
  setAutoLockDuration: (duration: number) => void;
  darkMode: boolean;
  onDarkModeToggle: (enabled: boolean) => void;
  masterPassword: string;
  onChangeMasterPassword: (oldPassword: string, newPassword: string) => boolean;
}

export function SettingsScreen({ 
  onBack, 
  onExportBackup, 
  onImportBackup, 
  onPrivacyPolicy, 
  onNavigate, 
  onAddNote,
  onLogout,
  autoLockTimer, 
  setAutoLockTimer, 
  onTimerExpire,
  autoLockDuration,
  setAutoLockDuration,
  darkMode,
  onDarkModeToggle,
  masterPassword,
  onChangeMasterPassword
}: SettingsScreenProps) {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showTimerDialog, setShowTimerDialog] = useState(false);
  const [showCustomTimer, setShowCustomTimer] = useState(false);
  const [customTimerValue, setCustomTimerValue] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setAutoLockTimer(autoLockTimer > 0 ? autoLockTimer - 1 : 0);
      if (autoLockTimer === 1) {
        onTimerExpire();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [autoLockTimer, setAutoLockTimer, onTimerExpire]);

  const handleChangePassword = () => {
    setPasswordError("");
    
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    
    const success = onChangeMasterPassword(oldPassword, newPassword);
    if (success) {
      setShowPasswordDialog(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      alert("Master password changed successfully!");
    } else {
      setPasswordError("Current password is incorrect");
    }
  };

  const handleTimerChange = (duration: number) => {
    setAutoLockDuration(duration);
    setAutoLockTimer(duration);
    setShowTimerDialog(false);
  };

  const timerOptions = [
    { value: 30, label: "30 seconds" },
    { value: 60, label: "1 minute" },
    { value: 120, label: "2 minutes" },
    { value: 300, label: "5 minutes" },
    { value: 600, label: "10 minutes" },
  ];

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-95 flex flex-col h-[calc(100vh-2rem)] max-h-[800px]`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Shield className="text-black" size={20} />
            </div>
            <h1 className="text-white">Settings</h1>
          </div>
          <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-2 rounded-lg">
            <Clock size={16} className="text-black" />
            <span className="text-black text-sm">{autoLockTimer}s</span>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
        {/* Backup & Restore */}
        <div>
          <h3 className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-3 flex items-center gap-2`}>
            <Download size={16} />
            Backup & Restore
          </h3>
          <div className="space-y-2">
            <button
              onClick={onExportBackup}
              className={`w-full ${darkMode ? 'bg-gradient-to-br from-blue-900 to-cyan-900 hover:from-blue-800 hover:to-cyan-800 border-blue-800' : 'bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border-blue-100 hover:border-blue-200'} rounded-xl p-4 flex items-center gap-3 transition-all group border-2`}
            >
              <div className={`p-2.5 ${darkMode ? 'bg-gray-700 text-blue-400' : 'bg-white text-blue-600'} rounded-xl group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-cyan-500 group-hover:text-white transition-all shadow-sm`}>
                <Download size={20} />
              </div>
              <div className="flex-1 text-left">
                <p className={darkMode ? 'text-gray-200' : 'text-gray-800'}>Export Encrypted Backup</p>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Save your vault to a file</p>
              </div>
              <ChevronRight className={`${darkMode ? 'text-gray-500 group-hover:text-blue-400' : 'text-gray-400 group-hover:text-blue-600'}`} size={20} />
            </button>

            <button
              onClick={onImportBackup}
              className={`w-full ${darkMode ? 'bg-gradient-to-br from-green-900 to-emerald-900 hover:from-green-800 hover:to-emerald-800 border-green-800' : 'bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-100 hover:border-green-200'} rounded-xl p-4 flex items-center gap-3 transition-all group border-2`}
            >
              <div className={`p-2.5 ${darkMode ? 'bg-gray-700 text-green-400' : 'bg-white text-green-600'} rounded-xl group-hover:bg-gradient-to-br group-hover:from-green-500 group-hover:to-emerald-500 group-hover:text-white transition-all shadow-sm`}>
                <Upload size={20} />
              </div>
              <div className="flex-1 text-left">
                <p className={darkMode ? 'text-gray-200' : 'text-gray-800'}>Import Encrypted Backup</p>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Restore from a backup file</p>
              </div>
              <ChevronRight className={`${darkMode ? 'text-gray-500 group-hover:text-green-400' : 'text-gray-400 group-hover:text-green-600'}`} size={20} />
            </button>
          </div>
        </div>

        {/* Security */}
        <div>
          <h3 className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-3 flex items-center gap-2`}>
            <Shield size={16} />
            Security
          </h3>
          <div className="space-y-2">
            <button 
              onClick={() => setShowPasswordDialog(true)}
              className={`w-full ${darkMode ? 'bg-gradient-to-br from-purple-900 to-pink-900 hover:from-purple-800 hover:to-pink-800 border-purple-800' : 'bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-100 hover:border-purple-200'} rounded-xl p-4 flex items-center gap-3 transition-all group border-2`}
            >
              <div className={`p-2.5 ${darkMode ? 'bg-gray-700 text-purple-400' : 'bg-white text-purple-600'} rounded-xl group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-pink-500 group-hover:text-white transition-all shadow-sm`}>
                <Key size={20} />
              </div>
              <div className="flex-1 text-left">
                <p className={darkMode ? 'text-gray-200' : 'text-gray-800'}>Change Master Password</p>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Update your vault password</p>
              </div>
              <ChevronRight className={`${darkMode ? 'text-gray-500 group-hover:text-purple-400' : 'text-gray-400 group-hover:text-purple-600'}`} size={20} />
            </button>

            <button 
              onClick={() => setShowTimerDialog(true)}
              className={`w-full ${darkMode ? 'bg-gradient-to-br from-orange-900 to-amber-900 hover:from-orange-800 hover:to-amber-800 border-orange-800' : 'bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 border-orange-100 hover:border-orange-200'} rounded-xl p-4 flex items-center gap-3 transition-all group border-2`}
            >
              <div className={`p-2.5 ${darkMode ? 'bg-gray-700 text-orange-400' : 'bg-white text-orange-600'} rounded-xl group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-amber-500 group-hover:text-white transition-all shadow-sm`}>
                <Clock size={20} />
              </div>
              <div className="flex-1 text-left">
                <p className={darkMode ? 'text-gray-200' : 'text-gray-800'}>Auto-Lock Timer</p>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                  Currently: {autoLockDuration >= 60 ? `${autoLockDuration / 60} minute${autoLockDuration > 60 ? 's' : ''}` : `${autoLockDuration} seconds`}
                </p>
              </div>
              <ChevronRight className={`${darkMode ? 'text-gray-500 group-hover:text-orange-400' : 'text-gray-400 group-hover:text-orange-600'}`} size={20} />
            </button>
          </div>
        </div>

        {/* Appearance */}
        <div>
          <h3 className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-3 flex items-center gap-2`}>
            <Moon size={16} />
            Appearance
          </h3>
          <div className="space-y-2">
            <div className={`w-full ${darkMode ? 'bg-gradient-to-br from-indigo-900 to-violet-900 border-indigo-800' : 'bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-100'} rounded-xl p-4 flex items-center gap-3 border-2`}>
              <div className={`p-2.5 ${darkMode ? 'bg-gray-700 text-indigo-400' : 'bg-white text-indigo-600'} rounded-xl shadow-sm`}>
                <Moon size={20} />
              </div>
              <div className="flex-1 text-left">
                <p className={darkMode ? 'text-gray-200' : 'text-gray-800'}>Dark Mode</p>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Toggle dark theme</p>
              </div>
              <button
                onClick={() => onDarkModeToggle(!darkMode)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  darkMode ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* About */}
        <div>
          <h3 className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-3 flex items-center gap-2`}>
            <Info size={16} />
            About
          </h3>
          <div className="space-y-2">
            <div className={`w-full ${darkMode ? 'bg-gradient-to-br from-gray-700 to-slate-700 border-gray-600' : 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-100'} rounded-xl p-4 flex items-center gap-3 border-2`}>
              <div className={`p-2.5 ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-white text-gray-600'} rounded-xl shadow-sm`}>
                <Info size={20} />
              </div>
              <div className="flex-1 text-left">
                <p className={darkMode ? 'text-gray-200' : 'text-gray-800'}>Version</p>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>1.0.0</p>
              </div>
            </div>

            <button 
              onClick={onPrivacyPolicy}
              className={`w-full ${darkMode ? 'bg-gradient-to-br from-indigo-900 to-purple-900 hover:from-indigo-800 hover:to-purple-800 border-indigo-800' : 'bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border-indigo-100 hover:border-indigo-200'} rounded-xl p-4 flex items-center gap-3 transition-all group border-2`}
            >
              <div className={`p-2.5 ${darkMode ? 'bg-gray-700 text-indigo-400' : 'bg-white text-indigo-600'} rounded-xl group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-500 group-hover:text-white transition-all shadow-sm`}>
                <FileText size={20} />
              </div>
              <div className="flex-1 text-left">
                <p className={darkMode ? 'text-gray-200' : 'text-gray-800'}>Privacy Policy</p>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>How we protect your data</p>
              </div>
              <ChevronRight className={`${darkMode ? 'text-gray-500 group-hover:text-indigo-400' : 'text-gray-400 group-hover:text-indigo-600'}`} size={20} />
            </button>
          </div>
        </div>

        {/* Logout */}
        <div>
          <h3 className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-3 flex items-center gap-2`}>
            <LogOut size={16} />
            Logout
          </h3>
          <div className="space-y-2">
            <button
              onClick={onLogout}
              className={`w-full ${darkMode ? 'bg-gradient-to-br from-red-900 to-rose-900 hover:from-red-800 hover:to-rose-800 border-red-800' : 'bg-gradient-to-br from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border-red-100 hover:border-red-200'} rounded-xl p-4 flex items-center gap-3 transition-all group border-2`}
            >
              <div className={`p-2.5 ${darkMode ? 'bg-gray-700 text-red-400' : 'bg-white text-red-600'} rounded-xl group-hover:bg-gradient-to-br group-hover:from-red-500 group-hover:to-rose-500 group-hover:text-white transition-all shadow-sm`}>
                <LogOut size={20} />
              </div>
              <div className="flex-1 text-left">
                <p className={darkMode ? 'text-gray-200' : 'text-gray-800'}>Logout</p>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Sign out of your account</p>
              </div>
              <ChevronRight className={`${darkMode ? 'text-gray-500 group-hover:text-red-400' : 'text-gray-400 group-hover:text-red-600'}`} size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav 
        currentScreen="settings" 
        onNavigate={onNavigate}
        onAddNote={onAddNote}
        darkMode={darkMode}
      />

      {/* Change Password Dialog */}
      {showPasswordDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 w-full max-w-md shadow-xl`}>
            <h2 className={`${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Change Master Password</h2>
            <div className="space-y-4">
              <div>
                <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Current Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} border-2 rounded-xl focus:border-indigo-500 focus:outline-none transition-all`}
                />
              </div>
              <div>
                <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} border-2 rounded-xl focus:border-indigo-500 focus:outline-none transition-all`}
                />
              </div>
              <div>
                <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} border-2 rounded-xl focus:border-indigo-500 focus:outline-none transition-all`}
                />
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPasswordDialog(false);
                    setOldPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setPasswordError("");
                  }}
                  className={`flex-1 py-3 rounded-xl ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-all`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                >
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
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 w-full max-w-md shadow-xl`}>
            <h2 className={`${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Auto-Lock Timer</h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 text-sm`}>
              Choose how long the app stays unlocked before automatically locking
            </p>
            <div className="space-y-2">
              {timerOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleTimerChange(option.value)}
                  className={`w-full py-3 px-4 rounded-xl text-left transition-all ${
                    autoLockDuration === option.value
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                      : darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
              <button
                onClick={() => setShowCustomTimer(true)}
                className={`w-full py-3 px-4 rounded-xl text-left transition-all ${
                  darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Custom Timer
              </button>
            </div>
            <button
              onClick={() => setShowTimerDialog(false)}
              className={`w-full mt-4 py-3 rounded-xl ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-all`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Custom Timer Dialog */}
      {showCustomTimer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 w-full max-w-md shadow-xl`}>
            <h2 className={`${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Custom Auto-Lock Timer</h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 text-sm`}>
              Enter the duration in seconds
            </p>
            <div className="space-y-4">
              <div>
                <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Duration (seconds)</label>
                <input
                  type="number"
                  value={customTimerValue}
                  onChange={(e) => setCustomTimerValue(e.target.value)}
                  className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} border-2 rounded-xl focus:border-indigo-500 focus:outline-none transition-all`}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCustomTimer(false);
                    setCustomTimerValue("");
                  }}
                  className={`flex-1 py-3 rounded-xl ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-all`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const duration = parseInt(customTimerValue, 10);
                    if (!isNaN(duration) && duration > 0) {
                      handleTimerChange(duration);
                    } else {
                      alert("Please enter a valid duration in seconds.");
                    }
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