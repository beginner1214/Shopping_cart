import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Products from "./pages/Products";
import Productdetailspage from "./pages/Productdetailspage";
import Cart from "./pages/Cart";
import Loginpage from "./pages/Login";
import Registerpage from "./pages/Register";
import Authpage from "./pages/Privateroute";
import Profilepage from "./pages/Profile";

function App() {
  return (
    <>
      <Routes>
        {/* Default route redirects to the Register page */}
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<Registerpage />} />
        <Route path="/login" element={<Loginpage />} />

        {/* Protected routes */}
        <Route
          path="/products"
          element={
            <Authpage>
              <Products />
            </Authpage>
          }
        />
        <Route
          path="/products/:id"
          element={
            <Authpage>
              <Productdetailspage />
            </Authpage>
          }
        />
        <Route
          path="/cart"
          element={
            <Authpage>
              <Cart />
            </Authpage>
          }
        />
        <Route
          path="/profile"
          element={
            <Authpage>
              <Profilepage />
            </Authpage>
          }
        />
      </Routes>
    </>
  );
}

export default App;
