import React, { useState, useEffect, useRef } from "react";
import { RotateCcw, Compass } from "lucide-react";
import { InlineMath } from "../SafeMath";

export default function SpeedSim() {
  const [speed, setSpeed] = useState(0); // Instantaneous speed (m/s)
  const [distance, setDistance] = useState(0); // Cumulative distance (m)
  const [time, setTime] = useState(0); // Cumulative time (s)
  
  const lastTimeRef = useRef(null);
  const animationRef = useRef(null);
  
  // Track visual offset for road scrolling
  const [roadOffset, setRoadOffset] = useState(0);
  // Car position (visual translation)
  const [carX, setCarX] = useState(50); 

  useEffect(() => {
    const tick = (now) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const deltaTime = (now - lastTimeRef.current) / 1000; // in seconds
      lastTimeRef.current = now;

      if (speed > 0) {
        // Increment time
        setTime((prevTime) => prevTime + deltaTime);
        
        // Calculate distance added (ds = v * dt)
        const dDistance = speed * deltaTime;
        setDistance((prevDist) => prevDist + dDistance);

        // Visual animation offsets
        // Scroll road lines to the left
        setRoadOffset((prevOffset) => (prevOffset - speed * deltaTime * 10) % 40);
        
        // Move car slightly forward based on speed (up to a limit, then keep road scrolling)
        setCarX((prevX) => {
          const targetX = 50 + (speed * 3); // Move forward slightly when driving fast
          // Smooth interpolation
          return prevX + (targetX - prevX) * 0.1;
        });
      } else {
        // Smoothly return car to idle position when speed is 0
        setCarX((prevX) => prevX + (50 - prevX) * 0.1);
      }

      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [speed]);

  // Synchronize ticker when speed resets/changes
  useEffect(() => {
    lastTimeRef.current = null;
  }, [speed]);

  const handleSpeedChange = (e) => {
    setSpeed(parseFloat(e.target.value));
  };

  const handleReset = () => {
    setSpeed(0);
    setDistance(0);
    setTime(0);
    setCarX(50);
  };

  // Convert speed 0-60 to needle angle -90deg to 90deg
  const needleRotation = -90 + (speed / 60) * 180;
  
  // Average Speed
  const averageSpeed = time > 0 ? (distance / time) : 0;

  return (
    <div className="simulator-container">
      <div className="simulator-header">
        <span className="simulator-title">
          <Compass size={18} className="text-cyan-500" />
          Speed Laboratory
        </span>
        <button className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }} onClick={handleReset}>
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      <div className="canvas-area">
        {/* HUD Stats */}
        <div className="canvas-hud">
          <div className="hud-pill">
            Distance (<InlineMath math="s" />): {distance.toFixed(1)} m
          </div>
          <div className="hud-pill">
            Time (<InlineMath math="t" />): {time.toFixed(1)} s
          </div>
        </div>

        {/* Physics Canvas (SVG representation of the road and car) */}
        <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" style={{ backgroundColor: "#1e293b" }}>
          {/* Sky background */}
          <rect width="400" height="110" fill="#0f172a" />
          
          {/* Mountain background */}
          <path d="M-50 110 L50 40 L120 90 L200 30 L310 100 L450 110 Z" fill="#1e293b" opacity="0.4" />
          <path d="M-20 110 L100 60 L180 100 L250 50 L380 110 Z" fill="#1e293b" opacity="0.6" />
          
          {/* Moon/Sun */}
          <circle cx="340" cy="40" r="15" fill="#fef08a" opacity="0.8" style={{ filter: "drop-shadow(0 0 10px rgba(254, 240, 138, 0.4))" }} />

          {/* Road */}
          <rect x="0" y="110" width="400" height="90" fill="#334155" />
          
          {/* Road Shoulder Lines */}
          <line x1="0" y1="110" x2="400" y2="110" stroke="#475569" strokeWidth="3" />
          <line x1="0" y1="190" x2="400" y2="190" stroke="#475569" strokeWidth="3" />
          
          {/* Scrolling Dashed Lanes */}
          <g stroke="#e2e8f0" strokeWidth="4" strokeDasharray="25, 25">
            <line x1={roadOffset - 25} y1="150" x2={roadOffset + 425} y2="150" />
          </g>

          {/* Speed particles indicating movement speed */}
          {speed > 0 && Array.from({ length: 6 }).map((_, i) => {
            const particleX = ((i * 80) + roadOffset * 2) % 460 - 30;
            return (
              <line 
                key={i} 
                x1={particleX} 
                y1={120 + (i % 2) * 45} 
                x2={particleX + 15} 
                y2={120 + (i % 2) * 45} 
                stroke="#64748b" 
                strokeWidth="1.5" 
                opacity={speed / 60} 
              />
            );
          })}

          {/* Car Graphic */}
          <g transform={`translate(${carX}, 130)`}>
            {/* Shadow */}
            <ellipse cx="45" cy="30" rx="35" ry="6" fill="#090d16" opacity="0.6" />
            
            {/* Body */}
            <path d="M10 20 L22 8 Q25 5, 32 5 L58 5 Q65 5, 68 8 L80 20 Q84 21, 84 24 L84 28 Q84 31, 80 31 L10 31 Q6 31, 6 28 L6 24 Q6 21, 10 20 Z" fill="url(#carGradient)" />
            {/* Windows */}
            <path d="M26 18 L32 9 L48 9 L54 18 Z" fill="#67e8f9" opacity="0.7" />
            {/* Wheel arches */}
            <circle cx="25" cy="30" r="11" fill="#1e293b" />
            <circle cx="65" cy="30" r="11" fill="#1e293b" />
            {/* Wheels */}
            <g className="wheel" style={{ transformOrigin: "25px 30px", transform: `rotate(${roadOffset * 8}deg)` }}>
              <circle cx="25" cy="30" r="8" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />
              <line x1="25" y1="22" x2="25" y2="38" stroke="#64748b" strokeWidth="1.5" />
              <line x1="17" y1="30" x2="33" y2="30" stroke="#64748b" strokeWidth="1.5" />
            </g>
            <g className="wheel" style={{ transformOrigin: "65px 30px", transform: `rotate(${roadOffset * 8}deg)` }}>
              <circle cx="65" cy="30" r="8" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />
              <line x1="65" y1="22" x2="65" y2="38" stroke="#64748b" strokeWidth="1.5" />
              <line x1="57" y1="30" x2="73" y2="30" stroke="#64748b" strokeWidth="1.5" />
            </g>
            {/* Headlight glow */}
            {speed > 0 && (
              <polygon points="84,23 150,15 150,38 84,29" fill="url(#lightGlow)" opacity="0.3" />
            )}
          </g>

          {/* Definitions for Gradients */}
          <defs>
            <linearGradient id="carGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="lightGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Speedometer Gauge Visualizer */}
      <div className="speedometer-wrapper">
        <div>
          <div className="speedometer-gauge">
            <div className="gauge-arc" style={{ borderRightColor: speed > 30 ? "var(--status-warning)" : "var(--accent-cyan)" }}></div>
            <div className="gauge-needle" style={{ transform: `translateX(-50%) rotate(${needleRotation}deg)` }}></div>
            <div className="gauge-center"></div>
          </div>
          <div className="gauge-readout">{speed.toFixed(1)} m/s</div>
        </div>
      </div>

      {/* Speed Slider Control */}
      <div className="slider-control-group">
        <div className="control-label-row">
          <span>
            Instantaneous Speed (<InlineMath math="v" />)
          </span>
          <span className="label-val">{speed.toFixed(0)} m/s</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="60" 
          step="1" 
          value={speed} 
          onChange={handleSpeedChange} 
          className="custom-slider"
        />
      </div>

      {/* Physics Readouts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "10px", fontSize: "0.85rem", fontFamily: "var(--font-mono)", textAlign: "left" }}>
        <div style={{ padding: "10px", backgroundColor: "var(--bg-input)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
          <div style={{ color: "var(--text-muted)", marginBottom: "4px" }}>
            Instantaneous (<InlineMath math="v" />):
          </div>
          <div style={{ fontWeight: "bold", color: "var(--accent-cyan)", fontSize: "1.05rem" }}>{speed.toFixed(1)} m/s</div>
        </div>
        <div style={{ padding: "10px", backgroundColor: "var(--bg-input)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
          <div style={{ color: "var(--text-muted)", marginBottom: "4px" }}>
            Average Speed (<InlineMath math="v_{\text{avg}}" />):
          </div>
          <div style={{ fontWeight: "bold", color: "var(--accent-purple)", fontSize: "1.05rem" }}>{averageSpeed.toFixed(1)} m/s</div>
        </div>
      </div>
    </div>
  );
}
