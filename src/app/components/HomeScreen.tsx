import { Lock, Shield, Clock } from "lucide-react";
import { useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";
import { useAutoLock } from "../hooks/useAutoLock";
import { BottomNav } from "./BottomNav";

export function HomeScreen() {
  const { notes, darkMode } = useAppContext();
  const navigate = useNavigate();
  const autoLock = useAutoLock();

  const getCategoryColor = (category: string) => {
    if (darkMode) {
      switch (category) {
        case "Work": return "bg-blue-900 text-blue-300";
        case "Personal": return "bg-green-900 text-green-300";
        case "Password": return "bg-purple-900 text-purple-300";
        default: return "bg-gray-700 text-gray-300";
      }
    }
    switch (category) {
      case "Work": return "bg-blue-100 text-blue-700";
      case "Personal": return "bg-green-100 text-green-700";
      case "Password": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl sm:rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-95 flex flex-col h-full`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-3 sm:px-6 py-3 sm:py-5 flex-shrink-0">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-white bg-opacity-20 rounded-lg">
              <Shield className="text-black" size={18} />
            </div>
            <h1 className="text-white text-base sm:text-lg">WhisprVault</h1>
          </div>
          {autoLock.display && (
            <div className="flex items-center gap-2 bg-white bg-opacity-20 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
              <Clock size={14} className="text-black" />
              <span>{autoLock.display}</span>
            </div>
          )}
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 p-3 sm:p-4 space-y-2 sm:space-y-3 overflow-y-auto custom-scrollbar">
        {notes.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-3 sm:mb-4">
              <Lock className="text-indigo-400" size={28} />
            </div>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-2 text-sm sm:text-base`}>No notes yet</p>
            <p className={`${darkMode ? "text-gray-500" : "text-gray-400"} text-xs sm:text-sm`}>Tap + to create your first encrypted note</p>
          </div>
        ) : (
          notes.map((note) => (
            <button
              key={note.id}
              onClick={() => navigate(`/note/${note.id}`)}
              className={`w-full ${darkMode ? "bg-gradient-to-br from-gray-700 to-gray-600 hover:from-indigo-900 hover:to-purple-900 border-gray-600 hover:border-indigo-700" : "bg-gradient-to-br from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-purple-50 border-transparent hover:border-indigo-200"} rounded-xl sm:rounded-2xl p-3 sm:p-4 text-left transition-all hover:shadow-lg border-2 group active:scale-[0.98]`}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <div className={`p-2 sm:p-2.5 ${darkMode ? "bg-gray-600" : "bg-white"} rounded-lg sm:rounded-xl group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-600 transition-all shadow-sm`}>
                  <Lock className={`${darkMode ? "text-indigo-400" : "text-indigo-500"} group-hover:text-white`} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`${darkMode ? "text-gray-100" : "text-gray-800"} truncate text-sm sm:text-base`}>{note.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs whitespace-nowrap ${getCategoryColor(note.category)}`}>
                      {note.category}
                    </span>
                  </div>
                  <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} truncate text-xs sm:text-sm`}>{note.content}</p>
                  <p className={`${darkMode ? "text-gray-500" : "text-gray-400"} mt-1 text-xs`}>
                    {note.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
