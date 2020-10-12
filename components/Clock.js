function Clock(props) {
  return (
    <React.Fragment>
      <div className="timer">
        <div id="timer-label" className="label">
          {props.timerState}
        </div>
        <div id="time-left">{props.time}</div>
      </div>

      <div className="btns-time-container">
        <button id="start_stop" className="btn" onClick={props.onClick}>
          ⏯
        </button>
        <button id="reset" className="btn" onClick={props.onClick}>
          ◼
        </button>
      </div>
    </React.Fragment>
  );
}
export default Clock;
