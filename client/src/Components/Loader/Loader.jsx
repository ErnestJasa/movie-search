import { useEffect, useState } from "react";
import "./Loader.css";
function Loader() {
  const [isUnmounting, setIsUnmounting] = useState(false);
  // useEffect(() => {
  //   return () => {
  //     setIsUnmounting(true);
  //   };
  // }, []);
  return <div className="loader"></div>;
}
export default Loader;
