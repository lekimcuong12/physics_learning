import React, { useState, useEffect, useRef } from "react";
import { MoveRight, Play, Pause, RotateCcw } from "lucide-react";
import { InlineMath } from "../SafeMath";

export default function VelocitySim() {
  const [angle, setAngle] = useState(0); // Angle in degrees from 0 to 720 (2 laps)
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef(null);
  const trackRef = useRef(null);

  // Constants
  const cx = 200;
  const cy = 110;
  const r = 65; // radius in pixels
  const startX = cx;
  const startY = cy - r; // Start at the top (12 o'clock)

  // Physical scaling matching the quiz question:
  // Radius is 50 meters, so 1 lap (360 deg) is 2 * pi * 50 = 314.16 meters.
  const physicalRadius = 50; 
  
  // Calculate current runner coordinates
  // Convert angle to radians. Offset by -90 deg (pi/2) so 0 deg starts at top
  const rad = (angle * Math.PI) / 180 - Math.PI / 2;
  const x = cx + r * Math.cos(rad);
  const y = cy + r * Math.sin(rad);

  // Physics Calculations
  const distance = (angle / 360) * (2 * Math.PI * physicalRadius);
  
  // Straight line distance from start (cx, cy - r) to (x,y)
  const pixelDx = x - startX;
  const pixelDy = y - startY;
  const pixelDist = Math.sqrt(pixelDx * pixelDx + pixelDy * pixelDy);
  // Scale pixel distance to physical meters (r pixels = 50 meters)
  const displacement = (pixelDist / r) * physicalRadius;

  // Auto-play animation
  useEffect(() => {
    let lastTime = null;
    const animate = (time) => {
      if (lastTime === null) lastTime = time;
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      setAngle((prev) => {
        const next = prev + 45 * dt; // 45 degrees per second
        if (next >= 720) {
          setIsPlaying(false);
          return 720;
        }
        return next;
      });
      
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  // Handle direct track dragging/clicking
  const handleSVGInteraction = (clientX, clientY) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const localX = clientX - rect.left - rect.width / 2;
    const localY = clientY - rect.top - rect.height / 2;

    // Calculate angle in radians from top center (12 o'clock)
    // Math.atan2(y, x) returns angle from positive x axis
    // Subtracting PI/2 turns it relative to positive y axis (down)
    // To make it clockwise from top, we use Math.atan2(localX, -localY)
    let targetRad = Math.atan2(localX, -localY);
    if (targetRad < 0) {
      targetRad += 2 * Math.PI;
    }

    let targetDeg = (targetRad * 180) / Math.PI;
    
    // Manage multi-lap locking
    // If the current angle is in the second lap (360-720), try to keep it in the second lap unless clicking close to start
    if (angle > 270) {
      if (angle > 540 && targetDeg < 90) {
        setAngle(360 + targetDeg);
      } else if (angle < 450 && targetDeg > 270) {
        setAngle(targetDeg);
      } else {
        setAngle(angle > 360 ? 360 + targetDeg : targetDeg);
      }
    } else {
      setAngle(targetDeg);
    }
  };

  const handleMouseDown = (e) => {
    handleSVGInteraction(e.clientX, e.clientY);
    
    const handleMouseMove = (moveEvent) => {
      handleSVGInteraction(moveEvent.clientX, moveEvent.clientY);
    };
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Generate SVG path for the accumulated distance arc
  const getArcPath = () => {
    if (angle <= 0.1) return "";
    
    let path = `M ${startX} ${startY}`;
    // If more than 360 deg, draw a full circle first
    if (angle >= 360) {
      path += ` A ${r} ${r} 0 1 1 ${cx} ${cy + r}`;
      path += ` A ${r} ${r} 0 1 1 ${startX} ${startY}`;
    }

    // Remaining angle
    const remAngle = angle % 360;
    if (remAngle > 0.1) {
      const remRad = (angle * Math.PI) / 180 - Math.PI / 2;
      const endX = cx + r * Math.cos(remRad);
      const endY = cy + r * Math.sin(remRad);
      const largeArcFlag = remAngle > 180 ? 1 : 0;
      path += ` A ${r} ${r} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
    }
    
    return path;
  };

  const handleReset = () => {
    setIsPlaying(false);
    setAngle(0);
  };

  return (
    <div className="simulator-container">
      <div className="simulator-header">
        <span className="simulator-title" style={{ color: "var(--accent-purple)" }}>
          <MoveRight size={18} />
          Velocity &amp; Displacement Laboratory
        </span>
        <button className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }} onClick={handleReset}>
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      <div className="canvas-area">
        {/* HUD Stats */}
        <div className="canvas-hud">
          <div className="hud-pill" style={{ borderColor: "var(--status-error)", color: "var(--status-error)" }}>
            Distance (<InlineMath math="s" />): {distance.toFixed(1)} m
          </div>
          <div className="hud-pill" style={{ borderColor: "var(--accent-cyan)", color: "var(--accent-cyan)" }}>
            Displacement (<InlineMath math={"\\vec{d}"} />): {displacement.toFixed(1)} m
          </div>
        </div>

        {/* Vector SVG View */}
        <svg 
          ref={trackRef}
          width="100%" 
          height="100%" 
          viewBox="0 0 400 220"
          style={{ cursor: "crosshair", backgroundColor: "#0f172a" }}
          onMouseDown={handleMouseDown}
        >
          {/* Grid coordinates */}
          <line x1="200" y1="0" x2="200" y2="220" className="simulation-vector-axis" />
          <line x1="0" y1="110" x2="400" y2="110" className="simulation-vector-axis" />

          {/* Starting point marker flag */}
          <circle cx={startX} cy={startY} r="4" fill="#ffffff" />
          <text x={startX} y={startY - 8} fill="#ffffff" fontSize="9" textAnchor="middle" fontFamily="var(--font-mono)">START</text>

          {/* Track Outline (Grey Circle) */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

          {/* Distance path (Red thick overlay) */}
          {angle > 0 && (
            <path 
              d={getArcPath()} 
              fill="none" 
              stroke="var(--status-error)" 
              strokeWidth="5" 
              opacity="0.85" 
              strokeLinecap="round"
            />
          )}

          {/* Displacement Vector (Blue Arrow starting at startX, startY to current x, y) */}
          {angle > 0.5 && (
            <g>
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="var(--accent-cyan)" />
                </marker>
              </defs>
              <line 
                x1={startX} 
                y1={startY} 
                x2={x} 
                y2={y} 
                stroke="var(--accent-cyan)" 
                strokeWidth="4" 
                markerEnd="url(#arrow)"
                style={{ filter: "drop-shadow(0 0 4px var(--accent-cyan-glow))" }}
              />
              <g>
                <text 
                  x={(startX + x) / 2 + 10} 
                  y={(startY + y) / 2 + 5} 
                  fill="var(--accent-cyan)" 
                  fontSize="10" 
                  fontFamily="var(--font-mono)" 
                  fontWeight="bold"
                >
                  d
                </text>
                <path 
                  d={`M ${(startX + x) / 2 + 10.5} ${(startY + y) / 2 - 6} L ${(startX + x) / 2 + 16.5} ${(startY + y) / 2 - 6} M ${(startX + x) / 2 + 14.5} ${(startY + y) / 2 - 7.5} L ${(startX + x) / 2 + 16.5} ${(startY + y) / 2 - 6} L ${(startX + x) / 2 + 14.5} ${(startY + y) / 2 - 4.5}`}
                  fill="none"
                  stroke="var(--accent-cyan)"
                  strokeWidth="1.2"
                />
              </g>
            </g>
          )}

          {/* Runner Node (Interactive Dot) */}
          <circle cx={x} cy={y} r="8" className="simulation-vector-runner" style={{ filter: "drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))" }} />
          
          {/* Label indicating Angle */}
          <text x="380" y="200" fill="var(--text-muted)" fontSize="10" textAnchor="end" fontFamily="var(--font-mono)">
            Angle: {angle.toFixed(0)}° ({ (angle/360).toFixed(1) } Laps)
          </text>
        </svg>
      </div>

      {/* Simulator Play & Slide Control */}
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
            max="720" 
            step="1" 
            value={angle} 
            onChange={(e) => {
              setIsPlaying(false);
              setAngle(parseFloat(e.target.value));
            }} 
            className="custom-slider"
          />
        </div>
      </div>

      {/* Physics Readouts */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "10px", fontSize: "0.85rem", fontFamily: "var(--font-mono)", textAlign: "left" }}>
        <div style={{ padding: "10px", backgroundColor: "var(--bg-input)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
          <div style={{ color: "var(--text-muted)", marginBottom: "4px" }}>
            Distance (<InlineMath math="s" />) [Scalar]:
          </div>
          <div style={{ fontWeight: "bold", color: "var(--status-error)", fontSize: "1.05rem" }}>
            {distance.toFixed(1)} m
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
            Total path length covered.
          </div>
        </div>
        <div style={{ padding: "10px", backgroundColor: "var(--bg-input)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
          <div style={{ color: "var(--text-muted)", marginBottom: "4px" }}>
            Displacement (<InlineMath math={"\\vec{d}"} />) [Vector]:
          </div>
          <div style={{ fontWeight: "bold", color: "var(--accent-cyan)", fontSize: "1.05rem" }}>
            {displacement.toFixed(1)} m
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
            Straight-line distance from Start.
          </div>
        </div>
      </div>
    </div>
  );
}
