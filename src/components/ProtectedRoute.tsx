// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/hooks/useAuth';

// export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const { user, loading } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!loading && !user) {
//       navigate('/auth');
//     }
//   }, [user, loading, navigate]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background">
//         <div className="text-center space-y-4">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
//           <p className="text-muted-foreground">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return user ? <>{children}</> : null;
// };



import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { doctor, loading } = useAuth();  // ✅ use 'doctor' instead of 'user'
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !doctor) {
      navigate('/auth', { replace: true }); // ✅ add replace
    }
  }, [doctor, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return doctor ? <>{children}</> : null;
};
