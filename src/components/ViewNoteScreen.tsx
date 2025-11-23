import { useEffect } from "react";
import { ArrowLeft, Edit, Trash2, Shield, FileText, Calendar, Link as LinkIcon, Paperclip, ExternalLink, Download, Clock, Image as ImageIcon, File } from "lucide-react";
import { Note } from "../App";

interface ViewNoteScreenProps {
  note: Note;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  autoLockTimer: number;
  setAutoLockTimer: (time: number) => void;
  onTimerExpire: () => void;
}

export function ViewNoteScreen({ note, onBack, onEdit, onDelete, autoLockTimer, setAutoLockTimer, onTimerExpire }: ViewNoteScreenProps) {
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

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this note?")) {
      onDelete();
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
                <FileText className="text-black" size={20} />
              </div>
              <h1 className="text-white">Note Details</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-2 rounded-lg">
            <Clock size={16} className="text-black" />
            <span className="text-black text-sm">{autoLockTimer}s</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto custom-scrollbar">
        <div>
          <div className="flex items-start gap-2 mb-3">
            <h2 className="text-gray-800 flex-1 break-words">{note.title}</h2>
            <span className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${getCategoryColor(note.category)}`}>
              {note.category}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Calendar size={14} />
            <span>
              {note.createdAt.toLocaleDateString()} at {note.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-5 min-h-[200px]">
          <p className="text-gray-700 whitespace-pre-wrap break-words leading-relaxed">{note.content}</p>
        </div>

        {/* Links Section */}
        {note.links && note.links.length > 0 && (
          <div>
            <label className="block text-gray-700 mb-2 flex items-center gap-2">
              <LinkIcon size={16} className="text-indigo-500" />
              Links
            </label>
            <div className="space-y-2">
              {note.links.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100 rounded-xl p-3 hover:from-blue-100 hover:to-cyan-100 transition-all group"
                >
                  <LinkIcon size={16} className="text-blue-600 flex-shrink-0" />
                  <span className="flex-1 text-blue-700 truncate text-sm">{link}</span>
                  <ExternalLink size={16} className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Attachments Section */}
        {note.attachments && note.attachments.length > 0 && (
          <div>
            <label className="block text-gray-700 mb-2 flex items-center gap-2">
              <Paperclip size={16} className="text-indigo-500" />
              Attachments
            </label>
            <div className="space-y-2">
              {note.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100 rounded-xl p-3 hover:from-purple-100 hover:to-pink-100 transition-all group"
                >
                  <div className="text-purple-600 flex-shrink-0">
                    {getFileIcon(attachment.type)}
                  </div>
                  <span className="flex-1 text-purple-700 truncate text-sm">{attachment.name}</span>
                  <button
                    onClick={() => handleDownloadAttachment(attachment)}
                    className="p-1.5 bg-white rounded-lg hover:bg-purple-100 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Download size={16} className="text-purple-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
          <Shield className="text-green-600 flex-shrink-0" size={20} />
          <p className="text-green-700 text-sm">Note decrypted only in memory</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 flex gap-3 border-t border-gray-100">
        <button
          onClick={onEdit}
          className="flex-1 bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 py-3.5 rounded-xl hover:from-indigo-200 hover:to-purple-200 transition-all flex items-center justify-center gap-2 border-2 border-indigo-200"
        >
          <Edit size={20} />
          <span>Edit</span>
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 bg-gradient-to-br from-red-100 to-pink-100 text-red-600 py-3.5 rounded-xl hover:from-red-200 hover:to-pink-200 transition-all flex items-center justify-center gap-2 border-2 border-red-200"
        >
          <Trash2 size={20} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
