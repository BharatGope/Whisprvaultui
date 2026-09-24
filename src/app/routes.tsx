import { createHashRouter, Navigate, Outlet, useLocation } from "react-router";
import { AppProvider, useAppContext } from "./context/AppContext";
import { HomeScreen } from "./components/HomeScreen";
import { AddNoteScreen } from "./components/AddNoteScreen";
import { ViewNoteScreen } from "./components/ViewNoteScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { PrivacyPolicyScreen } from "./components/PrivacyPolicyScreen";
import { SetMasterPasswordScreen } from "./components/SetMasterPasswordScreen";
import { UnlockScreen } from "./components/UnlockScreen";
import { ExportBackupDialog } from "./components/ExportBackupDialog";
import { ImportBackupDialog } from "./components/ImportBackupDialog";

function RootLayout() {
  const { darkMode, showExportDialog, setShowExportDialog, showImportDialog, setShowImportDialog } = useAppContext();

  return (
    <div
    className={`min-h-screen ${
      darkMode
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
        : "bg-gradient-to-br from-indigo-50 via-white to-purple-50"
    } flex items-center justify-center p-2 sm:p-4`}
  >
    <div className="w-full max-w-md h-[100dvh] sm:h-[95vh]">
      <Outlet />
    </div>
      {showExportDialog && <ExportBackupDialog onClose={() => setShowExportDialog(false)} />}
      {showImportDialog && <ImportBackupDialog onClose={() => setShowImportDialog(false)} />}
    </div>
  );
}

function Root() {
  return (
    <AppProvider>
      <RootLayout />
    </AppProvider>
  );
}

function IndexRedirect() {
  const { hasPassword, isUnlocked } = useAppContext();
  if (!hasPassword) return <Navigate to="/setup" replace />;
  if (!isUnlocked) return <Navigate to="/unlock" replace />;
  return <Navigate to="/home" replace />;
}

function ProtectedRoute() {
  const { isUnlocked, hasPassword } = useAppContext();
  const location = useLocation();

  if (!hasPassword) return <Navigate to="/setup" replace />;
  if (!isUnlocked) {
    return <Navigate to={`/unlock?from=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <Outlet />;
}

export const router = createHashRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: IndexRedirect },
      { path: "setup", Component: SetMasterPasswordScreen },
      { path: "unlock", Component: UnlockScreen },
      {
        Component: ProtectedRoute,
        children: [
          { path: "home", Component: HomeScreen },
          { path: "note/new", Component: AddNoteScreen },
          { path: "note/:id", Component: ViewNoteScreen },
          { path: "note/:id/edit", Component: AddNoteScreen },
          { path: "settings", Component: SettingsScreen },
          { path: "settings/privacy", Component: PrivacyPolicyScreen },
        ],
      },
    ],
  },
]);
