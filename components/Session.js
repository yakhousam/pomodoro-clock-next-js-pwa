function Session(props) {
  return (
    <div className="session">
      <div id="session-label" className="label">
        Session Length
      </div>
      <div className="btns-length-time-container">
        <div id="session-length" className="length-time">
          {props.sessionTime}
        </div>
        <div className="btns-inc-dec-container">
          <button
            id="session-increment"
            className="btn"
            onClick={props.onClick}
          >
            ⌃<br />⌃
          </button>
          <button
            id="session-decrement"
            className="btn"
            onClick={props.onClick}
          >
            ⌄<br />⌄
          </button>
        </div>
      </div>
    </div>
  );
}

export default Session;
