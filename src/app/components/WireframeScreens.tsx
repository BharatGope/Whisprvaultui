import { Lock } from "lucide-react";

const SCREEN_WIDTH = 412;
const SCREEN_HEIGHT = 892;

// Reusable wireframe components
const WireframeScreen = ({ children, title }: { children: React.ReactNode; title: string }) => (
  <div className="flex flex-col items-center">
    <div 
      className="bg-white border-4 border-black relative overflow-hidden"
      style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
    >
      {children}
    </div>
    <p className="mt-2 text-center text-gray-700">{title}</p>
  </div>
);

const WireframeInput = ({ placeholder, type = "text" }: { placeholder: string; type?: string }) => (
  <div className="w-full border-2 border-gray-400 bg-white px-4 py-3 mb-3">
    <span className="text-gray-500">{placeholder}</span>
  </div>
);

const WireframeButton = ({ children, variant = "primary" }: { children: React.ReactNode; variant?: "primary" | "secondary" }) => (
  <button 
    className={`w-full border-2 py-3 ${
      variant === "primary" 
        ? "bg-black text-white border-black" 
        : "bg-white text-black border-gray-400"
    }`}
  >
    {children}
  </button>
);

const WireframeHeader = ({ title, leftButton, rightButton }: { title: string; leftButton?: React.ReactNode; rightButton?: React.ReactNode }) => (
  <div className="w-full border-b-2 border-gray-300 bg-gray-100 px-4 py-4 flex items-center justify-between">
    <div className="w-12">{leftButton}</div>
    <span className="text-center">{title}</span>
    <div className="w-12">{rightButton}</div>
  </div>
);

// Screen 1: Set Master Password
const SetMasterPasswordScreen = () => (
  <WireframeScreen title="1. Set Master Password">
    <div className="w-full h-full flex flex-col p-6">
      <div className="text-center mb-12 mt-8">
        <h1 className="mb-2">WhisprVault</h1>
      </div>
      
      <div className="flex-1">
        <h2 className="mb-6">Create Your Master Password</h2>
        
        <WireframeInput placeholder="Password" type="password" />
        <WireframeInput placeholder="Confirm Password" type="password" />
        
        <div className="bg-gray-100 border border-gray-300 p-3 mb-6 text-gray-600">
          <p>This password unlocks your vault and cannot be recovered.</p>
        </div>
      </div>
      
      <WireframeButton variant="primary">Continue</WireframeButton>
    </div>
  </WireframeScreen>
);

// Screen 2: Unlock Screen
const UnlockScreen = () => (
  <WireframeScreen title="2. Unlock Screen">
    <div className="w-full h-full flex flex-col p-6">
      <div className="text-center mb-12 mt-8">
        <h1 className="mb-2">WhisprVault</h1>
      </div>
      
      <div className="flex-1">
        <h2 className="mb-6">Enter Master Password</h2>
        
        <WireframeInput placeholder="Password" type="password" />
        
        <WireframeButton variant="primary">Unlock Vault</WireframeButton>
        
        <div className="mt-6 text-center">
          <span className="text-gray-400">Use Fingerprint (coming soon)</span>
        </div>
      </div>
    </div>
  </WireframeScreen>
);

// Screen 3: Home Screen (Notes List)
const HomeScreen = () => (
  <WireframeScreen title="3. Home Screen (Notes List)">
    <div className="w-full h-full flex flex-col">
      <WireframeHeader title="WhisprVault" />
      
      <div className="p-4 flex gap-2 border-b-2 border-gray-200">
        <button className="flex-1 bg-black text-white border-2 border-black py-2">+ Add Note</button>
        <button className="px-6 bg-white border-2 border-gray-400 py-2">Backup</button>
      </div>
      
      <div className="flex-1 p-4 space-y-3 overflow-auto">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border-2 border-gray-300 p-4 bg-white flex items-center gap-3">
            <Lock className="text-gray-600" size={20} />
            <span className="text-gray-600">🔒 Encrypted Note</span>
          </div>
        ))}
      </div>
      
      <div className="border-t-2 border-gray-200 p-3 text-center bg-gray-50">
        <span className="text-gray-500">Auto-lock in 30s</span>
      </div>
    </div>
  </WireframeScreen>
);

// Screen 4: Add Note Screen
const AddNoteScreen = () => (
  <WireframeScreen title="4. Add Note Screen">
    <div className="w-full h-full flex flex-col">
      <WireframeHeader 
        title="Add Note" 
        leftButton={<button className="text-gray-600">←</button>}
      />
      
      <div className="flex-1 p-4">
        <WireframeInput placeholder="Title" />
        
        <div className="w-full border-2 border-gray-400 bg-white px-4 py-3 mb-3 h-48">
          <span className="text-gray-500">Content</span>
        </div>
        
        <div className="w-full border-2 border-gray-400 bg-white px-4 py-3 mb-6 flex justify-between items-center">
          <span className="text-gray-500">Category</span>
          <span className="text-gray-500">▼</span>
        </div>
        
        <div className="bg-gray-100 border border-gray-300 p-2 mb-3">
          <p className="text-gray-500">Personal / Work / Password</p>
        </div>
      </div>
      
      <div className="p-4">
        <WireframeButton variant="primary">Save</WireframeButton>
      </div>
    </div>
  </WireframeScreen>
);

// Screen 5: View Note Screen
const ViewNoteScreen = () => (
  <WireframeScreen title="5. View Note Screen">
    <div className="w-full h-full flex flex-col">
      <WireframeHeader 
        title="Note Details" 
        leftButton={<button className="text-gray-600">←</button>}
      />
      
      <div className="flex-1 p-4">
        <div className="mb-4">
          <h2 className="mb-2">Meeting Notes</h2>
        </div>
        
        <div className="bg-gray-50 border border-gray-300 p-4 mb-6 h-64">
          <p className="text-gray-700">This is the decrypted content of the note. It shows all the information stored securely in the vault.</p>
        </div>
        
        <div className="bg-gray-100 border border-gray-300 p-2 mb-6">
          <p className="text-gray-500">Note decrypted only in memory</p>
        </div>
      </div>
      
      <div className="p-4 flex gap-3">
        <WireframeButton variant="secondary">Edit</WireframeButton>
        <WireframeButton variant="secondary">Delete</WireframeButton>
      </div>
    </div>
  </WireframeScreen>
);

// Screen 6: Settings Screen
const SettingsScreen = () => (
  <WireframeScreen title="6. Settings Screen">
    <div className="w-full h-full flex flex-col">
      <WireframeHeader 
        title="Settings" 
        leftButton={<button className="text-gray-600">←</button>}
      />
      
      <div className="flex-1 p-4 overflow-auto">
        <div className="mb-6">
          <h3 className="mb-3 text-gray-600">Backup & Restore</h3>
          <div className="border-2 border-gray-300 mb-2">
            <button className="w-full text-left px-4 py-3 bg-white">Export Encrypted Backup</button>
          </div>
          <div className="border-2 border-gray-300">
            <button className="w-full text-left px-4 py-3 bg-white">Import Encrypted Backup</button>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="mb-3 text-gray-600">Security</h3>
          <div className="border-2 border-gray-300 mb-2">
            <button className="w-full text-left px-4 py-3 bg-white">Change Master Password</button>
          </div>
          <div className="border-2 border-gray-300">
            <button className="w-full text-left px-4 py-3 bg-white">Auto-Lock Timer</button>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="mb-3 text-gray-600">About</h3>
          <div className="border-2 border-gray-300 mb-2">
            <div className="px-4 py-3 bg-white flex justify-between">
              <span>Version</span>
              <span className="text-gray-500">1.0.0</span>
            </div>
          </div>
          <div className="border-2 border-gray-300">
            <button className="w-full text-left px-4 py-3 bg-white">Privacy Policy</button>
          </div>
        </div>
      </div>
    </div>
  </WireframeScreen>
);

// Screen 7: Export Backup Dialog
const ExportBackupDialog = () => (
  <WireframeScreen title="7. Export Backup Dialog">
    <div className="w-full h-full flex flex-col bg-gray-900 bg-opacity-50 items-center justify-center p-6">
      <div className="bg-white border-4 border-gray-800 p-6 w-full max-w-sm">
        <h2 className="mb-4">Export Encrypted Backup</h2>
        
        <div className="bg-gray-100 border border-gray-300 p-3 mb-6">
          <p className="text-gray-700">Your vault will be saved as:</p>
          <p className="text-gray-900 mt-2">whisprvault_backup.svbackup</p>
        </div>
        
        <div className="flex gap-3">
          <WireframeButton variant="secondary">Cancel</WireframeButton>
          <WireframeButton variant="primary">Export</WireframeButton>
        </div>
      </div>
    </div>
  </WireframeScreen>
);

// Screen 8: Import Backup Dialog
const ImportBackupDialog = () => (
  <WireframeScreen title="8. Import Backup Dialog">
    <div className="w-full h-full flex flex-col bg-gray-900 bg-opacity-50 items-center justify-center p-6">
      <div className="bg-white border-4 border-gray-800 p-6 w-full max-w-sm">
        <h2 className="mb-4">Import Backup</h2>
        
        <div className="w-full border-2 border-dashed border-gray-400 bg-gray-50 px-4 py-8 mb-3 text-center">
          <span className="text-gray-500">📁 Choose File</span>
        </div>
        
        <WireframeInput placeholder="Enter Master Password" type="password" />
        
        <div className="flex gap-3 mt-4">
          <WireframeButton variant="secondary">Cancel</WireframeButton>
          <WireframeButton variant="primary">Restore</WireframeButton>
        </div>
      </div>
    </div>
  </WireframeScreen>
);

export function WireframeScreens() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <SetMasterPasswordScreen />
      <UnlockScreen />
      <HomeScreen />
      <AddNoteScreen />
      <ViewNoteScreen />
      <SettingsScreen />
      <ExportBackupDialog />
      <ImportBackupDialog />
    </div>
  );
}
