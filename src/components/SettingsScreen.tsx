import { Download, Upload, Key, Clock, Info, FileText, ChevronRight, Shield } from "lucide-react";
import { useEffect } from "react";
import { Screen } from "../App";
import { BottomNav } from "./BottomNav";

interface SettingsScreenProps {
  onBack: () => void;
  onExportBackup: () => void;
  onImportBackup: () => void;
  onPrivacyPolicy: () => void;
  onNavigate: (screen: Screen) => void;
  autoLockTimer: number;
  setAutoLockTimer: (time: number) => void;
  onTimerExpire: () => void;
}

export function SettingsScreen({ onBack, onExportBackup, onImportBackup, onPrivacyPolicy, onNavigate, autoLockTimer, setAutoLockTimer, onTimerExpire }: SettingsScreenProps) {
  useEffect(() => {
    const timer = setInterval(() => {
      setAutoLockTimer(autoLockTimer > 0 ? autoLockTimer - 1 : 0);
      if (autoLockTimer === 1) {
        onTimerExpire();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [autoLockTimer, setAutoLockTimer, onTimerExpire]);

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-95 flex flex-col h-[calc(100vh-2rem)] max-h-[800px]">
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
          <h3 className="text-gray-600 mb-3 flex items-center gap-2">
            <Download size={16} />
            Backup & Restore
          </h3>
          <div className="space-y-2">
            <button
              onClick={onExportBackup}
              className="w-full bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-xl p-4 flex items-center gap-3 transition-all group border-2 border-blue-100 hover:border-blue-200"
            >
              <div className="p-2.5 bg-white text-blue-600 rounded-xl group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-cyan-500 group-hover:text-white transition-all shadow-sm">
                <Download size={20} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-800">Export Encrypted Backup</p>
                <p className="text-gray-500 text-sm">Save your vault to a file</p>
              </div>
              <ChevronRight className="text-gray-400 group-hover:text-blue-600" size={20} />
            </button>

            <button
              onClick={onImportBackup}
              className="w-full bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl p-4 flex items-center gap-3 transition-all group border-2 border-green-100 hover:border-green-200"
            >
              <div className="p-2.5 bg-white text-green-600 rounded-xl group-hover:bg-gradient-to-br group-hover:from-green-500 group-hover:to-emerald-500 group-hover:text-white transition-all shadow-sm">
                <Upload size={20} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-800">Import Encrypted Backup</p>
                <p className="text-gray-500 text-sm">Restore from a backup file</p>
              </div>
              <ChevronRight className="text-gray-400 group-hover:text-green-600" size={20} />
            </button>
          </div>
        </div>

        {/* Security */}
        <div>
          <h3 className="text-gray-600 mb-3 flex items-center gap-2">
            <Shield size={16} />
            Security
          </h3>
          <div className="space-y-2">
            <button className="w-full bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl p-4 flex items-center gap-3 transition-all group border-2 border-purple-100 hover:border-purple-200">
              <div className="p-2.5 bg-white text-purple-600 rounded-xl group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-pink-500 group-hover:text-white transition-all shadow-sm">
                <Key size={20} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-800">Change Master Password</p>
                <p className="text-gray-500 text-sm">Update your vault password</p>
              </div>
              <ChevronRight className="text-gray-400 group-hover:text-purple-600" size={20} />
            </button>

            <button className="w-full bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 rounded-xl p-4 flex items-center gap-3 transition-all group border-2 border-orange-100 hover:border-orange-200">
              <div className="p-2.5 bg-white text-orange-600 rounded-xl group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-amber-500 group-hover:text-white transition-all shadow-sm">
                <Clock size={20} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-800">Auto-Lock Timer</p>
                <p className="text-gray-500 text-sm">Currently: 30 seconds</p>
              </div>
              <ChevronRight className="text-gray-400 group-hover:text-orange-600" size={20} />
            </button>
          </div>
        </div>

        {/* About */}
        <div>
          <h3 className="text-gray-600 mb-3 flex items-center gap-2">
            <Info size={16} />
            About
          </h3>
          <div className="space-y-2">
            <div className="w-full bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 flex items-center gap-3 border-2 border-gray-100">
              <div className="p-2.5 bg-white text-gray-600 rounded-xl shadow-sm">
                <Info size={20} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-800">Version</p>
                <p className="text-gray-500 text-sm">1.0.0</p>
              </div>
            </div>

            <button 
              onClick={onPrivacyPolicy}
              className="w-full bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-xl p-4 flex items-center gap-3 transition-all group border-2 border-indigo-100 hover:border-indigo-200"
            >
              <div className="p-2.5 bg-white text-indigo-600 rounded-xl group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-500 group-hover:text-white transition-all shadow-sm">
                <FileText size={20} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-800">Privacy Policy</p>
                <p className="text-gray-500 text-sm">How we protect your data</p>
              </div>
              <ChevronRight className="text-gray-400 group-hover:text-indigo-600" size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav 
        currentScreen="settings" 
        onNavigate={onNavigate}
      />
    </div>
  );
}