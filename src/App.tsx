import type React from "react";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Point from "./components/Point";
import { getSecondsAnMillisecondsFirstDigit } from "./utils/getSecondsAnMillisecondsFirstDigit";
import { generateDisplayPoint } from "./utils/generateDisplayPoints";

export type DisplayPoint = {
	id: string;
	number: number;
	position: { top: string; left: string };
	zIndex: number;
	fadeOut: boolean;
};

export const FADE_OUT_TIMEOUT = 3000;

const App: React.FC = () => {
	const [inputValue, setInputValue] = useState<string>("");
	const [time, setTime] = useState<number>(0);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [displayPoints, setDisplayPoints] = useState<DisplayPoint[]>([]);
	const [isGameOver, setIsGameOver] = useState(false);
	const [isCompleted, setIsCompleted] = useState(false);
	const [autoPlay, setAutoPlay] = useState(false);

	useEffect(() => {
		let timer: ReturnType<typeof setTimeout> | null = null;
		if (isPlaying) {
			timer = setInterval(() => {
				setTime((prevTime) => prevTime + 100);
			}, 100);
		}
		return () => {
			if (timer) {
				clearInterval(timer);
			}
		};
	}, [isPlaying]);

	const formattedTime = getSecondsAnMillisecondsFirstDigit(time);
	const activePoints = displayPoints.filter((point) => !point.fadeOut);
	const firstPoint = activePoints[0];

	const isRestart = isCompleted || isGameOver || isPlaying;

	const handleRestart = () => {
		if (autoPlay) {
			setAutoPlay(false);
		}

		if (isPlaying) {
			setTime(0);
			setDisplayPoints(generateDisplayPoint(Number(inputValue)));
			return;
		}

		if (isGameOver) {
			setIsGameOver(false);
		}
		setTime(0);
		setInputValue("");
		setIsCompleted(false);
	};

	const handlePlay = () => {
		setIsPlaying(true);
		setDisplayPoints(generateDisplayPoint(Number(inputValue)));
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (!isNaN(Number(value))) {
			setInputValue(value);
		}
	};

	const handlePointClick = (id: string) => {
		// CASE 1: Game over -> do nothing
		if (isGameOver) return;

		// CASE 2: Point clicked not is first active points
		if (id !== firstPoint?.id) {
			setIsGameOver(true);
			setIsPlaying(false);
			toast.error("GAME OVER!");
			return;
		}

		// Update points, setting fadeOut to true for the clicked point
		const updatedPoints = displayPoints.map((point) =>
			point.id === id ? { ...point, fadeOut: true } : point,
		);

		setDisplayPoints(updatedPoints);

		// If no active points remain, complete the game
		const hasRemainingActivePoints = updatedPoints.some(
			(point) => !point.fadeOut,
		);
		if (!hasRemainingActivePoints) {
			setTimeout(() => {
				setIsCompleted(true);
				setIsPlaying(false);
			}, FADE_OUT_TIMEOUT);
		}
	};

	const handleAutoPlay = () => {
		if (!autoPlay) {
			setAutoPlay(true);
		} else {
			setAutoPlay(false);
		}
	};

	useEffect(() => {
		let autoPlayTimer: ReturnType<typeof setInterval> | null = null;

		if (autoPlay && !isGameOver) {
			autoPlayTimer = setInterval(() => {
				if (firstPoint) {
					handlePointClick(firstPoint.id);
				}
			}, 1000); // 1 second delay between each click

			return () => {
				if (autoPlayTimer) clearInterval(autoPlayTimer);
			};
		}
	}, [autoPlay, firstPoint, isGameOver]);

	useEffect(() => {
		if (isCompleted) {
			toast.success(`
        Congratulations!!! You have completed the game within ${formattedTime.seconds}.${formattedTime.millisecondsFirstDigit}s`);
		}
	}, [isCompleted, formattedTime]);

	const renderTitle = () => {
		if (isCompleted) return <span className="text-[#16a34a]">ALL CLEARED</span>;
		return <span>LET'S PLAY</span>;
	};

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-gray-100">
			<div className="mb-4">
				<div className="font-bold min-h-6 mb-2">
					<h2 className="mb-3 text-center ">{renderTitle()}</h2>
					<div className="flex items-center gap-3">
						<label
							htmlFor="points"
							className="block text-gray-700 text-sm font-bold mb-2"
						>
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
					onClick={() => {
						if (isRestart) {
							handleRestart();
							return;
						}
						handlePlay();
					}}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
					disabled={!inputValue}
					style={{ cursor: !inputValue ? "not-allowed" : "pointer" }}
				>
					{isRestart ? "Restart" : "Play"}
				</button>
				{isPlaying && (
					<button
						onClick={handleAutoPlay}
						className="ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
					>
						{autoPlay ? "Auto play OFF" : "Auto play ON"}
					</button>
				)}
			</div>
			<div className="mt-8">
				<div className="h-11 bg-orange-300 flex items-center justify-between ">
					<p className="text-l ml-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="size-6 inline"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
							/>
						</svg>
						: {formattedTime.seconds}.{formattedTime.millisecondsFirstDigit}s
					</p>

					{firstPoint && (
						<p className="text-lg mr-3 text-stone-950">
							{" "}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="size-6 inline"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
								/>
							</svg>
							{firstPoint.number}{" "}
						</p>
					)}
				</div>
				<div className="relative w-96 h-96 bg-white rounded-b-lg border border-gray-300 bg-[url('https://thuthuatoffice.net/wp-content/uploads/2023/08/8478a990a48e4fa7e5c7b8927b97a995.jpg')]  bg-center ">
					{displayPoints.map((displayPoint) => {
						return (
							<Point
								key={displayPoint.id}
								isGameOver={isGameOver}
								isPlaying={isPlaying}
								displayPoint={displayPoint}
								onClick={handlePointClick}
							/>
						);
					})}
				</div>
			</div>
			<ToastContainer theme="colored" />
		</div>
	);
};

export default App;