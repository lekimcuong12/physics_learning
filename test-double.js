import katex from 'katex';
try {
  const html = katex.renderToString('\\\\vec{d}', {
    displayMode: false,
    strict: 'warn'
  });
  console.log('SUCCESS:', html.substring(0, 100) + '...');
} catch (error) {
  console.error('ERROR:', error);
}
