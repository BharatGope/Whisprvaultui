import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Save, FileText, Lock, Briefcase, User, KeyRound, Link as LinkIcon, Paperclip, X, File, Image as ImageIcon, Clock, Plus } from "lucide-react";
import { Note } from "../App";

interface AddNoteScreenProps {
  note?: Note;
  onSave: (note: any) => void;
  onBack: () => void;
  autoLockTimer: number;
  setAutoLockTimer: (time: number) => void;
  onTimerExpire: () => void;
  darkMode?: boolean;
  customCategories?: string[];
  onAddCustomCategory?: (category: string) => void;
}

export function AddNoteScreen({ note, onSave, onBack, autoLockTimer, setAutoLockTimer, onTimerExpire, darkMode, customCategories = [], onAddCustomCategory }: AddNoteScreenProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [category, setCategory] = useState<string>(
    note?.category || "Personal"
  );
  const [links, setLinks] = useState<string[]>(note?.links || []);
  const [attachments, setAttachments] = useState<{ name: string; url: string; type: string }[]>(note?.attachments || []);
  const [newLink, setNewLink] = useState("");
  const [showCustomCategoryDialog, setShowCustomCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setAutoLockTimer(autoLockTimer > 0 ? autoLockTimer - 1 : 0);
      if (autoLockTimer === 1) {
        onTimerExpire();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [autoLockTimer, setAutoLockTimer, onTimerExpire]);

  const handleSave = () => {
    if (!title.trim()) return;

    if (note) {
      onSave({
        ...note,
        title,
        content,
        category,
        links,
        attachments,
      });
    } else {
      onSave({ title, content, category, links, attachments });
    }
  };

  const handleAddLink = () => {
    if (newLink.trim()) {
      setLinks([...links, newLink.trim()]);
      setNewLink("");
    }
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
          const newAttachment = {
            name: file.name,
            url: reader.result as string,
            type: file.type,
          };
          setAttachments([...attachments, newAttachment]);
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
    if (newCategoryName.trim() && onAddCustomCategory) {
      onAddCustomCategory(newCategoryName.trim());
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

  const allCategories = [...categories.map(c => c.value), ...customCategories];

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-95 flex flex-col h-[90vh] md:h-[85vh] max-h-[900px]`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
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
              <h1 className="text-white">{note ? "Edit Note" : "Add Note"}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white bg-opacity-20 px-2 sm:px-3 py-2 rounded-lg">
            <Clock size={16} className="text-black" />
            <span className="text-black text-sm">{autoLockTimer}s</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar">
        <div>
          <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center gap-2`}>
            <FileText size={16} className="text-indigo-500" />
            Title
          </label>
          <input
            type="text"
            placeholder="Enter note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200'} border-2 rounded-xl focus:border-indigo-500 focus:outline-none ${darkMode ? 'focus:bg-gray-600' : 'focus:bg-white'} transition-all`}
          />
        </div>

        <div>
          <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center gap-2`}>
            <Lock size={16} className="text-indigo-500" />
            Content
          </label>
          <textarea
            placeholder="Enter your encrypted note content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200'} border-2 rounded-xl focus:border-indigo-500 focus:outline-none ${darkMode ? 'focus:bg-gray-600' : 'focus:bg-white'} transition-all resize-none custom-scrollbar`}
          />
        </div>

        <div>
          <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>Category</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`py-2.5 sm:py-3 rounded-xl transition-all flex flex-col items-center gap-1 text-xs sm:text-sm ${
                    category === cat.value
                      ? `bg-gradient-to-r ${cat.color} text-white shadow-lg scale-105`
                      : darkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-xs">{cat.value}</span>
                </button>
              );
            })}
            {customCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`py-2.5 sm:py-3 rounded-xl transition-all flex flex-col items-center gap-1 text-xs sm:text-sm ${
                  category === cat
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105"
                    : darkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FileText size={18} />
                <span className="text-xs truncate max-w-full px-1">{cat}</span>
              </button>
            ))}
            <button
              onClick={() => setShowCustomCategoryDialog(true)}
              className={`py-2.5 sm:py-3 rounded-xl transition-all flex flex-col items-center gap-1 border-2 border-dashed text-xs sm:text-sm ${
                darkMode
                  ? "border-gray-600 text-gray-400 hover:border-indigo-500 hover:text-indigo-400 hover:bg-gray-700"
                  : "border-gray-300 text-gray-500 hover:border-indigo-500 hover:text-indigo-600 hover:bg-gray-50"
              }`}
            >
              <Plus size={18} />
              <span className="text-xs">Custom</span>
            </button>
          </div>
        </div>

        {/* Links Section */}
        <div>
          <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center gap-2`}>
            <LinkIcon size={16} className="text-indigo-500" />
            Links
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="url"
              placeholder="https://example.com"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddLink()}
              className={`flex-1 px-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200'} border-2 rounded-xl focus:border-indigo-500 focus:outline-none ${darkMode ? 'focus:bg-gray-600' : 'focus:bg-white'} transition-all`}
            />
            <button
              onClick={handleAddLink}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-md transition-all"
            >
              <LinkIcon size={20} />
            </button>
          </div>
          {links.length > 0 && (
            <div className="space-y-2">
              {links.map((link, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 ${darkMode ? 'bg-gradient-to-br from-blue-900 to-cyan-900 border-blue-800' : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100'} border-2 rounded-xl p-3`}
                >
                  <LinkIcon size={16} className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} flex-shrink-0`} />
                  <span className={`flex-1 ${darkMode ? 'text-blue-300' : 'text-blue-700'} truncate text-sm`}>{link}</span>
                  <button
                    onClick={() => handleRemoveLink(index)}
                    className={`p-1 ${darkMode ? 'hover:bg-red-900' : 'hover:bg-red-100'} rounded-lg transition-all`}
                  >
                    <X size={16} className="text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Attachments Section */}
        <div>
          <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center gap-2`}>
            <Paperclip size={16} className="text-indigo-500" />
            Attachments
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`w-full py-3 ${darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600 border-gray-600 text-gray-300 hover:border-indigo-500 hover:from-indigo-900 hover:to-purple-900 hover:text-indigo-300' : 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-300 text-gray-600 hover:border-indigo-400 hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600'} border-2 border-dashed rounded-xl transition-all flex items-center justify-center gap-2`}
          >
            <Paperclip size={20} />
            <span className="text-sm sm:text-base">Attach Photo or PDF</span>
          </button>
          {attachments.length > 0 && (
            <div className="space-y-2 mt-2">
              {attachments.map((attachment, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 ${darkMode ? 'bg-gradient-to-br from-purple-900 to-pink-900 border-purple-800' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100'} border-2 rounded-xl p-3`}
                >
                  <div className={`${darkMode ? 'text-purple-400' : 'text-purple-600'} flex-shrink-0`}>
                    {getFileIcon(attachment.type)}
                  </div>
                  <span className={`flex-1 ${darkMode ? 'text-purple-300' : 'text-purple-700'} truncate text-sm`}>{attachment.name}</span>
                  <button
                    onClick={() => handleRemoveAttachment(index)}
                    className={`p-1 ${darkMode ? 'hover:bg-red-900' : 'hover:bg-red-100'} rounded-lg transition-all`}
                  >
                    <X size={16} className="text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`${darkMode ? 'bg-gradient-to-br from-indigo-900 to-purple-900 border-indigo-800' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200'} border-2 rounded-xl p-4`}>
          <div className="flex items-start gap-3">
            <Lock className={`${darkMode ? 'text-indigo-400' : 'text-indigo-600'} mt-0.5`} size={18} />
            <p className={`${darkMode ? 'text-indigo-300' : 'text-indigo-700'} text-sm`}>
              Your note, links, and attachments will be encrypted and stored securely in your vault.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <button
          onClick={handleSave}
          disabled={!title.trim()}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3.5 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          <Save size={20} />
          <span>Save Note</span>
        </button>
      </div>

      {/* Custom Category Dialog */}
      {showCustomCategoryDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 w-full max-w-sm shadow-xl`}>
            <h2 className={`${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Add Custom Category</h2>
            <input
              type="text"
              placeholder="Category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCustomCategory()}
              className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} border-2 rounded-xl focus:border-indigo-500 focus:outline-none transition-all mb-4`}
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCustomCategoryDialog(false);
                  setNewCategoryName("");
                }}
                className={`flex-1 py-3 rounded-xl ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-all`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomCategory}
                disabled={!newCategoryName.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
