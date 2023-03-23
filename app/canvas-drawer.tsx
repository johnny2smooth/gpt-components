"use client";
import React, { useRef, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tkcaaymkxvrpewbwspwh.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrY2FheW1reHZycGV3YndzcHdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzkyNTYxMDUsImV4cCI6MTk5NDgzMjEwNX0.ncZ35Lo4RkIJaDhorjIyioqNAL8JrIhnB2YZ2dg1e8Q";

const supabase = createClient(supabaseUrl, supabaseKey);

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

  let currentColor = color;

  const drawingColors = ["#f87171", "#a3e635", "#34d399"];

  useEffect(() => {
    setDimensions({
      width: props.width || window.innerWidth * 0.9,
      height: props.height || window.innerHeight * 0.6,
    });
  }, [props.width, props.height]);

  useEffect(() => {
    if (canvasRef.current) {
      const renderCtx = canvasRef.current.getContext("2d");
      if (renderCtx) {
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
    const tempCanvas = document.createElement("canvas");
    if (dimensions.width && dimensions.height && tempCanvas) {
      tempCanvas.width = dimensions.width;
      tempCanvas.height = dimensions.height;
      const tempContext = tempCanvas.getContext("2d");

      if (!tempContext) return;
      tempContext.fillStyle = "black";
      tempContext.fillRect(0, 0, dimensions.width, dimensions.height);

      tempContext.drawImage(canvasRef.current, 0, 0);

      const dataURL = tempCanvas.toDataURL("image/png");

      // Create a download link and trigger the download
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "canvas_drawing.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      uploadCanvasToSupabase(tempCanvas, generateUniqueFileName());
    }
  };

  async function uploadCanvasToSupabase(
    canvas: HTMLCanvasElement,
    fileName: string
  ): Promise<void> {
    // Convert the canvas to a Blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          throw new Error("Failed to convert canvas to Blob");
        }
      }, "image/png");
    });

    // Upload the Blob to your Supabase bucket
    const { error } = await supabase.storage
      .from("friend-drawings")
      .upload(fileName, blob, { contentType: "image/png" });

    if (error) {
      console.error("Error uploading image:", error.message);
    } else {
      console.log("Image uploaded successfully");
    }
  }

  function generateUniqueFileName() {
    const timestamp = new Date().toISOString();
    const randomString = Math.random().toString(36).substr(2, 9);
    return `user-image-${timestamp}-${randomString}.png`;
  }

  return (
    <div
      style={{
        border: "4px solid white",
        borderRadius: "10px",
        padding: "1em",
        touchAction: "none",
        backgroundImage: "linear-gradient(blue, blue)",
      }}
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
        style={{
          touchAction: "none",
          background: "black",
        }}
      />
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {drawingColors.map((color) => (
          <button
            key={color}
            style={{
              backgroundColor: `${color === currentColor ? color : "black"}`,
              color: `${color === currentColor ? "black" : color}`,
              margin: "5px",
              padding: "20px 10px",
              borderRadius: "5px",
              border: `${color} 2px solid`,
            }}
            onClick={() => setColor(color)}
          >
            {color}
          </button>
        ))}
        <button
          style={{
            margin: "5px",
            background: "transparent",
            border: "white 2px solid",
            padding: "20px 10px",
            borderRadius: "5px",
          }}
          onClick={clearCanvas}
        >
          Clear Drawing
        </button>
        <button
          style={{
            margin: "5px",
            background: "green",
            border: "white 2px solid",
            padding: "20px 20px",
            borderRadius: "5px",
          }}
          onClick={saveCanvas}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default CanvasDrawer;
