import React, { useState } from "react";
import { ListFilter, Calendar, Clock, CheckCircle, AlertTriangle } from "lucide-react";

export default function TimelineSort({ onComplete }) {
  // Phrases to sort
  const initialItems = [
    { id: "item-1", text: "Soccer match lasted for 90 minutes", correctCategory: "interval" },
    { id: "item-2", text: "New Year's Eve is at 00:00 on Jan 1st", correctCategory: "point" },
    { id: "item-3", text: "Flight delayed for about 2 hours", correctCategory: "interval" },
    { id: "item-4", text: "Physics class starts at 13:30", correctCategory: "point" }
  ];

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [categorized, setCategorized] = useState({
    point: [], // List of item objects
    interval: [] // List of item objects
  });
  const [unsorted, setUnsorted] = useState(initialItems);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [activeDropZone, setActiveDropZone] = useState(null); // 'point' | 'interval' | null

  // Click handler to select an unsorted item
  const handleSelectItem = (id) => {
    if (isChecked) return;
    setSelectedItemId(id === selectedItemId ? null : id);
  };

  // Click/drop handler to categorize item
  const handleCategorize = (category) => {
    if (selectedItemId === null || isChecked) return;
    
    const itemToMove = unsorted.find(i => i.id === selectedItemId);
    if (!itemToMove) return;

    // Remove from unsorted
    setUnsorted(prev => prev.filter(i => i.id !== selectedItemId));
    // Add to target category
    setCategorized(prev => ({
      ...prev,
      [category]: [...prev[category], itemToMove]
    }));
    
    // Clear selection
    setSelectedItemId(null);
  };

  // Drag and Drop Event Handlers
  const handleDragStart = (e, id) => {
    if (isChecked) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
    setSelectedItemId(id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e, category) => {
    e.preventDefault();
    if (isChecked) return;
    setActiveDropZone(category);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    // Only reset if we are actually leaving the container, not entering its children
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setActiveDropZone(null);
    }
  };

  const handleDrop = (e, category) => {
    e.preventDefault();
    setActiveDropZone(null);
    if (isChecked) return;

    // Retrieve via dataTransfer or fall back to state selectedItemId
    const id = e.dataTransfer.getData("text/plain") || selectedItemId;
    if (!id) return;

    const itemToMove = unsorted.find(i => i.id === id);
    if (!itemToMove) return;

    // Remove from unsorted
    setUnsorted(prev => prev.filter(i => i.id !== id));
    // Add to target category
    setCategorized(prev => ({
      ...prev,
      [category]: [...prev[category], itemToMove]
    }));

    // Clear selection
    setSelectedItemId(null);
  };

  const handleDragEnd = () => {
    setActiveDropZone(null);
    setSelectedItemId(null);
  };

  // Return item back to unsorted list
  const handleRemoveItem = (item, currentCategory) => {
    if (isChecked) return;
    
    // Remove from category
    setCategorized(prev => ({
      ...prev,
      [currentCategory]: prev[currentCategory].filter(i => i.id !== item.id)
    }));
    // Add back to unsorted
    setUnsorted(prev => [...prev, item]);
  };

  // Check answers
  const handleCheck = () => {
    if (unsorted.length > 0) return; // Must categorize all first

    // Check if points and intervals match their correctCategory values
    const pointsCorrect = categorized.point.every(i => i.correctCategory === "point");
    const intervalsCorrect = categorized.interval.every(i => i.correctCategory === "interval");
    const allCorrect = pointsCorrect && intervalsCorrect;

    setIsCorrect(allCorrect);
    setIsChecked(true);
    setShowExplanation(true);
    
    if (allCorrect && onComplete) {
      onComplete(true);
    }
  };

  const handleRetry = () => {
    setUnsorted(initialItems);
    setCategorized({ point: [], interval: [] });
    setSelectedItemId(null);
    setActiveDropZone(null);
    setIsChecked(false);
    setIsCorrect(false);
    setShowExplanation(false);
  };

  return (
    <div className="simulator-container" style={{ gap: "16px" }}>
      <div className="simulator-header">
        <span className="simulator-title" style={{ color: "var(--accent-cyan)" }}>
          <ListFilter size={18} />
          Time Classifier Lab
        </span>
        {isChecked && (
          <button 
            className="btn btn-secondary" 
            style={{ padding: "4px 8px", fontSize: "0.75rem" }}
            onClick={handleRetry}
          >
            Reset Game
          </button>
        )}
      </div>

      {/* Instruction */}
      <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
        {unsorted.length > 0 ? (
          <span>Drag a phrase card and drop it into the correct bin below (or select and click to sort).</span>
        ) : (
          <span>All cards classified! Click <b>Check Classification</b> to verify your logic.</span>
        )}
      </div>

      {/* Unsorted Items Deck */}
      {unsorted.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "600" }}>UNSORTED PHRASES:</span>
          {unsorted.map(item => (
            <div 
              key={item.id}
              className={`quiz-option ${selectedItemId === item.id ? "selected" : ""}`}
              style={{ 
                padding: "10px 14px", 
                borderStyle: "dashed", 
                cursor: isChecked ? "default" : "grab", 
                opacity: selectedItemId === item.id ? 0.6 : 1 
              }}
              draggable={!isChecked}
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragEnd={handleDragEnd}
              onClick={() => handleSelectItem(item.id)}
            >
              <div className="quiz-option-letter" style={{ fontSize: "0.75rem", borderRadius: "4px", width: "22px", height: "22px" }}>?</div>
              <span style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>{item.text}</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: "16px", backgroundColor: "var(--bg-input)", borderRadius: "8px", border: "1px dashed var(--border-color)", textAlign: "center", color: "var(--status-success)", fontWeight: "600", fontSize: "0.9rem" }}>
          All phrases have been sorted!
        </div>
      )}

      {/* Quick Category Placement Buttons (Fallback helper for selection) */}
      {selectedItemId !== null && (
        <div style={{ display: "flex", gap: "10px", width: "100%", justifyContent: "center" }}>
          <button 
            className="btn btn-secondary" 
            style={{ padding: "8px 14px", fontSize: "0.8rem", color: "var(--accent-purple)" }}
            onClick={() => handleCategorize("point")}
          >
            Move to Point in Time &rarr;
          </button>
          <button 
            className="btn btn-secondary" 
            style={{ padding: "8px 14px", fontSize: "0.8rem", color: "var(--accent-cyan)" }}
            onClick={() => handleCategorize("interval")}
          >
            Move to Time Interval &rarr;
          </button>
        </div>
      )}

      {/* Two Buckets / Bins */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", width: "100%" }}>
        
        {/* Bucket 1: Point in Time */}
        <div 
          onClick={() => handleCategorize("point")}
          onDragOver={handleDragOver}
          onDragEnter={(e) => handleDragEnter(e, "point")}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, "point")}
          style={{ 
            backgroundColor: activeDropZone === "point" ? "rgba(139, 92, 246, 0.08)" : "var(--bg-input)", 
            border: activeDropZone === "point" 
              ? "2px solid var(--accent-purple)" 
              : selectedItemId 
                ? "2px dashed var(--accent-purple)" 
                : "1px solid var(--border-color)", 
            borderRadius: "10px", 
            padding: "12px", 
            minHeight: "130px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            cursor: selectedItemId ? "pointer" : "default",
            transition: "all 0.2s ease",
            boxShadow: activeDropZone === "point" ? "0 0 10px rgba(139, 92, 246, 0.3)" : "none"
          }}
        >
          <div style={{ 
            pointerEvents: selectedItemId !== null ? "none" : "auto",
            display: "flex", 
            alignItems: "center", 
            gap: "6px", 
            color: "var(--accent-purple)", 
            fontWeight: "600", 
            fontSize: "0.85rem", 
            borderBottom: "1px solid var(--border-color)", 
            paddingBottom: "6px" 
          }}>
            <Calendar size={14} /> Point in Time
          </div>
          {categorized.point.length === 0 ? (
            <span style={{ pointerEvents: selectedItemId !== null ? "none" : "auto", fontSize: "0.75rem", color: "var(--text-muted)", margin: "auto", fontStyle: "italic" }}>Empty Bin</span>
          ) : (
            categorized.point.map(item => {
              const isWrong = isChecked && item.correctCategory !== "point";
              return (
                <div 
                  key={item.id} 
                  style={{ 
                    padding: "6px 10px", 
                    backgroundColor: isWrong ? "var(--status-error-bg)" : "var(--bg-card)", 
                    border: isWrong ? "1px solid var(--status-error)" : "1px solid var(--border-color)",
                    borderRadius: "6px", 
                    fontSize: "0.8rem",
                    cursor: isChecked ? "default" : "pointer" 
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveItem(item, "point");
                  }}
                >
                  {item.text} {!isChecked && <span style={{ float: "right", color: "var(--text-muted)" }}>&times;</span>}
                </div>
              );
            })
          )}
        </div>

        {/* Bucket 2: Time Interval */}
        <div 
          onClick={() => handleCategorize("interval")}
          onDragOver={handleDragOver}
          onDragEnter={(e) => handleDragEnter(e, "interval")}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, "interval")}
          style={{ 
            backgroundColor: activeDropZone === "interval" ? "rgba(6, 182, 212, 0.08)" : "var(--bg-input)", 
            border: activeDropZone === "interval" 
              ? "2px solid var(--accent-cyan)" 
              : selectedItemId 
                ? "2px dashed var(--accent-cyan)" 
                : "1px solid var(--border-color)", 
            borderRadius: "10px", 
            padding: "12px", 
            minHeight: "130px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            cursor: selectedItemId ? "pointer" : "default",
            transition: "all 0.2s ease",
            boxShadow: activeDropZone === "interval" ? "0 0 10px rgba(6, 182, 212, 0.3)" : "none"
          }}
        >
          <div style={{ 
            pointerEvents: selectedItemId !== null ? "none" : "auto",
            display: "flex", 
            alignItems: "center", 
            gap: "6px", 
            color: "var(--accent-cyan)", 
            fontWeight: "600", 
            fontSize: "0.85rem", 
            borderBottom: "1px solid var(--border-color)", 
            paddingBottom: "6px" 
          }}>
            <Clock size={14} /> Time Interval
          </div>
          {categorized.interval.length === 0 ? (
            <span style={{ pointerEvents: selectedItemId !== null ? "none" : "auto", fontSize: "0.75rem", color: "var(--text-muted)", margin: "auto", fontStyle: "italic" }}>Empty Bin</span>
          ) : (
            categorized.interval.map(item => {
              const isWrong = isChecked && item.correctCategory !== "interval";
              return (
                <div 
                  key={item.id} 
                  style={{ 
                    padding: "6px 10px", 
                    backgroundColor: isWrong ? "var(--status-error-bg)" : "var(--bg-card)", 
                    border: isWrong ? "1px solid var(--status-error)" : "1px solid var(--border-color)",
                    borderRadius: "6px", 
                    fontSize: "0.8rem",
                    cursor: isChecked ? "default" : "pointer" 
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveItem(item, "interval");
                  }}
                >
                  {item.text} {!isChecked && <span style={{ float: "right", color: "var(--text-muted)" }}>&times;</span>}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Evaluator button */}
      {!isChecked && (
        <button 
          className="btn btn-primary" 
          style={{ width: "100%", justifyContent: "center" }}
          onClick={handleCheck}
          disabled={unsorted.length > 0}
        >
          Check Classification
        </button>
      )}

      {/* Explanatory popup */}
      {showExplanation && (
        <div 
          className="explanation-card" 
          style={{ margin: 0, padding: "12px 16px", border: isCorrect ? "1px solid var(--status-success-border)" : "1px solid var(--status-error-border)", backgroundColor: isCorrect ? "var(--status-success-bg)" : "var(--status-error-bg)" }}
        >
          <div className="explanation-header" style={{ color: isCorrect ? "var(--status-success)" : "var(--status-error)" }}>
            {isCorrect ? (
              <>
                <CheckCircle size={16} /> <span>All correct! Excellent sorting.</span>
              </>
            ) : (
              <>
                <AlertTriangle size={16} /> <span>Classification incomplete or wrong.</span>
              </>
            )}
          </div>
          <p className="explanation-text" style={{ fontSize: "0.82rem", color: "var(--text-primary)", marginTop: "4px" }}>
            {isCorrect ? (
              "You successfully identified that points on a clock (00:00, 13:30) are points in time, while durations (90 minutes, 2 hours) are time intervals."
            ) : (
              "Try again! Points in time refer to specific moments. Time intervals refer to duration. Tip: Look for words like 'starts at' vs 'lasted for'."
            )}
          </p>
          {!isCorrect && (
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <button className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "0.75rem" }} onClick={handleRetry}>
                Try Again
              </button>
              <button 
                className="btn btn-primary" 
                style={{ padding: "4px 8px", fontSize: "0.75rem", background: "var(--status-error)" }}
                onClick={() => {
                  // Show the correct answer
                  setCategorized({
                    point: initialItems.filter(i => i.correctCategory === "point"),
                    interval: initialItems.filter(i => i.correctCategory === "interval")
                  });
                  setUnsorted([]);
                  setIsCorrect(true);
                }}
              >
                Reveal Solution
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
