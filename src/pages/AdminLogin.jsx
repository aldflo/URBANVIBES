import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase";

const ADMIN_EMAIL = "aldair.flores0604@gmail.com";

function AdminLogin() {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginGoogle = async () => {
    try {
      setLoading(true);
      setError("");

      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, provider);

      const emailUsuario = result.user.email;

      // Validar que sea únicamente tu correo
      if (emailUsuario !== ADMIN_EMAIL) {
        await signOut(auth);

        setError(
          "Esta cuenta no tiene autorización para entrar al administrador."
        );

        return;
      }

      console.log("Administrador autorizado:", result.user);

      navigate("/admin");

    } catch (error) {
      console.error("Error de inicio de sesión:", error);

      if (error.code === "auth/popup-closed-by-user") {
        setError(
          "Se cerró la ventana de inicio de sesión."
        );
      } else if (error.code === "auth/popup-blocked") {
        setError(
          "El navegador bloqueó la ventana de Google."
        );
      } else {
        setError(
          "No se pudo iniciar sesión con Google."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-zinc-100 px-4">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

        <div className="mb-8 text-center">

          <h1 className="text-4xl font-black tracking-[0.25em]">
            URBAN
          </h1>

          <p className="mt-3 text-sm text-zinc-500">
            Panel de administración
          </p>

        </div>

        <button
          type="button"
          onClick={loginGoogle}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-300 bg-white px-4 py-3 font-semibold text-zinc-800 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
        >

          <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >

            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.27-4.74 3.27-8.09Z"
            />

            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.99.66-2.25 1.05-3.71 1.05-2.87 0-5.3-1.94-6.17-4.54H2.14v2.84A11 11 0 0 0 12 23Z"
            />

            <path
              fill="#FBBC05"
              d="M5.83 14.09A6.6 6.6 0 0 1 5.48 12c0-.73.13-1.43.35-2.09V7.07H2.14A11 11 0 0 0 1 12c0 1.77.42 3.44 1.14 4.93l3.69-2.84Z"
            />

            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.2 1.64l3.15-3.15A10.56 10.56 0 0 0 12 1 11 11 0 0 0 2.14 7.07l3.69 2.84C6.7 7.31 9.13 5.38 12 5.38Z"
            />

          </svg>

          {loading
            ? "Iniciando sesión..."
            : "Continuar con Google"}

        </button>

        {error && (
          <p className="mt-5 rounded-xl bg-red-50 p-3 text-center text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <p className="mt-7 text-center text-xs leading-5 text-zinc-400">
          Acceso exclusivo para administración de URBAN.
        </p>

      </div>

    </main>
  );
}

export default AdminLogin;