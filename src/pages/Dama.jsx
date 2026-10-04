import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase";

function Dama() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [imagenAbierta, setImagenAbierta] = useState(null);

  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("todas");

  const categorias = [
    { id: "playera", titulo: "Playeras" },
    { id: "pantalon", titulo: "Pantalones" },
    { id: "calzado", titulo: "Calzado" },
    { id: "gorra", titulo: "Gorras" },
    { id: "otros", titulo: "Otros" },
  ];

  useEffect(() => {
    const productosRef = collection(db, "productos");

    const consulta = query(
      productosRef,
      where("genero", "==", "dama"),
      where("activo", "==", true)
    );

    const unsubscribe = onSnapshot(
      consulta,
      (snapshot) => {
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProductos(lista);
        setLoading(false);
      },
      (error) => {
        console.error("Error Firestore:", error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const cerrarConEscape = (e) => {
      if (e.key === "Escape") {
        setImagenAbierta(null);
      }
    };

    window.addEventListener("keydown", cerrarConEscape);

    return () => {
      window.removeEventListener("keydown", cerrarConEscape);
    };
  }, []);

  const productosFiltrados = useMemo(() => {
    return productos.filter((producto) => {
      const texto = busqueda.toLowerCase().trim();

      const coincideBusqueda =
        producto.nombre?.toLowerCase().includes(texto) ||
        producto.descripcion?.toLowerCase().includes(texto);

      const coincideCategoria =
        categoria === "todas" ||
        producto.categoria === categoria;

      return coincideBusqueda && coincideCategoria;
    });
  }, [productos, busqueda, categoria]);

  const productosPorCategoria = (categoriaId) => {
    return productosFiltrados.filter(
      (producto) => producto.categoria === categoriaId
    );
  };

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-zinc-400">
            Cargando productos...
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white">

        <div className="mx-auto max-w-7xl px-6 py-10">

          {/* CABECERA */}
          <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-purple-400">
                URBAN
              </p>

              <h1 className="mt-2 text-4xl font-black">
                Dama
              </h1>

              <p className="mt-2 text-sm text-zinc-400">
                {productosFiltrados.length} productos
              </p>
            </div>

            {/* BUSCADOR + CATEGORIA */}
            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">

              <div className="relative w-full sm:w-72">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                  🔍
                </span>

                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar producto..."
                  className="w-full rounded-full border border-white/10 bg-white/10 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-purple-500"
                />
              </div>

              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="rounded-full border border-white/10 bg-zinc-900 px-5 py-3 text-sm font-medium text-white outline-none transition focus:border-purple-500"
              >
                <option value="todas">
                  Todas las categorías
                </option>

                <option value="playera">
                  Playeras
                </option>

                <option value="pantalon">
                  Pantalones
                </option>

                <option value="calzado">
                  Calzado
                </option>

                <option value="gorra">
                  Gorras
                </option>

                <option value="otros">
                  Otros
                </option>
              </select>

            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-950/30 p-4 text-red-300">
              {error}
            </div>
          )}

          {/* SIN RESULTADOS */}
          {!error && productosFiltrados.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">

              <h2 className="text-xl font-bold">
                No encontramos productos
              </h2>

              <p className="mt-2 text-zinc-400">
                Prueba con otra búsqueda o categoría.
              </p>

              <button
                type="button"
                onClick={() => {
                  setBusqueda("");
                  setCategoria("todas");
                }}
                className="mt-5 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                Limpiar filtros
              </button>

            </div>
          )}

          {/* CATEGORIAS */}
          <div className="space-y-16">

            {categorias.map((grupo) => {
              const productosCategoria =
                productosPorCategoria(grupo.id);

              if (productosCategoria.length === 0) {
                return null;
              }

              return (
                <section key={grupo.id}>

                  {/* TITULO CATEGORIA */}
                  <div className="mb-6 flex items-end justify-between border-b border-white/10 pb-4">

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
                        URBAN
                      </p>

                      <h2 className="mt-1 text-2xl font-black">
                        {grupo.titulo}
                      </h2>
                    </div>

                    <span className="text-sm text-zinc-400">
                      {productosCategoria.length}{" "}
                      {productosCategoria.length === 1
                        ? "producto"
                        : "productos"}
                    </span>

                  </div>

                  {/* PRODUCTOS */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                    {productosCategoria.map((producto) => (

                      <article
                        key={producto.id}
                        className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-purple-950/20"
                      >

                        {/* IMAGEN */}
                        <button
                          type="button"
                          onClick={() =>
                            setImagenAbierta(producto)
                          }
                          className="block aspect-[4/5] w-full cursor-zoom-in overflow-hidden bg-black"
                        >
                          <img
                            src={producto.imagen}
                            alt={producto.nombre}
                            className="h-full w-full object-cover transition duration-500 hover:scale-105"
                          />
                        </button>

                        {/* INFORMACION */}
                        <div className="p-5">

                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-400">
                            {producto.categoria}
                          </p>

                          <h3 className="mt-2 text-lg font-bold text-white">
                            {producto.nombre}
                          </h3>

                          {producto.descripcion && (
                            <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                              {producto.descripcion}
                            </p>
                          )}

                          <p className="mt-4 text-xl font-black text-white">
                            $
                            {Number(
                              producto.precio
                            ).toLocaleString("es-MX")}
                          </p>

                          <button
                            type="button"
                            className="mt-5 w-full rounded-xl bg-white py-3 font-semibold text-black transition hover:bg-zinc-200"
                          >
                            Agregar al carrito
                          </button>

                        </div>

                      </article>
                    ))}

                  </div>

                </section>
              );
            })}

          </div>

        </div>

      </main>

      {/* MODAL IMAGEN */}
      {imagenAbierta && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
          onClick={() => setImagenAbierta(null)}
        >

          <button
            type="button"
            onClick={() => setImagenAbierta(null)}
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl font-bold text-black transition hover:scale-105"
          >
            ×
          </button>

          <div
            className="flex max-h-[90vh] max-w-6xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >

            <img
              src={imagenAbierta.imagen}
              alt={imagenAbierta.nombre}
              className="max-h-[80vh] max-w-full rounded-xl object-contain shadow-2xl"
            />

            <div className="mt-4 text-center text-white">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-400">
                {imagenAbierta.categoria}
              </p>

              <h2 className="mt-2 text-xl font-bold">
                {imagenAbierta.nombre}
              </h2>

              <p className="mt-1 text-lg font-semibold">
                $
                {Number(
                  imagenAbierta.precio
                ).toLocaleString("es-MX")}
              </p>

            </div>

          </div>

        </div>
      )}

    </>
  );
}

export default Dama;