import { FC, useEffect, useRef } from "react";
import { fromEvent } from "rxjs";
import { Eye } from "../Eye/Eye";
import { SocialNetworks } from "../SocialNetworks/SocialNetworks";
import "./App.style.css";

export const App: FC = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const mouseTextRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const disposable = fromEvent<MouseEvent>(document, "mousemove").subscribe(
      (e) => {
        if (mouseTextRef.current) {
          mouseTextRef.current.innerText = `Mouse: x=${e.clientX} y=${e.clientY}`;
        }
      }
    );

    return () => {
      disposable.unsubscribe();
    };
  }, []);

  return (
    <div className="container" ref={parentRef}>
      <div className="label" ref={mouseTextRef}></div>
      <Eye />
      <Eye />

      <SocialNetworks />
    </div>
  );
};
