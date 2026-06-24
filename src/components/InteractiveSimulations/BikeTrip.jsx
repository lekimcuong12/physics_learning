import React, { useState, useEffect, useRef } from "react";
import { Bike, Play, Pause, RotateCcw } from "lucide-react";
import { InlineMath } from "../SafeMath";

export default function BikeTrip() {
  const [phase, setPhase] = useState(1); // 1: Home to School, 2: School to Bookstore
  const [progress, setProgress] = useState(0); // Progress along the path: 0 to 4 km
  const [isPlaying, setIsPlaying] = useState(false);
  
  const lastTimeRef = useRef(null);
  const animationRef = useRef(null);

  // SVG dimensions
  const roadY = 110;
  const startX = 60; // A (Home) at 0 km
  const bookstoreX = 240; // C (Bookstore) at 2 km
  const schoolX = 330; // B (School) at 3 km
  const scale = 90; // 90 pixels = 1 km physical

  // Calculate current bike coordinates based on progress (0 to 4 km)
  let bikeGridX = 0; // physical km coordinate from Home
  
  if (progress <= 3) {
    // Phase 1: Going from A (0) to B (3)
    bikeGridX = progress;
  } else {
    // Phase 2: Turning back from B (3) toward C (2)
    bikeGridX = 3 - (progress - 3); // decreases from 3 to 2
  }

  const bikeSvgX = startX + bikeGridX * scale;

  // Calculate distance (s) and displacement (d)
  const distance = progress;
  const displacement = bikeGridX; // In 1D, since start is 0, net change in position is just current X coordinate!

  useEffect(() => {
    const tick = (now) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (isPlaying) {
        setProgress((prev) => {
          const target = phase === 1 ? 3 : 4;
          // Speed: 1 km per second
          const next = prev + 1.0 * dt;
          if (next >= target) {
            setIsPlaying(false);
            return target;
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
  }, [isPlaying, phase]);

  useEffect(() => {
    lastTimeRef.current = null;
  }, [isPlaying]);

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
    setPhase(1);
  };

  const startPhase1 = () => {
    setIsPlaying(false);
    setProgress(0);
    setPhase(1);
    setTimeout(() => setIsPlaying(true), 100);
  };

  const startPhase2 = () => {
    setIsPlaying(false);
    setProgress(3); // Start at School
    setPhase(2);
    setTimeout(() => setIsPlaying(true), 100);
  };

  // Generate distance track line segments
  const getDistanceLines = () => {
    if (progress <= 3) {
      return (
        <line 
          x1={startX} y1={roadY - 12} 
          x2={bikeSvgX} y2={roadY - 12} 
          stroke="var(--status-error)" strokeWidth="4" 
        />
      );
    } else {
      // Draws line A to B (0 to 3) in red, then overlap line B to C (3 to current) in double width or offset
      return (
        <>
          <line 
            x1={startX} y1={roadY - 12} 
            x2={schoolX} y2={roadY - 12} 
            stroke="var(--status-error)" strokeWidth="4" 
          />
          <line 
            x1={schoolX} y1={roadY - 18} 
            x2={bikeSvgX} y2={roadY - 18} 
            stroke="var(--status-error)" strokeWidth="4" 
            opacity="0.8"
          />
        </>
      );
    }
  };

  return (
    <div className="simulator-container">
      <div className="simulator-header">
        <span className="simulator-title" style={{ color: "var(--status-error)" }}>
          <Bike size={18} />
          Student Bike Ride Simulator
        </span>
        <button className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }} onClick={handleReset}>
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* Phase selection buttons */}
      <div className="toggle-group" style={{ width: "100%" }}>
        <button 
          className={`toggle-item ${phase === 1 && progress < 3 ? "active" : ""}`}
          onClick={startPhase1}
        >
          Phase 1: Home &rarr; School (3km)
        </button>
        <button 
          className={`toggle-item ${phase === 2 || progress >= 3 ? "active" : ""}`}
          onClick={startPhase2}
        >
          Phase 2: Turn back &rarr; Bookstore (1km back)
        </button>
      </div>

      <div className="canvas-area">
        {/* HUD Details */}
        <div className="canvas-hud">
          <div className="hud-pill" style={{ borderColor: "var(--status-error)", color: "var(--status-error)" }}>
            Distance (<InlineMath math="s" />): {distance.toFixed(1)} km
          </div>
          <div className="hud-pill" style={{ borderColor: "var(--accent-cyan)", color: "var(--accent-cyan)" }}>
            Displacement (<InlineMath math={"\\vec{d}"} />): {displacement.toFixed(1)} km
          </div>
        </div>

        {/* 1D Road Trip SVG */}
        <svg width="100%" height="100%" viewBox="0 0 400 220" style={{ backgroundColor: "#0f172a" }}>
          
          {/* Main Road Line */}
          <line x1="20" y1={roadY} x2="380" y2={roadY} stroke="#475569" strokeWidth="6" strokeLinecap="round" />
          <line x1="20" y1={roadY} x2="380" y2={roadY} stroke="#1e293b" strokeWidth="2" strokeDasharray="5, 5" />

          {/* Landmarks: A (Home) */}
          <g transform={`translate(${startX}, ${roadY - 24})`}>
            <circle cx="0" cy="0" r="10" fill="var(--accent-purple)" opacity="0.3" />
            <circle cx="0" cy="0" r="4" fill="var(--accent-purple)" />
            <text x="0" y="-14" fill="var(--text-primary)" fontSize="10" fontWeight="bold" textAnchor="middle">A</text>
            <text x="0" y="38" fill="var(--text-muted)" fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">Home (0km)</text>
          </g>

          {/* Landmarks: C (Bookstore) */}
          <g transform={`translate(${bookstoreX}, ${roadY - 24})`}>
            <circle cx="0" cy="0" r="10" fill="var(--status-warning)" opacity="0.3" />
            <circle cx="0" cy="0" r="4" fill="var(--status-warning)" />
            <text x="0" y="-14" fill="var(--text-primary)" fontSize="10" fontWeight="bold" textAnchor="middle">C</text>
            <text x="0" y="38" fill="var(--text-muted)" fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">Book (2km)</text>
          </g>

          {/* Landmarks: B (School) */}
          <g transform={`translate(${schoolX}, ${roadY - 24})`}>
            <circle cx="0" cy="0" r="10" fill="var(--status-success)" opacity="0.3" />
            <circle cx="0" cy="0" r="4" fill="var(--status-success)" />
            <text x="0" y="-14" fill="var(--text-primary)" fontSize="10" fontWeight="bold" textAnchor="middle">B</text>
            <text x="0" y="38" fill="var(--text-muted)" fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">School (3km)</text>
          </g>

          {/* Distance path line (Red overlays on top of road) */}
          {progress > 0 && getDistanceLines()}

          {/* Displacement Vector (Blue Arrow starting at A (startX) pointing to current position) */}
          {progress > 0.1 && (
            <g>
              <defs>
                <marker id="bike-vector-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="var(--accent-cyan)" />
                </marker>
              </defs>
              <line 
                x1={startX} 
                y1={roadY + 14} 
                x2={bikeSvgX} 
                y2={roadY + 14} 
                stroke="var(--accent-cyan)" 
                strokeWidth="4" 
                markerEnd="url(#bike-vector-arrow)"
                style={{ filter: "drop-shadow(0 0 4px var(--accent-cyan-glow))" }}
              />
              <g>
                <text 
                  x={(startX + bikeSvgX) / 2} 
                  y={roadY + 30} 
                  fill="var(--accent-cyan)" 
                  fontSize="11" 
                  fontFamily="var(--font-mono)" 
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  d
                </text>
                <path 
                  d={`M ${(startX + bikeSvgX) / 2 - 3.5} ${roadY + 18} L ${(startX + bikeSvgX) / 2 + 3.5} ${roadY + 18} M ${(startX + bikeSvgX) / 2 + 1.5} ${roadY + 16.5} L ${(startX + bikeSvgX) / 2 + 3.5} ${roadY + 18} L ${(startX + bikeSvgX) / 2 + 1.5} ${roadY + 19.5}`}
                  fill="none"
                  stroke="var(--accent-cyan)"
                  strokeWidth="1.2"
                />
              </g>
            </g>
          )}

          {/* Bicycle Node */}
          <g transform={`translate(${bikeSvgX}, ${roadY - 14})`}>
            {/* Simple Bike Silhouette */}
            <circle cx="-6" cy="6" r="5" fill="none" stroke="#fff" strokeWidth="1.5" />
            <circle cx="6" cy="6" r="5" fill="none" stroke="#fff" strokeWidth="1.5" />
            <line x1="-6" y1="6" x2="0" y2="6" stroke="#fff" strokeWidth="1.5" />
            <line x1="0" y1="6" x2="4" y2="-2" stroke="#fff" strokeWidth="1.5" />
            <line x1="-6" y1="6" x2="-2" y2="-2" stroke="#fff" strokeWidth="1.5" />
            <line x1="-2" y1="-2" x2="4" y2="-2" stroke="#fff" strokeWidth="1.5" />
            {/* Rider Head */}
            <circle cx="2" cy="-8" r="3" fill="var(--accent-cyan)" />
          </g>

          {/* Labels for Red and Blue indicators */}
          {progress > 0 && (
            <g transform="translate(20, 195)" fontSize="8" fontFamily="var(--font-mono)">
              <rect x="0" y="0" width="8" height="8" fill="var(--status-error)" />
              <text x="12" y="7" fill="var(--text-secondary)">Red line: Distance s</text>
              
              <rect x="130" y="0" width="8" height="8" fill="var(--accent-cyan)" />
              <text x="142" y="7" fill="var(--text-secondary)">Blue arrow: Displacement d</text>
            </g>
          )}
        </svg>
      </div>

      {/* Control sliders */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <button 
          className="btn btn-primary" 
          style={{ borderRadius: "50%", width: "40px", height: "40px", padding: 0, justifyContent: "center" }}
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: "2px" }} />}
        </button>

        <div style={{ flex: 1 }} className="slider-control-group">
          <input 
            type="range" 
            min="0" 
            max={phase === 1 ? "3" : "4"} 
            step="0.05" 
            value={progress} 
            onChange={(e) => {
              setIsPlaying(false);
              const val = parseFloat(e.target.value);
              setProgress(val);
              if (val > 3) {
                setPhase(2);
              } else {
                setPhase(1);
              }
            }} 
            className="custom-slider"
          />
        </div>
      </div>

      {/* Comparison metrics table */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "10px", fontSize: "0.85rem", fontFamily: "var(--font-mono)", textAlign: "left" }}>
        <div style={{ padding: "8px 12px", backgroundColor: "var(--bg-input)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
            Distance (<InlineMath math="s" />) [Path length]:
          </div>
          <div style={{ fontWeight: "bold", color: "var(--status-error)" }}>
            {distance.toFixed(1)} km
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>
            Always accumulates (<InlineMath math="s_1 + s_2" />).
          </div>
        </div>
        <div style={{ padding: "8px 12px", backgroundColor: "var(--bg-input)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
            Displacement (<InlineMath math={"\\vec{d}"} />) [Vector]:
          </div>
          <div style={{ fontWeight: "bold", color: "var(--accent-cyan)" }}>
            {displacement.toFixed(1)} km
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>
            Net change relative to <InlineMath math="O(0\text{ km})" />.
          </div>
        </div>
      </div>
    </div>
  );
}
