import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Anchor } from "lucide-react";
import { InlineMath, BlockMath } from "../SafeMath";

export default function AdditionSim() {
  const [mode, setMode] = useState("crossing"); // "downstream", "upstream", "crossing"
  const [boatSpeed, setBoatSpeed] = useState(4.0); // v1,2 in m/s
  const [riverSpeed, setRiverSpeed] = useState(3.0); // v2,3 in m/s
  const [isPlaying, setIsPlaying] = useState(false);
  const [boatPos, setBoatPos] = useState({ x: 50, y: 160 }); // Pixel positions
  
  const animationRef = useRef(null);
  const lastTimeRef = useRef(null);
  
  // Visual offsets for animated river waves
  const [waterOffset, setWaterOffset] = useState(0);

  // Initialize boat position based on mode
  const resetBoat = (currentMode = mode) => {
    setIsPlaying(false);
    if (currentMode === "crossing") {
      setBoatPos({ x: 50, y: 160 });
    } else if (currentMode === "downstream") {
      setBoatPos({ x: 40, y: 100 });
    } else if (currentMode === "upstream") {
      setBoatPos({ x: 350, y: 100 });
    }
  };

  useEffect(() => {
    resetBoat();
  }, [mode]);

  // Combined velocity calculations
  let vResultant = 0;
  let angleDeg = 0;

  if (mode === "downstream") {
    vResultant = boatSpeed + riverSpeed;
    angleDeg = 0; // Pointing right
  } else if (mode === "upstream") {
    vResultant = Math.abs(boatSpeed - riverSpeed);
    angleDeg = boatSpeed >= riverSpeed ? 180 : 0; // Pointing left or right
  } else {
    // crossing (perpendicular)
    vResultant = Math.sqrt(boatSpeed * boatSpeed + riverSpeed * riverSpeed);
    // Angle: atan(riverSpeed / boatSpeed) relative to straight North
    angleDeg = (Math.atan2(riverSpeed, boatSpeed) * 180) / Math.PI;
  }

  // Physics animation tick
  useEffect(() => {
    const tick = (now) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      // Animate flowing water ripples
      setWaterOffset((prev) => (prev + riverSpeed * dt * 20) % 60);

      if (isPlaying) {
        setBoatPos((prev) => {
          let nextX = prev.x;
          let nextY = prev.y;
          const scale = 25; // 25 pixels = 1 meter physical

          if (mode === "downstream") {
            // Moves East (right) at (v1,2 + v2,3)
            nextX += (boatSpeed + riverSpeed) * dt * scale;
            if (nextX > 380) {
              setIsPlaying(false);
              return { x: 380, y: prev.y };
            }
          } else if (mode === "upstream") {
            // Boat tries to move West (left) at v1,2; River pushes East (right) at v2,3
            const netSpeed = boatSpeed - riverSpeed;
            nextX -= netSpeed * dt * scale; // Decrements X if netSpeed > 0
            if (nextX < 20 || nextX > 380) {
              setIsPlaying(false);
              return { x: Math.max(20, Math.min(380, nextX)), y: prev.y };
            }
          } else {
            // Crossing
            // Boat goes North (upward, dec Y) at v1,2; River pushes East (right, inc X) at v2,3
            nextX += riverSpeed * dt * scale;
            nextY -= boatSpeed * dt * scale;
            if (nextY < 40 || nextX > 380) {
              setIsPlaying(false);
              return { x: Math.min(380, nextX), y: Math.max(40, nextY) };
            }
          }
          return { x: nextX, y: nextY };
        });
      }

      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, boatSpeed, riverSpeed, mode]);

  useEffect(() => {
    lastTimeRef.current = null;
  }, [isPlaying]);

  return (
    <div className="simulator-container">
      <div className="simulator-header">
        <span className="simulator-title" style={{ color: "var(--accent-cyan)" }}>
          <Anchor size={18} />
          Velocity Addition Lab
        </span>
        <button className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }} onClick={() => resetBoat()}>
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* Navigation Mode Selector */}
      <div className="toggle-group">
        <button 
          className={`toggle-item ${mode === "crossing" ? "active" : ""}`}
          onClick={() => setMode("crossing")}
        >
          Crossing (Perpendicular)
        </button>
        <button 
          className={`toggle-item ${mode === "downstream" ? "active" : ""}`}
          onClick={() => setMode("downstream")}
        >
          Downstream (Same Dir)
        </button>
        <button 
          className={`toggle-item ${mode === "upstream" ? "active" : ""}`}
          onClick={() => setMode("upstream")}
        >
          Upstream (Opposite Dir)
        </button>
      </div>

      <div className="canvas-area">
        {/* HUD Info */}
        <div className="canvas-hud">
          <div className="hud-pill" style={{ borderColor: "var(--accent-purple)" }}>
            Boat (<InlineMath math={"\\vec{v}_{1,2}"} />): {boatSpeed.toFixed(1)} m/s
          </div>
          <div className="hud-pill" style={{ borderColor: "var(--accent-cyan)" }}>
            River (<InlineMath math={"\\vec{v}_{2,3}"} />): {riverSpeed.toFixed(1)} m/s
          </div>
          <div className="hud-pill" style={{ borderColor: "var(--status-success)" }}>
            Result (<InlineMath math={"\\vec{v}_{1,3}"} />): {vResultant.toFixed(1)} m/s
          </div>
        </div>

        {/* River Scene SVG */}
        <svg width="100%" height="100%" viewBox="0 0 400 200" style={{ backgroundColor: "#0f172a" }}>
          {/* Riverbank Land (Top & Bottom) */}
          <rect x="0" y="0" width="400" height="35" fill="#1e293b" />
          <rect x="0" y="165" width="400" height="35" fill="#1e293b" />
          <line x1="0" y1="35" x2="400" y2="35" stroke="#475569" strokeWidth="2" />
          <line x1="0" y1="165" x2="400" y2="165" stroke="#475569" strokeWidth="2" />

          {/* Grass details on banks */}
          <rect x="30" y="10" width="8" height="15" fill="#0f172a" opacity="0.3" />
          <rect x="180" y="180" width="10" height="10" fill="#0f172a" opacity="0.3" />
          <rect x="320" y="8" width="12" height="12" fill="#0f172a" opacity="0.3" />

          {/* Water Area */}
          <rect x="0" y="35" width="400" height="130" fill="#0284c7" opacity="0.15" />

          {/* Flow ripples (scrolling waves based on riverSpeed) */}
          {Array.from({ length: 4 }).map((_, i) => {
            const waveY = 55 + i * 32;
            const waveX = ((i * 120) + waterOffset) % 460 - 40;
            return (
              <path 
                key={i} 
                d={`M ${waveX} ${waveY} Q ${waveX + 15} ${waveY - 5}, ${waveX + 30} ${waveY} T ${waveX + 60} ${waveY}`} 
                fill="none" 
                stroke="#38bdf8" 
                strokeWidth="1.5" 
                opacity="0.3" 
              />
            );
          })}

          {/* Vector overlay showing vector additions in Crossing Mode */}
          {mode === "crossing" && (
            <g opacity="0.8">
              {/* Boat relative vector v1,2 (Purple pointing UP) */}
              <line 
                x1="250" y1="130" x2="250" y2={130 - boatSpeed * 12} 
                stroke="var(--accent-purple)" strokeWidth="3" markerEnd="url(#arrow-purple)" 
              />
              <g>
                <text x="238" y={135 - boatSpeed * 6} fill="var(--accent-purple)" fontSize="9" fontFamily="var(--font-mono)">
                  v<tspan baselineShift="sub" fontSize="6">1,2</tspan>
                </text>
                <path 
                  d={`M 238.5 ${135 - boatSpeed * 6 - 9.5} L 244 ${135 - boatSpeed * 6 - 9.5} M 242 ${135 - boatSpeed * 6 - 11} L 244 ${135 - boatSpeed * 6 - 9.5} L 242 ${135 - boatSpeed * 6 - 8}`}
                  fill="none"
                  stroke="var(--accent-purple)"
                  strokeWidth="1"
                />
              </g>

              {/* River relative vector v2,3 (Cyan pointing RIGHT, head-to-tail at end of purple) */}
              <line 
                x1="250" y1={130 - boatSpeed * 12} x2={250 + riverSpeed * 12} y2={130 - boatSpeed * 12} 
                stroke="var(--accent-cyan)" strokeWidth="3" markerEnd="url(#arrow-cyan)" 
              />
              <g>
                <text x={252 + riverSpeed * 6} y={124 - boatSpeed * 12} fill="var(--accent-cyan)" fontSize="9" fontFamily="var(--font-mono)">
                  v<tspan baselineShift="sub" fontSize="6">2,3</tspan>
                </text>
                <path 
                  d={`M ${252.5 + riverSpeed * 6} ${124 - boatSpeed * 12 - 9.5} L ${258 + riverSpeed * 6} ${124 - boatSpeed * 12 - 9.5} M ${256 + riverSpeed * 6} ${124 - boatSpeed * 12 - 11} L ${258 + riverSpeed * 6} ${124 - boatSpeed * 12 - 9.5} L ${256 + riverSpeed * 6} ${124 - boatSpeed * 12 - 8}`}
                  fill="none"
                  stroke="var(--accent-cyan)"
                  strokeWidth="1"
                />
              </g>

              {/* Combined Vector v1,3 (Green diagonal) */}
              <line 
                x1="250" y1="130" x2={250 + riverSpeed * 12} y2={130 - boatSpeed * 12} 
                stroke="var(--status-success)" strokeWidth="3.5" markerEnd="url(#arrow-success)"
                strokeDasharray="2, 2"
              />
              <g>
                <text 
                  x={260 + riverSpeed * 4} y={142 - boatSpeed * 6} 
                  fill="var(--status-success)" fontSize="10" fontWeight="bold" fontFamily="var(--font-mono)"
                >
                  v<tspan baselineShift="sub" fontSize="6.5">1,3</tspan>
                </text>
                <path 
                  d={`M ${260.5 + riverSpeed * 4} ${142 - boatSpeed * 6 - 10.5} L ${266.5 + riverSpeed * 4} ${142 - boatSpeed * 6 - 10.5} M ${264.5 + riverSpeed * 4} ${142 - boatSpeed * 6 - 12} L ${266.5 + riverSpeed * 4} ${142 - boatSpeed * 6 - 10.5} L ${264.5 + riverSpeed * 4} ${142 - boatSpeed * 6 - 9}`}
                  fill="none"
                  stroke="var(--status-success)"
                  strokeWidth="1.2"
                />
              </g>
            </g>
          )}

          {/* Simple Vector overlay in Downstream / Upstream */}
          {(mode === "downstream" || mode === "upstream") && (
            <g opacity="0.8">
              {/* Reference point */}
              <circle cx="200" cy="140" r="3" fill="#fff" />
              {/* Boat vector (Purple) */}
              <line 
                x1="200" y1="140" x2={mode === "downstream" ? 200 + boatSpeed * 12 : 200 - boatSpeed * 12} y2="140" 
                stroke="var(--accent-purple)" strokeWidth="3" markerEnd="url(#arrow-purple)" 
              />
              {/* River vector (Cyan) */}
              <line 
                x1={mode === "downstream" ? 200 + boatSpeed * 12 : 200 - boatSpeed * 12} y1="140" 
                x2={mode === "downstream" ? 200 + (boatSpeed + riverSpeed) * 12 : 200 - (boatSpeed - riverSpeed) * 12} y2="140" 
                stroke="var(--accent-cyan)" strokeWidth="3" markerEnd="url(#arrow-cyan)" 
              />
              {/* Combined Vector */}
              <line 
                x1="200" y1="148" 
                x2={mode === "downstream" ? 200 + (boatSpeed + riverSpeed) * 12 : 200 - (boatSpeed - riverSpeed) * 12} y2="148" 
                stroke="var(--status-success)" strokeWidth="3" markerEnd="url(#arrow-success)" 
              />
                <g>
                  <text x="200" y="158" fill="var(--status-success)" fontSize="8" fontFamily="var(--font-mono)">
                    Resultant
                  </text>
                  <text x="248" y="158" fill="var(--status-success)" fontSize="8" fontFamily="var(--font-mono)">
                    v<tspan baselineShift="sub" fontSize="5.5">1,3</tspan>
                  </text>
                  <path 
                    d="M 248.5 149.5 L 253.5 149.5 M 252 148 L 253.5 149.5 L 252 151"
                    fill="none"
                    stroke="var(--status-success)"
                    strokeWidth="0.8"
                  />
                </g>
            </g>
          )}

          {/* Boat Graphic */}
          <g 
            transform={`translate(${boatPos.x}, ${boatPos.y}) rotate(${mode === "crossing" ? angleDeg - 90 : 0})`}
            style={{ transition: "transform 0.1s ease" }}
          >
            {/* Shadow */}
            <ellipse cx="0" cy="5" rx="18" ry="8" fill="#021f30" opacity="0.6" />
            {/* Wooden hull */}
            <path d="M-15 -6 L10 -6 Q22 0, 22 4 Q22 8, 10 8 L-15 8 Z" fill="#b45309" />
            <path d="M-13 -4 L8 -4 Q18 0, 18 4 Q18 8, 8 8 L-13 8 Z" fill="#d97706" />
            {/* Bench */}
            <rect x="-3" y="-4" width="6" height="8" fill="#78350f" />
            {/* Canopy / Sail */}
            <rect x="-10" y="-2" width="4" height="4" fill="#f8fafc" />
            {/* Motor Propeller ripples if active */}
            {isPlaying && (
              <path d="M-18 -2 Q-25 -5, -25 0 Q-25 5, -18 2" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" />
            )}
          </g>

          {/* Vector Marker Definitions */}
          <defs>
            <marker id="arrow-purple" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="var(--accent-purple)" />
            </marker>
            <marker id="arrow-cyan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="var(--accent-cyan)" />
            </marker>
            <marker id="arrow-success" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="var(--status-success)" />
            </marker>
          </defs>
        </svg>
      </div>

      {/* Simulator Play & Controls */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <button 
          className="btn btn-primary" 
          style={{ borderRadius: "50%", width: "40px", height: "40px", padding: 0, justifyContent: "center" }}
          onClick={() => {
            if (boatPos.x > 370 || boatPos.x < 30 || boatPos.y < 45) {
              resetBoat();
              // Briefly wait before playing again
              setTimeout(() => setIsPlaying(true), 150);
            } else {
              setIsPlaying(!isPlaying);
            }
          }}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: "2px" }} />}
        </button>

        <div style={{ flex: 1 }} className="boat-sim-grid">
          {/* Controls Sliders */}
          <div className="boat-controls-grid">
            <div className="slider-control-group">
              <div className="control-label-row">
                <span style={{ color: "var(--accent-purple)", fontSize: "0.75rem" }}>
                  Boat Speed (<InlineMath math={"\\vec{v}_{1,2}"} />)
                </span>
                <span className="label-val" style={{ color: "var(--accent-purple)", fontSize: "0.75rem" }}>{boatSpeed.toFixed(1)} m/s</span>
              </div>
              <input 
                type="range" 
                min="2.0" 
                max="6.0" 
                step="0.5" 
                value={boatSpeed} 
                onChange={(e) => {
                  setBoatSpeed(parseFloat(e.target.value));
                  resetBoat();
                }} 
                className="custom-slider"
              />
            </div>

            <div className="slider-control-group">
              <div className="control-label-row">
                <span style={{ color: "var(--accent-cyan)", fontSize: "0.75rem" }}>
                  River Current (<InlineMath math={"\\vec{v}_{2,3}"} />)
                </span>
                <span className="label-val" style={{ color: "var(--accent-cyan)", fontSize: "0.75rem" }}>{riverSpeed.toFixed(1)} m/s</span>
              </div>
              <input 
                type="range" 
                min="0.0" 
                max="4.0" 
                step="0.5" 
                value={riverSpeed} 
                onChange={(e) => {
                  setRiverSpeed(parseFloat(e.target.value));
                  resetBoat();
                }} 
                className="custom-slider"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Explanatory Math Summary */}
      <div style={{ padding: "12px", backgroundColor: "var(--bg-input)", borderRadius: "8px", border: "1px solid var(--border-color)", textAlign: "left", fontSize: "0.82rem" }}>
        <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
          Velocity Vector Addition Calculation:
        </div>
        <div style={{ color: "var(--status-success)" }}>
          {mode === "crossing" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <BlockMath math={`v_{1,3} = \\sqrt{v_{1,2}^2 + v_{2,3}^2} = \\sqrt{${boatSpeed.toFixed(1)}^2 + ${riverSpeed.toFixed(1)}^2} = ${vResultant.toFixed(2)}\\text{ m/s}`} />
              <div style={{ color: "var(--text-muted)", fontSize: "0.78rem", textAlign: "center" }}>
                Resultant direction: diagonally at {angleDeg.toFixed(0)}&deg; relative to North.
              </div>
            </div>
          )}
          {mode === "downstream" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <BlockMath math={`v_{1,3} = v_{1,2} + v_{2,3} = ${boatSpeed.toFixed(1)} + ${riverSpeed.toFixed(1)} = ${vResultant.toFixed(1)}\\text{ m/s}`} />
              <div style={{ color: "var(--text-muted)", fontSize: "0.78rem", textAlign: "center" }}>
                Resultant direction: downstream (parallel to current).
              </div>
            </div>
          )}
          {mode === "upstream" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <BlockMath math={`v_{1,3} = |v_{1,2} - v_{2,3}| = |${boatSpeed.toFixed(1)} - ${riverSpeed.toFixed(1)}| = ${vResultant.toFixed(1)}\\text{ m/s}`} />
              <div style={{ color: "var(--text-muted)", fontSize: "0.78rem", textAlign: "center" }}>
                Resultant direction: {boatSpeed >= riverSpeed ? "upstream (boat moves forward)" : "downstream (boat pushed backward!)"}.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
