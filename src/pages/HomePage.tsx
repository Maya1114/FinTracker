import { useAuth } from '@/hooks/useAuth';
import Landing from './Landing';
import FinanceDashboard from './FinanceDashboard';

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show landing page for unauthenticated users, dashboard for authenticated users
  return user ? <FinanceDashboard /> : <Landing />;
}