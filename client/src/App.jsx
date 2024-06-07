import "./App.css";
import Favorites from "./Pages/Favorites";
import Home from "./Pages/Home";
import { Route, Router, Switch } from "wouter";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Alert from "./Components/Alert/Alert.jsx";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "./Context/AppContext.jsx";

function App() {
  const serverInfoText =
    "The website might not function correctly because the server enters sleep mode after some time of inactivity. After a few minutes everything should be OK.";
  const { showAlert, hideAlert, alert } = useContext(AppContext);
  const [serverResponding, setServerResponding] = useState(false);
  useEffect(() => {
    async function checkServer() {
      try {
        const response = await fetch(
          `${`${import.meta.env.VITE_APP_API_ADDRESS}`}`,
          {
            credentials: "include",
          }
        );
        if (response.status === 200) {
          const data = await response.json();
          hideAlert();
          setServerResponding(true);
          showAlert({ text: data.message, type: "success" });
        }
      } catch (e) {
        hideAlert();
        showAlert({
          text: serverInfoText,
          type: "danger",
        });
      }
    }
    checkServer();
  }, []);
  useEffect(() => {
    if (!serverResponding) {
      hideAlert();
      showAlert({
        text: serverInfoText,
        type: "danger",
      });
    }
  }, [serverResponding]);
  return (
    <div className="min-h-screen bg-black text-white ">
      <Router base="/movie-search">
        <Navbar />
        {alert.show && <Alert {...alert} />}
        <Switch>
          <Route path="/">
            <Home />
          </Route>
          <Route path="/favorites">
            <Favorites />
          </Route>
          <Route path="/*">
            <div className="w-full flex justify-center items-center text-center text-4xl mt-24">
              Page Not Found
            </div>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
