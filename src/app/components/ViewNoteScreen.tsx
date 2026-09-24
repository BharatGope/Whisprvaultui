import { ArrowLeft, Edit, Trash2, Shield, FileText, Calendar, Link as LinkIcon, Paperclip, ExternalLink, Download, Clock, Image as ImageIcon, File } from "lucide-react";
import { useNavigate, useParams, Navigate } from "react-router";
import { useAppContext } from "../context/AppContext";
import { useAutoLock } from "../hooks/useAutoLock";

export function ViewNoteScreen() {
  const { notes, setNotes, darkMode } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const autoLock = useAutoLock();

  const note = notes.find((n) => n.id === id);
  if (!note) return <Navigate to="/home" replace />;

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

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this note?")) {
      setNotes(notes.filter((n) => n.id !== note.id));
      navigate("/home", { replace: true });
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon size={16} />;
    return <File size={16} />;
  };

  const handleDownloadAttachment = (attachment: { name: string; url: string; type: string }) => {
    const link = document.createElement("a");
    link.href = attachment.url;
    link.download = attachment.name;
    link.click();
  };

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
                <FileText className="text-black" size={18} />
              </div>
              <h1 className="text-white text-base sm:text-lg">Note Details</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white bg-opacity-20 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
            <Clock size={14} className="text-black" />
            {autoLock.display && (
              <span>{autoLock.display}</span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-3 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto custom-scrollbar">
        <div>
          <div className="flex items-start gap-2 mb-2 sm:mb-3">
            <h2 className={`${darkMode ? "text-gray-100" : "text-gray-800"} flex-1 break-words text-base sm:text-lg`}>{note.title}</h2>
            <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs whitespace-nowrap ${getCategoryColor(note.category)}`}>
              {note.category}
            </span>
          </div>
          <div className={`flex items-center gap-2 ${darkMode ? "text-gray-400" : "text-gray-500"} text-xs sm:text-sm`}>
            <Calendar size={12} />
            <span>
              {note.createdAt.toLocaleDateString()} at {note.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>

        <div className={`${darkMode ? "bg-gradient-to-br from-gray-700 to-gray-600 border-gray-600" : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200"} border-2 rounded-xl sm:rounded-2xl p-4 sm:p-5 min-h-[180px] sm:min-h-[200px]`}>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} whitespace-pre-wrap break-words leading-relaxed text-sm sm:text-base`}>{note.content}</p>
        </div>

        {note.links && note.links.length > 0 && (
          <div>
            <label className={`block ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2 flex items-center gap-2 text-sm`}>
              <LinkIcon size={14} className="text-indigo-500" />
              Links
            </label>
            <div className="space-y-2">
              {note.links.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 ${darkMode ? "bg-gradient-to-br from-blue-900 to-cyan-900 border-blue-800 hover:from-blue-800 hover:to-cyan-800" : "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100 hover:from-blue-100 hover:to-cyan-100"} border-2 rounded-lg sm:rounded-xl p-2.5 sm:p-3 transition-all group active:scale-[0.98]`}
                >
                  <LinkIcon size={14} className={`${darkMode ? "text-blue-400" : "text-blue-600"} flex-shrink-0`} />
                  <span className={`flex-1 ${darkMode ? "text-blue-300" : "text-blue-700"} truncate text-xs sm:text-sm`}>{link}</span>
                  <ExternalLink size={14} className={`${darkMode ? "text-blue-400" : "text-blue-600"} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </a>
              ))}
            </div>
          </div>
        )}

        {note.attachments && note.attachments.length > 0 && (
          <div>
            <label className={`block ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2 flex items-center gap-2 text-sm`}>
              <Paperclip size={14} className="text-indigo-500" />
              Attachments
            </label>
            <div className="space-y-2">
              {note.attachments.map((attachment, index) => (
                <div key={index} className={`flex items-center gap-2 ${darkMode ? "bg-gradient-to-br from-purple-900 to-pink-900 border-purple-800 hover:from-purple-800 hover:to-pink-800" : "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100 hover:from-purple-100 hover:to-pink-100"} border-2 rounded-lg sm:rounded-xl p-2.5 sm:p-3 transition-all group`}>
                  <div className={`${darkMode ? "text-purple-400" : "text-purple-600"} flex-shrink-0`}>{getFileIcon(attachment.type)}</div>
                  <span className={`flex-1 ${darkMode ? "text-purple-300" : "text-purple-700"} truncate text-xs sm:text-sm`}>{attachment.name}</span>
                  <button
                    onClick={() => handleDownloadAttachment(attachment)}
                    className={`p-1.5 ${darkMode ? "bg-gray-700 hover:bg-purple-900" : "bg-white hover:bg-purple-100"} rounded-lg transition-all opacity-0 group-hover:opacity-100 active:scale-95`}
                  >
                    <Download size={14} className={darkMode ? "text-purple-400" : "text-purple-600"} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={`flex items-center gap-2 ${darkMode ? "bg-gradient-to-br from-green-900 to-emerald-900 border-green-800" : "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"} border-2 rounded-lg sm:rounded-xl p-3 sm:p-4`}>
          <Shield className={`${darkMode ? "text-green-400" : "text-green-600"} flex-shrink-0`} size={18} />
          <p className={`${darkMode ? "text-green-300" : "text-green-700"} text-xs sm:text-sm`}>Note decrypted only in memory</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`p-3 sm:p-4 flex gap-2 sm:gap-3 border-t ${darkMode ? "border-gray-700" : "border-gray-100"} flex-shrink-0 safe-area-bottom`}>
        <button
          onClick={() => navigate(`/note/${note.id}/edit`)}
          className={`flex-1 ${darkMode ? "bg-gradient-to-br from-indigo-900 to-purple-900 text-indigo-300 hover:from-indigo-800 hover:to-purple-800 border-indigo-800" : "bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 hover:from-indigo-200 hover:to-purple-200 border-indigo-200"} py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-2 border-2 active:scale-95 text-sm sm:text-base min-h-[44px]`}
        >
          <Edit size={18} />
          <span>Edit</span>
        </button>
        <button
          onClick={handleDelete}
          className={`flex-1 ${darkMode ? "bg-gradient-to-br from-red-900 to-pink-900 text-red-300 hover:from-red-800 hover:to-pink-800 border-red-800" : "bg-gradient-to-br from-red-100 to-pink-100 text-red-600 hover:from-red-200 hover:to-pink-200 border-red-200"} py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-2 border-2 active:scale-95 text-sm sm:text-base min-h-[44px]`}
        >
          <Trash2 size={18} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
