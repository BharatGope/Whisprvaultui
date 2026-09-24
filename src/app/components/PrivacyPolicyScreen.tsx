import { ArrowLeft, Shield, Lock, Eye, Database, Server, Clock } from "lucide-react";
import { useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";
import { useAutoLock } from "../hooks/useAutoLock";
import { BottomNav } from "./BottomNav";

export function PrivacyPolicyScreen() {
  const { darkMode } = useAppContext();
  const navigate = useNavigate();
  const autoLockTimer = useAutoLock();

  return (
    <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl sm:rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-95 flex flex-col h-full`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-3 sm:px-6 py-3 sm:py-5 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 sm:p-2 bg-white bg-opacity-20 rounded-lg sm:rounded-xl hover:bg-opacity-30 transition-all active:scale-95"
            >
              <ArrowLeft className="text-black" size={18} />
            </button>
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 bg-white bg-opacity-20 rounded-lg">
                <Shield className="text-black" size={18} />
              </div>
              <h1 className="text-white text-base sm:text-lg">Privacy Policy</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white bg-opacity-20 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
            <Clock size={14} className="text-black" />
            <span className="text-black text-xs sm:text-sm">{autoLockTimer}s</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto custom-scrollbar">
        <div className={`${darkMode ? "bg-gradient-to-br from-indigo-900 to-purple-900 border-indigo-800" : "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200"} border-2 rounded-2xl p-5`}>
          <div className="flex items-start gap-3 mb-3">
            <Shield className={`${darkMode ? "text-indigo-400" : "text-indigo-600"} flex-shrink-0 mt-1`} size={24} />
            <div>
              <h2 className={`${darkMode ? "text-gray-100" : "text-gray-800"} mb-2`}>Your Privacy Matters</h2>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} leading-relaxed`}>
                WhisprVault is designed with privacy at its core. We believe your notes belong to you and only you.
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Database className="text-indigo-500" size={20} />
            <h3 className={darkMode ? "text-gray-200" : "text-gray-800"}>Data Collection</h3>
          </div>
          <div className={`${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"} rounded-xl p-4 border-2`}>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed mb-3`}>
              <strong>We collect ZERO personal data.</strong> WhisprVault operates entirely offline on your device.
            </p>
            <ul className={`space-y-2 ${darkMode ? "text-gray-400" : "text-gray-600"} ml-4`}>
              {["No account registration required", "No analytics or tracking", "No third-party services"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lock className="text-indigo-500" size={20} />
            <h3 className={darkMode ? "text-gray-200" : "text-gray-800"}>Encryption</h3>
          </div>
          <div className={`${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"} rounded-xl p-4 border-2`}>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed mb-3`}>
              All your notes are encrypted using industry-standard encryption algorithms.
            </p>
            <ul className={`space-y-2 ${darkMode ? "text-gray-400" : "text-gray-600"} ml-4`}>
              {["AES-256 encryption for all notes", "Master password never leaves your device", "Notes decrypted only in memory when viewed"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Server className="text-indigo-500" size={20} />
            <h3 className={darkMode ? "text-gray-200" : "text-gray-800"}>Local Storage</h3>
          </div>
          <div className={`${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"} rounded-xl p-4 border-2`}>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed`}>
              All data is stored locally on your device. We have no servers, no cloud storage, and no way to access your notes. If you lose your master password, we cannot help you recover your data — this is by design to ensure maximum security.
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Eye className="text-indigo-500" size={20} />
            <h3 className={darkMode ? "text-gray-200" : "text-gray-800"}>{"What We Don't Do"}</h3>
          </div>
          <div className={`${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"} rounded-xl p-4 border-2`}>
            <ul className={`space-y-2 ${darkMode ? "text-gray-400" : "text-gray-600"} ml-4`}>
              {["We don't sell your data", "We don't share your data with anyone", "We don't use cookies or trackers", "We don't send your data to any server"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`${darkMode ? "bg-gradient-to-br from-amber-900 to-orange-900 border-amber-800" : "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200"} border-2 rounded-2xl p-5`}>
          <h3 className={`${darkMode ? "text-gray-200" : "text-gray-800"} mb-2 flex items-center gap-2`}>
            <span>⚠️</span>
            Your Responsibility
          </h3>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed`}>
            Since everything is stored locally and encrypted, you are responsible for:
          </p>
          <ul className={`mt-3 space-y-2 ${darkMode ? "text-gray-400" : "text-gray-600"} ml-4`}>
            {["Keeping your master password secure", "Creating regular backups", "Storing backup files safely"].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center py-4">
          <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-sm`}>Last updated: November 23, 2024</p>
          <p className={`${darkMode ? "text-gray-500" : "text-gray-400"} text-sm mt-2`}>WhisprVault v1.0.0</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
