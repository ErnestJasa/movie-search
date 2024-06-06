import { createContext, useState } from "react";

export const AppContext = createContext(null);
export function AppProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [alert, setAlert] = useState({ show: false, text: "", type: "danger" });
  function showAlert({ text, type = "danger" }) {
    setAlert({
      show: true,
      text,
      type,
    });
  }
  function hideAlert() {
    setAlert({
      show: false,
      text: "",
      type: "danger",
    });
  }
  return (
    <AppContext.Provider
      value={{
        loggedIn,
        setLoggedIn,
        user,
        setUser,
        alert,
        showAlert,
        hideAlert,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
