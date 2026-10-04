import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Dama from "./pages/Dama";
import Caballeros from "./pages/Caballeros";
import Contacto from "./pages/Contacto";

import AdminLogin from "./pages/AdminLogin";
import MenuAdmin from "./pages/MenuAdmin";
import AgregarProducto from "./pages/AgregarProducto";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* TIENDA */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/dama"
          element={<Dama />}
        />

        <Route
          path="/caballeros"
          element={<Caballeros />}
        />

        <Route
          path="/contacto"
          element={<Contacto />}
        />

        {/* LOGIN ADMIN */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* PANEL ADMIN */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <MenuAdmin />
            </ProtectedRoute>
          }
        />

        {/* AGREGAR PRODUCTO */}

        <Route
          path="/admin/productos/nuevo"
          element={
            <ProtectedRoute>
              <AgregarProducto />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;