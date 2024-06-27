import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./css/normalize.css";
import "./css/index.css";
import "./css/utils.css";
import "./css/NavBar.css";
import "./css/SignIn.css";
import "./css/UserProfilePage.css";
import "./css/BlogPost.css";
import "./css/pop-up.css";
import "./css/three-floating-dots.css";
import { AuthProvider } from "./context/AuthContent";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
