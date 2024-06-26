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
      location.reload();
    }
  }

  async function deleteUser() {
    const confirm = window.confirm("Delete user data?");
    if (confirm) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_APP_API_ADDRESS}users`,
          {
            method: "DELETE",
            headers: {
              "Content-type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await res.json();
        if (res.status === 200) {
          console.log(data);
          setLoggedIn(false);
          setUser({});
          hideAlert();
          showAlert({
            text: data.message,
            type: "success",
          });
          setTimeout(() => {
            localStorage.removeItem("favorites");
            location.reload();
          }, 800);
        } else {
          console.log(data);
        }
      } catch (err) {
        console.log("something went wrong deleting");
        console.log(err);
      }
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
          </div>
          {show && (
            <ul className="slide-down absolute right-0 text-right lg:hidden z-10 w-full bg-black/50 backdrop-blur rounded-xl">
              <li className="border-b-[2px] border-slate-500 rounded-xl">
                <button
                  className=" text-rose-700  active:text-red-600 active:shadow-slate-500 shadow-sm p-2 rounded-xl text-right"
                  onClick={deleteUser}
                >
                  Delete user data
                </button>
              </li>
              <li className="border-b-[2px] border-slate-500 rounded-xl">
                <button
                  className=" text-red-500 active:text-red-400 active:shadow-slate-500 shadow-sm p-2 rounded-xl"
                  onClick={logout}
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
          <ul
            className={`z-10 hidden lg:block w-48 right-0 mt-1 text-right absolute translate-y-[-70%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-300
            `}
            // className="content"
          >
            <li>
              <button
                className=" text-red-800 hover:text-red-600 hover:shadow-slate-500 shadow-sm p-2 rounded-xl"
                onClick={deleteUser}
              >
                Delete user data
              </button>
            </li>
            <li>
              <button
                className=" text-red-500 hover:text-red-400 hover:shadow-slate-500 shadow-sm p-2 rounded-xl"
                onClick={logout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
export default Navbar;
