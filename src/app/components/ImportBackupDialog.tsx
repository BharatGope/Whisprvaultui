import { useState } from "react";
import { Upload, X, FileUp, Eye, EyeOff } from "lucide-react";

interface ImportBackupDialogProps {
  onClose: () => void;
}

export function ImportBackupDialog({ onClose }: ImportBackupDialogProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleFileSelect = () => {
    // Simulate file selection
    setSelectedFile("whisprvault_backup.svbackup");
  };

  const handleRestore = () => {
    if (!selectedFile || !password) {
      alert("Please select a file and enter your password");
      return;
    }
    // In a real app, this would restore the backup
    alert("Backup restored successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Upload className="text-black" size={20} />
            </div>
            <h2 className="text-white">Import Backup</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all"
          >
            <X className="text-black" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Backup File</label>
            {selectedFile ? (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3">
                <FileUp className="text-green-600" size={24} />
                <div className="flex-1">
                  <p className="text-green-800 font-mono">{selectedFile}</p>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleFileSelect}
                className="w-full border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-8 hover:border-indigo-400 hover:bg-indigo-50 transition-all group"
              >
                <FileUp className="mx-auto text-gray-400 group-hover:text-indigo-500 mb-2" size={32} />
                <p className="text-gray-600 group-hover:text-indigo-600">Click to select backup file</p>
              </button>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Master Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-amber-800">
              ⚠️ This will replace your current vault with the backup data.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleRestore}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
            >
              Restore
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
