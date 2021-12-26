import { FC, useEffect, useRef } from "react";
import { fromEvent, Subscription } from "rxjs";
import { concatMap, takeUntil } from "rxjs/operators";
import "./Eye.style.css";

export interface IPoint {
  x: number;
  y: number;
}

const moveIris = (irisEle: HTMLDivElement, point: IPoint) => {
  const rect = irisEle.getBoundingClientRect();

  const top = point.y - rect.height / 2;
  const left = point.x - rect.width / 2;

  irisEle.style.top = top + "px";
  irisEle.style.left = left + "px";
};

const getEyeRadius = (eyeEle: HTMLDivElement) => {
  const rect = eyeEle.getBoundingClientRect();

  return rect.height / 2;
};

const getUnitVector = (pointA: IPoint, pointB: IPoint) => {
  const module = getDistance(pointA.x, pointB.x, pointA.y, pointB.y);

  return {
    x: (pointB.x - pointA.x) / module,
    y: (pointB.y - pointA.y) / module,
  };
};

const getElementCenter = (ele: HTMLDivElement) => {
  const rect = ele.getBoundingClientRect();
  return {
    x: (rect.left + rect.right) / 2,
    y: (rect.top + rect.bottom) / 2,
  };
};

const getDistance = (x1: number, x2: number, y1: number, y2: number) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

const mouseUp$ = fromEvent<MouseEvent>(document, "mouseup");
const mouseMove$ = fromEvent<MouseEvent>(document, "mousemove").pipe(
  takeUntil(mouseUp$)
);

export const Eye: FC = () => {
  const eyeRef = useRef<HTMLDivElement>(null);
  const irisRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let subs: Subscription | null = null;

    if (eyeRef.current) {
      subs = fromEvent<MouseEvent>(eyeRef.current, "mousedown")
        .pipe(concatMap(() => mouseMove$))
        .subscribe((e) => {
          e.preventDefault();

          if (eyeRef.current && eyeRef.current.parentElement) {
            const parentRect =
              eyeRef.current.parentElement.getBoundingClientRect();
            const rect = eyeRef.current.getBoundingClientRect();

            if (rect.left < parentRect.left) {
              eyeRef.current.style.left = "0";
            } else {
              eyeRef.current.style.left = rect.left + e.movementX + "px";
            }
            if (rect.top < parentRect.top) {
              eyeRef.current.style.top = "0";
            } else {
              eyeRef.current.style.top = rect.top + e.movementY + "px";
            }
            if (rect.right > parentRect.right)
              eyeRef.current.style.left = parentRect.width - rect.width + "px";
            if (rect.bottom > parentRect.bottom)
              eyeRef.current.style.top = parentRect.height - rect.height + "px";
          }
        });
    }

    const sub2 = fromEvent(window, "resize").subscribe(() => {
      if (eyeRef.current && eyeRef.current.parentElement) {
        const parentRect = eyeRef.current.parentElement.getBoundingClientRect();
        const rect = eyeRef.current.getBoundingClientRect();

        if (rect.left < parentRect.left) {
          eyeRef.current.style.left = "0";
        }
        if (rect.top < parentRect.top) {
          eyeRef.current.style.top = "0";
        }
        if (rect.right > parentRect.right) {
          eyeRef.current.style.left = parentRect.width - rect.width + "px";
        }
        if (rect.bottom > parentRect.bottom) {
          eyeRef.current.style.top = parentRect.height - rect.height + "px";
        }
      }
    });

    return () => {
      sub2.unsubscribe();
      if (subs) {
        subs.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    const mouseSub = fromEvent<MouseEvent>(document, "mousemove").subscribe(
      (e) => {
        if (eyeRef.current && irisRef.current) {
          const mousePos = { x: e.clientX, y: e.clientY };

          const center = getElementCenter(eyeRef.current);

          const distance = getDistance(
            e.clientX,
            center.x,
            e.clientY,
            center.y
          );

          const eyeRadius = getEyeRadius(eyeRef.current);

          if (distance <= eyeRadius) {
            return moveIris(irisRef.current, mousePos);
          }

          const unitVector = getUnitVector(center, mousePos);

          moveIris(irisRef.current, {
            x: center.x + eyeRadius * Math.sin(unitVector.x),
            y: center.y + eyeRadius * Math.sin(unitVector.y),
          });
        }
      }
    );

    return () => {
      mouseSub.unsubscribe();
    };
  });

  return (
    <div className="eye" ref={eyeRef}>
      <div className="iris" ref={irisRef}></div>
    </div>
  );
};
