import { useEffect, useRef, useCallback, useState } from "react";
import Break from "../components/Break";
import Clock from "../components/Clock";
import Session from "../components/Session";
// import Beep from "../beep.mp3";

const initialState = {
  sessionTime: 25,
  breakTime: 5,
  timeSeconds: 25 * 60,
  clockTime: "25:00",
  timerId: "",
  timerState: "Session",
  timerIsRunning: false,
};

export default function Index() {
  const [state, setState] = useState(() => initialState);
  const workerRef = useRef();
  const audioRef = useRef();
  useEffect(() => {
    workerRef.current = new Worker("../worker.js", { type: "module" });
    workerRef.current.onmessage = (event) => {
      // console.log(event);
      const { action, payload } = event.data;
      if (action === "UPDATE_STATE") {
        setState((c) => ({ ...c, ...payload }));
      }
      if (action === "PLAY_BEEP") {
        setState((c) => ({ ...c, ...payload }));
        audioRef.current.play();
      }
    };

    return () => {
      workerRef.current.terminate();
    };
  }, []);

  const secondsToMinuteFormat = (seconds) => {
    if (seconds <= 0) {
      return "00:00";
    }
    const formatDigit = (num) => (num < 10 ? "0" + num : num);
    let minute = Math.floor(seconds / 60);
    return formatDigit(minute) + ":" + formatDigit(seconds - minute * 60);
  };

  // const handleClick = useCallback(async () => {
  //   workerRef.current.postMessage(100000);
  // }, []);
  const handleClick = (e) => {
    const elementId = e.target.id;
    let sessionTime = state.sessionTime;
    let breakTime = state.breakTime;

    if (elementId === "start_stop") {
      if (state.timerIsRunning) {
        workerRef.current.postMessage({ action: "PAUSE" });
        setState((c) => ({ ...c, timerIsRunning: false }));
      } else {
        setState((c) => ({ ...c, timerIsRunning: true }));
        workerRef.current.postMessage({
          action: "START",
          payload: {
            breakTime: state.breakTime,
            sessionTime: state.sessionTime,
          },
        });
      }
      return;
    }
    if (elementId === "reset") {
      workerRef.current.postMessage({
        action: "RESET",
        payload: { breakTime: state.breakTime, sessionTime: state.sessionTime },
      });
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setState(initialState);
      return;
    }
    if (!state.timerIsRunning) {
      switch (elementId) {
        case "session-increment":
          sessionTime = sessionTime < 60 ? sessionTime + 1 : 60;
          break;
        case "session-decrement":
          sessionTime = sessionTime > 1 ? sessionTime - 1 : 1;
          break;
        case "break-increment":
          breakTime = breakTime < 60 ? breakTime + 1 : 60;
          break;
        case "break-decrement":
          breakTime = breakTime > 1 ? breakTime - 1 : 1;
          break;
        default:
          break;
      }
      setState((c) => ({
        ...c,
        sessionTime,
        breakTime,
        timeSeconds: sessionTime * 60,
        clockTime: secondsToMinuteFormat(sessionTime * 60),
      }));
    }
  };

  return (
    <main>
      <h1 id="title">Pomodoro Clock</h1>
      <p className="author-2">
        Coded and designed by
        <a href="https://github.com/yakhousam/Pomodoro-Clock">yakhousam</a>
      </p>
      <section className="container">
        <div className="about">
          <p className="author">
            Coded and designed by <br />
            <a href="https://github.com/yakhousam/Pomodoro-Clock">yakhousam</a>
          </p>
        </div>
        <Break breakTime={state.breakTime} onClick={handleClick} />
        <Session sessionTime={state.sessionTime} onClick={handleClick} />
        <Clock
          time={state.clockTime}
          timerState={state.timerState}
          onClick={handleClick}
        />
        <audio id="beep" ref={audioRef} src="beep.mp3" />
      </section>
    </main>
  );
}
