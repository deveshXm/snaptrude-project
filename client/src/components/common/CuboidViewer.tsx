import React, { useEffect, useRef, useState } from "react";

import { CuboidScene } from "../../utils/cuboidScene";
import { UI_CONFIG } from "../../constants/babylon.config";

import Progress from "../ui/Progress";

const CuboidViewer: React.FC<{ capturedImage: string }> = ({ capturedImage }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<CuboidScene | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    sceneRef.current = new CuboidScene(canvasRef.current, setProgress);
    sceneRef.current.run();

    const handleResize = () => sceneRef.current?.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      sceneRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (sceneRef.current && capturedImage) {
      setProgress(0); // Reset progress when a new image is set
      sceneRef.current.updateTexture(capturedImage, setProgress);
    }
  }, [capturedImage]);

  return (
    <div style={{ position: "relative", width: UI_CONFIG.CANVAS_WIDTH, height: UI_CONFIG.CANVAS_HEIGHT }}>
      {progress < 100 && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-[#1f1f1f] flex-1 ">
          <Progress.Root className="w-72" data-orientation="vertical" value={progress} size="md" variant="soft">
            <Progress.Indicator intent="primary" loading="primary" complete="success" style={{ transform: `translateX(-${100 - progress}%)` }} />
          </Progress.Root>
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "0.5rem",
        }}
      />
    </div>
  );
};

export default CuboidViewer;
