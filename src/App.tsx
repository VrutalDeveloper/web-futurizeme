import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [ellipsis, setEllipsis] = useState<string>("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setEllipsis(prev => prev.length < 3 ? prev + "." : "")
    }, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>Work in progress {ellipsis}</div>
      </header>
    </div>
  );
}

export default App;
