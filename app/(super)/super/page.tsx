import { SuperAdminDashboard } from "@/components/super/super-admin-dashboard";
import { ThemeProvider } from "@/components/driver/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";

export default function Home() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  return <SuperAdminDashboard />;
}
