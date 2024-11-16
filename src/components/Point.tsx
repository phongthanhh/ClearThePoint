import { useEffect, useState } from "react";
import { getSecondsAnMillisecondsFirstDigit } from "../utils/getSecondsAnMillisecondsFirstDigit";
import { FADE_OUT_TIMEOUT } from "../constants";
import { DisplayPoint } from "../types";

type Props = {
  isGameOver: boolean;
  isPlaying: boolean;
  displayPoint: DisplayPoint;
  onClick: (id: DisplayPoint["id"]) => void;
};

const Point = (props: Props) => {
  const {
    isGameOver,
    isPlaying,
    displayPoint: { fadeOut, id, position, zIndex, number },
    onClick,
  } = props;
  const [time, setTime] = useState<number>(FADE_OUT_TIMEOUT);
  const [opacity, setOpacity] = useState<number>(1);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (isGameOver || !isPlaying) {
      if (timer) {
        clearInterval(timer);
      }
      return;
    }

    if (fadeOut) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime - 100;
          if (newTime === 0) {
            clearInterval(timer!);
            return 0;
          }
          return newTime;
        });
        setOpacity((prevOpacity) => {
          const newOpacity = prevOpacity - 1 / (FADE_OUT_TIMEOUT / 100);
          return newOpacity < 0 ? 0 : newOpacity;
        });
      }, 100);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [fadeOut, isGameOver, isPlaying]);

  const formattedTime = getSecondsAnMillisecondsFirstDigit(time);

  return (
    <div
      onClick={() => {
        if (fadeOut) return;
        onClick(id);
      }}
      className={`absolute w-10 h-10 rounded-full border border-[#ea580c] items-center justify-center font-bold cursor-pointer flex flex-col
      `}
      style={{
        top: position.top,
        left: position.left,
        zIndex: zIndex,
        cursor: isGameOver ? "no-drop" : "pointer",
        backgroundColor: fadeOut ? "#ea580c" : "white",
        opacity,
      }}
    >
      <span className="text-sm">{number}</span>
      {fadeOut && (
        <span className="h-max text-xs text-white font-normal">{`${formattedTime.seconds}.${formattedTime.millisecondsFirstDigit}s`}</span>
      )}
    </div>
  );
};

export default Point;