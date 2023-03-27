import React from "react";
import Webcam from "react-webcam";
import "./WebcamCapture.css"; // Import the CSS file

const videoWidth = 640;
const videoHeight = 480;
const squareSize = 200;

let intervalId;

function WebcamCapture() {
  const webcamRef = React.useRef(null);
  const [squarePosition, setSquarePosition] = React.useState({
    x: 0,
    y: 0,
    width: 200,
    height: 200,
  });
  const [isCaptured, setIsCaptured] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState(null);
  const [watermarkSectors, setWatermarkSectors] = React.useState(null);
  const [shapeName, setShapeName] = React.useState("");
  const [selectedSectors, setSelectedSectors] = React.useState([]);

  React.useEffect(() => {
    intervalId = setInterval(() => {
      setSquarePosition({
        x: Math.floor(Math.random() * (videoWidth - squareSize)),
        y: Math.floor(Math.random() * (videoHeight - squareSize)),
        width: 200,
        height: 200,
      });
    }, 2000);
    return () => clearInterval(intervalId);
  }, [videoWidth, videoHeight]);

  const handleContinue = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
    setIsCaptured(true);
    clearInterval(intervalId);

    // Divide square area into sectors and randomly assign watermarks to half of them
    const sectors = [];
    const rows = 3;
    const columns = 3;
    const sectorWidth = squarePosition.width / columns;
    const sectorHeight = squarePosition.height / rows;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const sector = {
          x: j * sectorWidth,
          y: i * sectorHeight,
          width: sectorWidth,
          height: sectorHeight,
          hasWatermark: false,
          selected: false,
        };
        sectors.push(sector);
      }
    }
    const watermarkedSectors = [];
    const numWatermarkedSectors = Math.floor(rows * columns * 0.5);
    for (let i = 0; i < numWatermarkedSectors; i++) {
      const sectorIndex = Math.floor(Math.random() * sectors.length);
      const watermarkShape = ["triangle", "square", "circle"][
        Math.floor(Math.random() * 3)
      ];
      const watermarkedSector = {
        ...sectors[sectorIndex],
        hasWatermark: true,
        watermarkShape,
      };
      watermarkedSectors.push(watermarkedSector);
      sectors.splice(sectorIndex, 1);
    }

    const seletctedShapeName = [
      ...new Set(watermarkedSectors.map((item) => item.watermarkShape)),
    ][Math.floor(Math.random() * 3)];

    setWatermarkSectors([...sectors, ...watermarkedSectors]);
    setShapeName(seletctedShapeName);
  };

  const handleValidation = () => {
    const selectedShapes = selectedSectors.filter(
      (sector) => sector.watermarkShape === shapeName
    );

    if (
      selectedShapes.length === 0 ||
      selectedShapes.length !== selectedSectors.length
    ) {
      // setResult("fail");
      console.log("fail");
    } else {
      // setResult("pass");
      console.log("pass");
    }
  };

  const handleSelectSector = (sector) => {
    // find the index of the sector in watermarkSectors
    const watermarkSectorsCopy = [...watermarkSectors];
    const selectedSectorsCopy = [...selectedSectors];
    const index = watermarkSectorsCopy.findIndex(
      (s) => s.x === sector.x && s.y === sector.y
    );

    // if the sector is already selected, deselect it and remove it from selectedSectors
    if (watermarkSectorsCopy[index].selected) {
      watermarkSectorsCopy[index].selected = false;
      const selectedIndex = selectedSectorsCopy.findIndex(
        (s) => s.x === sector.x && s.y === sector.y
      );
      if (selectedIndex >= 0) {
        selectedSectorsCopy.splice(selectedIndex, 1);
      }
    } else {
      // otherwise, select it and add it to selectedSectors
      watermarkSectorsCopy[index].selected = true;
      selectedSectorsCopy.push(sector);
    }
    setWatermarkSectors(watermarkSectorsCopy);
    setSelectedSectors(selectedSectorsCopy);
  };

  return (
    <div className="webcam-container">
      <div className="section">
        {!isCaptured && (
          <>
            <div className="webcam-section">
              <h1 className="title">Take Selfie</h1>
              <div className="webcam">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                />
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
              </div>

              <button className="continue-button" onClick={handleContinue}>
                Continue
              </button>
            </div>
          </>
        )}
        {isCaptured && (
          <div className="webcam-section">
            {shapeName && <h1 className="title">Select {shapeName}s</h1>}
            <div className="webcam">
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
                    style={{
                      left: `${s.x}px`,
                      top: `${s.y}px`,
                      width: `${s.width}px`,
                      height: `${s.height}px`,
                      backgroundColor: s.selected ? "red" : "",
                    }}
                    onClick={() => handleSelectSector(s)}
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
            </div>

            <button className="continue-button" onClick={handleValidation}>
              Validate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default WebcamCapture;
