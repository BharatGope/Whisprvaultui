import { ArrowLeft, Shield, Lock, Eye, Database, Server, Clock } from "lucide-react";
import { useEffect } from "react";
import { Screen } from "../App";
import { BottomNav } from "./BottomNav";

interface PrivacyPolicyScreenProps {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
  autoLockTimer: number;
  setAutoLockTimer: (time: number) => void;
  onTimerExpire: () => void;
}

export function PrivacyPolicyScreen({ onBack, onNavigate, autoLockTimer, setAutoLockTimer, onTimerExpire }: PrivacyPolicyScreenProps) {
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
            <button
              onClick={onBack}
              className="p-2 bg-white bg-opacity-20 rounded-xl hover:bg-opacity-30 transition-all"
            >
              <ArrowLeft className="text-black" size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <Shield className="text-black" size={20} />
              </div>
              <h1 className="text-white">Privacy Policy</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-2 rounded-lg">
            <Clock size={16} className="text-black" />
            <span className="text-black text-sm">{autoLockTimer}s</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
        {/* Introduction */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-5">
          <div className="flex items-start gap-3 mb-3">
            <Shield className="text-indigo-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h2 className="text-gray-800 mb-2">Your Privacy Matters</h2>
              <p className="text-gray-600 leading-relaxed">
                WhisprVault is designed with privacy at its core. We believe your notes belong to you and only you.
              </p>
            </div>
          </div>
        </div>

        {/* Data Collection */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Database className="text-indigo-500" size={20} />
            <h3 className="text-gray-800">Data Collection</h3>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong>We collect ZERO personal data.</strong> WhisprVault operates entirely offline on your device.
            </p>
            <ul className="space-y-2 text-gray-600 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>No account registration required</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>No analytics or tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>No third-party services</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Encryption */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lock className="text-indigo-500" size={20} />
            <h3 className="text-gray-800">Encryption</h3>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
            <p className="text-gray-700 leading-relaxed mb-3">
              All your notes are encrypted using industry-standard encryption algorithms.
            </p>
            <ul className="space-y-2 text-gray-600 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span>AES-256 encryption for all notes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span>Master password never leaves your device</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span>Notes decrypted only in memory when viewed</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Local Storage */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Server className="text-indigo-500" size={20} />
            <h3 className="text-gray-800">Local Storage</h3>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
            <p className="text-gray-700 leading-relaxed">
              All data is stored locally on your device. We have no servers, no cloud storage, and no way to access your notes. If you lose your master password, we cannot help you recover your data - this is by design to ensure maximum security.
            </p>
          </div>
        </div>

        {/* What We Don't Do */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Eye className="text-indigo-500" size={20} />
            <h3 className="text-gray-800">What We Don't Do</h3>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
            <ul className="space-y-2 text-gray-600 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>We don't sell your data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>We don't share your data with anyone</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>We don't use cookies or trackers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>We don't send your data to any server</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Your Responsibility */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-5">
          <h3 className="text-gray-800 mb-2 flex items-center gap-2">
            <span>⚠️</span>
            Your Responsibility
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Since everything is stored locally and encrypted, you are responsible for:
          </p>
          <ul className="mt-3 space-y-2 text-gray-600 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-1">•</span>
              <span>Keeping your master password secure</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-1">•</span>
              <span>Creating regular backups</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-1">•</span>
              <span>Storing backup files safely</span>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">Last updated: November 23, 2024</p>
          <p className="text-gray-400 text-sm mt-2">WhisprVault v1.0.0</p>
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