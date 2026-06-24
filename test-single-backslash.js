import katex from 'katex';
try {
  // Single backslash in JS string literal: "\vec{d}"
  const mathStr = "\vec{d}";
  console.log("Length of mathStr:", mathStr.length);
  console.log("Characters of mathStr:", Array.from(mathStr).map(c => c.charCodeAt(0)));
  const html = katex.renderToString(mathStr, {
    displayMode: false,
    throwOnError: true
  });
  console.log('SUCCESS:', html.substring(0, 100) + '...');
} catch (error) {
  console.error('ERROR:', error.message || error);
}
