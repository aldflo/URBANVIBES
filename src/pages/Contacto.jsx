function Contacto() {
  const whatsappNumber = "525517237904";

  const whatsappMessage =
    "Hola, vi la tienda URBAN y me gustaría recibir información sobre sus productos.";

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const facebookUrl =
    "https://www.facebook.com/share/1DmA42V7HC/";

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-zinc-950 via-zinc-900 to-black px-4 py-16 text-white">

      <div className="mx-auto max-w-5xl">

        {/* ENCABEZADO */}
        <div className="mb-12 text-center">

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-purple-400">
            URBAN
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            Contacto
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-zinc-400 md:text-base">
            ¿Tienes alguna pregunta sobre nuestros productos?
            Contáctanos directamente por WhatsApp o síguenos
            en Facebook.
          </p>

        </div>

        {/* TARJETAS */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* WHATSAPP */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-green-500/40 hover:bg-white/10"
          >

            <div className="flex items-center gap-5">

              {/* ICONO WHATSAPP */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-green-500">

                <svg
                  viewBox="0 0 32 32"
                  className="h-9 w-9 fill-white"
                  aria-hidden="true"
                >
                  <path d="M16.01 3C8.84 3 3 8.75 3 15.82c0 2.25.6 4.45 1.75 6.38L3 29l6.98-1.8a13.16 13.16 0 0 0 6.03 1.46h.01C23.18 28.66 29 22.91 29 15.84 29 8.76 23.18 3 16.01 3Zm0 23.5a11.03 11.03 0 0 1-5.62-1.53l-.4-.24-4.14 1.07 1.1-3.98-.26-.41a10.57 10.57 0 0 1-1.65-5.59c0-5.9 4.92-10.7 10.97-10.7 6.04 0 10.96 4.8 10.96 10.71 0 5.9-4.92 10.67-10.96 10.67Zm6.02-8c-.33-.16-1.95-.95-2.25-1.06-.3-.11-.52-.16-.74.16-.22.33-.85 1.06-1.04 1.28-.19.22-.38.25-.71.09-.33-.17-1.39-.51-2.65-1.62-.98-.86-1.64-1.92-1.83-2.25-.19-.33-.02-.5.14-.67.15-.15.33-.38.49-.57.16-.19.22-.33.33-.55.11-.22.05-.41-.03-.57-.08-.16-.74-1.76-1.01-2.41-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.57.08-.87.41-.3.33-1.15 1.11-1.15 2.71s1.18 3.15 1.34 3.37c.16.22 2.31 3.49 5.6 4.89.78.33 1.39.53 1.87.68.78.25 1.5.21 2.06.13.63-.09 1.95-.79 2.22-1.55.27-.76.27-1.41.19-1.55-.08-.13-.3-.21-.63-.37Z" />
                </svg>

              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-400">
                  WhatsApp
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Envíanos un mensaje
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                  55 1723 7904
                </p>
              </div>

            </div>

            <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">

              <span className="text-sm text-zinc-400">
                Atención y pedidos
              </span>

              <span className="text-xl transition group-hover:translate-x-1">
                →
              </span>

            </div>

          </a>

          {/* FACEBOOK */}
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-white/10"
          >

            <div className="flex items-center gap-5">

              {/* ICONO FACEBOOK */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-600">

                <svg
                  viewBox="0 0 24 24"
                  className="h-9 w-9 fill-white"
                  aria-hidden="true"
                >
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.414c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.972h-1.513c-1.49 0-1.956.931-1.956 1.887v2.261h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" />
                </svg>

              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                  Facebook
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Síguenos en Facebook
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                  URBAN
                </p>
              </div>

            </div>

            <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">

              <span className="text-sm text-zinc-400">
                Novedades y productos
              </span>

              <span className="text-xl transition group-hover:translate-x-1">
                →
              </span>

            </div>

          </a>

        </div>

        {/* MENSAJE INFERIOR */}
        <div className="mt-12 text-center">

          <p className="text-sm text-zinc-500">
            URBAN · Moda · Estilo · Tendencias
          </p>

        </div>

      </div>

    </main>
  );
}

export default Contacto;