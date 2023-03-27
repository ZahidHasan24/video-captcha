import React, { useState, useEffect, useRef } from "react";
import CaptchaSection from "./components/CaptchaSection";
import VideoSection from "./components/VideoSection";
import "./WebcamCapture.css";

const videoWidth = 640;
const videoHeight = 480;
const squareSize = 200;



function WebcamCapture() {
  const webcamRef = useRef(null);
  const intervalId = useRef(null);
  const [squarePosition, setSquarePosition] = useState({
    x: 0,
    y: 0,
    width: 200,
    height: 200,
  });
  const [isCaptured, setIsCaptured] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [watermarkSectors, setWatermarkSectors] = useState(null);
  const [shapeName, setShapeName] = useState("");
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [result, setResult] = useState("");

  useEffect(() => {
    intervalId.current = setInterval(() => {
      setSquarePosition({
        x: Math.floor(Math.random() * (videoWidth - squareSize)),
        y: Math.floor(Math.random() * (videoHeight - squareSize)),
        width: 200,
        height: 200,
      });
    }, 2000);
    return () => clearInterval(intervalId.current);
  }, []);

  const handleContinue = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
    setIsCaptured(true);
    clearInterval(intervalId.current);

    // Divide square area into sectors and randomly assign watermarks to half of them
    const sectors = [];
    const rows = 5;
    const columns = 5;
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
      setResult("failed");
    } else {
      setResult("passed");
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
        {!isCaptured && result === "" && (
          <VideoSection
            title="Take Selfie"
            onClickHandler={handleContinue}
            btnTitle="Continue"
            webcamRef={webcamRef}
            squarePosition={squarePosition}
            squareSize={squareSize}
          />
        )}
        {isCaptured && result === "" && (
          <CaptchaSection
            title={`Select ${shapeName}s`}
            onClickHandler={handleValidation}
            btnTitle="Validate"
            squarePosition={squarePosition}
            watermarkSectors={watermarkSectors}
            onSelectHandler={handleSelectSector}
            imageSrc={imageSrc}
          />
        )}
        {result !== "" && (
          <div className="webcam-section">
            <h1 className={`title ${result}`}>{result}</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default WebcamCapture;
