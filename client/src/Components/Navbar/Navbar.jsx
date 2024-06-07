import Cookies from "js-cookie";
import "./Navbar.css";
import { AppContext } from "../../Context/AppContext";
import { useContext, useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Link } from "wouter";
function Navbar() {
  const { setLoggedIn, user, setUser, showAlert, hideAlert } =
    useContext(AppContext);

  // useEffect(() => {
  //   const loggedInCookie = Cookies.get("movie_search_loggedIn");
  //   if (loggedInCookie) {
  //     setLoggedIn(loggedInCookie);
  //   }

  // });
  useEffect(() => {
    async function getUser() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_ADDRESS}users/login`,
          {
            credentials: "include",
          }
        );
        if (response.status === 200) {
          const data = await response.json();
          setLoggedIn(true);
          setUser(data.user);
        } else {
          setUser({});
        }
      } catch (e) {
        hideAlert();
        showAlert({
          text: "Sorry the server is currently down.",
          type: "danger",
        });
      }
    }
    getUser();
  }, []);
  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        // console.log(response);
        const res = await fetch(
          `${import.meta.env.VITE_APP_API_ADDRESS}google-auth`,
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(response),
          }
        );
        const data = await res.json();
        setLoggedIn(true);
        setUser(data);
      } catch (err) {
        console.log(err);
        hideAlert();
        showAlert({
          text: "Sorry the server is currently down.",
          type: "danger",
        });
      }
    },
  });
  async function logout() {
    setUser({});
    setLoggedIn(false);
    Cookies.remove("movie_search_loggedIn", { path: "/" });
    const res = await fetch(
      `${import.meta.env.VITE_APP_API_ADDRESS}users/logout`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      }
    );
    if (res.status === 200) {
      const data = await res.json();
      console.log(data);
      localStorage.removeItem("favorites");
      setTimeout(() => {
        location.reload();
      }, 500);
    }
  }

  const [show, setShow] = useState(false);
  return (
    <nav className="flex gap-4 lg:gap-12 lg:text-2xl p-4 text-xl">
      <Link href="/">Home</Link>
      <Link href="/favorites">Favorites</Link>

      {Object.keys(user).length === 0 ? (
        <button className="ml-auto" onClick={() => login()}>
          Sign in with google
        </button>
      ) : (
        <div
          onClick={() => setShow(!show)}
          className="ml-auto group lg:mr-2 relative dropdown"
        >
          <div className="flex gap-3 ">
            <h3 className="lg:m-auto ">Hi, {user.given_name}</h3>
            <img
              className=" rounded-full "
              width={"40px"}
              src={user.picture}
              alt=""
              referrerPolicy="no-referrer"
            />
            {/* <button className=" text-red-500" onClick={logout}>
              Logout
            </button> */}
          </div>
          {show ? (
            <button
              className="slide-down absolute right-0 lg:hidden text-red-500"
              onClick={logout}
            >
              Logout
            </button>
          ) : (
            ""
          )}
          <div className="hover:opacity-100 hidden lg:block  w-full text-right absolute translate-y-[-100%] group-hover:translate-y-0 duration-300 opacity-0 group-hover:opacity-100">
            {/* <div className="content right-0 text-right pb-3 absolute"> */}
            <button className=" text-red-500" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
export default Navbar;
