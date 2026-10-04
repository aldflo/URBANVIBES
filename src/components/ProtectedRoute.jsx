import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase";

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <p className="text-zinc-500">
          Cargando...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;