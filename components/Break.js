function Break(props) {
  return (
    <div className="break">
      <div id="break-label" className="label">
        Break Length
      </div>
      <div className="btns-length-time-container">
        <div id="break-length" className="length-time">
          {props.breakTime}
        </div>
        <div className="btns-inc-dec-container">
          <button id="break-increment" className="btn" onClick={props.onClick}>
            ⌃<br />⌃
          </button>
          <button id="break-decrement" className="btn" onClick={props.onClick}>
            ⌄<br />⌄
          </button>
        </div>
      </div>
    </div>
  );
}

export default Break;
