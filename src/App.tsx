import { useState } from "react";
import { SetMasterPasswordScreen } from "./components/SetMasterPasswordScreen";
import { UnlockScreen } from "./components/UnlockScreen";
import { HomeScreen } from "./components/HomeScreen";
import { AddNoteScreen } from "./components/AddNoteScreen";
import { ViewNoteScreen } from "./components/ViewNoteScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { ExportBackupDialog } from "./components/ExportBackupDialog";
import { ImportBackupDialog } from "./components/ImportBackupDialog";
import { PrivacyPolicyScreen } from "./components/PrivacyPolicyScreen";

export type Screen = 
  | "set-password"
  | "unlock"
  | "home"
  | "add-note"
  | "view-note"
  | "settings"
  | "privacy-policy";

export type Note = {
  id: string;
  title: string;
  content: string;
  category: "Personal" | "Work" | "Password";
  createdAt: Date;
  links?: string[];
  attachments?: { name: string; url: string; type: string }[];
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("set-password");
  const [hasPassword, setHasPassword] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [autoLockTimer, setAutoLockTimer] = useState(60);
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Meeting Notes",
      content: "Discussed Q4 planning and budget allocations for next year.",
      category: "Work",
      createdAt: new Date("2024-11-20"),
    },
    {
      id: "2",
      title: "Shopping List",
      content: "Milk, Eggs, Bread, Coffee, Vegetables",
      category: "Personal",
      createdAt: new Date("2024-11-21"),
    },
    {
      id: "3",
      title: "Bank Password",
      content: "Account: ****1234\nPassword: Secure#Pass123",
      category: "Password",
      createdAt: new Date("2024-11-19"),
    },
  ]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  const handleSetPassword = (password: string) => {
    setHasPassword(true);
    setCurrentScreen("unlock");
  };

  const handleUnlock = (password: string) => {
    setIsUnlocked(true);
    setAutoLockTimer(60); // Reset timer on unlock
    setCurrentScreen("home");
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setCurrentScreen("unlock");
  };

  // Auto-lock functionality
  const handleTimerExpire = () => {
    if (isUnlocked && currentScreen !== "set-password" && currentScreen !== "unlock") {
      handleLock();
    }
  };

  const handleAddNote = (note: Omit<Note, "id" | "createdAt">) => {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setNotes([newNote, ...notes]);
    setCurrentScreen("home");
  };

  const handleViewNote = (noteId: string) => {
    setSelectedNoteId(noteId);
    setCurrentScreen("view-note");
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId));
    setCurrentScreen("home");
  };

  const handleEditNote = (noteId: string) => {
    setSelectedNoteId(noteId);
    setCurrentScreen("add-note");
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes(notes.map((note) => (note.id === updatedNote.id ? updatedNote : note)));
    setCurrentScreen("home");
  };

  const selectedNote = selectedNoteId ? notes.find((n) => n.id === selectedNoteId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {currentScreen === "set-password" && (
          <SetMasterPasswordScreen onContinue={handleSetPassword} />
        )}
        {currentScreen === "unlock" && (
          <UnlockScreen onUnlock={handleUnlock} />
        )}
        {currentScreen === "home" && (
          <HomeScreen
            notes={notes}
            onAddNote={() => {
              setSelectedNoteId(null);
              setCurrentScreen("add-note");
            }}
            onViewNote={handleViewNote}
            onNavigate={setCurrentScreen}
            autoLockTimer={autoLockTimer}
            setAutoLockTimer={setAutoLockTimer}
            onTimerExpire={handleTimerExpire}
          />
        )}
        {currentScreen === "add-note" && (
          <AddNoteScreen
            note={selectedNote || undefined}
            onSave={selectedNote ? handleUpdateNote : handleAddNote}
            onBack={() => setCurrentScreen("home")}
            autoLockTimer={autoLockTimer}
            setAutoLockTimer={setAutoLockTimer}
            onTimerExpire={handleTimerExpire}
          />
        )}
        {currentScreen === "view-note" && selectedNote && (
          <ViewNoteScreen
            note={selectedNote}
            onBack={() => setCurrentScreen("home")}
            onEdit={() => handleEditNote(selectedNote.id)}
            onDelete={() => handleDeleteNote(selectedNote.id)}
            autoLockTimer={autoLockTimer}
            setAutoLockTimer={setAutoLockTimer}
            onTimerExpire={handleTimerExpire}
          />
        )}
        {currentScreen === "settings" && (
          <SettingsScreen
            onBack={() => setCurrentScreen("home")}
            onExportBackup={() => setShowExportDialog(true)}
            onImportBackup={() => setShowImportDialog(true)}
            onPrivacyPolicy={() => setCurrentScreen("privacy-policy")}
            onNavigate={setCurrentScreen}
            autoLockTimer={autoLockTimer}
            setAutoLockTimer={setAutoLockTimer}
            onTimerExpire={handleTimerExpire}
          />
        )}
        {currentScreen === "privacy-policy" && (
          <PrivacyPolicyScreen
            onBack={() => setCurrentScreen("settings")}
            onNavigate={setCurrentScreen}
            autoLockTimer={autoLockTimer}
            setAutoLockTimer={setAutoLockTimer}
            onTimerExpire={handleTimerExpire}
          />
        )}
      </div>

      {showExportDialog && (
        <ExportBackupDialog onClose={() => setShowExportDialog(false)} />
      )}
      {showImportDialog && (
        <ImportBackupDialog onClose={() => setShowImportDialog(false)} />
      )}
    </div>
  );
}