import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { AppProvider } from "./Context/AppContext.jsx";

const client_id = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={client_id}>
      <AppProvider>
        <App />
      </AppProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
