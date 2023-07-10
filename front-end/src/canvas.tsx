import { useEffect, useRef } from "react";
export const canvasStyle = {
  backgroundColor: "#f0f0f0",
};
const Canvas = ({ points, width, height }: any) => {
  const canvasRef = useRef<any>(null);

  // Scale points to fit the canvas size
  // Scale points to fit the canvas size
  const scalePointY = (point: number, maxPoint: number) =>
    (point / maxPoint) * maxPoint;
  const scalePointX = (point: number, maxPoint: number) =>
    (point / maxPoint) ** 2 * maxPoint; // quadratic transformation

  const drawCurve = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    points.forEach((point: any, i: number) => {
      // Swap x and y again and invert y
      const x = scalePointY(i, points.length - 1);
      const y = width - scalePointX(point, Math.max(...points));

      if (i === 0) {
        ctx.moveTo(x, y);
      } else if (i === points.length - 1) {
        ctx.lineTo(x, y);
      } else {
        const nextX = scalePointY(i + 1, points.length - 1);
        const nextY = width - scalePointX(points[i + 1], Math.max(...points));

        ctx.bezierCurveTo(x, y, x, y, nextX, nextY);
      }
    });

    ctx.strokeStyle = "black"; // Line color
    ctx.lineWidth = 2; // Line width
    ctx.stroke();
  };
  useEffect(() => {
    drawCurve();
  }, [points]);

  // useEffect(() => {
  //   drawCurve();
  // }, [points]); // Re-draw the curve whenever the points array changes

  return (
    <canvas ref={canvasRef} width={width} style={canvasStyle} height={height} />
  );
};

export default Canvas;
