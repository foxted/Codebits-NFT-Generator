const fs = require("fs");
const dir = __dirname;
const positionX = 0;
const positionY = 0;
const width = 512;
const height = 512;
const description = "Code contributions graph snapshots.";
const baseImageUri = "https://codebits.rocks";
const series = 'G';
const seriesBackgroundColor = '#FFFFFF';
const seriesSignatureColor = '#EFEFEF';
const gridX = 2;
const gridY = 2;
const variants = [
  { name: 'No Code', code: 'N', suffix: '_sr' },
  { name: 'Junior', code: 'J', suffix: '_r' },
  { name: 'Intermediate', code: 'I', suffix: '' },
  { name: 'Senior', code: 'S', suffix: '_r' },
  { name: '10x', code: 'X', suffix: '_sr' },
];

const baseLayer = {
  name: 'Base',
  selectedElement: {
    id: 'base',
    name: 'Base',
    path: `${dir}/base/base.png`
  },
  position: { x: positionX, y: positionY },
  size: { width, height }
};
const layers = [];

// Generate layers
for(let x = 1 ; x <= gridX ; x++) {
  for(let y = 1 ; y <= gridY ; y++) {
    const name = `${x}x${y}`;
    const elements = [];

    for (let v = 0 ; v < variants.length ; v++) {
      elements.push({
        id: variants[v].code,
        name: variants[v].name,
        path: `${dir}/${name}/${name}-${v}${variants[v].suffix}.png`
      });
    }
    layers.push({
      name,
      elements,
      position: { x: positionX, y: positionY },
      size: { width, height }
    });
  }
}

module.exports = {
  positionX,
  positionY,
  width,
  height,
  description,
  baseImageUri,
  gridX,
  gridY,
  variants,
  series,
  seriesBackgroundColor,
  seriesSignatureColor,
  baseLayer,
  layers,
};
