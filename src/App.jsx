import React, { useState, useEffect } from "react";
import { 
  Sun, 
  Moon, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  Volume2, 
  VolumeX, 
  Award, 
  Compass, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  RotateCcw
} from "lucide-react";
import TimelineSort from "./components/InteractiveSimulations/TimelineSort";
import RobotGrid from "./components/InteractiveSimulations/RobotGrid";
import BikeTrip from "./components/InteractiveSimulations/BikeTrip";
import SpeedSim from "./components/InteractiveSimulations/SpeedSim";
import VelocitySim from "./components/InteractiveSimulations/VelocitySim";
import AdditionSim from "./components/InteractiveSimulations/AdditionSim";
import DisplacementTimeGraphSim from "./components/InteractiveSimulations/DisplacementTimeGraphSim";
import { InlineMath, BlockMath } from "./components/SafeMath";
import "katex/dist/katex.min.css";

// Synthesized Audio Tones Player using Web Audio API
const playSound = (type, isMuted) => {
  if (isMuted) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const playTone = (freq, duration, oscType = "sine", delay = 0) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = oscType;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
    };

    if (type === "click") {
      playTone(550, 0.06, "triangle");
    } else if (type === "correct") {
      playTone(523.25, 0.12, "sine", 0);
      playTone(659.25, 0.12, "sine", 0.06);
      playTone(783.99, 0.22, "sine", 0.12);
    } else if (type === "incorrect") {
      playTone(220, 0.18, "sawtooth", 0);
      playTone(165, 0.32, "sawtooth", 0.06);
    } else if (type === "complete") {
      playTone(261.63, 0.18, "sine", 0);
      playTone(329.63, 0.18, "sine", 0.06);
      playTone(392.00, 0.18, "sine", 0.12);
      playTone(523.25, 0.35, "sine", 0.18);
    }
  } catch (err) {
    console.warn("AudioContext initialization failed:", err);
  }
};

// Subscript/Vector Physics Text Formatter using KaTeX
export function PhysicsText({ text }) {
  if (!text) return null;

  // Split text by $ to find inline LaTeX math
  const parts = text.split("$");
  
  return (
    <span className="notranslate" translate="no" style={{ display: "inline" }}>
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          // Inside $...$, render as KaTeX InlineMath
          return <InlineMath key={index} math={part} />;
        } else {
          // Outside $...$, process standard variables and symbols
          const tokenRegex = /(\\vec\{v\}|\\vec\{d\}|\\Delta\\vec\{d\}|\\Delta t|\\Delta s|v1,3|v1,2|v2,3|v_t|v_avg|v21,2|v22,3|\\vec\{d\}_1\s*\+\s*\\vec\{d\}_2|\\vec\{d\}_1|\\vec\{d\}_2|v_{1,3}|v_{1,2}|v_{2,3})/;
          
          const subParts = part.split(tokenRegex);
          return (
            <React.Fragment key={index}>
              {subParts.map((subPart, subIndex) => {
                if (tokenRegex.test(subPart)) {
                  // Normalize token to LaTeX
                  let mathExpr = subPart;
                  if (mathExpr === "v1,3" || mathExpr === "v_1,3") mathExpr = "v_{1,3}";
                  else if (mathExpr === "v1,2" || mathExpr === "v_1,2") mathExpr = "v_{1,2}";
                  else if (mathExpr === "v2,3" || mathExpr === "v_2,3") mathExpr = "v_{2,3}";
                  else if (mathExpr === "v_t" || mathExpr === "vt") mathExpr = "v_t";
                  else if (mathExpr === "v_avg") mathExpr = "v_{\\text{avg}}";
                  else if (mathExpr === "v21,2") mathExpr = "v_{1,2}^2";
                  else if (mathExpr === "v22,3") mathExpr = "v_{2,3}^2";
                  else if (mathExpr === "\\Delta\\vec{d}") mathExpr = "\\Delta \\vec{d}";
                  
                  return <InlineMath key={subIndex} math={mathExpr} />;
                }
                
                return <span key={subIndex} dangerouslySetInnerHTML={{ __html: subPart }} />;
              })}
            </React.Fragment>
          );
        }
      })}
    </span>
  );
}

// Math Equations Fraction Formatter using KaTeX
export function MathFormula({ formula }) {
  if (!formula) return null;
  
  if (formula.includes("\\text{LLM Query}")) {
    return (
      <div className="formula-display notranslate" translate="no" style={{ fontSize: "0.85rem", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
        <span style={{ padding: "4px 8px", background: "var(--accent-purple-glow)", border: "1px solid var(--accent-purple)", borderRadius: "4px", color: "var(--text-primary)" }}>LLM Query</span>
        <span style={{ color: "var(--accent-cyan)" }}>&rarr;</span>
        <span style={{ padding: "4px 8px", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "4px" }}>MCP Client</span>
        <span style={{ color: "var(--accent-cyan)" }}>&rarr;</span>
        <span style={{ padding: "4px 8px", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "4px" }}>MCP Server</span>
        <span style={{ color: "var(--accent-cyan)" }}>&rarr;</span>
        <span style={{ padding: "4px 8px", background: "var(--accent-cyan-glow)", border: "1px solid var(--accent-cyan)", borderRadius: "4px", color: "var(--text-primary)" }}>Browser DOM</span>
      </div>
    );
  }

  if (formula.includes("S_{\\text{total}}")) {
    return (
      <div className="formula-display notranslate" translate="no" style={{ fontSize: "0.95rem", flexDirection: "column", gap: "4px" }}>
        <div>S<sub>total</sub> = 0.4 &middot; S<sub>text</sub> + 0.2 &middot; S<sub>id</sub> + 0.2 &middot; S<sub>dom</sub> + 0.2 &middot; S<sub>visual</sub></div>
        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
          Weighted element similarity scoring system
        </div>
      </div>
    );
  }

  return (
    <div className="formula-display notranslate" translate="no" style={{ background: "transparent", border: "none", boxShadow: "none", padding: 0 }}>
      <BlockMath math={formula} />
    </div>
  );
}

// Decorative Rotating Vector Plane for Intro and Summary cover slides
function PhysicsDecorativeGrid() {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    let lastTime = null;
    const rotate = (time) => {
      if (!lastTime) lastTime = time;
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      setAngle((prev) => (prev + 10 * dt) % 360);
      animationFrame = requestAnimationFrame(rotate);
    };
    let animationFrame = requestAnimationFrame(rotate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const rad = (angle * Math.PI) / 180;
  const vx = 200 + 70 * Math.cos(rad);
  const vy = 110 - 70 * Math.sin(rad);

  return (
    <div className="simulator-container" style={{ minHeight: "340px", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: 16, left: 16, fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
        <Compass size={14} /> Vector Space Visualizer
      </div>
      <svg width="100%" height="240" viewBox="0 0 400 220" style={{ backgroundColor: "transparent" }}>
        <line x1="200" y1="0" x2="200" y2="220" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3, 3" />
        <line x1="0" y1="110" x2="400" y2="110" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3, 3" />
        <circle cx="200" cy="110" r="70" fill="none" stroke="var(--border-color)" strokeWidth="1" />
        <line x1="200" y1="110" x2={vx} y2={vy} stroke="var(--accent-cyan)" strokeWidth="3.5" markerEnd="url(#grid-arrow-d)" />
        <circle cx="200" cy="110" r="4" fill="var(--text-primary)" />
        <g>
          <text x={vx + 10} y={vy - 2} fill="var(--accent-cyan)" fontSize="10" fontWeight="bold" fontFamily="var(--font-mono)">d</text>
          <path 
            d={`M ${vx + 10.5} ${vy - 11} L ${vx + 16.5} ${vy - 11} M ${vx + 14.5} ${vy - 12.5} L ${vx + 16.5} ${vy - 11} L ${vx + 14.5} ${vy - 9.5}`}
            fill="none"
            stroke="var(--accent-cyan)"
            strokeWidth="1.2"
          />
        </g>
        <defs>
          <marker id="grid-arrow-d" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="var(--accent-cyan)" />
          </marker>
        </defs>
      </svg>
      <div style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
        &theta; = {angle.toFixed(0)}&deg; | Displacement Vector Animation
      </div>
    </div>
  );
}



import { courseLessons } from "./data/lessonsData";

function App() {
  const activeSubject = "physics";
  // Page routing state
  const [viewState, setViewState] = useState("home"); // "home" or "lesson"
  const [activeLessonId, setActiveLessonId] = useState("lesson-1");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [activeQuizIndex, setActiveQuizIndex] = useState(-1);

  // Course locking state
  const [completedLessons, setCompletedLessons] = useState(() => {
    const saved = localStorage.getItem("completedLessons");
    return saved ? JSON.parse(saved) : [];
  });

  // Quiz branching states
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [showIncorrectPrompt, setShowIncorrectPrompt] = useState(false);
  const [isExplanationRevealed, setIsExplanationRevealed] = useState(false);
  const [score, setScore] = useState(0);

  // Settings
  const [isMuted, setIsMuted] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Sync completions
  useEffect(() => {
    localStorage.setItem("completedLessons", JSON.stringify(completedLessons));
  }, [completedLessons]);

  const toggleTheme = () => {
    playSound("click", isMuted);
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  // Get filtered lessons for active subject
  const currentLessons = courseLessons.filter(l => l.subject === activeSubject);
  const activeLesson = currentLessons.find(l => l.id === activeLessonId) || currentLessons[0] || courseLessons[0];
  const currentSlide = activeLesson.slides[currentSlideIndex] || activeLesson.slides[0];
  const progressPercent = ((currentSlideIndex + 1) / activeLesson.slides.length) * 100;

  // Handle category option selection
  const handleSelectOption = (idx) => {
    if (isAnswerChecked) return;
    playSound("click", isMuted);
    setSelectedOptionIndex(idx);
  };

  // Check quiz option submission
  const handleCheckAnswer = () => {
    if (selectedOptionIndex === null || isAnswerChecked) return;

    const activeQuiz = (currentSlide.quizzes && activeQuizIndex >= 0) ? currentSlide.quizzes[activeQuizIndex] : null;
    const correct = activeQuiz ? activeQuiz.options[selectedOptionIndex].isCorrect : currentSlide.options[selectedOptionIndex].isCorrect;

    setIsAnswerCorrect(correct);
    setIsAnswerChecked(true);

    if (correct) {
      setScore(prev => prev + 1);
      playSound("correct", isMuted);
    } else {
      playSound("incorrect", isMuted);
      // Reveal Retry/Show explanation prompts
      setShowIncorrectPrompt(true);
    }
  };

  const handleRetryQuiz = () => {
    playSound("click", isMuted);
    // Reset slide quiz hooks to let them answer again
    setSelectedOptionIndex(null);
    setIsAnswerChecked(false);
    setIsAnswerCorrect(false);
    setShowIncorrectPrompt(false);
    setIsExplanationRevealed(false);
  };

  const handleRevealQuizSolution = () => {
    playSound("click", isMuted);
    setIsExplanationRevealed(true);
    setShowIncorrectPrompt(false);
  };

  // Continue to next slide
  const handleNextSlide = () => {
    playSound("click", isMuted);

    // Check if there are remaining quizzes in this slide
    if (activeQuizIndex === -1 && currentSlide.quizzes && currentSlide.quizzes.length > 0) {
      // Transition to first quiz
      setActiveQuizIndex(0);
      setSelectedOptionIndex(null);
      setIsAnswerChecked(false);
      setIsAnswerCorrect(false);
      setShowIncorrectPrompt(false);
      setIsExplanationRevealed(false);
      return;
    }

    if (activeQuizIndex >= 0 && currentSlide.quizzes && activeQuizIndex + 1 < currentSlide.quizzes.length) {
      // Transition to next quiz in same slide
      setActiveQuizIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswerChecked(false);
      setIsAnswerCorrect(false);
      setShowIncorrectPrompt(false);
      setIsExplanationRevealed(false);
      return;
    }

    // Otherwise, we move to the next slide
    // Reset active quiz index for next slide
    setActiveQuizIndex(-1);
    
    // Check if it is the summary/last slide
    if (currentSlideIndex === activeLesson.slides.length - 1) {
      // Mark current lesson as complete
      if (!completedLessons.includes(activeLessonId)) {
        setCompletedLessons(prev => [...prev, activeLessonId]);
      }
      
      // Navigate back to Dashboard
      playSound("complete", isMuted);
      setViewState("home");
      return;
    }

    // Go to next slide
    setCurrentSlideIndex(prev => prev + 1);
    setSelectedOptionIndex(null);
    setIsAnswerChecked(false);
    setIsAnswerCorrect(false);
    setShowIncorrectPrompt(false);
    setIsExplanationRevealed(false);

    // Play completion fan-fare chime when shifting to final summary slide
    if (currentSlideIndex + 2 === activeLesson.slides.length) {
      setTimeout(() => playSound("complete", isMuted), 150);
    }
  };

  const handlePrevSlide = () => {
    playSound("click", isMuted);

    if (activeQuizIndex > 0) {
      setActiveQuizIndex(prev => prev - 1);
      setSelectedOptionIndex(null);
      setIsAnswerChecked(false);
      setIsAnswerCorrect(false);
      setShowIncorrectPrompt(false);
      setIsExplanationRevealed(false);
      return;
    }

    if (activeQuizIndex === 0) {
      setActiveQuizIndex(-1);
      setSelectedOptionIndex(null);
      setIsAnswerChecked(false);
      setIsAnswerCorrect(false);
      setShowIncorrectPrompt(false);
      setIsExplanationRevealed(false);
      return;
    }

    // If activeQuizIndex === -1, go to previous slide
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
      setActiveQuizIndex(-1);
      setSelectedOptionIndex(null);
      setIsAnswerChecked(false);
      setIsAnswerCorrect(false);
      setShowIncorrectPrompt(false);
      setIsExplanationRevealed(false);
    } else {
      // On first slide, go back to home dashboard
      setViewState("home");
    }
  };

  const startLesson = (lessonId) => {
    playSound("click", isMuted);
    setActiveLessonId(lessonId);
    setCurrentSlideIndex(0);
    setActiveQuizIndex(-1);
    setSelectedOptionIndex(null);
    setIsAnswerChecked(false);
    setIsAnswerCorrect(false);
    setShowIncorrectPrompt(false);
    setIsExplanationRevealed(false);
    setViewState("lesson");
  };

  const handleResetPlatform = () => {
    playSound("click", isMuted);
    setCompletedLessons([]);
    setScore(0);
  };

  const renderSimulator = () => {
    switch (currentSlide.simulationId) {
      case "sort-game":
        return <TimelineSort onComplete={() => {}} />;
      case "robot-grid":
        return <RobotGrid />;
      case "bike-trip":
        return <BikeTrip />;
      case "speed":
        return <SpeedSim />;
      case "velocity":
        return <VelocitySim />;
      case "addition":
        return <AdditionSim />;
      case "graph-draw-sim":
        return <DisplacementTimeGraphSim mode="draw" />;
      case "robot-graph-sim":
        return <DisplacementTimeGraphSim mode="robot" />;
      case "slope-car-sim":
        return <DisplacementTimeGraphSim mode="slope" />;
      default:
        return <PhysicsDecorativeGrid />;
    }
  };

  return (
    <div className="app-container notranslate" translate="no">
      
      {/* -------------------- VIEW 1: HOME PAGE DASHBOARD -------------------- */}
      {viewState === "home" && (
        <>
          <header className="navbar">
            <div className="logo-container">
              <div className="logo-icon">⚡</div>
              <span className="logo-text">Physics Learning</span>
            </div>

            <div className="nav-actions">
              <div className="tracker-hud">
                <span>Completed Lessons:</span>
                <span className="hud-score" style={{ color: "var(--status-success)" }}>
                  {completedLessons.filter(id => currentLessons.some(l => l.id === id)).length}/{currentLessons.length}
                </span>
              </div>
              <button className="theme-toggle-btn" onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <button className="theme-toggle-btn" onClick={toggleTheme}>
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </header>

          <main style={{ flex: 1, padding: "40px 24px", maxWidth: "880px", margin: "0 auto", width: "100%", animation: "slideUp 0.4s ease-out" }}>
            
            {/* Course Information Hero */}
            <div style={{ marginBottom: "40px", textAlign: "left" }}>
              <span className="lesson-badge">KINEMATICS COURSE</span>
              <h1 style={{ fontSize: "2.8rem", letterSpacing: "-1px", marginBottom: "12px" }}>Linear Dynamics &amp; Motion</h1>
              <p style={{ fontSize: "1.15rem", color: "var(--text-secondary)", maxWidth: "680px", lineHeight: "1.6" }}>
                Master displacement vectors, frame reference systems, speed indicators, relative speed vector sums, and circular motion vectors with step-by-step simulations.
              </p>
            </div>

            {/* Lessons Roadmap Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {currentLessons.map((lesson, idx) => {
                const isUnlocked = idx === 0 || completedLessons.includes(currentLessons[idx - 1].id);
                const isCompleted = completedLessons.includes(lesson.id);

                return (
                  <div 
                    key={lesson.id}
                    onClick={() => isUnlocked && startLesson(lesson.id)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto",
                      alignItems: "center",
                      gap: "24px",
                      backgroundColor: "var(--bg-card)",
                      border: isCompleted 
                        ? "1px solid var(--status-success-border)" 
                        : isUnlocked 
                          ? "1px solid var(--border-color)" 
                          : "1px solid rgba(255, 255, 255, 0.03)",
                      borderRadius: "16px",
                      padding: "24px",
                      cursor: isUnlocked ? "pointer" : "not-allowed",
                      opacity: isUnlocked ? 1 : 0.45,
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: isUnlocked ? "var(--shadow-sm)" : "none"
                    }}
                    className={isUnlocked ? "quiz-option" : ""}
                  >
                    {/* Index Badge */}
                    <div 
                      style={{ 
                        width: "48px", 
                        height: "48px", 
                        borderRadius: "12px", 
                        backgroundColor: isCompleted 
                          ? "var(--status-success-bg)" 
                          : "var(--bg-input)", 
                        display: "flex", 
                        alignItems: "center", 
                        justify: "center",
                        fontSize: "1.3rem",
                        fontWeight: "800",
                        color: isCompleted ? "var(--status-success)" : "var(--text-secondary)",
                        border: "1px solid var(--border-color)",
                        justifyContent: "center"
                      }}
                    >
                      {idx + 1}
                    </div>

                    {/* Lesson text */}
                    <div style={{ textAlign: "left" }}>
                      <h3 style={{ fontSize: "1.25rem", marginBottom: "4px", color: "var(--text-primary)" }}>
                        {lesson.title}
                      </h3>
                      <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)" }}>
                        <PhysicsText text={lesson.description} />
                      </p>
                    </div>

                    {/* Unlock Status Action icon */}
                    <div>
                      {isCompleted ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--status-success)", fontWeight: "600", fontSize: "0.85rem" }}>
                          <CheckCircle2 size={18} /> Completed
                        </div>
                      ) : isUnlocked ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--accent-cyan)", fontWeight: "600", fontSize: "0.85rem" }}>
                          <Unlock size={16} /> Start Lesson
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                          <Lock size={16} /> Locked
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dashboard Footer Action */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "40px", paddingTop: "20px", borderTop: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                Platform Local Storage Sync Active.
              </span>
              {(completedLessons.length > 0) && (
                <button className="btn btn-secondary" style={{ color: "var(--status-error)" }} onClick={handleResetPlatform}>
                  <RotateCcw size={14} /> Reset Course Progress
                </button>
              )}
            </div>

          </main>
        </>
      )}

      {/* -------------------- VIEW 2: ACTIVE SPLIT-SCREEN LESSON CARD -------------------- */}
      {viewState === "lesson" && (
        <>
          {/* Header */}
          <header className="navbar">
            <button className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.85rem" }} onClick={() => setViewState("home")}>
              &larr; Back to Dashboard
            </button>

            <div className="logo-container">
              <span className="logo-text" style={{ fontSize: "1.1rem" }}>{activeLesson.title}</span>
            </div>

            <div className="nav-actions">
              <div className="tracker-hud">
                <span>Card:</span>
                <span className="hud-score">{currentSlideIndex + 1}/{activeLesson.slides.length}</span>
                {activeQuizIndex >= 0 && (
                  <>
                    <span style={{ margin: "0 4px", color: "var(--border-color)" }}>|</span>
                    <span>Quiz Score:</span>
                    <span className="hud-score" style={{ color: "var(--status-success)" }}>{score}</span>
                  </>
                )}
              </div>
              <button className="theme-toggle-btn" onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <button className="theme-toggle-btn" onClick={toggleTheme}>
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </header>

          {/* Progress fill */}
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>

          {/* Splitted view grid */}
          <main className="workspace-grid">
            
            {/* Split 1: Card texts */}
            <section className="content-panel">
              <div className="content-card-body" key={`${activeLessonId}-${currentSlideIndex}`}>
                
                {/* badges */}
                <span className="lesson-badge">
                  {currentSlide.type === "intro" && "Intro Card"}
                  {currentSlide.type === "theory" && activeQuizIndex === -1 && `Concept ${currentSlideIndex} of ${activeLesson.slides.length - 2}`}
                  {currentSlide.type === "theory" && activeQuizIndex >= 0 && `Interactive Quiz ${activeQuizIndex + 1} of ${currentSlide.quizzes?.length}`}
                  {currentSlide.type === "summary" && "Summary review"}
                </span>

                {/* header */}
                <h1 className="card-title">{currentSlide.title}</h1>
                {currentSlide.subtitle && <p className="card-subtitle">{currentSlide.subtitle}</p>}
                
                {currentSlide.concept && (
                  <div className="concept-text">
                    <PhysicsText text={currentSlide.concept} />
                  </div>
                )}

                {/* View Intro */}
                {currentSlide.type === "intro" && (
                  <div className="intro-container">
                    <p style={{ fontSize: "1.05rem" }}>{currentSlide.introText}</p>
                    <ul className="bullets-styled">
                      {currentSlide.bullets.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* View Theory */}
                {currentSlide.type === "theory" && (
                  <div>
                    {currentSlide.sections.map((sec, idx) => (
                      <div key={idx} className="content-section">
                        <h3 className="section-title">{sec.subtitle}</h3>
                        <p className="section-text">
                          <PhysicsText text={sec.content} />
                        </p>
                        {sec.formula && <MathFormula formula={sec.formula} />}
                        {sec.details && (
                          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontStyle: "italic", marginTop: "4px" }}>
                            <PhysicsText text={sec.details} />
                          </p>
                        )}
                        {sec.bullets && (
                          <ul className="bullets-list">
                            {sec.bullets.map((bullet, bIdx) => (
                              <li key={bIdx}><PhysicsText text={bullet} /></li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* View Summary */}
                {currentSlide.type === "summary" && (
                  <div className="summary-container">
                    <div className="completion-badge-wrapper">
                      <div className="completion-badge">
                        <Award size={48} />
                      </div>
                    </div>
                    <p style={{ fontSize: "1.1rem", fontWeight: "600", color: "var(--status-warning)", textAlign: "center" }}>
                      {currentSlide.summaryText}
                    </p>
                    <ul className="bullets-styled">
                      {currentSlide.bullets.map((b, idx) => (
                        <li key={idx}><PhysicsText text={b} /></li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>

              {/* Stepper Footer Controls */}
              <footer className="navigation-bar">
                <button 
                  className="btn btn-secondary" 
                  onClick={handlePrevSlide}
                >
                  <ChevronLeft size={16} /> Back
                </button>

                {activeQuizIndex >= 0 && !isAnswerChecked ? (
                  <button 
                    className="btn btn-success" 
                    onClick={handleCheckAnswer}
                    disabled={selectedOptionIndex === null}
                  >
                    Check Answer
                  </button>
                ) : showIncorrectPrompt ? (
                  <button className="btn btn-primary" disabled>
                    Answer Pending...
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={handleNextSlide}>
                    {currentSlideIndex === activeLesson.slides.length - 1 ? "Finish Lesson" : "Continue"} 
                    <ChevronRight size={16} />
                  </button>
                )}
              </footer>
            </section>

            {/* Split 2: Visual labs */}
            <section className="simulator-panel">
              <div style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
                pointerEvents: "none"
              }}></div>
              
              {activeQuizIndex === -1 ? (
                <>
                  {renderSimulator()}
                  {currentSlide.instruction && (
                    <div style={{ marginTop: "16px", maxWidth: "420px", textAlign: "center", zIndex: 2 }}>
                      <p className="simulator-instruction">
                        <PhysicsText text={currentSlide.instruction} />
                      </p>
                    </div>
                  )}
                </>
              ) : (
                (() => {
                  const activeQuiz = currentSlide.quizzes?.[activeQuizIndex];
                  if (!activeQuiz) return null;
                  return (
                    <div className="simulator-container" style={{ width: "100%", maxWidth: "500px", zIndex: 2, animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>
                      <div className="simulator-header">
                        <span className="simulator-title" style={{ color: "var(--accent-purple)" }}>
                          <Compass size={18} />
                          {activeQuiz.title || `Concept Check`}
                        </span>
                      </div>
                      
                      <p style={{ fontSize: "1.05rem", fontWeight: "500", marginBottom: "18px", color: "var(--text-primary)", textAlign: "left" }}>
                        <PhysicsText text={activeQuiz.question} />
                      </p>

                      <div className="quiz-options-list">
                        {activeQuiz.options.map((opt, idx) => {
                          const letters = ["A", "B", "C", "D"];
                          let optionClass = "quiz-option";

                          if (selectedOptionIndex === idx) optionClass += " selected";
                          
                          if (isAnswerChecked) {
                            optionClass += " checked";
                            if (opt.isCorrect && (isAnswerCorrect || isExplanationRevealed)) {
                              optionClass += " correct";
                            } else if (selectedOptionIndex === idx && !isAnswerCorrect) {
                              optionClass += " incorrect";
                            }
                          }

                          return (
                            <div 
                              key={idx}
                              className={optionClass}
                              onClick={() => handleSelectOption(idx)}
                            >
                              <div className="quiz-option-letter">{letters[idx]}</div>
                              <div className="option-text">
                                <PhysicsText text={opt.text} />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Quiz Wrong Option Prompt */}
                      {showIncorrectPrompt && (
                        <div className="explanation-card" style={{ border: "1px solid var(--status-error-border)", backgroundColor: "var(--status-error-bg)", margin: "16px 0 0 0", textAlign: "left" }}>
                          <div className="explanation-header incorrect-label">
                            <X size={18} /> <span>Incorrect Answer</span>
                          </div>
                          <p className="explanation-text" style={{ color: "var(--text-primary)", marginBottom: "12px" }}>
                            Would you like to try again or reveal the correct explanation?
                          </p>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <button className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }} onClick={handleRetryQuiz}>
                              Try Again
                            </button>
                            <button 
                              className="btn btn-primary" 
                              style={{ padding: "6px 12px", fontSize: "0.8rem", background: "var(--status-error)" }}
                              onClick={handleRevealQuizSolution}
                            >
                              Reveal Solution
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Explanation details (shown if correct OR revealed) */}
                      {(isAnswerChecked && (!showIncorrectPrompt || isExplanationRevealed)) && (
                        <div className="explanation-card" style={{ textAlign: "left" }}>
                          <div className={`explanation-header ${isAnswerCorrect ? "correct-label" : "incorrect-label"}`}>
                            {isAnswerCorrect ? (
                              <>
                                <Check size={18} /> <span>Correct answer!</span>
                              </>
                            ) : (
                              <>
                                <X size={18} /> <span>Revealed Solution:</span>
                              </>
                            )}
                          </div>
                          <p className="explanation-text">
                            <PhysicsText text={activeQuiz.explanation} />
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()
              )}
            </section>

          </main>
        </>
      )}

    </div>
  );
}

export default App;
