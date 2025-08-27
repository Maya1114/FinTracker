import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="glass-card border-primary/30 bg-primary/5 p-8 space-y-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-error/10 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-error" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-primary bg-gradient-primary bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-xl font-semibold text-foreground">Page Not Found</h2>
            <p className="text-foreground-secondary">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <Button asChild className="bg-gradient-primary hover:opacity-90 transition-opacity">
            <Link to="/" className="inline-flex items-center gap-2">
              <Home className="h-4 w-4" />
              Return to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
