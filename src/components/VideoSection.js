import WebcamSection from "./WebcamSection";
import Webcam from "react-webcam";

const VideoSection = ({
  title,
  btnTitle,
  onClickHandler,
  webcamRef,
  squarePosition,
  squareSize
}) => {
  return (
    <WebcamSection
      title={title}
      onClickHandler={onClickHandler}
      btnTitle={btnTitle}
    >
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      {webcamRef.current !== null && (
        <div
          className="square"
          style={{
            position: "absolute",
            left: `${squarePosition.x}px`,
            top: `${squarePosition.y}px`,
            width: `${squareSize}px`,
            height: `${squareSize}px`,
          }}
        />
      )}
    </WebcamSection>
  );
};

export default VideoSection;
