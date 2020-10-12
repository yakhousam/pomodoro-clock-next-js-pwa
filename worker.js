// This is a module worker, so we can use imports (in the browser too!)
import pi from "./utils/pi";

const secondsToMinuteFormat = (seconds) => {
  if (seconds <= 0) {
    return "00:00";
  }
  const formatDigit = (num) => (num < 10 ? "0" + num : num);
  let minute = Math.floor(seconds / 60);
  return formatDigit(minute) + ":" + formatDigit(seconds - minute * 60);
};

let state = {
  timeSeconds: 0,
  breakTime: 0,
  sessionTime: 0,
  timerId: null,
  timerState: "Session",
  isReset: false,
  isPause: false,
};

const timer = () => {
  if (state.isReset || state.isPause) return;
  let timerId = setTimeout(timer, 1000);
  if (state.timeSeconds >= 0) {
    state.timeSeconds = state.timeSeconds - 1;
    postMessage({
      action: "UPDATE_STATE",
      payload: {
        clockTime: secondsToMinuteFormat(state.timeSeconds),
        timerId: timerId,
        timeSeconds: state.timeSeconds,
      },
    });
  } else {
    state =
      state.timerState === "Session"
        ? {
            ...state,
            timerState: "Break",
            timeSeconds: state.breakTime * 60,
            timerId: timerId,
          }
        : {
            ...state,
            timerState: "Session",
            timeSeconds: state.sessionTime * 60,
            timerId: timerId,
          };

    postMessage({
      action: "PLAY_BEEP",
      payload: {
        timerState: state.timerState,
        clockTime:
          state.timerState === "Session"
            ? secondsToMinuteFormat(state.breakTime * 60)
            : secondsToMinuteFormat(state.sessionTime * 60),
      },
    });
  }
};

const startTimer = ({ breakTime, sessionTime }) => {
  state.timeSeconds = sessionTime * 60;
  state.sessionTime = sessionTime;
  state.breakTime = breakTime;
  state.isReset = false;
  state.isPause = false;
  timer();
};

const pause = () => {
  clearTimeout(state.timerId);
  state.isPause = true;
};

const resume = () => {
  state.isPause = false;
  timer();
};

addEventListener("message", (event) => {
  const { action, payload } = event.data;
  console.log("webworker recieved an order", action, payload);
  if (action === "START") {
    if (state.isPause) {
      resume();
      return;
    }
    startTimer({ ...payload });
  }
  if (action === "RESET") {
    clearTimeout(state.timerId);
    state.isReset = true;
  }
  if (action === "PAUSE") {
    pause();
  }
});
