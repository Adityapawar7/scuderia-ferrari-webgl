const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../public/sequence');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

for (let i = 1; i <= 100; i++) {
  const frameStr = i.toString().padStart(4, '0');
  const angle = (i / 100) * 360;
  
  // A simple SVG showing the frame number and a rotating element to visualize scrubbing
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
    <rect width="1920" height="1080" fill="transparent" />
    <g transform="translate(960, 540) rotate(${angle})">
      <rect x="-300" y="-150" width="600" height="300" fill="rgba(255, 0, 0, 0.2)" stroke="red" stroke-width="4" rx="20" />
      <text x="0" y="20" font-family="monospace" font-size="100" fill="white" text-anchor="middle" dominant-baseline="middle">FRAME ${frameStr}</text>
    </g>
  </svg>`;
  
  fs.writeFileSync(path.join(dir, `frame_${frameStr}.svg`), svg);
}

console.log('Successfully generated 100 placeholder frames in public/sequence');
