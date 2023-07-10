import React, { useRef, useEffect, useState } from "react";
export interface Line {
  from: [number, number];
  to: [number, number];
}
interface CanvasProps {
  width: number;
  height: number;
  line?: Line;
}
export const canvasStyle = {
  backgroundColor: "#f0f0f0",
};
const Canvas: React.FC<CanvasProps> = ({ width, height, line }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<any>(null);

  const DrawLine = (line?: Line) => {
    if (!canvasRef?.current) return;
    console.log(context);
    if (!context) return;
    context.fillStyle = "red";

    const canvas = canvasRef.current;
    // Set canvas size

    if (line) {
      if (canvas.width < line?.to[0] || canvas.width < line?.from[0]) return;
      if (canvas.height < line?.to[1] || canvas.height < line?.from[1]) return;

      context.lineTo(...line.to); // Ending point
      context.strokeStyle = "black"; // Line color
      context.lineWidth = 2; // Line width
      context.stroke();
    }
    // Draw a line
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    setContext(context);
    if (!context) return;
    canvas.width = width;
    canvas.height = height;
    context.beginPath();
    if (!line) return;
    context.moveTo(line.from[0], line.from[1]);
  }, [width, height]);

  useEffect(() => {
    DrawLine(line);
  }, [line, context]);
  return (
    <div style={{ width: 500, height: 500, ...canvasStyle }}>
      <canvas ref={canvasRef} style={canvasStyle} />
    </div>
  );
};

export default Canvas;
