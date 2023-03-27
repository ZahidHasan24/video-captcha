const WebcamSection = ({ title, onClickHandler, btnTitle, children }) => {
  
  return (
    <div className="webcam-section">
      <h1 className="title">{title}</h1>
      <div className="webcam">{children}</div>
      <button className="button" onClick={onClickHandler}>
        {btnTitle}
      </button>
    </div>
  );
};

export default WebcamSection;
