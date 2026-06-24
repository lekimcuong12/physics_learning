import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Cpu } from "lucide-react";

export default function RobotGrid() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // Progress along the path: 0 to 7 units
  
  const animationRef = useRef(null);
  const lastTimeRef = useRef(null);

  // SVG grid sizing
  // Origin O(0,0) is at pixel coordinates (60, 160)
  // 1 unit = 20 pixels
  const originX = 80;
  const originY = 160;
  const unitSize = 25; // 25 pixels per unit

  // Compute current robot position based on progress (0 to 7)
  let robotGridX = 0;
  let robotGridY = 0;

  if (progress <= 4) {
    // Phase 1: Going North (increasing Y)
    robotGridX = 0;
    robotGridY = progress;
  } else {
    // Phase 2: Going East (increasing X)
    robotGridX = progress - 4;
    robotGridY = 4;
  }

  // Convert grid coordinates to SVG canvas coordinates
  const robotSvgX = originX + robotGridX * unitSize;
  const robotSvgY = originY - robotGridY * unitSize;

  // Calculate distance (s) and displacement (d)
  const distance = progress;
  const displacement = Math.sqrt(robotGridX * robotGridX + robotGridY * robotGridY);

  useEffect(() => {
    const tick = (now) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (isPlaying) {
        setProgress((prev) => {
          const next = prev + 1.5 * dt; // Walk 1.5 grid units per second
          if (next >= 7) {
            setIsPlaying(false);
            return 7;
          }
          return next;
        });
      }
      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    lastTimeRef.current = null;
  }, [isPlaying]);

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  // Generate SVG grid lines
  const gridLines = [];
  const maxGridX = 9;
  const maxGridY = 6;
  
  // Vertical lines
  for (let i = 0; i <= maxGridX; i++) {
    const lx = originX + i * unitSize;
    gridLines.push(
      <line 
        key={`v-${i}`} 
        x1={lx} y1={originY - maxGridY * unitSize} 
        x2={lx} y2={originY + 10} 
        stroke="rgba(255,255,255,0.06)" 
        strokeWidth={i === 0 ? 2 : 1}
      />
    );
  }
  // Horizontal lines
  for (let j = 0; j <= maxGridY; j++) {
    const ly = originY - j * unitSize;
    gridLines.push(
      <line 
        key={`h-${j}`} 
        x1={originX - 10} y1={ly} 
        x2={originX + maxGridX * unitSize} y2={ly} 
        stroke="rgba(255,255,255,0.06)" 
        strokeWidth={j === 0 ? 2 : 1}
      />
    );
  }

  // Draw the dotted trail walked by the robot
  const getWalkTrailPoints = () => {
    const points = [];
    // Start
    points.push(`${originX},${originY}`);
    
    if (progress > 0) {
      // Corner at (0,4)
      const cornerY = originY - Math.min(progress, 4) * unitSize;
      points.push(`${originX},${cornerY}`);
    }
    
    if (progress > 4) {
      // Current point
      points.push(`${robotSvgX},${robotSvgY}`);
    }
    
    return points.join(" ");
  };

  return (
    <div className="simulator-container">
      <div className="simulator-header">
        <span className="simulator-title" style={{ color: "var(--accent-purple)" }}>
          <Cpu size={18} />
          Robot Grid Pathfinder
        </span>
        <button className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }} onClick={handleReset}>
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      <div className="canvas-area">
        {/* HUD Overlay */}
        <div className="canvas-hud">
          <div className="hud-pill" style={{ borderColor: "var(--status-warning)", color: "var(--status-warning)" }}>
            Path Distance (s): {distance.toFixed(1)} units
          </div>
          <div className="hud-pill" style={{ borderColor: "var(--status-success)", color: "var(--status-success)" }}>
            Displacement (d): {displacement.toFixed(1)} units
          </div>
        </div>

        {/* SVG Grid Workspace */}
        <svg width="100%" height="100%" viewBox="0 0 400 220" style={{ backgroundColor: "#0f172a" }}>
          {/* Coordinates Grid */}
          {gridLines}

          {/* X Axis Labels */}
          {Array.from({ length: 9 }).map((_, i) => (
            <text key={`xl-${i}`} x={originX + i * unitSize} y={originY + 18} fill="var(--text-muted)" fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">
              {i}
            </text>
          ))}
          {/* Y Axis Labels */}
          {Array.from({ length: 6 }).map((_, j) => (
            <text key={`yl-${j}`} x={originX - 12} y={originY - j * unitSize + 3} fill="var(--text-muted)" fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">
              {j}
            </text>
          ))}

          {/* Compass labels */}
          <text x={originX} y={originY - maxGridY * unitSize - 8} fill="var(--text-muted)" fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">N (North)</text>
          <text x={originX + maxGridX * unitSize + 8} y={originY + 3} fill="var(--text-muted)" fontSize="8" textAnchor="start" fontFamily="var(--font-mono)">E (East)</text>

          {/* Origin O label */}
          <text x={originX - 10} y={originY + 12} fill="#fff" fontSize="9" fontFamily="var(--font-mono)">O</text>

          {/* Dotted path trail (Orange) */}
          {progress > 0 && (
            <polyline 
              points={getWalkTrailPoints()} 
              fill="none" 
              stroke="var(--status-warning)" 
              strokeWidth="3.5" 
              strokeDasharray="4, 4" 
            />
          )}

          {/* Displacement Vector (Green arrow from (0,0) to current (x,y)) */}
          {progress > 0.1 && (
            <g>
              <defs>
                <marker id="grid-robot-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="var(--status-success)" />
                </marker>
              </defs>
              <line 
                x1={originX} 
                y1={originY} 
                x2={robotSvgX} 
                y2={robotSvgY} 
                stroke="var(--status-success)" 
                strokeWidth="4" 
                markerEnd="url(#grid-robot-arrow)"
                style={{ filter: "drop-shadow(0 0 4px var(--status-success-border))" }}
              />
              <text 
                x={(originX + robotSvgX) / 2 + 10} 
                y={(originY + robotSvgY) / 2 + 5} 
                fill="var(--status-success)" 
                fontSize="11" 
                fontFamily="var(--font-mono)" 
                fontWeight="bold"
              >
                d
              </text>
            </g>
          )}

          {/* Robot Node */}
          <g transform={`translate(${robotSvgX}, ${robotSvgY})`}>
            {/* Robot Head */}
            <rect x="-8" y="-12" width="16" height="15" rx="3" fill="#8b5cf6" stroke="#fff" strokeWidth="1.5" />
            {/* Antenna */}
            <line x1="0" y1="-12" x2="0" y2="-18" stroke="#fff" strokeWidth="1.5" />
            <circle cx="0" cy="-18" r="2.5" fill="#ec4899" />
            {/* Eyes */}
            <circle cx="-3" cy="-5" r="1.5" fill="#67e8f9" />
            <circle cx="3" cy="-5" r="1.5" fill="#67e8f9" />
            {/* Wheels */}
            <ellipse cx="-7" cy="4" rx="2.5" ry="3.5" fill="#1e293b" />
            <ellipse cx="7" cy="4" rx="2.5" ry="3.5" fill="#1e293b" />
          </g>
        </svg>
      </div>

      {/* Control Stepper */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <button 
          className="btn btn-primary" 
          style={{ borderRadius: "50%", width: "40px", height: "40px", padding: 0, justifyContent: "center" }}
          onClick={() => {
            if (progress >= 7) {
              handleReset();
              setTimeout(() => setIsPlaying(true), 150);
            } else {
              setIsPlaying(!isPlaying);
            }
          }}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: "2px" }} />}
        </button>

        <div style={{ flex: 1 }} className="slider-control-group">
          <input 
            type="range" 
            min="0" 
            max="7" 
            step="0.05" 
            value={progress} 
            onChange={(e) => {
              setIsPlaying(false);
              setProgress(parseFloat(e.target.value));
            }} 
            className="custom-slider"
          />
        </div>
      </div>

      {/* Coordinates status banner */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "10px", fontSize: "0.85rem", fontFamily: "var(--font-mono)", textAlign: "left" }}>
        <div style={{ padding: "8px 12px", backgroundColor: "var(--bg-input)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Robot Position:</div>
          <div style={{ fontWeight: "bold", color: "var(--accent-purple)" }}>
            ({robotGridX.toFixed(1)}, {robotGridY.toFixed(1)})
          </div>
        </div>
        <div style={{ padding: "8px 12px", backgroundColor: "var(--bg-input)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Pythagorean Theorem:</div>
          <div style={{ fontWeight: "bold", color: "var(--status-success)" }}>
            d = &radic;({robotGridX.toFixed(1)}&sup2; + {robotGridY.toFixed(1)}&sup2;)
          </div>
        </div>
      </div>
    </div>
  );
}
