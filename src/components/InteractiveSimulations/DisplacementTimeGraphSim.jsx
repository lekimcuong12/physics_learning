import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Compass, ArrowRight, ArrowLeft, Info, Check, X } from "lucide-react";
import { InlineMath, BlockMath } from "../SafeMath";
import "katex/dist/katex.min.css";
import { PhysicsText } from "../../App";

export default function DisplacementTimeGraphSim({ mode }) {
  // Common states
  const [isPlaying, setIsPlaying] = useState(false);
  const [simTime, setSimTime] = useState(0); // simulation time (s)
  const lastTimeRef = useRef(null);
  const animationRef = useRef(null);

  // ----------------------------------------------------
  // MODE: DRAW - Graph Drawing Challenge
  // ----------------------------------------------------
  const [selectedDrawGraph, setSelectedDrawGraph] = useState(null);
  const graphFeedback = {
    A: {
      correct: false,
      text: "Incorrect! Graph A has swapped the coordinate axes: the vertical axis represents time $t\\text{ (s)}$ and the horizontal axis represents displacement $d\\text{ (m)}$. Remember the vertical axis must always be $d$ and the horizontal axis is $t$.",
    },
    B: {
      correct: true,
      text: "Correct! Graph B correctly plots displacement $d\\text{ (m)}$ on the vertical axis, time $t\\text{ (s)}$ on the horizontal axis, and the coordinates match the data table perfectly.",
    },
    C: {
      correct: false,
      text: "Incorrect! Graph C has the correct axes, but the plotted value of $d$ at $t = 250\\text{ s}$ is incorrect, reaching $1200\\text{ m}$ (the table shows a maximum of $1000\\text{ m}$).",
    },
    D: {
      correct: false,
      text: "Incorrect! Graph D shows the object immediately reaching $1000\\text{ m}$ at $50\\text{ s}$ and staying still, which does not match the gradual walking progression of Student A.",
    },
  };

  // ----------------------------------------------------
  // MODE: ROBOT - Click & Play robot path
  // ----------------------------------------------------
  const [selectedElement, setSelectedElement] = useState(null); // 'AB', 'BC', 'CD', 'A', 'B', 'C', 'D'
  
  // Robot path coordinates (t from 0 to 15, d from 0 to 10)
  // A(0,0), B(5,10), C(10,10), D(15,0)
  const robotSegments = {
    AB: {
      title: "Segment AB: Uniform straight motion in the positive direction",
      time: "$0\\text{ s} \\to 5\\text{ s} \\quad (\\Delta t = 5\\text{ s})$",
      disp: "$0\\text{ m} \\to 10\\text{ m} \\quad (\\Delta d = +10\\text{ m})$",
      vel: "+2.0 m/s",
      desc: "Displacement increases uniformly over time (upward sloping graph). The robot moves in a straight line in the positive direction of the coordinate axis.",
      math: "v = \\frac{\\Delta d}{\\Delta t} = \\frac{10 - 0}{5 - 0} = +2.0\\text{ m/s}",
    },
    BC: {
      title: "Segment BC: Robot is stationary (Resting)",
      time: "$5\\text{ s} \\to 10\\text{ s} \\quad (\\Delta t = 5\\text{ s})$",
      disp: "$10\\text{ m} \\to 10\\text{ m} \\quad (\\Delta d = 0\\text{ m})$",
      vel: "0.0 m/s",
      desc: "Displacement remains constant over time (horizontal line parallel to the $Ot$ axis). The robot is at rest at a position $10\\text{ m}$ from the starting point.",
      math: "v = \\frac{\\Delta d}{\\Delta t} = \\frac{10 - 10}{10 - 5} = 0\\text{ m/s}",
    },
    CD: {
      title: "Segment CD: Uniform straight motion in the negative direction",
      time: "$10\\text{ s} \\to 15\\text{ s} \\quad (\\Delta t = 5\\text{ s})$",
      disp: "$10\\text{ m} \\to 0\\text{ m} \\quad (\\Delta d = -10\\text{ m})$",
      vel: "-2.0 m/s",
      desc: "Displacement decreases uniformly over time (downward sloping graph). The robot moves in a straight line in the negative direction (returning to the start).",
      math: "v = \\frac{\\Delta d}{\\Delta t} = \\frac{0 - 10}{15 - 10} = -2.0\\text{ m/s}",
    },
  };

  const robotPoints = {
    A: "Point $A$ ($0\\text{ s}, 0\\text{ m}$): The starting position of the robot at the initial moment.",
    B: "Point $B$ ($5\\text{ s}, 10\\text{ m}$): The robot reaches $10\\text{ m}$ displacement and begins its stationary rest.",
    C: "Point $C$ ($10\\text{ s}, 10\\text{ m}$): The robot ends its rest and starts moving in reverse.",
    D: "Point $D$ ($15\\text{ s}, 0\\text{ m}$): The robot returns to the starting position at $d = 0\\text{ m}$."
  };

  // ----------------------------------------------------
  // MODE: SLOPE - Slope-Velocity Lab
  // ----------------------------------------------------
  const [slopeVal, setSlopeVal] = useState(2); // v from -4 to 4 (m/s)
  
  // Coordinates mapping
  // SVG coordinates for graph plotting: width 400, height 200
  // t: 0 to 10s maps to X: 50 to 350
  // d: -40 to 40m maps to Y: 170 to 30 (center d=0 at Y=100)
  const mapTimeToX = (t) => 50 + (t / 10) * 300;
  const mapDispToY = (d) => 100 - (d / 40) * 70;

  // Robot simulation state helper
  const getRobotPositionAndTime = (timeSec) => {
    if (timeSec <= 5) {
      // AB: 0m to 10m
      const d = (timeSec / 5) * 10;
      return { d, v: 2.0, segment: "AB" };
    } else if (timeSec <= 10) {
      // BC: flat at 10m
      return { d: 10, v: 0, segment: "BC" };
    } else {
      // CD: 10m to 0m
      const d = 10 - ((timeSec - 10) / 5) * 10;
      return { d, v: -2.0, segment: "CD" };
    }
  };

  // Timer runner for robot and slope mode
  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = null;
      return;
    }

    const tick = (now) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      setSimTime((prevTime) => {
        const nextTime = prevTime + dt;
        const maxLimit = mode === "robot" ? 15 : 10;
        if (nextTime >= maxLimit) {
          setIsPlaying(false);
          return maxLimit;
        }
        return nextTime;
      });

      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, mode]);

  const handlePlayToggle = () => {
    if (mode === "robot" && simTime >= 15) setSimTime(0);
    if (mode === "slope" && simTime >= 10) setSimTime(0);
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setSimTime(0);
    setSelectedElement(null);
  };

  return (
    <div className="simulator-container" style={{ width: "100%", maxWidth: "560px" }}>
      {/* Component Styles Isolated */}
      <style dangerouslySetInnerHTML={{ __html: `
        .dt-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          width: 100%;
        }
        .dt-graph-card {
          background-color: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }
        .dt-graph-card:hover {
          border-color: var(--accent-cyan);
          transform: translateY(-2px);
        }
        .dt-graph-card.selected {
          border-color: var(--accent-cyan);
          box-shadow: 0 0 10px var(--accent-cyan-glow);
        }
        .dt-graph-card.correct {
          border-color: var(--status-success);
          box-shadow: 0 0 10px var(--status-success-border);
        }
        .dt-graph-card.incorrect {
          border-color: var(--status-error);
          box-shadow: 0 0 10px var(--status-error-border);
        }
        .dt-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          color: #fff;
        }
        .dt-table {
          width: 100%;
          border-collapse: collapse;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          margin-bottom: 12px;
          text-align: center;
        }
        .dt-table th, .dt-table td {
          border: 1px solid var(--border-color);
          padding: 6px;
        }
        .dt-table th {
          background-color: var(--bg-input);
          color: var(--text-secondary);
        }
        .feedback-box {
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-top: 8px;
        }
        .feedback-box.correct {
          background-color: var(--status-success-bg);
          border: 1px solid var(--status-success-border);
          color: var(--text-primary);
        }
        .feedback-box.incorrect {
          background-color: var(--status-error-bg);
          border: 1px solid var(--status-error-border);
          color: var(--text-primary);
        }
        .interactive-line {
          cursor: pointer;
          stroke-width: 4px;
          transition: stroke 0.2s ease, stroke-width 0.2s ease;
        }
        .interactive-line:hover {
          stroke: var(--accent-cyan);
          stroke-width: 6px;
        }
        .interactive-line.selected {
          stroke: var(--accent-purple);
          stroke-width: 6px;
        }
        .interactive-node {
          cursor: pointer;
          transition: r 0.2s ease, fill 0.2s ease;
        }
        .interactive-node:hover {
          r: 7;
          fill: var(--accent-cyan);
        }
        .interactive-node.selected {
          r: 8;
          fill: var(--accent-purple);
        }
        .highway-track {
          width: 100%;
          height: 70px;
          background-color: #1e293b;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          position: relative;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .slope-details {
          background-color: var(--bg-input);
          border-radius: 8px;
          border: 1px solid var(--border-color);
          padding: 12px;
          font-size: 0.88rem;
          line-height: 1.5;
        }
      ` }} />

      {/* ----------------------------------------------------
          1. SIMULATOR HEADER
          ---------------------------------------------------- */}
      <div className="simulator-header">
        <span className="simulator-title">
          <Compass size={18} style={{ color: "var(--accent-cyan)" }} />
          {mode === "draw" && "Displacement-Time Graph Plotting"}
          {mode === "robot" && "Robot Journey Analyzer"}
          {mode === "slope" && "Slope & Motion Velocity"}
        </span>
        {(mode === "robot" || mode === "slope") && (
          <button className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: "0.75rem" }} onClick={handleReset}>
            <RotateCcw size={12} /> Reset
          </button>
        )}
      </div>

      {/* ----------------------------------------------------
          2. CANVAS / PLAY AREA
          ---------------------------------------------------- */}
      
      {/* --- MODE: DRAW --- */}
      {mode === "draw" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
          {/* Table Data */}
          <div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "6px", fontWeight: "600" }}>
              Data Table of Student A's Straight Motion:
            </div>
            <table className="dt-table">
              <thead>
                <tr>
                  <th>Time t (s)</th>
                  <td>0</td>
                  <td>50</td>
                  <td>100</td>
                  <td>150</td>
                  <td>200</td>
                  <td>250</td>
                  <td>300</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Displacement d (m)</th>
                  <td>0</td>
                  <td>200</td>
                  <td>400</td>
                  <td>600</td>
                  <td>800</td>
                  <td>1000</td>
                  <td>800</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 4 Graph Choices Grid */}
          <div className="dt-grid">
            {/* Graph A */}
            <div 
              className={`dt-graph-card ${selectedDrawGraph === 'A' ? 'incorrect selected' : ''}`}
              onClick={() => setSelectedDrawGraph('A')}
            >
              <div style={{ fontSize: "0.75rem", fontWeight: "bold", marginBottom: "4px", textAlign: "left" }}>Graph A</div>
              <svg width="100%" height="90" viewBox="0 0 160 90" style={{ backgroundColor: "#0f172a", borderRadius: "4px" }}>
                {/* Axes */}
                <line x1="20" y1="10" x2="20" y2="80" stroke="var(--text-secondary)" strokeWidth="1" />
                <line x1="20" y1="80" x2="150" y2="80" stroke="var(--text-secondary)" strokeWidth="1" />
                {/* Labels Swapped */}
                <text x="10" y="15" fill="#f87171" fontSize="8" fontWeight="bold">t (s)</text>
                <text x="135" y="88" fill="#60a5fa" fontSize="8" fontWeight="bold">d (m)</text>
                {/* Graph line */}
                <polyline points="20,80 120,30 100,20" fill="none" stroke="var(--accent-purple)" strokeWidth="1.5" />
                <circle cx="20" cy="80" r="2" fill="var(--text-primary)" />
                <circle cx="120" cy="30" r="2" fill="var(--text-primary)" />
                <circle cx="100" cy="20" r="2" fill="var(--text-primary)" />
              </svg>
              {selectedDrawGraph === 'A' && <div className="dt-badge" style={{ backgroundColor: "var(--status-error)" }}>✕</div>}
            </div>

            {/* Graph B */}
            <div 
              className={`dt-graph-card ${selectedDrawGraph === 'B' ? 'correct selected' : ''}`}
              onClick={() => setSelectedDrawGraph('B')}
            >
              <div style={{ fontSize: "0.75rem", fontWeight: "bold", marginBottom: "4px", textAlign: "left" }}>Graph B (Correct)</div>
              <svg width="100%" height="90" viewBox="0 0 160 90" style={{ backgroundColor: "#0f172a", borderRadius: "4px" }}>
                {/* Axes */}
                <line x1="20" y1="10" x2="20" y2="80" stroke="var(--text-secondary)" strokeWidth="1" />
                <line x1="20" y1="80" x2="150" y2="80" stroke="var(--text-secondary)" strokeWidth="1" />
                {/* Labels Correct */}
                <text x="5" y="15" fill="#60a5fa" fontSize="8" fontWeight="bold">d (m)</text>
                <text x="135" y="88" fill="#f87171" fontSize="8" fontWeight="bold">t (s)</text>
                {/* Graph line */}
                <polyline points="20,80 120,20 140,32" fill="none" stroke="var(--accent-cyan)" strokeWidth="1.5" />
                <circle cx="20" cy="80" r="2" fill="var(--text-primary)" />
                <circle cx="120" cy="20" r="2" fill="var(--text-primary)" />
                <circle cx="140" cy="32" r="2" fill="var(--text-primary)" />
              </svg>
              {selectedDrawGraph === 'B' && <div className="dt-badge" style={{ backgroundColor: "var(--status-success)" }}>✓</div>}
            </div>

            {/* Graph C */}
            <div 
              className={`dt-graph-card ${selectedDrawGraph === 'C' ? 'incorrect selected' : ''}`}
              onClick={() => setSelectedDrawGraph('C')}
            >
              <div style={{ fontSize: "0.75rem", fontWeight: "bold", marginBottom: "4px", textAlign: "left" }}>Graph C</div>
              <svg width="100%" height="90" viewBox="0 0 160 90" style={{ backgroundColor: "#0f172a", borderRadius: "4px" }}>
                {/* Axes */}
                <line x1="20" y1="10" x2="20" y2="80" stroke="var(--text-secondary)" strokeWidth="1" />
                <line x1="20" y1="80" x2="150" y2="80" stroke="var(--text-secondary)" strokeWidth="1" />
                {/* Labels Correct */}
                <text x="5" y="15" fill="#60a5fa" fontSize="8" fontWeight="bold">d (m)</text>
                <text x="135" y="88" fill="#f87171" fontSize="8" fontWeight="bold">t (s)</text>
                {/* Graph line (Wrong maximum: peak is too high, then goes down to 1000m) */}
                <polyline points="20,80 120,10 140,24" fill="none" stroke="var(--accent-purple)" strokeWidth="1.5" />
                <circle cx="20" cy="80" r="2" fill="var(--text-primary)" />
                <circle cx="120" cy="10" r="2" fill="var(--text-primary)" />
                <circle cx="140" cy="24" r="2" fill="var(--text-primary)" />
              </svg>
              {selectedDrawGraph === 'C' && <div className="dt-badge" style={{ backgroundColor: "var(--status-error)" }}>✕</div>}
            </div>

            {/* Graph D */}
            <div 
              className={`dt-graph-card ${selectedDrawGraph === 'D' ? 'incorrect selected' : ''}`}
              onClick={() => setSelectedDrawGraph('D')}
            >
              <div style={{ fontSize: "0.75rem", fontWeight: "bold", marginBottom: "4px", textAlign: "left" }}>Graph D</div>
              <svg width="100%" height="90" viewBox="0 0 160 90" style={{ backgroundColor: "#0f172a", borderRadius: "4px" }}>
                {/* Axes */}
                <line x1="20" y1="10" x2="20" y2="80" stroke="var(--text-secondary)" strokeWidth="1" />
                <line x1="20" y1="80" x2="150" y2="80" stroke="var(--text-secondary)" strokeWidth="1" />
                {/* Labels Correct */}
                <text x="5" y="15" fill="#60a5fa" fontSize="8" fontWeight="bold">d (m)</text>
                <text x="135" y="88" fill="#f87171" fontSize="8" fontWeight="bold">t (s)</text>
                {/* Graph line (Flat line) */}
                <polyline points="20,80 40,20 140,20" fill="none" stroke="var(--accent-purple)" strokeWidth="1.5" />
                <circle cx="20" cy="80" r="2" fill="var(--text-primary)" />
                <circle cx="40" cy="20" r="2" fill="var(--text-primary)" />
                <circle cx="140" cy="20" r="2" fill="var(--text-primary)" />
              </svg>
              {selectedDrawGraph === 'D' && <div className="dt-badge" style={{ backgroundColor: "var(--status-error)" }}>✕</div>}
            </div>
          </div>

          {/* Feedback section */}
          {selectedDrawGraph && (
            <div className={`feedback-box ${graphFeedback[selectedDrawGraph].correct ? 'correct' : 'incorrect'}`}>
              <div style={{ fontWeight: "bold", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                {graphFeedback[selectedDrawGraph].correct ? <Check size={16} /> : <X size={16} />}
                {graphFeedback[selectedDrawGraph].correct ? "CORRECT SELECTION" : "INCORRECT SELECTION"}
              </div>
              <div><PhysicsText text={graphFeedback[selectedDrawGraph].text} /></div>
            </div>
          )}
        </div>
      )}

      {/* --- MODE: ROBOT --- */}
      {mode === "robot" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
          
          {/* Animated 1D linear track showing robot moving */}
          <div className="highway-track">
            {/* Grid pattern overlay */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "30px 100%" }} />
            
            {/* Track Line */}
            <line x1="30" y1="50" x2="510" y2="50" style={{ position: "absolute", top: "50%", left: "30px", right: "30px", height: "4px", backgroundColor: "#475569", display: "block" }} />
            
            {/* Start and destination markings */}
            <span style={{ position: "absolute", left: "20px", bottom: "6px", fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>0m (Start)</span>
            <span style={{ position: "absolute", left: "260px", bottom: "6px", fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", transform: "translateX(-50%)" }}>5m</span>
            <span style={{ position: "absolute", right: "20px", bottom: "6px", fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>10m (U-turn point)</span>
            
            {/* Live stats inside the track */}
            <div style={{ position: "absolute", top: "6px", left: "10px", right: "10px", display: "flex", justifyContent: "space-between", pointerEvents: "none" }}>
              <span className="hud-pill">Time: {simTime.toFixed(1)}s</span>
              <span className="hud-pill">Displacement: {getRobotPositionAndTime(simTime).d.toFixed(1)}m</span>
              <span className="hud-pill">Velocity: {getRobotPositionAndTime(simTime).v.toFixed(1)} m/s</span>
            </div>

            {/* Robot graphic on the track */}
            <g style={{
              position: "absolute",
              top: "35px",
              left: `${35 + (getRobotPositionAndTime(simTime).d / 10) * 440}px`,
              transform: `translateX(-50%) scale(${getRobotPositionAndTime(simTime).v < 0 ? -1 : 1}, 1)`,
              transition: "left 0.05s linear",
            }}>
              {/* Cute SVG Robot */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                {/* Robot body */}
                <rect x="4" y="8" width="16" height="12" rx="3" fill="url(#robotGradient)" stroke="#06b6d4" strokeWidth="1.5" />
                {/* Head */}
                <rect x="8" y="3" width="8" height="5" rx="1.5" fill="#1e293b" stroke="#06b6d4" strokeWidth="1.5" />
                {/* Neck */}
                <rect x="11" y="7" width="2" height="2" fill="#06b6d4" />
                {/* Eyes */}
                <circle cx="10" cy="5.5" r="1" fill="#22d3ee" />
                <circle cx="14" cy="5.5" r="1" fill="#22d3ee" />
                {/* Antenna */}
                <line x1="12" y1="3" x2="12" y2="1" stroke="#06b6d4" strokeWidth="1.5" />
                <circle cx="12" cy="1" r="1" fill="#8b5cf6" />
                {/* Wheels */}
                <circle cx="7" cy="21" r="2.5" fill="#0f172a" stroke="#94a3b8" />
                <circle cx="17" cy="21" r="2.5" fill="#0f172a" stroke="#94a3b8" />
                {/* Eye glow when moving */}
                {isPlaying && (
                  <ellipse cx="12" cy="5.5" rx="5" ry="1.5" fill="#22d3ee" opacity="0.3" />
                )}
              </svg>
            </g>
          </div>

          {/* Interactive Graph (SVG representation) */}
          <div className="canvas-area" style={{ height: "190px" }}>
            <svg width="100%" height="100%" viewBox="0 0 400 190">
              {/* Grid lines */}
              {Array.from({ length: 6 }).map((_, i) => (
                <line key={`v-${i}`} x1={50 + i * 60} y1="20" x2={50 + i * 60} y2="160" stroke="#334155" strokeWidth="0.5" strokeDasharray="2,2" />
              ))}
              {Array.from({ length: 4 }).map((_, i) => (
                <line key={`h-${i}`} x1="50" y1="40 + i * 40" x2="350" y2="40 + i * 40" stroke="#334155" strokeWidth="0.5" strokeDasharray="2,2" />
              ))}

              {/* Coordinates axes */}
              <line x1="50" y1="160" x2="360" y2="160" stroke="var(--text-secondary)" strokeWidth="1.5" markerEnd="url(#arrow-head)" />
              <line x1="50" y1="20" x2="50" y2="165" stroke="var(--text-secondary)" strokeWidth="1.5" markerEnd="url(#arrow-head)" />
              
              {/* Axes titles */}
              <text x="365" y="164" fill="var(--text-primary)" fontSize="10" fontWeight="bold">t (s)</text>
              <text x="35" y="18" fill="var(--text-primary)" fontSize="10" fontWeight="bold">d (m)</text>

              {/* Tick Marks & Values */}
              {/* Time axis ticks (0, 5, 10, 15) */}
              <text x="50" y="174" fill="var(--text-muted)" fontSize="9" textAnchor="middle">0</text>
              <text x="150" y="174" fill="var(--text-muted)" fontSize="9" textAnchor="middle">5</text>
              <text x="250" y="174" fill="var(--text-muted)" fontSize="9" textAnchor="middle">10</text>
              <text x="350" y="174" fill="var(--text-muted)" fontSize="9" textAnchor="middle">15</text>

              {/* Displacement axis ticks (0, 10) */}
              <text x="42" y="164" fill="var(--text-muted)" fontSize="9" textAnchor="end">0</text>
              <text x="42" y="80" fill="var(--text-muted)" fontSize="9" textAnchor="end">5</text>
              <text x="42" y="44" fill="var(--text-muted)" fontSize="9" textAnchor="end">10</text>

              {/* Graph lines (segments AB, BC, CD) */}
              {/* AB: (50, 160) -> (150, 40) */}
              <line 
                x1="50" y1="160" x2="150" y2="40" 
                className={`interactive-line ${selectedElement === 'AB' ? 'selected' : ''}`} 
                stroke={selectedElement === 'AB' ? 'var(--accent-purple)' : 'var(--accent-cyan)'} 
                onClick={() => setSelectedElement('AB')}
              />
              {/* BC: (150, 40) -> (250, 40) */}
              <line 
                x1="150" y1="40" x2="250" y2="40" 
                className={`interactive-line ${selectedElement === 'BC' ? 'selected' : ''}`} 
                stroke={selectedElement === 'BC' ? 'var(--accent-purple)' : 'var(--status-warning)'} 
                onClick={() => setSelectedElement('BC')}
              />
              {/* CD: (250, 40) -> (350, 160) */}
              <line 
                x1="250" y1="40" x2="350" y2="160" 
                className={`interactive-line ${selectedElement === 'CD' ? 'selected' : ''}`} 
                stroke={selectedElement === 'CD' ? 'var(--accent-purple)' : '#f87171'} 
                onClick={() => setSelectedElement('CD')}
              />

              {/* Plot points (nodes A, B, C, D) */}
              <circle cx="50" cy="160" r="5" fill="#fff" stroke="var(--accent-cyan)" strokeWidth="2" className={`interactive-node ${selectedElement === 'A' ? 'selected' : ''}`} onClick={() => setSelectedElement('A')} />
              <circle cx="150" cy="40" r="5" fill="#fff" stroke="var(--accent-cyan)" strokeWidth="2" className={`interactive-node ${selectedElement === 'B' ? 'selected' : ''}`} onClick={() => setSelectedElement('B')} />
              <circle cx="250" cy="40" r="5" fill="#fff" stroke="var(--accent-cyan)" strokeWidth="2" className={`interactive-node ${selectedElement === 'C' ? 'selected' : ''}`} onClick={() => setSelectedElement('C')} />
              <circle cx="350" cy="160" r="5" fill="#fff" stroke="var(--accent-cyan)" strokeWidth="2" className={`interactive-node ${selectedElement === 'D' ? 'selected' : ''}`} onClick={() => setSelectedElement('D')} />

              {/* Node labels */}
              <text x="50" y="150" fill="var(--text-primary)" fontSize="9" fontWeight="bold" textAnchor="middle">A</text>
              <text x="150" y="30" fill="var(--text-primary)" fontSize="9" fontWeight="bold" textAnchor="middle">B</text>
              <text x="250" y="30" fill="var(--text-primary)" fontSize="9" fontWeight="bold" textAnchor="middle">C</text>
              <text x="350" y="150" fill="var(--text-primary)" fontSize="9" fontWeight="bold" textAnchor="middle">D</text>

              {/* Live Playhead vertical line sweep */}
              <line x1={50 + (simTime / 15) * 300} y1="20" x2={50 + (simTime / 15) * 300} y2="160" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="3, 1" />
              <circle cx={50 + (simTime / 15) * 300} cy={160 - (getRobotPositionAndTime(simTime).d / 10) * 120} r="3" fill="#fef08a" />

              {/* Defs */}
              <defs>
                <marker id="arrow-head" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 2 L 8 5 L 0 8 z" fill="var(--text-secondary)" />
                </marker>
                <linearGradient id="robotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Stepper controller */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center" }}>
            <button className="btn btn-primary" style={{ padding: "8px 16px" }} onClick={handlePlayToggle}>
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              {isPlaying ? "Pause" : simTime >= 15 ? "Replay" : "Play Journey"}
            </button>
            <div style={{ flex: 1, height: "6px", backgroundColor: "var(--bg-input)", borderRadius: "3px", position: "relative", overflow: "hidden" }}>
              <div style={{ width: `${(simTime / 15) * 100}%`, height: "100%", background: "linear-gradient(to right, var(--accent-cyan), var(--accent-purple))" }} />
            </div>
          </div>

          {/* Element Analysis Output */}
          <div className="slope-details">
            {!selectedElement ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontStyle: "italic" }}>
                <Info size={16} /> Click on a point (A, B, C, D) or segment (AB, BC, CD) on the graph to view detailed analysis.
              </div>
            ) : robotSegments[selectedElement] ? (
              <div>
                <h4 style={{ color: "var(--accent-cyan)", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>{robotSegments[selectedElement].title}</span>
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.8rem", marginBottom: "8px", fontFamily: "var(--font-mono)" }}>
                  <div style={{ padding: "4px 8px", backgroundColor: "var(--bg-card)", borderRadius: "4px" }}>
                    Time: <span style={{ color: "var(--status-warning)" }}><PhysicsText text={robotSegments[selectedElement].time} /></span>
                  </div>
                  <div style={{ padding: "4px 8px", backgroundColor: "var(--bg-card)", borderRadius: "4px" }}>
                    Displacement: <span style={{ color: "var(--accent-cyan)" }}><PhysicsText text={robotSegments[selectedElement].disp} /></span>
                  </div>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "8px" }}>
                  <PhysicsText text={robotSegments[selectedElement].desc} />
                </p>
                <div className="formula-display" style={{ padding: "4px 12px", background: "transparent", border: "none", boxShadow: "none", margin: "4px 0 0 0" }}>
                  <BlockMath math={robotSegments[selectedElement].math} />
                </div>
              </div>
            ) : (
              <div>
                <h4 style={{ color: "var(--accent-purple)", marginBottom: "4px" }}>Point Coordinates</h4>
                <p style={{ color: "var(--text-primary)", fontSize: "0.88rem" }}><PhysicsText text={robotPoints[selectedElement]} /></p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MODE: SLOPE --- */}
      {mode === "slope" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
          
          {/* Animated 1D track with dynamic velocity vector arrow */}
          <div className="highway-track">
            {/* Grid pattern overlay */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "30px 100%" }} />
            
            <line x1="30" y1="50" x2="510" y2="50" style={{ position: "absolute", top: "50%", left: "30px", right: "30px", height: "4px", backgroundColor: "#475569", display: "block" }} />
            
            {/* Track labels */}
            <span style={{ position: "absolute", left: "20px", bottom: "4px", fontSize: "0.75rem", color: "var(--text-muted)" }}>-40m</span>
            <span style={{ position: "absolute", left: "260px", bottom: "4px", fontSize: "0.75rem", color: "var(--text-muted)", transform: "translateX(-50%)" }}>0m (Origin O)</span>
            <span style={{ position: "absolute", right: "20px", bottom: "4px", fontSize: "0.75rem", color: "var(--text-muted)" }}>+40m</span>
            
            {/* Live readout */}
            <div style={{ position: "absolute", top: "6px", left: "10px", right: "10px", display: "flex", justifyContent: "space-between", pointerEvents: "none" }}>
              <span className="hud-pill">
                <InlineMath math="t" /> = {simTime.toFixed(1)} s
              </span>
              <span className="hud-pill">
                <InlineMath math={"\\vec{d}"} /> = {(slopeVal * simTime).toFixed(1)} m
              </span>
              <span className="hud-pill" style={{ color: slopeVal > 0 ? "var(--status-success)" : slopeVal < 0 ? "var(--status-error)" : "var(--text-muted)" }}>
                <InlineMath math="v" /> = {slopeVal.toFixed(1)} m/s
              </span>
            </div>

            {/* Simulated Car */}
            <g style={{
              position: "absolute",
              top: "32px",
              left: `${260 + (slopeVal * simTime / 40) * 230}px`,
              transform: "translateX(-50%)",
              transition: isPlaying ? "none" : "left 0.15s ease-out",
            }}>
              <svg width="34" height="24" viewBox="0 0 34 24" fill="none">
                {/* Car Shadow */}
                <ellipse cx="17" cy="20" rx="14" ry="3" fill="#090d16" opacity="0.6" />
                
                {/* Body */}
                <path d="M4 14 L9 6 Q11 4, 15 4 L22 4 Q26 4, 28 6 L32 14 Q34 15, 34 17 L34 19 Q34 21, 32 21 L4 21 Q2 21, 2 19 L2 17 Q2 15, 4 14 Z" fill="url(#carSlopeGradient)" />
                {/* Windows */}
                <path d="M10 13 L14 7 L21 7 L25 13 Z" fill="#67e8f9" opacity="0.6" />
                {/* Wheels */}
                <circle cx="10" cy="20" r="4.5" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" className="wheel" style={{ transformOrigin: "10px 20px", transform: `rotate(${slopeVal * simTime * 120}deg)` }} />
                <circle cx="24" cy="20" r="4.5" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" className="wheel" style={{ transformOrigin: "24px 20px", transform: `rotate(${slopeVal * simTime * 120}deg)` }} />
              </svg>
            </g>

            {/* Velocity Vector Arrow drawn on the car */}
            {slopeVal !== 0 && (
              <div style={{
                position: "absolute",
                top: "16px",
                left: `${260 + (slopeVal * simTime / 40) * 230}px`,
                transform: `translateX(-50%) translateX(${slopeVal > 0 ? 25 : -25}px)`,
                display: "flex",
                alignItems: "center",
                transition: isPlaying ? "none" : "left 0.15s ease-out",
              }}>
                {slopeVal > 0 ? (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ height: "4px", width: `${Math.min(30, Math.abs(slopeVal) * 8)}px`, backgroundColor: "var(--status-success)" }} />
                    <ArrowRight size={12} className="text-emerald-500" style={{ color: "var(--status-success)", marginLeft: "-2px" }} />
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <ArrowLeft size={12} className="text-red-500" style={{ color: "var(--status-error)", marginRight: "-2px" }} />
                    <div style={{ height: "4px", width: `${Math.min(30, Math.abs(slopeVal) * 8)}px`, backgroundColor: "var(--status-error)" }} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SVG coordinate graph */}
          <div className="canvas-area" style={{ height: "180px" }}>
            <svg width="100%" height="100%" viewBox="0 0 400 180">
              {/* Grid lines */}
              {Array.from({ length: 11 }).map((_, i) => (
                <line key={`v-${i}`} x1={50 + i * 30} y1="20" x2={50 + i * 30} y2="160" stroke="#1e293b" strokeWidth="0.5" />
              ))}
              {Array.from({ length: 5 }).map((_, i) => (
                <line key={`h-${i}`} x1="50" y1="30 + i * 35" x2="350" y2="30 + i * 35" stroke="#1e293b" strokeWidth="0.5" />
              ))}

              {/* Center axis d=0 */}
              <line x1="50" y1="100" x2="350" y2="100" stroke="#475569" strokeWidth="1" strokeDasharray="3, 2" />

              {/* Axes lines */}
              <line x1="50" y1="160" x2="360" y2="160" stroke="var(--text-secondary)" strokeWidth="1.5" markerEnd="url(#arrow-head)" />
              <line x1="50" y1="20" x2="50" y2="165" stroke="var(--text-secondary)" strokeWidth="1.5" markerEnd="url(#arrow-head)" />
              
              {/* Axes titles */}
              <text x="365" y="164" fill="var(--text-primary)" fontSize="9" fontWeight="bold">t (s)</text>
              <text x="35" y="18" fill="var(--text-primary)" fontSize="9" fontWeight="bold">d (m)</text>

              {/* Ticks */}
              <text x="50" y="171" fill="var(--text-muted)" fontSize="8" textAnchor="middle">0</text>
              <text x="200" y="171" fill="var(--text-muted)" fontSize="8" textAnchor="middle">5</text>
              <text x="350" y="171" fill="var(--text-muted)" fontSize="8" textAnchor="middle">10</text>
              
              <text x="42" y="103" fill="var(--text-muted)" fontSize="8" textAnchor="end">0</text>
              <text x="42" y="68" fill="var(--text-muted)" fontSize="8" textAnchor="end">+20</text>
              <text x="42" y="33" fill="var(--text-muted)" fontSize="8" textAnchor="end">+40</text>
              <text x="42" y="138" fill="var(--text-muted)" fontSize="8" textAnchor="end">-20</text>
              <text x="42" y="165" fill="var(--text-muted)" fontSize="8" textAnchor="end">-40</text>

              {/* Plotting slope line from (0,0) to (10s, slopeVal * 10) */}
              {/* Point (0s, 0m) -> X=50, Y=100. Point (10s, slopeVal*10) -> X=350, Y=mapDispToY(slopeVal*10) */}
              <line 
                x1="50" y1="100" 
                x2="350" y2={mapDispToY(slopeVal * 10)} 
                stroke={slopeVal > 0 ? "var(--status-success)" : slopeVal < 0 ? "var(--status-error)" : "var(--text-muted)"} 
                strokeWidth="3.5" 
              />
              
              <circle cx="50" cy="100" r="4" fill="var(--text-primary)" />
              <circle cx="350" cy={mapDispToY(slopeVal * 10)} r="4" fill="var(--text-primary)" />

              {/* Current sweep tracker head */}
              <line x1={mapTimeToX(simTime)} y1="20" x2={mapTimeToX(simTime)} y2="160" stroke="#fef08a" strokeWidth="1" strokeDasharray="3,2" />
              <circle cx={mapTimeToX(simTime)} cy={mapDispToY(slopeVal * simTime)} r="3" fill="#fef08a" />

              {/* Gradients */}
              <defs>
                <linearGradient id="carSlopeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Stepper controller controls */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center" }}>
            <button className="btn btn-primary" style={{ padding: "8px 16px" }} onClick={handlePlayToggle}>
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              {isPlaying ? "Pause" : simTime >= 10 ? "Replay" : "Play Simulation"}
            </button>
            <div style={{ flex: 1, height: "6px", backgroundColor: "var(--bg-input)", borderRadius: "3px", position: "relative", overflow: "hidden" }}>
              <div style={{ width: `${(simTime / 10) * 100}%`, height: "100%", background: "linear-gradient(to right, var(--accent-cyan), var(--accent-purple))" }} />
            </div>
          </div>

          {/* Slider input */}
          <div className="slider-control-group" style={{ marginTop: "6px" }}>
            <div className="control-label-row">
              <span>
                Graph Slope (Velocity <InlineMath math="v" />)
              </span>
              <span className="label-val" style={{ color: slopeVal > 0 ? "var(--status-success)" : slopeVal < 0 ? "var(--status-error)" : "var(--text-muted)" }}>
                {slopeVal > 0 ? `+${slopeVal.toFixed(1)}` : slopeVal.toFixed(1)} m/s
              </span>
            </div>
            <input 
              type="range" 
              min="-4" 
              max="4" 
              step="0.5" 
              value={slopeVal} 
              onChange={(e) => {
                setSlopeVal(parseFloat(e.target.value));
                setSimTime(0);
                setIsPlaying(false);
              }}
              className="custom-slider"
            />
          </div>

          {/* Mathematical formulation analysis */}
          <div className="slope-details">
            <div style={{ fontWeight: "bold", marginBottom: "4px", color: "var(--text-primary)" }}>
              {slopeVal > 0 && "📈 Upward Slope (Positive Slope)"}
              {slopeVal === 0 && "➖ Horizontal Slope (Zero Slope)"}
              {slopeVal < 0 && "📉 Downward Slope (Negative Slope)"}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
              {slopeVal > 0 && <PhysicsText text="Displacement increases over time. Velocity $v > 0$, the car moves uniformly in the positive direction." />}
              {slopeVal === 0 && <PhysicsText text="Displacement is constant over time. Velocity $v = 0$, the car is stationary." />}
              {slopeVal < 0 && <PhysicsText text="Displacement decreases over time. Velocity $v < 0$, the car moves in the negative direction (reverse)." />}
            </div>
            
            <div className="formula-display" style={{ padding: "4px 12px", background: "transparent", border: "none", boxShadow: "none", margin: "0" }}>
              <BlockMath math={`v = \\text{Slope} = \\frac{\\Delta d}{\\Delta t} = \\frac{${(slopeVal * 10).toFixed(0)}\\text{ m} - 0\\text{ m}}{10\\text{ s} - 0\\text{ s}} = ${slopeVal > 0 ? "+" : ""}${slopeVal.toFixed(1)}\\text{ m/s}`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
