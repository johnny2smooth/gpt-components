"use client";
import React, { useRef, useEffect, useState } from "react";

interface CanvasDrawerProps {
  width?: number;
  height?: number;
}

const CanvasDrawer: React.FC<CanvasDrawerProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [color, setColor] = useState("#f87171");
  const [dimensions, setDimensions] = useState({
    width: props.width,
    height: props.height,
  });

  const colors = ["#f87171", "#a3e635", "#34d399"];

  useEffect(() => {
    setDimensions({
      width: props.width || window.innerWidth * 0.9,
      height: props.height || window.innerHeight * 0.7,
    });
  }, [props.width, props.height]);

  useEffect(() => {
    if (canvasRef.current) {
      const renderCtx = canvasRef.current.getContext("2d");
      if (renderCtx) {
        renderCtx.fillStyle = "black";
        setContext(renderCtx);
      }
    }
  }, [context]);

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const x =
      "clientX" in e ? e.clientX - rect.left : e.touches[0].clientX - rect.left;
    const y =
      "clientY" in e ? e.clientY - rect.top : e.touches[0].clientY - rect.top;

    return { x, y };
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    // e.preventDefault();
    if (!context) return;

    const { x, y } = getCoordinates(e);

    setDrawing(true);
    context.beginPath();
    context.moveTo(x, y);

    context.lineJoin = "round";
    context.lineCap = "round";
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    // e.preventDefault();
    if (!drawing || !context) return;

    const { x, y } = getCoordinates(e);

    context.lineTo(x, y);
    context.strokeStyle = color;
    context.lineWidth = 5;
    context.stroke();
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const clearCanvas = () => {
    if (!context) return;

    context.clearRect(
      0,
      0,
      dimensions.width || canvasRef.current!.clientWidth,
      dimensions.height || canvasRef.current!.clientHeight
    );
  };

  const saveCanvas = () => {
    if (!canvasRef.current) return;

    // Create a temporary canvas with the same dimensions as the original canvas
    const tempCanvas = document.createElement("canvas");
    if (dimensions.width && dimensions.height && tempCanvas) {
      tempCanvas.width = dimensions.width;
      tempCanvas.height = dimensions.height;
      const tempContext = tempCanvas.getContext("2d");

      if (!tempContext) return;

      // Fill the temporary canvas with the desired background color
      tempContext.fillStyle = "black"; // Change this to the desired background color
      tempContext.fillRect(0, 0, dimensions.width, dimensions.height);

      // Draw the original canvas onto the temporary canvas
      tempContext.drawImage(canvasRef.current, 0, 0);

      // Generate the data URL from the temporary canvas
      const dataURL = tempCanvas.toDataURL("image/png");

      // Create a download link and trigger the download
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "canvas_drawing.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div
      style={{ border: "2px solid white", padding: "1em", touchAction: "none" }}
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onMouseMove={draw}
        onTouchStart={startDrawing}
        onTouchEnd={stopDrawing}
        onTouchMove={draw}
        style={{ touchAction: "none", background: "black" }}
      />
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {colors.map((color) => (
          <button
            key={color}
            style={{ backgroundColor: color, margin: "5px" }}
            onClick={() => setColor(color)}
          >
            {color}
          </button>
        ))}
        <button style={{ margin: "5px" }} onClick={clearCanvas}>
          Clear
        </button>
        <button style={{ margin: "5px" }} onClick={saveCanvas}>
          Save
        </button>
      </div>
    </div>
  );
};

export default CanvasDrawer;
