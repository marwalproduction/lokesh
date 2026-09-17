import fs from 'fs';
import path from 'path';

const distDir = path.resolve(process.cwd(), 'dist');
const publicDir = path.resolve(process.cwd(), 'public');

if (!fs.existsSync(distDir)) {
  console.error('dist directory does not exist. Run vite build first.');
  process.exit(1);
}

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const htmlPath = path.join(distDir, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf-8');

// Find all CSS links and inline them
const cssRegex = /<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g;
html = html.replace(cssRegex, (match, href) => {
  const cleanHref = href.startsWith('/') ? href.slice(1) : href;
  const fullPath = path.join(distDir, cleanHref);
  if (fs.existsSync(fullPath)) {
    const cssContent = fs.readFileSync(fullPath, 'utf-8');
    return `<style>\n${cssContent}\n</style>`;
  }
  return match;
});

// Find all JS scripts and inline them
const jsRegex = /<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g;
html = html.replace(jsRegex, (match, src) => {
  const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
  const fullPath = path.join(distDir, cleanSrc);
  if (fs.existsSync(fullPath)) {
    let jsContent = fs.readFileSync(fullPath, 'utf-8');
    // Ensure </script> inside strings don't break the HTML tag
    jsContent = jsContent.replace(/<\/script>/gi, '<\\/script>');
    return `<script type="module">\n${jsContent}\n</script>`;
  }
  return match;
});

// Add Framer-friendly styling (responsive, no overflow scrollbar issues)
const framerMeta = `
    <!-- Framer Embed Optimization -->
    <style>
      html, body {
        width: 100%;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      /* Smooth font rendering in Framer */
      body {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
    </style>
`;

html = html.replace('</head>', `${framerMeta}\n  </head>`);

// Write to public/framer-embed.html so it can be served via URL or downloaded
const publicOutputPath = path.join(publicDir, 'framer-embed.html');
fs.writeFileSync(publicOutputPath, html, 'utf-8');

// Also write to dist/framer-embed.html
const distOutputPath = path.join(distDir, 'framer-embed.html');
fs.writeFileSync(distOutputPath, html, 'utf-8');

console.log(`Successfully generated standalone single-file HTML for Framer:`);
console.log(`- ${publicOutputPath} (${(html.length / 1024).toFixed(1)} KB)`);
console.log(`- ${distOutputPath}`);
