import { Link } from "react-router-dom";
import logourban from "../assets/logourban.jpeg";

function Home() {
  return (
    <main className="bg-black">
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
    </main>
  );
}

export default Home;