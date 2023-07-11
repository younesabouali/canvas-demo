import { useEffect, useRef } from "react";

export const GraphCanvas = ({
  xMax,
  xMin,
  graphFunction,
  progress,
  incrementation,
}: any) => {
  const canvasRef = useRef<any>(null);

  const yMin = graphFunction(xMin);
  const yMax = graphFunction(xMax);
  function mapX(x: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasWidth = canvas.width;
    const xRange = xMax - xMin;
    const xRatio = canvasWidth / xRange;
    return (x - xMin) * xRatio;
  }

  function mapY(y: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasHeight = canvas.height;
    const yRange = yMax - yMin;
    const yRatio = canvasHeight / yRange;
    return canvasHeight - (y - yMin) * yRatio;
  }

  // Draw the graph
  function drawGraph() {
    // Clear the canvas
    //
    //
    //
    const canvas = canvasRef.current;
    console.log(canvas);
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!canvas) return;
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the x-axis
    context.beginPath();
    context.moveTo(0, mapY(0));
    context.lineTo(canvas.width, mapY(0));
    context.stroke();

    // Draw the y-axis
    context.beginPath();
    context.moveTo(mapX(0), 0);
    context.lineTo(mapX(0), canvas.height);
    context.stroke();
  }

  // Draw the function
  async function drawFunction() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    context.beginPath();

    // Draw points and connect them with lines
    let xPrev: any = 0;
    let yPrev: any = 0;
    for (
      let x = xMin;
      x < xMax * progress + incrementation;
      x += incrementation
    ) {
      const y = graphFunction(x);
      const canvasX = mapX(x);
      const canvasY = mapY(y);

      if (x === xMin) {
        context.moveTo(canvasX, canvasY);
        xPrev = canvasX;
        yPrev = canvasY;
      } else {
        // await resolveTimeout(() => {}, 10).promise;

        context.beginPath();
        context.moveTo(xPrev, yPrev);
        xPrev = canvasX;
        yPrev = canvasY;
        console.log(canvasX, canvasY);

        context.lineTo(canvasX, canvasY);

        context.strokeStyle = "black"; // Line color
        context.lineWidth = 2; // Line width
        context.stroke();
      }
    }
  }

  useEffect(() => {
    // drawGraph();
    // drawFunction();
    // Define the function you want to graph
    // Determine the range of x and y values
    // Helper functions to map x and y values to canvas coordinates
  }, []);
  useEffect(() => {
    console.log("new Progress called", progress);
    drawGraph();
    drawFunction();
  }, [progress]);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      style={{ background: "white" }}
    />
  );
};
