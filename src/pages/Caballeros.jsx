import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";



import {

  collection,

  onSnapshot,

  query,

  where,

} from "firebase/firestore";



import { db } from "../firebase";



function Caballeros() {

  const [productos, setProductos] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");



  const [imagenAbierta, setImagenAbierta] = useState(null);

  const [indiceImagen, setIndiceImagen] = useState(0);



  const [busqueda, setBusqueda] = useState("");

  const [categoria, setCategoria] = useState("todas");



  const categorias = [

    { id: "playera", titulo: "Playeras" },

    { id: "pantalon", titulo: "Pantalones" },

    { id: "calzado", titulo: "Calzado" },

    { id: "gorra", titulo: "Gorras" },

    { id: "otros", titulo: "Otros" },

  ];



  // =====================================

  // CARGAR PRODUCTOS

  // =====================================



  useEffect(() => {

    const productosRef = collection(db, "productos");



    const consulta = query(

      productosRef,

      where("genero", "==", "caballeros"),

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



  // =====================================

  // GALERÍA

  // =====================================



  const obtenerImagenesProducto = (producto) => {

    if (

      Array.isArray(producto?.imagenes) &&

      producto.imagenes.length > 0

    ) {

      return producto.imagenes;

    }



    if (producto?.imagen) {

      return [producto.imagen];

    }



    return [];

  };

  // =====================================
  // DISPONIBILIDAD
  // =====================================

  const obtenerDisponibilidad = (producto) => {
    return producto?.disponibilidad === "agotado"
      ? "agotado"
      : "disponible";
  };



  const abrirProducto = (producto) => {

    setImagenAbierta(producto);

    setIndiceImagen(0);

  };



  const cerrarProducto = () => {

    setImagenAbierta(null);

    setIndiceImagen(0);

  };



  const imagenAnterior = () => {

    if (!imagenAbierta) return;



    const imagenes =

      obtenerImagenesProducto(imagenAbierta);



    if (imagenes.length <= 1) return;



    setIndiceImagen((indiceActual) =>

      indiceActual === 0

        ? imagenes.length - 1

        : indiceActual - 1

    );

  };



  const imagenSiguiente = () => {

    if (!imagenAbierta) return;



    const imagenes =

      obtenerImagenesProducto(imagenAbierta);



    if (imagenes.length <= 1) return;



    setIndiceImagen((indiceActual) =>

      indiceActual === imagenes.length - 1

        ? 0

        : indiceActual + 1

    );

  };



  // =====================================

  // TECLADO

  // =====================================



  useEffect(() => {

    const manejarTeclado = (e) => {

      if (!imagenAbierta) return;



      if (e.key === "Escape") {

        cerrarProducto();

      }



      if (e.key === "ArrowLeft") {

        imagenAnterior();

      }



      if (e.key === "ArrowRight") {

        imagenSiguiente();

      }

    };



    window.addEventListener(

      "keydown",

      manejarTeclado

    );



    return () => {

      window.removeEventListener(

        "keydown",

        manejarTeclado

      );

    };

  }, [imagenAbierta]);



  // =====================================

  // FILTRAR

  // =====================================



  const productosFiltrados = useMemo(() => {

    return productos.filter((producto) => {

      const texto =

        busqueda.toLowerCase().trim();



      const coincideBusqueda =

        producto.nombre

          ?.toLowerCase()

          .includes(texto) ||

        producto.descripcion

          ?.toLowerCase()

          .includes(texto);



      const coincideCategoria =

        categoria === "todas" ||

        producto.categoria === categoria;



      return (

        coincideBusqueda &&

        coincideCategoria

      );

    });

  }, [

    productos,

    busqueda,

    categoria,

  ]);



  const productosPorCategoria = (

    categoriaId

  ) => {

    return productosFiltrados.filter(

      (producto) =>

        producto.categoria === categoriaId

    );

  };



  // =====================================

  // CARGANDO

  // =====================================



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



  const imagenesModal = imagenAbierta

    ? obtenerImagenesProducto(

        imagenAbierta

      )

    : [];



  return (

    <>

      <main className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white">



        <div className="mx-auto max-w-7xl px-6 py-10">



          {/* CABECERA */}

          <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">



            <div>



              <p className="mt-3 max-w-xl text-sm text-zinc-400">

                Descubre nuestra colección para caballero.

              </p>



            </div>



            {/* BUSCADOR + VER DAMA + CATEGORÍA */}

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">



              {/* BUSCADOR */}

              <div className="relative w-full sm:w-72">



                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">

                  🔍

                </span>



                <input

                  type="text"

                  value={busqueda}

                  onChange={(e) =>

                    setBusqueda(

                      e.target.value

                    )

                  }

                  placeholder="Buscar producto..."

                  className="w-full rounded-full border border-white/10 bg-white/10 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-purple-500"

                />



              </div>



              {/* VER DAMA */}

              <Link

                to="/dama"

                className="flex items-center justify-center whitespace-nowrap rounded-full border border-pink-500/40 bg-pink-500/10 px-6 py-3 text-sm font-bold text-pink-300 transition hover:bg-pink-500 hover:text-white"

              >

                Ver Dama

              </Link>



              {/* CATEGORÍAS */}

              <select

                value={categoria}

                onChange={(e) =>

                  setCategoria(

                    e.target.value

                  )

                }

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

          {!error &&

            productosFiltrados.length === 0 && (



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



          {/* CATEGORÍAS */}

          <div className="space-y-16">



            {categorias.map((grupo) => {

              const productosCategoria =

                productosPorCategoria(

                  grupo.id

                );



              if (

                productosCategoria.length === 0

              ) {

                return null;

              }



              return (

                <section key={grupo.id}>



                  {/* TÍTULO CATEGORÍA */}

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



                      {

                        productosCategoria.length

                      }{" "}



                      {productosCategoria.length ===

                      1

                        ? "producto"

                        : "productos"}



                    </span>



                  </div>



                  {/* PRODUCTOS */}

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">



                    {productosCategoria.map(

                      (producto) => {



                        const cantidadImagenes =

                          obtenerImagenesProducto(

                            producto

                          ).length;



                        return (

                          <article

                            key={producto.id}

                            className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-purple-950/20"

                          >



                            {/* IMAGEN */}

                            <button

                              type="button"

                              onClick={() =>

                                abrirProducto(

                                  producto

                                )

                              }

                              className="relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden bg-black"

                            >



                              <img

                                src={

                                  producto.imagen

                                }

                                alt={

                                  producto.nombre

                                }

                                className="h-full w-full object-cover transition duration-500 hover:scale-105"

                              />



                              {/* INDICADOR DE VARIAS FOTOS */}

                              {cantidadImagenes >

                                1 && (



                                <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">

                                  📷{" "}

                                  {

                                    cantidadImagenes

                                  }

                                </span>



                              )}



                            </button>



                            {/* INFO */}

                            <div className="p-5">



                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-400">

                                {

                                  producto.categoria

                                }

                              </p>

                            {/* ESTADO PRODUCTO */}
                            <div className="mt-3">
                              {obtenerDisponibilidad(producto) === "agotado" ? (
                                <span className="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-red-400">
                                  Agotado
                                </span>
                              ) : (
                                <span className="inline-flex rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-green-400">
                                  Disponible
                                </span>
                              )}
                            </div>



                              <h3 className="mt-2 text-lg font-bold text-white">

                                {

                                  producto.nombre

                                }

                              </h3>



                              {producto.descripcion && (



                                <p className="mt-2 line-clamp-2 text-sm text-zinc-400">

                                  {

                                    producto.descripcion

                                  }

                                </p>



                              )}



                              <p className="mt-4 text-xl font-black text-white">



                                $



                                {Number(

                                  producto.precio

                                ).toLocaleString(

                                  "es-MX"

                                )}



                              </p>



                            </div>



                          </article>

                        );

                      }

                    )}



                  </div>



                </section>

              );

            })}



          </div>



        </div>



      </main>



      {/* =====================================

          MODAL GALERÍA

      ====================================== */}



      {imagenAbierta && (

        <div

          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"

          onClick={cerrarProducto}

        >



          {/* CERRAR */}

          <button

            type="button"

            onClick={cerrarProducto}

            className="absolute right-5 top-5 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl font-bold text-black shadow-xl transition hover:scale-105"

          >

            ×

          </button>



          <div

            className="relative flex max-h-[94vh] w-full max-w-6xl flex-col items-center"

            onClick={(e) =>

              e.stopPropagation()

            }

          >



            {/* IMAGEN PRINCIPAL */}

            <div className="relative flex w-full items-center justify-center">



              <img

                src={

                  imagenesModal[

                    indiceImagen

                  ]

                }

                alt={

                  imagenAbierta.nombre

                }

                className="max-h-[72vh] max-w-full rounded-xl object-contain shadow-2xl"

              />



              {/* FLECHA IZQUIERDA */}

              {imagenesModal.length > 1 && (



                <button

                  type="button"

                  onClick={imagenAnterior}

                  className="absolute left-2 flex h-12 w-12 items-center justify-center rounded-full bg-black/70 text-3xl font-light text-white shadow-xl backdrop-blur-md transition hover:scale-110 hover:bg-white hover:text-black sm:left-5"

                  aria-label="Imagen anterior"

                >

                  ‹

                </button>



              )}



              {/* FLECHA DERECHA */}

              {imagenesModal.length > 1 && (



                <button

                  type="button"

                  onClick={imagenSiguiente}

                  className="absolute right-2 flex h-12 w-12 items-center justify-center rounded-full bg-black/70 text-3xl font-light text-white shadow-xl backdrop-blur-md transition hover:scale-110 hover:bg-white hover:text-black sm:right-5"

                  aria-label="Imagen siguiente"

                >

                  ›

                </button>



              )}



            </div>



            {/* CONTADOR */}

            {imagenesModal.length > 1 && (



              <p className="mt-3 text-xs font-semibold text-zinc-400">



                {indiceImagen + 1} /{" "}

                {imagenesModal.length}



              </p>



            )}



            {/* MINIATURAS */}

            {imagenesModal.length > 1 && (



              <div className="mt-4 flex max-w-full gap-2 overflow-x-auto pb-1">



                {imagenesModal.map(

                  (imagen, indice) => (



                    <button

                      key={`${imagen}-${indice}`}

                      type="button"

                      onClick={() =>

                        setIndiceImagen(

                          indice

                        )

                      }

                      className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${

                        indiceImagen ===

                        indice

                          ? "border-white"

                          : "border-transparent opacity-50 hover:opacity-100"

                      }`}

                    >



                      <img

                        src={imagen}

                        alt={`Vista ${

                          indice + 1

                        }`}

                        className="h-full w-full object-cover"

                      />



                    </button>



                  )

                )}



              </div>



            )}



            {/* INFORMACIÓN */}

            <div className="mt-4 text-center text-white">



              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-400">

                {

                  imagenAbierta.categoria

                }

              </p>

              <div className="mt-3">
                {obtenerDisponibilidad(imagenAbierta) === "agotado" ? (
                  <span className="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-red-400">
                    Agotado
                  </span>
                ) : (
                  <span className="inline-flex rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-green-400">
                    Disponible
                  </span>
                )}
              </div>



              <h2 className="mt-2 text-xl font-bold">

                {

                  imagenAbierta.nombre

                }

              </h2>



              {imagenAbierta.descripcion && (



                <p className="mx-auto mt-2 max-w-xl text-sm text-zinc-400">

                  {

                    imagenAbierta.descripcion

                  }

                </p>



              )}



              <p className="mt-2 text-lg font-semibold">



                $



                {Number(

                  imagenAbierta.precio

                ).toLocaleString(

                  "es-MX"

                )}



              </p>



            </div>



          </div>



        </div>

      )}



    </>

  );

}



export default Caballeros;