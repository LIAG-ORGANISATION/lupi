import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppRole } from '@/types/database';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: AppRole;
}

const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('[AuthGuard] State:', { isAuthenticated, userRole, loading, requiredRole });
    
    if (!loading) {
      if (!isAuthenticated) {
        console.log('[AuthGuard] User not authenticated, redirecting to /choose-account-type');
        navigate('/choose-account-type');
      } else if (requiredRole && userRole !== requiredRole) {
        console.log('[AuthGuard] Role mismatch. Required:', requiredRole, 'Actual:', userRole);
        // Redirect to appropriate dashboard based on role
        if (userRole === 'professional') {
          navigate('/professional/dashboard');
        } else {
          navigate('/guardian/dashboard');
        }
      } else {
        console.log('[AuthGuard] Access granted');
      }
    }
  }, [isAuthenticated, userRole, loading, navigate, requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || (requiredRole && userRole !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
