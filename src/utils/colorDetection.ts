// Lightweight client-side colour detection used to auto-sort uploaded product photos into colour variants.

export interface DetectedColor {
  name: string;
  hex: string;
}

const NAMED_COLORS: { name: string; hex: string }[] = [
  { name: 'Black', hex: '#111111' },
  { name: 'White', hex: '#FDFDFD' },
  { name: 'Ivory', hex: '#F4EDE1' },
  { name: 'Sand Gold', hex: '#D4AF37' },
  { name: 'Gold', hex: '#FFD700' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Royal Ruby', hex: '#9B111E' },
  { name: 'Red', hex: '#E32636' },
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Magenta', hex: '#FF00FF' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Lavender', hex: '#B497BD' },
  { name: 'Navy Blue', hex: '#000080' },
  { name: 'Blue', hex: '#1E5AA8' },
  { name: 'Sky Blue', hex: '#87CEEB' },
  { name: 'Teal', hex: '#008080' },
  { name: 'Turquoise', hex: '#40E0D0' },
  { name: 'Green', hex: '#228B22' },
  { name: 'Emerald Green', hex: '#50C878' },
  { name: 'Olive', hex: '#808000' },
  { name: 'Mustard Yellow', hex: '#E1AD01' },
  { name: 'Yellow', hex: '#FFEB3B' },
  { name: 'Orange', hex: '#FF7F32' },
  { name: 'Peach', hex: '#FFCBA4' },
  { name: 'Brown', hex: '#6F4E37' },
  { name: 'Beige', hex: '#D8C3A5' },
  { name: 'Grey', hex: '#808080' },
  { name: 'Silver', hex: '#C0C0C0' },
];

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  return [parseInt(clean.slice(0, 2), 16), parseInt(clean.slice(2, 4), 16), parseInt(clean.slice(4, 6), 16)];
}

export function nearestNamedColor(rgb: [number, number, number]): { name: string; hex: string } {
  let best = NAMED_COLORS[0];
  let bestDist = Infinity;
  for (const candidate of NAMED_COLORS) {
    const [r, g, b] = hexToRgb(candidate.hex);
    const dist = (r - rgb[0]) ** 2 + (g - rgb[1]) ** 2 + (b - rgb[2]) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      best = candidate;
    }
  }
  return best;
}

/** Samples a downscaled canvas render of the image to estimate its dominant garment colour. */
export function detectDominantColor(source: File | string): Promise<DetectedColor> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = typeof source !== 'string' ? URL.createObjectURL(source) : null;

    img.onload = () => {
      try {
        const size = 32;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas rendering is not supported in this browser.');
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);

        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 128) continue; // skip transparent pixels
          const pr = data[i], pg = data[i + 1], pb = data[i + 2];
          const isNearWhiteBackdrop = pr > 235 && pg > 235 && pb > 235;
          const isNearBlackBackdrop = pr < 15 && pg < 15 && pb < 15;
          if (isNearWhiteBackdrop || isNearBlackBackdrop) continue; // ignore studio background pixels
          r += pr; g += pg; b += pb; count++;
        }
        if (count === 0) { r = 128; g = 128; b = 128; count = 1; }

        const avg: [number, number, number] = [r / count, g / count, b / count];
        const nearest = nearestNamedColor(avg);
        resolve({ name: nearest.name, hex: nearest.hex });
      } catch (err) {
        reject(err);
      } finally {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      }
    };
    img.onerror = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image for colour detection.'));
    };

    if (objectUrl) {
      img.src = objectUrl;
    } else {
      img.crossOrigin = 'anonymous';
      img.src = source as string;
    }
  });
}
