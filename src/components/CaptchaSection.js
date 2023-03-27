import WebcamSection from "./WebcamSection";


const CaptchaSection = ({
  title,
  btnTitle,
  onClickHandler,
  squarePosition,
  imageSrc,
  watermarkSectors,
  onSelectHandler
}) => {
  return (
    <WebcamSection
      title={title}
      onClickHandler={onClickHandler}
      btnTitle={btnTitle}
    >
      <img src={imageSrc} alt="Captured" />
      <div
        className="sectors-container"
        style={{
          width: `${squarePosition.width}px`,
          height: `${squarePosition.height}px`,
          left: `${squarePosition.x}px`,
          top: `${squarePosition.y}px`,
        }}
      >
        {watermarkSectors.map((s, i) => (
          <div
            key={i}
            className={`sector${s.hasWatermark ? " watermark" : ""}`}
            data-testid="sector"
            style={{
              left: `${s.x}px`,
              top: `${s.y}px`,
              width: `${s.width}px`,
              height: `${s.height}px`,
              backgroundColor: s.selected ? "#03285d" : "",
            }}
            data-shape={s.watermarkShape}
            onClick={() => onSelectHandler(s)}
          >
            {s.hasWatermark && (
              <svg viewBox="0 0 100 100">
                {s.watermarkShape === "triangle" && (
                  <polygon points="0,100 50,0 100,100" />
                )}
                {s.watermarkShape === "square" && (
                  <rect x="0" y="0" width="100" height="100" />
                )}
                {s.watermarkShape === "circle" && (
                  <circle cx="50" cy="50" r="50" />
                )}
              </svg>
            )}
          </div>
        ))}
      </div>
    </WebcamSection>
  );
};

export default CaptchaSection;
