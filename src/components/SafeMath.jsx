import React from "react";
import katex from "katex";

export function InlineMath({ math }) {
  try {
    const html = katex.renderToString(math, {
      displayMode: false,
      throwOnError: false, // Don't throw and fallback to raw text
      strict: "ignore"     // Suppress strict warnings like mathVsTextAccents
    });
    return (
      <span 
        className="notranslate" 
        translate="no" 
        style={{ display: "inline" }} 
        dangerouslySetInnerHTML={{ __html: html }} 
      />
    );
  } catch {
    return <span className="notranslate" translate="no" style={{ color: "var(--status-error)" }}>{math}</span>;
  }
}

export function BlockMath({ math }) {
  try {
    const html = katex.renderToString(math, {
      displayMode: true,
      throwOnError: false,
      strict: "ignore"
    });
    return (
      <div 
        className="notranslate" 
        translate="no" 
        style={{ display: "block" }} 
        dangerouslySetInnerHTML={{ __html: html }} 
      />
    );
  } catch {
    return <div className="notranslate" translate="no" style={{ color: "var(--status-error)", textAlign: "center" }}>{math}</div>;
  }
}
