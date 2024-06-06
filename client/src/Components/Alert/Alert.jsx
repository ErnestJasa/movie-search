import { useContext } from "react";
import useAlert from "../../Hooks/useAlert";
import "./Alert.css";
import { AppContext } from "../../Context/AppContext";
function Alert({ type, text }) {
  const { hideAlert } = useContext(AppContext);
  return (
    <div
      className={` overflow-hidden fixed bottom-10 right-5  w-[450px] p-2 rounded-xl z-10 
   
      `}
    >
      <div
        className={`relative flex w-full h-full slide-in rounded-xl p-2 bg-black/50 backdrop-blur  ${
          type === "danger" ? "border-red" : "border-green"
        }`}
      >
        {type === "danger" ? (
          <p className=" text-xl">⚠</p>
        ) : (
          <p className=" text-xl">🟢</p>
        )}
        <p className="p-1 mt-1">{text}</p>

        <button
          onClick={() => hideAlert()}
          className="text-lg hover:text-red-400 absolute right-2 top-0"
        >
          X
        </button>
      </div>
    </div>
  );
}
export default Alert;
