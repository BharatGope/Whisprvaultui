import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Save, FileText, Lock, Briefcase, User, KeyRound, Link as LinkIcon, Paperclip, X, File, Image as ImageIcon, Clock } from "lucide-react";
import { Note } from "../App";

interface AddNoteScreenProps {
  note?: Note;
  onSave: (note: any) => void;
  onBack: () => void;
  autoLockTimer: number;
  setAutoLockTimer: (time: number) => void;
  onTimerExpire: () => void;
}

export function AddNoteScreen({ note, onSave, onBack, autoLockTimer, setAutoLockTimer, onTimerExpire }: AddNoteScreenProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [category, setCategory] = useState<"Personal" | "Work" | "Password">(
    note?.category || "Personal"
  );
  const [links, setLinks] = useState<string[]>(note?.links || []);
  const [attachments, setAttachments] = useState<{ name: string; url: string; type: string }[]>(note?.attachments || []);
  const [newLink, setNewLink] = useState("");
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

  const categories = [
    { value: "Personal" as const, icon: User, color: "from-green-500 to-emerald-600" },
    { value: "Work" as const, icon: Briefcase, color: "from-blue-500 to-cyan-600" },
    { value: "Password" as const, icon: KeyRound, color: "from-purple-500 to-pink-600" },
  ];

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
              <h1 className="text-white">{note ? "Edit Note" : "Add Note"}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-2 rounded-lg">
            <Clock size={16} className="text-black" />
            <span className="text-black text-sm">{autoLockTimer}s</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto custom-scrollbar">
        <div>
          <label className="block text-gray-700 mb-2 flex items-center gap-2">
            <FileText size={16} className="text-indigo-500" />
            Title
          </label>
          <input
            type="text"
            placeholder="Enter note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2 flex items-center gap-2">
            <Lock size={16} className="text-indigo-500" />
            Content
          </label>
          <textarea
            placeholder="Enter your encrypted note content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none focus:bg-white transition-all resize-none custom-scrollbar"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-3">Category</label>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`py-3 rounded-xl transition-all flex flex-col items-center gap-1 ${
                    category === cat.value
                      ? `bg-gradient-to-r ${cat.color} text-white shadow-lg scale-105`
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs">{cat.value}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Links Section */}
        <div>
          <label className="block text-gray-700 mb-2 flex items-center gap-2">
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
              className="flex-1 px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none focus:bg-white transition-all"
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
                  className="flex items-center gap-2 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100 rounded-xl p-3"
                >
                  <LinkIcon size={16} className="text-blue-600 flex-shrink-0" />
                  <span className="flex-1 text-blue-700 truncate text-sm">{link}</span>
                  <button
                    onClick={() => handleRemoveLink(index)}
                    className="p-1 hover:bg-red-100 rounded-lg transition-all"
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
          <label className="block text-gray-700 mb-2 flex items-center gap-2">
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
            className="w-full py-3 bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-400 hover:from-indigo-50 hover:to-purple-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-indigo-600"
          >
            <Paperclip size={20} />
            <span>Attach Photo or PDF</span>
          </button>
          {attachments.length > 0 && (
            <div className="space-y-2 mt-2">
              {attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100 rounded-xl p-3"
                >
                  <div className="text-purple-600 flex-shrink-0">
                    {getFileIcon(attachment.type)}
                  </div>
                  <span className="flex-1 text-purple-700 truncate text-sm">{attachment.name}</span>
                  <button
                    onClick={() => handleRemoveAttachment(index)}
                    className="p-1 hover:bg-red-100 rounded-lg transition-all"
                  >
                    <X size={16} className="text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Lock className="text-indigo-600 mt-0.5" size={18} />
            <p className="text-indigo-700 text-sm">
              Your note, links, and attachments will be encrypted and stored securely in your vault.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleSave}
          disabled={!title.trim()}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3.5 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          <Save size={20} />
          <span>Save Note</span>
        </button>
      </div>
    </div>
  );
}
