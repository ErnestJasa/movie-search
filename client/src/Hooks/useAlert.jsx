import { useState } from "react";

function useAlert() {
  const [alert, setAlert] = useState({ show: false, text: "", type: "danger" });
  function showAlert({ text, type = "danger" }) {
    setAlert({
      show: true,
      text,
      type,
    });
  }
  function hideAlert() {
    console.log("hide");
    setAlert({
      show: false,
      text: "",
      type: "danger",
    });
  }
  return { alert, showAlert, hideAlert };
}
export default useAlert;
