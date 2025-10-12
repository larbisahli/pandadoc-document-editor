// utils/colors.ts
type RGB = { r: number; g: number; b: number };

// Clamp 0..1
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// ---- Public API ----

/**
 * Generate a unique hex color not too close to existing ones.
 * Store this in DB for each user.
 */
export function generateUniqueUserColor(existing: string[]): string {
  // Convert existing to HSL hue list for spacing
  const existingHues = existing
    .map(hexToRgb)
    .filter(Boolean)
    .map(rgbToHsl)
    .map((hsl) => hsl.h);

  let hue: number;
  let tries = 0;

  do {
    hue = Math.floor(Math.random() * 360);
    tries++;
    // Stop infinite loop in extreme cases
    if (tries > 100) break;
  } while (
    existingHues.some((eh) => circularHueDist(hue, eh) < 15) // avoid too close
  );

  // Pastel background color (high lightness)
  const pastelRgb = hslToRgb(hue, 55, 92);
  return rgbToHex(pastelRgb);
}

/**
 * Given a stored hex, generate avatar colors (bg with opacity, strong text, subtle ring).
 */
export function generateAvatarColors(
  hex: string = "#cc5a0ed6",
  opacity = 0.35,
) {
  const rgb = hexToRgb(hex);
  if (!rgb) throw new Error("Invalid hex");

  const { h } = rgbToHsl(rgb);

  // Background (same hue, pastel light)
  const bgRgb = hslToRgb(h, 55, 92);
  const bgRgba = `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, ${clamp01(opacity)})`;

  // Text (same hue, darker & stronger, ensure contrast)
  let textRgb = hslToRgb(h, 80, 28);
  while (contrastRatio(bgRgb, textRgb) < 4.5 && textRgb) {
    textRgb = hslToRgb(h, 90, 24);
  }

  // Ring/border (same hue, medium)
  const ringRgb = hslToRgb(h, 60, 70);

  return {
    bgRgba,
    textHex: rgbToHex(textRgb),
    ringHex: rgbToHex(ringRgb),
  };
}

// ---- Helpers ----

export function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function hexToRgb(hex: string): RGB | null {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHex({ r, g, b }: RGB) {
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsl({ r, g, b }: RGB) {
  const R = r / 255,
    G = g / 255,
    B = b / 255;
  const max = Math.max(R, G, B),
    min = Math.min(R, G, B);
  const d = max - min;
  let h = 0;
  if (d) {
    switch (max) {
      case R:
        h = ((G - B) / d) % 6;
        break;
      case G:
        h = (B - R) / d + 2;
        break;
      case B:
        h = (R - G) / d + 4;
        break;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { h, s: s * 100, l: l * 100 };
}

function hslToRgb(h: number, s: number, l: number): RGB {
  const S = s / 100,
    L = l / 100;
  const C = (1 - Math.abs(2 * L - 1)) * S;
  const Hp = (((h % 360) + 360) % 360) / 60;
  const X = C * (1 - Math.abs((Hp % 2) - 1));
  let [r1, g1, b1] = [0, 0, 0];
  if (0 <= Hp && Hp < 1) [r1, g1, b1] = [C, X, 0];
  else if (1 <= Hp && Hp < 2) [r1, g1, b1] = [X, C, 0];
  else if (2 <= Hp && Hp < 3) [r1, g1, b1] = [0, C, X];
  else if (3 <= Hp && Hp < 4) [r1, g1, b1] = [0, X, C];
  else if (4 <= Hp && Hp < 5) [r1, g1, b1] = [X, 0, C];
  else if (5 <= Hp && Hp < 6) [r1, g1, b1] = [C, 0, X];
  const m = L - C / 2;
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

function relLuminance({ r, g, b }: RGB) {
  const toLin = (v: number) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  };
  const R = toLin(r),
    G = toLin(g),
    B = toLin(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(bg: RGB, fg: RGB) {
  const L1 = relLuminance(bg),
    L2 = relLuminance(fg);
  const [hi, lo] = L1 >= L2 ? [L1, L2] : [L2, L1];
  return (hi + 0.05) / (lo + 0.05);
}

function circularHueDist(a: number, b: number) {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

// // Generate a new unique user color
// const userColor = generateUniqueUserColor(["#f3eaff", "#ffe3e0"]);
// // => "#e7f9f0"

// // Turn that color into avatar styles
// const avatar = generateAvatarColors(userColor, 0.3);
// /*
// {
//   bgRgba: "rgba(231, 249, 240, 0.3)",
//   textHex: "#1b7d4a",
//   ringHex: "#92d3af"
// }
// */
