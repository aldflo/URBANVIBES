import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";

function AgregarProducto() {
  const navigate = useNavigate();

  // =====================================
  // FORMULARIO
  // =====================================

  const [genero, setGenero] = useState("");
  const [categoria, setCategoria] = useState("");

  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // =====================================
  // PRODUCTOS
  // =====================================

  const [productos, setProductos] = useState([]);

  // =====================================
  // EDICIÓN
  // =====================================

  const [productoEditando, setProductoEditando] =
    useState(null);

  // =====================================
  // FILTROS ADMINISTRADOR
  // =====================================

  const [seccionAdmin, setSeccionAdmin] =
    useState("dama");

  const [categoriaAdmin, setCategoriaAdmin] =
    useState("todas");

  // =====================================
  // CARGAR PRODUCTOS
  // =====================================

  useEffect(() => {
    const productosRef = collection(
      db,
      "productos"
    );

    const unsubscribe = onSnapshot(
      productosRef,

      (snapshot) => {
        const lista = snapshot.docs.map(
          (documento) => ({
            id: documento.id,
            ...documento.data(),
          })
        );

        setProductos(lista);
      },

      (error) => {
        console.error(
          "Error leyendo productos:",
          error
        );
      }
    );

    return () => unsubscribe();
  }, []);

  // =====================================
  // SELECCIONAR IMAGEN
  // =====================================

  const seleccionarImagen = (e) => {
    const archivo = e.target.files[0];

    if (!archivo) return;

    setImagen(archivo);

    const imagenTemporal =
      URL.createObjectURL(archivo);

    setPreview(imagenTemporal);
  };

  // =====================================
  // SUBIR IMAGEN A CLOUDINARY
  // =====================================

  const subirImagenCloudinary = async (
    archivo
  ) => {
    const formData = new FormData();

    formData.append("file", archivo);

    formData.append(
      "upload_preset",
      "URBANVIBES"
    );

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dxj4iczvk/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(
        "No se pudo subir la imagen a Cloudinary"
      );
    }

    const data = await response.json();

    return data.secure_url;
  };

  // =====================================
  // LIMPIAR FORMULARIO
  // =====================================

  const limpiarFormulario = () => {
    setGenero("");
    setCategoria("");

    setNombre("");
    setPrecio("");
    setDescripcion("");

    setImagen(null);
    setPreview("");

    setProductoEditando(null);
  };

  // =====================================
  // GUARDAR / ACTUALIZAR
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensaje("");
    setError("");

    if (!genero) {
      setError(
        "Selecciona si el producto es para Dama o Caballeros."
      );

      return;
    }

    if (!categoria) {
      setError(
        "Selecciona una categoría."
      );

      return;
    }

    if (!nombre.trim()) {
      setError(
        "Escribe el nombre del producto."
      );

      return;
    }

    if (!precio) {
      setError(
        "Escribe el precio del producto."
      );

      return;
    }

    // Producto nuevo necesita imagen
    if (!productoEditando && !imagen) {
      setError(
        "Selecciona una imagen."
      );

      return;
    }

    try {
      setLoading(true);

      let imagenUrl = preview;

      // Si eligió una imagen nueva
      if (imagen) {
        imagenUrl =
          await subirImagenCloudinary(
            imagen
          );
      }

      const producto = {
        nombre: nombre.trim(),

        precio: Number(precio),

        descripcion:
          descripcion.trim(),

        genero,

        categoria,

        imagen: imagenUrl,

        activo: true,
      };

      // =================================
      // EDITAR
      // =================================

      if (productoEditando) {
        const productoRef = doc(
          db,
          "productos",
          productoEditando.id
        );

        await updateDoc(productoRef, {
          ...producto,

          actualizado:
            serverTimestamp(),
        });

        setMensaje(
          "Producto actualizado correctamente."
        );
      }

      // =================================
      // NUEVO PRODUCTO
      // =================================

      else {
        await addDoc(
          collection(
            db,
            "productos"
          ),
          {
            ...producto,

            creado:
              serverTimestamp(),
          }
        );

        setMensaje(
          "Producto guardado correctamente."
        );
      }

      limpiarFormulario();

    } catch (error) {
      console.error(
        "Error guardando producto:",
        error
      );

      setError(
        `Error: ${
          error.message ||
          "No se pudo guardar el producto"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // EDITAR PRODUCTO
  // =====================================

  const editarProducto = (producto) => {
    setProductoEditando(producto);

    setGenero(
      producto.genero || ""
    );

    setCategoria(
      producto.categoria || ""
    );

    setNombre(
      producto.nombre || ""
    );

    setPrecio(
      producto.precio || ""
    );

    setDescripcion(
      producto.descripcion || ""
    );

    setPreview(
      producto.imagen || ""
    );

    setImagen(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================
  // ELIMINAR PRODUCTO
  // =====================================

  const eliminarProducto = async (
    producto
  ) => {
    const confirmar =
      window.confirm(
        `¿Seguro que quieres eliminar "${producto.nombre}"?`
      );

    if (!confirmar) return;

    try {
      await deleteDoc(
        doc(
          db,
          "productos",
          producto.id
        )
      );
    } catch (error) {
      console.error(
        "Error eliminando producto:",
        error
      );

      alert(
        "No se pudo eliminar el producto."
      );
    }
  };

  // =====================================
  // FILTRAR PRODUCTOS ADMIN
  // =====================================

  const productosAdmin =
    productos.filter((producto) => {
      const coincideGenero =
        producto.genero ===
        seccionAdmin;

      const coincideCategoria =
        categoriaAdmin === "todas" ||
        producto.categoria ===
          categoriaAdmin;

      return (
        coincideGenero &&
        coincideCategoria
      );
    });

  // =====================================
  // RETURN
  // =====================================

  return (
    <main className="min-h-[calc(100vh-80px)] bg-zinc-100 px-4 py-10">

      <div className="mx-auto max-w-6xl">

        {/* =========================
            CABECERA
        ========================== */}

        <div className="mb-8 flex items-center justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">
              Administrador
            </p>

            <h1 className="mt-2 text-3xl font-black md:text-4xl">

              {productoEditando
                ? "Editar producto"
                : "Agregar producto"}

            </h1>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/admin")
            }
            className="rounded-full border border-zinc-300 bg-white px-5 py-2 text-sm font-semibold transition hover:bg-black hover:text-white"
          >
            Volver
          </button>

        </div>

        {/* =========================
            FORMULARIO
        ========================== */}

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-6 shadow-sm md:p-10"
        >

          {/* =========================
              DAMA / CABALLEROS
          ========================== */}

          <div>

            <label className="mb-3 block text-sm font-bold">
              ¿Para quién es?
            </label>

            <div className="grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={() =>
                  setGenero("dama")
                }
                className={`rounded-2xl border px-5 py-5 font-bold transition ${
                  genero === "dama"
                    ? "border-black bg-black text-white"
                    : "border-zinc-300 bg-white text-black hover:border-black"
                }`}
              >
                Dama
              </button>

              <button
                type="button"
                onClick={() =>
                  setGenero(
                    "caballeros"
                  )
                }
                className={`rounded-2xl border px-5 py-5 font-bold transition ${
                  genero ===
                  "caballeros"
                    ? "border-black bg-black text-white"
                    : "border-zinc-300 bg-white text-black hover:border-black"
                }`}
              >
                Caballeros
              </button>

            </div>

          </div>

          {/* =========================
              CATEGORÍA
          ========================== */}

          <div className="mt-7">

            <label className="mb-3 block text-sm font-bold">
              Categoría
            </label>

            <select
              value={categoria}
              onChange={(e) =>
                setCategoria(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-4 outline-none transition focus:border-black"
            >

              <option value="">
                Selecciona una categoría
              </option>

              <option value="playera">
                Playera
              </option>

              <option value="pantalon">
                Pantalón
              </option>

              <option value="calzado">
                Calzado
              </option>

              <option value="gorra">
                Gorra
              </option>

              <option value="otros">
                Otros
              </option>

            </select>

          </div>

          {/* =========================
              NOMBRE
          ========================== */}

          <div className="mt-7">

            <label className="mb-2 block text-sm font-bold">
              Nombre del producto
            </label>

            <input
              type="text"
              value={nombre}
              onChange={(e) =>
                setNombre(
                  e.target.value
                )
              }
              placeholder="Ej. Playera Urban Oversize"
              className="w-full rounded-xl border border-zinc-300 px-4 py-4 outline-none transition focus:border-black"
            />

          </div>

          {/* =========================
              PRECIO
          ========================== */}

          <div className="mt-7">

            <label className="mb-2 block text-sm font-bold">
              Precio
            </label>

            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-zinc-500">
                $
              </span>

              <input
                type="number"
                min="0"
                step="0.01"
                value={precio}
                onChange={(e) =>
                  setPrecio(
                    e.target.value
                  )
                }
                placeholder="399"
                className="w-full rounded-xl border border-zinc-300 py-4 pl-9 pr-4 outline-none transition focus:border-black"
              />

            </div>

          </div>

          {/* =========================
              DESCRIPCIÓN
          ========================== */}

          <div className="mt-7">

            <label className="mb-2 block text-sm font-bold">
              Descripción
            </label>

            <textarea
              value={descripcion}
              onChange={(e) =>
                setDescripcion(
                  e.target.value
                )
              }
              placeholder="Descripción del producto..."
              rows="5"
              className="w-full resize-none rounded-xl border border-zinc-300 px-4 py-4 outline-none transition focus:border-black"
            />

          </div>

          {/* =========================
              IMAGEN
          ========================== */}

          <div className="mt-7">

            <label className="mb-2 block text-sm font-bold">
              Imagen del producto
            </label>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 transition hover:border-black">

              <span className="text-3xl">
                📷
              </span>

              <span className="mt-3 font-semibold">

                {productoEditando
                  ? "Cambiar imagen"
                  : "Seleccionar imagen"}

              </span>

              <span className="mt-1 text-xs text-zinc-400">
                JPG, PNG o WEBP
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={
                  seleccionarImagen
                }
                className="hidden"
              />

            </label>

          </div>

          {/* =========================
              PREVIEW
          ========================== */}

          {preview && (

            <div className="mt-6">

              <p className="mb-3 text-sm font-bold">
                Vista previa
              </p>

              <div className="overflow-hidden rounded-2xl bg-zinc-100">

                <img
                  src={preview}
                  alt="Vista previa"
                  className="h-[400px] w-full object-contain"
                />

              </div>

            </div>

          )}

          {/* =========================
              CLASIFICACIÓN
          ========================== */}

          {(genero ||
            categoria) && (

            <div className="mt-7 rounded-2xl bg-zinc-100 p-5">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Clasificación
              </p>

              <p className="mt-2 font-bold capitalize">

                {genero ||
                  "Sin seleccionar"}

                {categoria &&
                  ` / ${categoria}`}

              </p>

            </div>

          )}

          {/* =========================
              ERROR
          ========================== */}

          {error && (

            <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600">
              {error}
            </div>

          )}

          {/* =========================
              MENSAJE ÉXITO
          ========================== */}

          {mensaje && (

            <div className="mt-6 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700">
              {mensaje}
            </div>

          )}

          {/* =========================
              BOTONES
          ========================== */}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">

            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-black py-4 font-bold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
            >

              {loading
                ? "Guardando..."
                : productoEditando
                ? "Actualizar producto"
                : "Guardar producto"}

            </button>

            {productoEditando && (

              <button
                type="button"
                onClick={
                  limpiarFormulario
                }
                className="rounded-xl border border-zinc-300 px-8 py-4 font-bold transition hover:bg-zinc-100"
              >
                Cancelar
              </button>

            )}

          </div>

        </form>

        {/* =====================================
            ADMINISTRAR PRODUCTOS
        ====================================== */}

        <section className="mt-16">

          {/* TITULO */}

          <div className="mb-7">

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
              Inventario
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Administrar productos
            </h2>

          </div>

          {/* =================================
              DAMA / CABALLEROS
          ================================= */}

          <div className="mb-6 flex flex-wrap gap-3">

            <button
              type="button"
              onClick={() => {
                setSeccionAdmin(
                  "dama"
                );

                setCategoriaAdmin(
                  "todas"
                );
              }}
              className={`rounded-full px-7 py-3 text-sm font-bold transition ${
                seccionAdmin ===
                "dama"
                  ? "bg-black text-white"
                  : "border border-zinc-300 bg-white text-black hover:border-black"
              }`}
            >
              Dama
            </button>

            <button
              type="button"
              onClick={() => {
                setSeccionAdmin(
                  "caballeros"
                );

                setCategoriaAdmin(
                  "todas"
                );
              }}
              className={`rounded-full px-7 py-3 text-sm font-bold transition ${
                seccionAdmin ===
                "caballeros"
                  ? "bg-black text-white"
                  : "border border-zinc-300 bg-white text-black hover:border-black"
              }`}
            >
              Caballeros
            </button>

          </div>

          {/* =================================
              CATEGORIAS
          ================================= */}

          <div className="mb-8">

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
              Categorías
            </p>

            <div className="flex flex-wrap gap-2">

              {/* TODAS */}

              <button
                type="button"
                onClick={() =>
                  setCategoriaAdmin(
                    "todas"
                  )
                }
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  categoriaAdmin ===
                  "todas"
                    ? "bg-zinc-800 text-white"
                    : "border border-zinc-300 bg-white text-zinc-600 hover:border-black hover:text-black"
                }`}
              >
                Todas
              </button>

              {/* PLAYERAS */}

              <button
                type="button"
                onClick={() =>
                  setCategoriaAdmin(
                    "playera"
                  )
                }
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  categoriaAdmin ===
                  "playera"
                    ? "bg-zinc-800 text-white"
                    : "border border-zinc-300 bg-white text-zinc-600 hover:border-black hover:text-black"
                }`}
              >
                Playeras
              </button>

              {/* PANTALONES */}

              <button
                type="button"
                onClick={() =>
                  setCategoriaAdmin(
                    "pantalon"
                  )
                }
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  categoriaAdmin ===
                  "pantalon"
                    ? "bg-zinc-800 text-white"
                    : "border border-zinc-300 bg-white text-zinc-600 hover:border-black hover:text-black"
                }`}
              >
                Pantalones
              </button>

              {/* CALZADO */}

              <button
                type="button"
                onClick={() =>
                  setCategoriaAdmin(
                    "calzado"
                  )
                }
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  categoriaAdmin ===
                  "calzado"
                    ? "bg-zinc-800 text-white"
                    : "border border-zinc-300 bg-white text-zinc-600 hover:border-black hover:text-black"
                }`}
              >
                Calzado
              </button>

              {/* GORRAS */}

              <button
                type="button"
                onClick={() =>
                  setCategoriaAdmin(
                    "gorra"
                  )
                }
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  categoriaAdmin ===
                  "gorra"
                    ? "bg-zinc-800 text-white"
                    : "border border-zinc-300 bg-white text-zinc-600 hover:border-black hover:text-black"
                }`}
              >
                Gorras
              </button>

              {/* OTROS */}

              <button
                type="button"
                onClick={() =>
                  setCategoriaAdmin(
                    "otros"
                  )
                }
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  categoriaAdmin ===
                  "otros"
                    ? "bg-zinc-800 text-white"
                    : "border border-zinc-300 bg-white text-zinc-600 hover:border-black hover:text-black"
                }`}
              >
                Otros
              </button>

            </div>

          </div>

          {/* =================================
              RESUMEN
          ================================= */}

          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="font-bold">

                {seccionAdmin ===
                "dama"
                  ? "Dama"
                  : "Caballeros"}

              </p>

              <p className="text-sm capitalize text-zinc-500">

                {categoriaAdmin ===
                "todas"
                  ? "Todas las categorías"
                  : categoriaAdmin}

              </p>

            </div>

            <p className="text-sm text-zinc-500">

              {productosAdmin.length}{" "}

              {productosAdmin.length ===
              1
                ? "producto"
                : "productos"}

            </p>

          </div>

          {/* =================================
              SIN PRODUCTOS
          ================================= */}

          {productosAdmin.length ===
            0 && (

            <div className="rounded-2xl bg-white p-10 text-center">

              <h3 className="font-bold">
                No hay productos
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                No existen productos
                en esta categoría.
              </p>

            </div>

          )}

          {/* =================================
              LISTADO
          ================================= */}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {productosAdmin.map(
              (producto) => (

              <article
                key={producto.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >

                {/* IMAGEN */}

                <div className="aspect-[4/3] overflow-hidden bg-zinc-100">

                  <img
                    src={
                      producto.imagen
                    }
                    alt={
                      producto.nombre
                    }
                    className="h-full w-full object-cover"
                  />

                </div>

                {/* INFO */}

                <div className="p-5">

                  {/* ETIQUETAS */}

                  <div className="mb-3 flex flex-wrap items-center gap-2">

                    {/* CATEGORIA */}

                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-zinc-600">
                      {
                        producto.categoria
                      }
                    </span>

                    {/* GENERO */}

                    <span className="rounded-full bg-black px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">

                      {producto.genero ===
                      "dama"
                        ? "Dama"
                        : "Caballeros"}

                    </span>

                  </div>

                  {/* NOMBRE */}

                  <h3 className="text-lg font-bold">
                    {producto.nombre}
                  </h3>

                  {/* DESCRIPCION */}

                  {producto.descripcion && (

                    <p className="mt-2 line-clamp-2 text-sm text-zinc-500">
                      {
                        producto.descripcion
                      }
                    </p>

                  )}

                  {/* PRECIO */}

                  <p className="mt-3 text-xl font-black">

                    $

                    {Number(
                      producto.precio
                    ).toLocaleString(
                      "es-MX"
                    )}

                  </p>

                  {/* BOTONES */}

                  <div className="mt-5 grid grid-cols-2 gap-3">

                    <button
                      type="button"
                      onClick={() =>
                        editarProducto(
                          producto
                        )
                      }
                      className="rounded-xl bg-black py-3 text-sm font-bold text-white transition hover:bg-zinc-800"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        eliminarProducto(
                          producto
                        )
                      }
                      className="rounded-xl border border-red-300 py-3 text-sm font-bold text-red-600 transition hover:bg-red-600 hover:text-white"
                    >
                      Eliminar
                    </button>

                  </div>

                </div>

              </article>

            ))}

          </div>

        </section>

      </div>

    </main>
  );
}

export default AgregarProducto;