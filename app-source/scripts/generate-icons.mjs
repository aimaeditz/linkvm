import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resvg } from '@resvg/resvg-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');
const rootDir = path.resolve(__dirname, '../../');

function renderSvgToPng(svgPath, width, height) {
  const svgContent = fs.readFileSync(svgPath, 'utf8');
  const opts = {
    fitTo: width && height ? { mode: 'width', value: width } : { mode: 'original' }
  };
  const resvg = new Resvg(svgContent, opts);
  const pngData = resvg.render();
  return pngData.asPng();
}

function buildIco(pngBuffersWithSizes) {
  const count = pngBuffersWithSizes.length;
  const headerSize = 6;
  const directorySize = 16 * count;
  let currentOffset = headerSize + directorySize;

  const directoryEntries = [];
  for (const item of pngBuffersWithSizes) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.width >= 256 ? 0 : item.width, 0);
    entry.writeUInt8(item.height >= 256 ? 0 : item.height, 1);
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(item.buffer.length, 8); // image size
    entry.writeUInt32LE(currentOffset, 12); // image offset

    directoryEntries.push(entry);
    currentOffset += item.buffer.length;
  }

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // image type (1 = icon)
  header.writeUInt16LE(count, 4); // number of images

  return Buffer.concat([header, ...directoryEntries, ...pngBuffersWithSizes.map(i => i.buffer)]);
}

async function main() {
  console.log('Generating raster PNG and ICO brand assets from SVGs...');

  const iconSvg = path.join(publicDir, 'icon.svg');
  const faviconSvg = path.join(publicDir, 'favicon.svg');
  const appleSvg = path.join(publicDir, 'apple-touch-icon.svg');
  const icon192Svg = path.join(publicDir, 'icon-192.svg');
  const icon512Svg = path.join(publicDir, 'icon-512.svg');
  const ogSvg = path.join(publicDir, 'og-image.svg');

  // Render PNGs
  const png16 = renderSvgToPng(faviconSvg, 16, 16);
  const png32 = renderSvgToPng(faviconSvg, 32, 32);
  const png48 = renderSvgToPng(faviconSvg, 48, 48);
  const pngApple = renderSvgToPng(appleSvg, 180, 180);
  const png192 = renderSvgToPng(icon192Svg, 192, 192);
  const png512 = renderSvgToPng(icon512Svg, 512, 512);
  const pngOg = renderSvgToPng(ogSvg, 1200, 630);

  // Build ICO containing 16, 32, 48 sizes
  const icoBuffer = buildIco([
    { width: 16, height: 16, buffer: png16 },
    { width: 32, height: 32, buffer: png32 },
    { width: 48, height: 48, buffer: png48 },
  ]);

  // Write files to public directory
  fs.writeFileSync(path.join(publicDir, 'favicon-48x48.png'), png48);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), pngApple);
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), png192);
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), png512);
  fs.writeFileSync(path.join(publicDir, 'og-image.png'), pngOg);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);

  // Write copies to repo root directory so direct domain root requests return 200
  fs.writeFileSync(path.join(rootDir, 'favicon-48x48.png'), png48);
  fs.writeFileSync(path.join(rootDir, 'apple-touch-icon.png'), pngApple);
  fs.writeFileSync(path.join(rootDir, 'icon-192.png'), png192);
  fs.writeFileSync(path.join(rootDir, 'icon-512.png'), png512);
  fs.writeFileSync(path.join(rootDir, 'og-image.png'), pngOg);
  fs.writeFileSync(path.join(rootDir, 'favicon.ico'), icoBuffer);

  // Also copy SVG masters to root
  fs.copyFileSync(iconSvg, path.join(rootDir, 'icon.svg'));
  fs.copyFileSync(faviconSvg, path.join(rootDir, 'favicon.svg'));
  fs.copyFileSync(appleSvg, path.join(rootDir, 'apple-touch-icon.svg'));
  fs.copyFileSync(icon192Svg, path.join(rootDir, 'icon-192.svg'));
  fs.copyFileSync(icon512Svg, path.join(rootDir, 'icon-512.svg'));
  fs.copyFileSync(ogSvg, path.join(rootDir, 'og-image.svg'));

  console.log('Successfully generated and synchronized favicon.ico, favicon-48x48.png, apple-touch-icon.png, icon-192.png, icon-512.png, og-image.png!');
}

main().catch(err => {
  console.error('Failed to generate icon assets:', err);
  process.exit(1);
});
