import React from "react";
import { Html, useProgress } from "@react-three/drei";

const CanvasLoader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <span
          style={{
            width: 42,
            height: 42,
            border: "4px solid rgba(255,255,255,0.15)",
            borderTopColor: "#2dd4bf",
            borderRadius: "50%",
            display: "inline-block",
            animation: "spin 0.9s linear infinite",
          }}
        />
        <span style={{ color: "#c7d2e5", fontSize: 13, fontWeight: 600 }}>
          {progress.toFixed(0)}%
        </span>
      </div>
    </Html>
  );
};

export default CanvasLoader;
