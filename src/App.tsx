import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';

type DisplayPoint = {
  id: number;
  position: { top: string; left: string };
  zIndex: number;
  fadeOut: boolean;
};

const App: React.FC = () => {


  const [inputValue, setInputValue] = useState<string>("");
  const [time, setTime] = useState<number>(0); // Time in milliseconds
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [displayPoints, setDisplayPoints] = useState<DisplayPoint[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (isPlaying && displayPoints.length) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 100);
      }, 100);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isPlaying, displayPoints]);

  const seconds = Math.floor(time / 1000); // Calculate full seconds
  const milliseconds = Math.floor((time % 1000) / 100); // Get the first digit of milliseconds
  const activePoints = displayPoints.filter((point) => !point.fadeOut);
  const firstPoint = activePoints[0];

  const handlePlay = () => {
    if (isPlaying || isGameOver) {
      // Reset game
      setIsPlaying(false);
      setTime(0);
      setDisplayPoints([]);
      setInputValue("");
      setIsGameOver(false);
    } else {
      // Start game
      setIsPlaying(true);
      const pointsArray = Array.from({ length: Number(inputValue) }, (_, i) => ({
        id: i + 1,
        fadeOut: false,
        position: {
          top: Math.random() * 90 + "%",
          left: Math.random() * 90 + "%",
        },
        zIndex: Number(inputValue) - i,
      }));
      setDisplayPoints(pointsArray);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isNaN(Number(value))) {
      setInputValue(value);
    }
  };

  const handlePointClick = (id: number) => {
    // CASE 1: Game over -> do nothing
    if (isGameOver) return;

    // CASE 2: Point clicked not is first active points
    // If the clicked point is not the first active point, end the game
    if (id !== firstPoint?.id) {
      setIsGameOver(true);
      setIsPlaying(false);
      toast.error("GAME OVER!");
      return;
    }

    // Update points, setting fadeOut to true for the clicked point
    const updatedPoints = displayPoints.map((point) => (point.id === id ? { ...point, fadeOut: true } : point));
    // CASE 3: Update display points
    setDisplayPoints(updatedPoints);

    // CASE 4: Clear display points and reset input value if not exist any point have fadeout
    // If no active points remain, reset the game state
    const hasRemainingActivePoints = updatedPoints.some((point) => !point.fadeOut);
    if (!hasRemainingActivePoints) {
      toast.success(`Congratulations!!! You have completed the game within ${seconds}.${milliseconds}s`);
      setDisplayPoints([]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="mb-4">
        <div className="font-bold min-h-6 mb-2">
          <h2 className="mb-3 text-center ">LET'S PLAY</h2>
          <div className="flex items-center gap-3">
            <label htmlFor="points" className="block text-gray-700 text-sm font-bold mb-2">
              Points:
            </label>
            <input
              id="points"
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter a number"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={handlePlay}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
          disabled={!inputValue}
          style={{ cursor: !inputValue ? "not-allowed" : "pointer" }}
        >
          {isPlaying || isGameOver ? "Restart" : "Play"}
        </button>
      </div>
      <div className="mt-8">
        <div className="h-11 bg-orange-300 flex items-center justify-between ">
          <p className="text-l ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 inline">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            : {seconds}.{milliseconds}s
          </p>

          {firstPoint && <p className="text-lg mr-3 text-stone-950"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 inline">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
            {firstPoint.id} </p>}
        </div>
        <div className="relative w-96 h-96 bg-white rounded-b-lg border border-gray-300 bg-[url('https://thuthuatoffice.net/wp-content/uploads/2023/08/8478a990a48e4fa7e5c7b8927b97a995.jpg')]  bg-center ">
          {displayPoints.map(({ id, position, zIndex, fadeOut }) => {
            return (
              <div
                key={id}
                onClick={() => {
                  if (fadeOut) return;
                  handlePointClick(id);
                }}
                className={`${fadeOut ? "opacity-0" : "opacity-100"
                  } absolute w-10 h-10 rounded-full border border-black flex items-center justify-center font-bold cursor-pointer transition-opacity duration-1000`}
                style={{
                  top: position.top,
                  left: position.left,
                  zIndex,
                  cursor: isGameOver ? "no-drop" : "pointer",
                  backgroundColor: fadeOut ? "#ea580c" : "white"
                }}
              >
                {id}
              </div>
            );
          })}
        </div>
      </div>

      <ToastContainer theme="colored" />
    </div>
  );

};

export default App;