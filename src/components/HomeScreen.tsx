import { Lock, Plus, Download, Shield, Clock } from "lucide-react";
import { Note, Screen } from "../App";
import { useEffect, useState } from "react";
import { BottomNav } from "./BottomNav";

interface HomeScreenProps {
  notes: Note[];
  onAddNote: () => void;
  onViewNote: (noteId: string) => void;
  onNavigate: (screen: Screen) => void;
  autoLockTimer: number;
  setAutoLockTimer: (time: number) => void;
  onTimerExpire: () => void;
}

export function HomeScreen({ notes, onAddNote, onViewNote, onNavigate, autoLockTimer, setAutoLockTimer, onTimerExpire }: HomeScreenProps) {
  useEffect(() => {
    const timer = setInterval(() => {
      setAutoLockTimer(autoLockTimer > 0 ? autoLockTimer - 1 : 0);
      if (autoLockTimer === 1) {
        onTimerExpire();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [autoLockTimer, setAutoLockTimer, onTimerExpire]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Work":
        return "bg-blue-100 text-blue-700";
      case "Personal":
        return "bg-green-100 text-green-700";
      case "Password":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-95 flex flex-col h-[calc(100vh-2rem)] max-h-[800px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Shield className="text-black" size={20} />
            </div>
            <h1 className="text-white">WhisprVault</h1>
          </div>
          <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-2 rounded-lg">
            <Clock size={16} className="text-black" />
            <span className="text-black text-sm">{autoLockTimer}s</span>
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto custom-scrollbar">
        {notes.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-4">
              <Lock className="text-indigo-400" size={32} />
            </div>
            <p className="text-gray-600 mb-2">No notes yet</p>
            <p className="text-gray-400">Tap + to create your first encrypted note</p>
          </div>
        ) : (
          notes.map((note) => (
            <button
              key={note.id}
              onClick={() => onViewNote(note.id)}
              className="w-full bg-gradient-to-br from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-purple-50 rounded-2xl p-4 text-left transition-all hover:shadow-lg border-2 border-transparent hover:border-indigo-200 group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-white rounded-xl group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-600 transition-all shadow-sm">
                  <Lock className="text-indigo-500 group-hover:text-white" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-gray-800 truncate">{note.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs whitespace-nowrap ${getCategoryColor(note.category)}`}>
                      {note.category}
                    </span>
                  </div>
                  <p className="text-gray-500 truncate text-sm">{note.content}</p>
                  <p className="text-gray-400 mt-1 text-xs">
                    {note.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav 
        currentScreen="home" 
        onNavigate={onNavigate}
        onAddNote={onAddNote}
      />
    </div>
  );
}