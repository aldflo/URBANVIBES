import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";
import logourban from "../assets/logourban.jpeg";

function Home() {
  const [productos, setProductos] = useState([]);

  const [damaMostrados, setDamaMostrados] = useState([]);
  const [caballerosMostrados, setCaballerosMostrados] = useState([]);

  // CARGAR PRODUCTOS DESDE FIRESTORE
  useEffect(() => {
    const productosRef = collection(db, "productos");

    const unsubscribe = onSnapshot(
      productosRef,
      (snapshot) => {
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProductos(lista);
      },
      (error) => {
        console.error("Error cargando productos:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // FUNCIÓN PARA ELEGIR 3 PRODUCTOS ALEATORIOS
  const obtenerAleatorios = (lista, cantidad = 3) => {
    const mezclados = [...lista];

    for (let i = mezclados.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [mezclados[i], mezclados[j]] = [
        mezclados[j],
        mezclados[i],
      ];
    }

    return mezclados.slice(0, cantidad);
  };

  // CAMBIAR PRODUCTOS MOSTRADOS
  const actualizarProductos = () => {
    const productosDama = productos.filter(
      (producto) =>
        producto.genero === "dama" &&
        producto.activo === true
    );

    const productosCaballeros = productos.filter(
      (producto) =>
        producto.genero === "caballeros" &&
        producto.activo === true
    );

    setDamaMostrados(
      obtenerAleatorios(productosDama, 3)
    );

    setCaballerosMostrados(
      obtenerAleatorios(productosCaballeros, 3)
    );
  };

  // MOSTRAR PRODUCTOS AL CARGAR
  useEffect(() => {
    if (productos.length === 0) return;

    actualizarProductos();
  }, [productos]);

  // ROTAR PRODUCTOS CADA 12 SEGUNDOS
  useEffect(() => {
    if (productos.length === 0) return;

    const intervalo = setInterval(() => {
      actualizarProductos();
    }, 12000);

    return () => clearInterval(intervalo);
  }, [productos]);

  // TARJETA DE PRODUCTO
  const TarjetaProducto = ({
  producto,
  destino,
}) => {
  return (
    <Link
      to={destino}
      className="group block"
    >
      <article className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-white/20">

        {/* IMAGEN */}
        <div className="relative aspect-[4/5] overflow-hidden bg-zinc-950">

          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />

          {/* SOMBRA SOBRE IMAGEN */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />

          {/* CATEGORÍA FLOTANTE */}
          <div className="absolute left-4 top-4">
            <span className="rounded-full border border-white/15 bg-black/50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
              {producto.categoria}
            </span>
          </div>

          {/* PRECIO SOBRE FOTO */}
          <div className="absolute bottom-4 right-4">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-black shadow-lg">
              $
              {Number(
                producto.precio
              ).toLocaleString("es-MX")}
            </span>
          </div>

        </div>

        {/* INFORMACIÓN */}
        <div className="p-5">

          <div className="flex items-start justify-between gap-4">

            <div className="min-w-0">

              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-purple-400">
                URBAN
              </p>

              <h3 className="mt-2 text-xl font-black leading-tight text-white">
                {producto.nombre}
              </h3>

            </div>

            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg text-white transition duration-300 group-hover:bg-white group-hover:text-black">
              ↗
            </span>

          </div>

          {producto.descripcion && (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-400">
              {producto.descripcion}
            </p>
          )}

          <div className="mt-5 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Ver producto
          </p>

        </div>

      </article>
    </Link>
  );
};
  return (
    <main className="bg-black text-white">

      {/* ================================================= */}
      {/* IMAGEN PRINCIPAL */}
      {/* ================================================= */}

      <section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-black">

        {/* IMAGEN */}
        <img
          src={logourban}
          alt="URBAN"
          className="absolute inset-0 h-full w-full object-contain object-center"
        />

        {/* SOMBRA SUAVE */}
        <div className="absolute inset-0 bg-black/10" />

        {/* BOTONES */}
        <div className="relative z-10 flex h-full min-h-[calc(100vh-80px)] w-full items-end justify-center pb-16">

          <div className="flex flex-col gap-4 sm:flex-row">

            <Link
              to="/dama"
              className="min-w-[170px] rounded-full bg-white px-8 py-4 text-center text-sm font-bold text-black shadow-xl transition duration-300 hover:scale-105 hover:bg-zinc-200"
            >
              Ver Dama
            </Link>

            <Link
              to="/caballeros"
              className="min-w-[170px] rounded-full border border-white bg-black/50 px-8 py-4 text-center text-sm font-bold text-white shadow-xl backdrop-blur-md transition duration-300 hover:scale-105 hover:bg-white hover:text-black"
            >
              Ver Caballeros
            </Link>

          </div>

        </div>

      </section>

      {/* ================================================= */}
      {/* PRODUCTOS */}
      {/* ================================================= */}

      <section className="bg-gradient-to-b from-black via-zinc-950 to-black px-6 py-16">

        <div className="mx-auto max-w-7xl">

          {/* ================================================= */}
          {/* DAMA */}
          {/* ================================================= */}

          {damaMostrados.length > 0 && (

            <section className="mb-20">

              <div className="mb-7 flex items-end justify-between border-b border-white/10 pb-5">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-pink-400">
                    URBAN
                  </p>

                  <h2 className="mt-1 text-3xl font-black">
                    Dama
                  </h2>

                </div>

                <Link
                  to="/dama"
                  className="rounded-full border border-pink-500/30 bg-pink-500/10 px-5 py-2.5 text-sm font-bold text-pink-300 transition hover:bg-pink-500 hover:text-white"
                >
                  Ver más →
                </Link>

              </div>

              <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">

                {damaMostrados.map((producto) => (

                  <TarjetaProducto
                    key={producto.id}
                    producto={producto}
                    destino="/dama"
                  />

                ))}

              </div>

            </section>

          )}

          {/* ================================================= */}
          {/* CABALLEROS */}
          {/* ================================================= */}

          {caballerosMostrados.length > 0 && (

            <section>

              <div className="mb-7 flex items-end justify-between border-b border-white/10 pb-5">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
                    URBAN
                  </p>

                  <h2 className="mt-1 text-3xl font-black">
                    Caballeros
                  </h2>

                </div>

                <Link
                  to="/caballeros"
                  className="rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2.5 text-sm font-bold text-blue-300 transition hover:bg-blue-500 hover:text-white"
                >
                  Ver más →
                </Link>

              </div>

              <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">

                {caballerosMostrados.map((producto) => (

                  <TarjetaProducto
                    key={producto.id}
                    producto={producto}
                    destino="/caballeros"
                  />

                ))}

              </div>

            </section>

          )}

        </div>

      </section>

    </main>
  );
}

export default Home;