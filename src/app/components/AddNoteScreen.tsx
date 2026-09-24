import { useState, useRef } from "react";
import { ArrowLeft, Save, FileText, Lock, Briefcase, User, KeyRound, Link as LinkIcon, Paperclip, X, File, Image as ImageIcon, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useAppContext } from "../context/AppContext";
import type { Note } from "../types";

export function AddNoteScreen() {
  const { notes, setNotes, darkMode, autoLockDuration, setAutoLockTimer, customCategories, setCustomCategories } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
const existingNote = id ? notes.find((n) => n.id === id) : undefined;

  const [title, setTitle] = useState(existingNote?.title || "");
  const [content, setContent] = useState(existingNote?.content || "");
  const [category, setCategory] = useState<string>(existingNote?.category || "Personal");
  const [links, setLinks] = useState<string[]>(existingNote?.links || []);
  const [attachments, setAttachments] = useState<{ name: string; url: string; type: string }[]>(existingNote?.attachments || []);
  const [newLink, setNewLink] = useState("");
  const [showCustomCategoryDialog, setShowCustomCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (!title.trim()) return;

    if (existingNote) {
      const updated: Note = { ...existingNote, title, content, category: category as Note["category"], links, attachments };
      setNotes(notes.map((n) => n.id === updated.id ? updated : n));
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title,
        content,
        category: category as Note["category"],
        createdAt: new Date(),
        links,
        attachments,
      };
      setNotes([newNote, ...notes]);
    }
    setAutoLockTimer(autoLockDuration);
    navigate(-1);
  };

  const handleAddLink = () => {
    if (newLink.trim()) { setLinks([...links, newLink.trim()]); setNewLink(""); }
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAttachments((prev) => [...prev, { name: file.name, url: reader.result as string, type: file.type }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon size={16} />;
    return <File size={16} />;
  };

  const handleAddCustomCategory = () => {
    if (newCategoryName.trim()) {
      setCustomCategories([...customCategories, newCategoryName.trim()]);
      setCategory(newCategoryName.trim());
      setNewCategoryName("");
      setShowCustomCategoryDialog(false);
    }
  };

  const categories = [
    { value: "Personal" as const, icon: User, color: "from-green-500 to-emerald-600" },
    { value: "Work" as const, icon: Briefcase, color: "from-blue-500 to-cyan-600" },
    { value: "Password" as const, icon: KeyRound, color: "from-purple-500 to-pink-600" },
  ];

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
              <h1 className="text-white text-base sm:text-lg">{existingNote ? "Edit Note" : "Add Note"}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 p-3 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto custom-scrollbar">
        <div>
          <label className={`block ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2 flex items-center gap-2 text-sm`}>
            <FileText size={14} className="text-indigo-500" />
            Title
          </label>
          <input
            type="text"
            placeholder="Enter note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-200"} border-2 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:outline-none ${darkMode ? "focus:bg-gray-600" : "focus:bg-white"} transition-all text-sm sm:text-base`}
          />
        </div>

        <div>
          <label className={`block ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2 flex items-center gap-2 text-sm`}>
            <Lock size={14} className="text-indigo-500" />
            Content
          </label>
          <textarea
            placeholder="Enter your encrypted note content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-200"} border-2 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:outline-none ${darkMode ? "focus:bg-gray-600" : "focus:bg-white"} transition-all resize-none custom-scrollbar text-sm sm:text-base`}
          />
        </div>

        <div>
          <label className={`block ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2 sm:mb-3 text-sm`}>Category</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all flex flex-col items-center gap-1 text-xs active:scale-95 min-h-[3.5rem] ${
                    category === cat.value
                      ? `bg-gradient-to-r ${cat.color} text-white shadow-lg scale-105`
                      : darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-xs">{cat.value}</span>
                </button>
              );
            })}
            {customCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all flex flex-col items-center gap-1 text-xs active:scale-95 min-h-[3.5rem] ${
                  category === cat
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105"
                    : darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FileText size={16} />
                <span className="text-xs truncate max-w-full px-1">{cat}</span>
              </button>
            ))}
            <button
              onClick={() => setShowCustomCategoryDialog(true)}
              className={`py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all flex flex-col items-center gap-1 border-2 border-dashed text-xs active:scale-95 min-h-[3.5rem] ${
                darkMode
                  ? "border-gray-600 text-gray-400 hover:border-indigo-500 hover:text-indigo-400 hover:bg-gray-700"
                  : "border-gray-300 text-gray-500 hover:border-indigo-500 hover:text-indigo-600 hover:bg-gray-50"
              }`}
            >
              <Plus size={16} />
              <span className="text-xs">Custom</span>
            </button>
          </div>
        </div>

        {/* Links */}
        <div>
          <label className={`block ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2 flex items-center gap-2 text-sm`}>
            <LinkIcon size={14} className="text-indigo-500" />
            Links
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="url"
              placeholder="https://example.com"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddLink()}
              className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-200"} border-2 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:outline-none ${darkMode ? "focus:bg-gray-600" : "focus:bg-white"} transition-all text-sm`}
            />
            <button
              onClick={handleAddLink}
              className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg sm:rounded-xl hover:shadow-md transition-all active:scale-95"
            >
              <LinkIcon size={18} />
            </button>
          </div>
          {links.length > 0 && (
            <div className="space-y-2">
              {links.map((link, index) => (
                <div key={index} className={`flex items-center gap-2 ${darkMode ? "bg-gradient-to-br from-blue-900 to-cyan-900 border-blue-800" : "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100"} border-2 rounded-lg sm:rounded-xl p-2.5 sm:p-3`}>
                  <LinkIcon size={14} className={`${darkMode ? "text-blue-400" : "text-blue-600"} flex-shrink-0`} />
                  <span className={`flex-1 ${darkMode ? "text-blue-300" : "text-blue-700"} truncate text-xs sm:text-sm`}>{link}</span>
                  <button onClick={() => handleRemoveLink(index)} className={`p-1 ${darkMode ? "hover:bg-red-900" : "hover:bg-red-100"} rounded-lg transition-all active:scale-95`}>
                    <X size={14} className="text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Attachments */}
        <div>
          <label className={`block ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2 flex items-center gap-2 text-sm`}>
            <Paperclip size={14} className="text-indigo-500" />
            Attachments
          </label>
          <input ref={fileInputRef} type="file" accept="image/*,.pdf" multiple onChange={handleFileSelect} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`w-full py-2.5 sm:py-3 ${darkMode ? "bg-gradient-to-br from-gray-700 to-gray-600 border-gray-600 text-gray-300 hover:border-indigo-500 hover:from-indigo-900 hover:to-purple-900 hover:text-indigo-300" : "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-300 text-gray-600 hover:border-indigo-400 hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600"} border-2 border-dashed rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] text-sm`}
          >
            <Paperclip size={18} />
            <span>Attach Photo or PDF</span>
          </button>
          {attachments.length > 0 && (
            <div className="space-y-2 mt-2">
              {attachments.map((attachment, index) => (
                <div key={index} className={`flex items-center gap-2 ${darkMode ? "bg-gradient-to-br from-purple-900 to-pink-900 border-purple-800" : "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100"} border-2 rounded-lg sm:rounded-xl p-2.5 sm:p-3`}>
                  <div className={`${darkMode ? "text-purple-400" : "text-purple-600"} flex-shrink-0`}>{getFileIcon(attachment.type)}</div>
                  <span className={`flex-1 ${darkMode ? "text-purple-300" : "text-purple-700"} truncate text-xs sm:text-sm`}>{attachment.name}</span>
                  <button onClick={() => handleRemoveAttachment(index)} className={`p-1 ${darkMode ? "hover:bg-red-900" : "hover:bg-red-100"} rounded-lg transition-all active:scale-95`}>
                    <X size={14} className="text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`${darkMode ? "bg-gradient-to-br from-indigo-900 to-purple-900 border-indigo-800" : "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200"} border-2 rounded-lg sm:rounded-xl p-3 sm:p-4`}>
          <div className="flex items-start gap-2 sm:gap-3">
            <Lock className={`${darkMode ? "text-indigo-400" : "text-indigo-600"} mt-0.5 flex-shrink-0`} size={16} />
            <p className={`${darkMode ? "text-indigo-300" : "text-indigo-700"} text-xs sm:text-sm`}>
              Your note, links, and attachments will be encrypted and stored securely in your vault.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className={`p-3 sm:p-4 border-t ${darkMode ? "border-gray-700" : "border-gray-100"} flex-shrink-0 safe-area-bottom`}>
        <button
          onClick={handleSave}
          disabled={!title.trim()}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 sm:py-3.5 rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-sm sm:text-base min-h-[44px]"
        >
          <Save size={18} />
          <span>Save Note</span>
        </button>
      </div>

      {/* Custom Category Dialog */}
      {showCustomCategoryDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-sm shadow-xl`}>
            <h2 className={`${darkMode ? "text-white" : "text-gray-800"} mb-3 sm:mb-4 text-base sm:text-lg`}>Add Custom Category</h2>
            <input
              type="text"
              placeholder="Category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCustomCategory()}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"} border-2 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:outline-none transition-all mb-3 sm:mb-4 text-sm sm:text-base`}
              autoFocus
            />
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => { setShowCustomCategoryDialog(false); setNewCategoryName(""); }}
                className={`flex-1 py-2.5 sm:py-3 rounded-lg sm:rounded-xl ${darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"} transition-all text-sm sm:text-base min-h-[44px]`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomCategory}
                disabled={!newCategoryName.trim()}
                className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[44px]"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

