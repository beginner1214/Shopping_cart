import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ShoppingcartContextProvider from "./Context/Createcontext.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./Context/AuthContexts"; // Import the AuthProvider

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ShoppingcartContextProvider>
          <App />
        </ShoppingcartContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
