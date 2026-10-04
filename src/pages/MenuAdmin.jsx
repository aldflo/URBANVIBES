import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function MenuAdmin() {
  const navigate = useNavigate();

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      navigate("/admin/login");
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-zinc-100">
      <div className="mx-auto w-[94%] max-w-7xl py-10">

        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
              Panel de control
            </p>

            <h1 className="mt-2 text-4xl font-black">
              Administrador URBAN
            </h1>

            {auth.currentUser && (
              <p className="mt-2 text-sm text-zinc-500">
                {auth.currentUser.email}
              </p>
            )}
          </div>

          <button
            onClick={cerrarSesion}
            className="rounded-full border border-zinc-300 bg-white px-5 py-2 text-sm font-semibold transition hover:bg-black hover:text-white"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          <button
            onClick={() =>
              navigate("/admin/productos/nuevo")
            }
            className="rounded-3xl bg-black p-7 text-left text-white shadow-lg transition hover:-translate-y-1"
          >
            <div className="mb-10 text-4xl">
              +
            </div>

            <h2 className="text-xl font-bold">
              Agregar producto
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              Agrega imagen, nombre, precio y categoría.
            </p>
          </button>

          
          <button className="rounded-3xl bg-white p-7 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-10 text-4xl">
              📦
            </div>

            <h2 className="text-xl font-bold">
              Pedidos
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Revisa pedidos y ventas.
            </p>
          </button>

        </div>

      </div>
    </main>
  );
}

export default MenuAdmin;