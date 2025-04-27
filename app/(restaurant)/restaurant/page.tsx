import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { DashboardPage } from "@/pages/restaurant/dashboard-page"

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
  return <DashboardPage />;
}