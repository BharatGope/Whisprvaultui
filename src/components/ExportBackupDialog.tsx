import { Download, X } from "lucide-react";

interface ExportBackupDialogProps {
  onClose: () => void;
}

export function ExportBackupDialog({ onClose }: ExportBackupDialogProps) {
  const handleExport = () => {
    // In a real app, this would trigger the backup export
    alert("Backup exported successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Download className="text-black" size={20} />
            </div>
            <h2 className="text-white">Export Encrypted Backup</h2>
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
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-gray-700 mb-2">Your vault will be saved as:</p>
            <p className="text-blue-700 font-mono bg-white px-3 py-2 rounded-lg border border-blue-200">
              whisprvault_backup.svbackup
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-amber-800">
              ⚠️ Keep this backup file safe. It contains your encrypted notes.
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
              onClick={handleExport}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
            >
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
