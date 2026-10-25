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

  const facebookUrl =
    "https://www.facebook.com/share/1DmA42V7HC/";

  const instagramUrl =
    "https://www.instagram.com/urbanvibes.camp?rpxt=MWMwZzh1eTZpOThtMQ==";

  const whatsappNumber = "525517237904";

  const whatsappMessage =
    "Hola, vi la tienda URBAN y me gustaría recibir información sobre sus productos.";

  const whatsappUrl =
    "https://wa.me/" +
    whatsappNumber +
    "?text=" +
    encodeURIComponent(whatsappMessage);

  // =====================================
  // CARGAR PRODUCTOS DESDE FIRESTORE
  // =====================================

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

  // =====================================
  // PRODUCTOS ALEATORIOS
  // =====================================

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

  // =====================================
  // ACTUALIZAR PRODUCTOS MOSTRADOS
  // =====================================

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

  // =====================================
  // MOSTRAR PRODUCTOS AL CARGAR
  // =====================================

  useEffect(() => {
    if (productos.length === 0) return;

    actualizarProductos();
  }, [productos]);

  // =====================================
  // ROTAR PRODUCTOS CADA 12 SEGUNDOS
  // =====================================

  useEffect(() => {
    if (productos.length === 0) return;

    const intervalo = setInterval(() => {
      actualizarProductos();
    }, 12000);

    return () => clearInterval(intervalo);
  }, [productos]);

  // =====================================
  // TARJETA DE PRODUCTO
  // =====================================

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

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />

            <div className="absolute left-4 top-4">
              <span className="rounded-full border border-white/15 bg-black/50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                {producto.categoria}
              </span>
            </div>

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

      {/* ===================================== */}
      {/* HERO */}
      {/* ===================================== */}

      <section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-black">

        <img
          src={logourban}
          alt="URBAN"
          className="absolute inset-0 h-full w-full object-contain object-center"
        />

        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 flex min-h-[calc(100vh-80px)] w-full items-end justify-center pb-12">

          <div className="flex flex-col items-center gap-5">

            {/* BOTONES */}
            <div className="flex flex-col gap-4 sm:flex-row">

              <Link
                to="/dama"
                className="min-w-[170px] rounded-full bg-white px-8 py-4 text-center text-sm font-bold text-black shadow-xl transition duration-300 hover:scale-105 hover:bg-zinc-200"
              >
                Ver Dama
              </Link>

              <Link
                to="/caballeros"
                className="min-w-[170px] rounded-full border border-white bg-black/40 px-8 py-4 text-center text-sm font-bold text-white shadow-xl backdrop-blur-md transition duration-300 hover:scale-105 hover:bg-white hover:text-black"
              >
                Ver Caballeros
              </Link>

            </div>

            {/* ===================================== */}
            {/* REDES SOCIALES */}
            {/* ===================================== */}

            <div className="text-center">

              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-zinc-400">
                Síguenos en nuestras redes
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Nuevos modelos, promociones y novedades
              </p>

              <div className="mt-4 flex items-center justify-center gap-3">

                {/* INSTAGRAM */}
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition duration-300 hover:scale-110 hover:border-pink-500/40 hover:bg-white/10"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 fill-pink-400"
                    aria-hidden="true"
                  >
                    <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7Zm10 2c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3h10Zm-5 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm5.5-3a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z" />
                  </svg>
                </a>

                {/* FACEBOOK */}
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition duration-300 hover:scale-110 hover:border-blue-500/40 hover:bg-white/10"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 fill-blue-400"
                    aria-hidden="true"
                  >
                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.414c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.972h-1.513c-1.49 0-1.956.931-1.956 1.887v2.261h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" />
                  </svg>
                </a>

                {/* WHATSAPP */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition duration-300 hover:scale-110 hover:border-green-500/40 hover:bg-white/10"
                >
                  <svg
                    viewBox="0 0 32 32"
                    className="h-6 w-6 fill-green-400"
                    aria-hidden="true"
                  >
                    <path d="M16.01 3C8.84 3 3 8.75 3 15.82c0 2.25.6 4.45 1.75 6.38L3 29l6.98-1.8a13.16 13.16 0 0 0 6.03 1.46h.01C23.18 28.66 29 22.91 29 15.84 29 8.76 23.18 3 16.01 3Zm0 23.5a11.03 11.03 0 0 1-5.62-1.53l-.4-.24-4.14 1.07 1.1-3.98-.26-.41a10.57 10.57 0 0 1-1.65-5.59c0-5.9 4.92-10.7 10.97-10.7 6.04 0 10.96 4.8 10.96 10.71 0 5.9-4.92 10.67-10.96 10.67Zm6.02-8c-.33-.16-1.95-.95-2.25-1.06-.3-.11-.52-.16-.74.16-.22.33-.85 1.06-1.04 1.28-.19.22-.38.25-.71.09-.33-.17-1.39-.51-2.65-1.62-.98-.86-1.64-1.92-1.83-2.25-.19-.33-.02-.5.14-.67.15-.15.33-.38.49-.57.16-.19.22-.33.33-.55.11-.22.05-.41-.03-.57-.08-.16-.74-1.76-1.01-2.41-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.57.08-.87.41-.3.33-1.15 1.11-1.15 2.71s1.18 3.15 1.34 3.37c.16.22 2.31 3.49 5.6 4.89.78.33 1.39.53 1.87.68.78.25 1.5.21 2.06.13.63-.09 1.95-.79 2.22-1.55.27-.76.27-1.41.19-1.55-.08-.13-.3-.21-.63-.37Z" />
                  </svg>
                </a>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ===================================== */}
      {/* PRODUCTOS */}
      {/* ===================================== */}

      <section className="bg-gradient-to-b from-black via-zinc-950 to-black px-6 py-16">

        <div className="mx-auto max-w-7xl">

          {/* ===================================== */}
          {/* DAMA */}
          {/* ===================================== */}

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

          {/* ===================================== */}
          {/* CABALLEROS */}
          {/* ===================================== */}

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