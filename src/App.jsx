import { useState, useEffect, useRef } from "react";
import { FaArrowUp, FaArrowDownLong, FaPlay, FaPause } from "react-icons/fa6";
import { VscDebugRestart } from "react-icons/vsc";
import "./App.css";

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerLabel, setTimerLabel] = useState("Session");
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const handleIncrementDecrement = (type, operation) => {
    if (isRunning) return;

    if (type === "break") {
      if (operation === "increment" && breakLength < 60) {
        setBreakLength(breakLength + 1);
      } else if (operation === "decrement" && breakLength > 1) {
        setBreakLength(breakLength - 1);
      }
    } else if (type === "session") {
      if (operation === "increment" && sessionLength < 60) {
        setSessionLength(sessionLength + 1);
        setTimeLeft((sessionLength + 1) * 60);
      } else if (operation === "decrement" && sessionLength > 1) {
        setSessionLength(sessionLength - 1);
        setTimeLeft((sessionLength - 1) * 60);
      }
    }
  };

  const handleStartStop = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    } else {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerLabel("Session");
    setIsRunning(false);
    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
  };

  useEffect(() => {
    if (timeLeft < 0) {
      const audio = document.getElementById("beep");
      audio.play();
      if (timerLabel === "Session") {
        setTimeLeft(breakLength * 60);
        setTimerLabel("Break");
      } else {
        setTimeLeft(sessionLength * 60);
        setTimerLabel("Session");
      }
    } else if (timeLeft === 0) {
      const audio = document.getElementById("beep");
      audio.play();
    }
  }, [timeLeft, timerLabel, breakLength, sessionLength]);

  useEffect(() => {
    if (!isRunning) {
      clearInterval(intervalRef.current);
    }
  }, [isRunning]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  return (
    <>
      <main className="flex justify-center items-center w-full h-full min-h-screen bg-[#1e555c]">
        <div className="flex flex-col text-white p-6">
          <h1 className="text-5xl text-center font-serif">25 + 5 Clock</h1>

          {/* Break and Session Length */}
          <div className="flex flex-row gap-10 my-4">
            <div className="items-center text-center space-y-2 text-2xl">
              <h1 id="break-label" className="">
                Break Length
              </h1>
              <div className="space-x-2">
                <button
                  id="break-increment"
                  onClick={() => handleIncrementDecrement("break", "increment")}
                >
                  <FaArrowUp />
                </button>
                <span id="break-length">{breakLength}</span>
                <button
                  id="break-decrement"
                  onClick={() => handleIncrementDecrement("break", "decrement")}
                >
                  <FaArrowDownLong />
                </button>
              </div>
            </div>
            <div className="items-center text-center space-y-2 text-2xl">
              <h1 id="session-label" className="">
                Session Length
              </h1>
              <div className="space-x-2">
                <button
                  id="session-increment"
                  onClick={() =>
                    handleIncrementDecrement("session", "increment")
                  }
                >
                  <FaArrowUp />
                </button>
                <span id="session-length">{sessionLength}</span>
                <button
                  id="session-decrement"
                  onClick={() =>
                    handleIncrementDecrement("session", "decrement")
                  }
                >
                  <FaArrowDownLong />
                </button>
              </div>
            </div>
          </div>

          {/* Timer */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center rounded-3xl border-4 border-[#13353a] p-6 gap-2">
              <h1 id="timer-label" className="text-xl">
                {timerLabel}
              </h1>
              <span id="time-left" className="text-7xl font-serif">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Action Button Below */}
          <div className="flex flex-row items-center justify-center my-4 gap-4">
            <button id="start_stop" onClick={handleStartStop}>
              {isRunning ? <FaPause size={30} /> : <FaPlay size={30} />}
            </button>
            <button id="reset" onClick={handleReset}>
              <VscDebugRestart size={30} />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center font-mono font-semibold">
            {" "}
            <h1 className="text-md text-[#982e4a]">Designed and Coded By</h1>
            <p className="text-sm text-[#002f55]">
              <a href="https://github.com/Loydie16">Jon Loyd Talagtag</a>
            </p>
          </div>
        </div>
      </main>
      <audio
        id="beep"
        src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
      ></audio>
    </>
  );
}

export default App;
