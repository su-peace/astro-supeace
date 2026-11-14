/**
 * Shared Azure Crystal snowflake geometry for the cover snowfall field and the click effect.
 * Six-fold radial symmetry with fine lines, moderate V-branches, and rounded caps in a 20×24 box.
 */

export const PETAL_VIEWBOX = { width: 20, height: 24 } as const;

/** Six primary radial axes radiating from center (10, 12) in the 20×24 viewBox. */
export const CRYSTAL_AXES_PATH = 'M10 12L10 2.8M10 12L17.97 7.4M10 12L17.97 16.6M10 12L10 21.2M10 12L2.03 16.6M10 12L2.03 7.4';

/** Inner hexagonal ring and six symmetric V-branches in the 20×24 viewBox. */
export const CRYSTAL_BRANCHES_PATH =
  'M10 9.2L12.42 10.6L12.42 13.4L10 14.8L7.58 13.4L7.58 10.6Z' +
  'M7.9 4.8L10 6.4L12.1 4.8' +
  'M15.19 6.58L14.85 9.2L17.29 10.22' +
  'M17.29 13.78L14.85 14.8L15.19 17.42' +
  'M12.1 19.2L10 17.6L7.9 19.2' +
  'M4.81 17.42L5.15 14.8L2.71 13.78' +
  'M2.71 10.22L5.15 9.2L4.81 6.58';

/** Primary and secondary stroke colors per crystal variant (translucent, ethereal Azure & Lily frost palette). */
export const PETAL_COLORS: ReadonlyArray<readonly [tip: string, base: string]> = [
  ['#ffffff', '#e2f0fd'],
  ['#ffffff', '#cce5fc'],
  ['#fcfdff', '#d9e3fb'],
  ['#f0f7fe', '#bdddfa'],
];

/**
 * Pre-render every color variant once so each frame is only a `drawImage` per snowflake.
 * `scale` is the device-pixel size of one viewBox unit.
 */
export function createPetalSprites(scale: number): HTMLCanvasElement[] {
  const axesPath = new Path2D(CRYSTAL_AXES_PATH);
  const branchesPath = new Path2D(CRYSTAL_BRANCHES_PATH);
  return PETAL_COLORS.map(([tip, base]) => {
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(PETAL_VIEWBOX.width * scale);
    canvas.height = Math.ceil(PETAL_VIEWBOX.height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;
    ctx.scale(scale, scale);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Soft crystalline glow for delicate luminescence
    ctx.shadowColor = 'rgba(255, 255, 255, 0.65)';
    ctx.shadowBlur = 1.5;

    // Delicate secondary branches in pale frost tone
    ctx.strokeStyle = base;
    ctx.lineWidth = 0.95;
    ctx.stroke(branchesPath);

    // Primary crystal radial axes
    const gradient = ctx.createLinearGradient(2, 2.8, 18, 21.2);
    gradient.addColorStop(0, tip);
    gradient.addColorStop(1, base);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.15;
    ctx.stroke(axesPath);

    // Crystal center glint
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(10, 12, 0.75, 0, Math.PI * 2);
    ctx.fill();

    return canvas;
  });
}

/** CSS mask for DOM snowflakes (the click burst), matching the 6-fold Azure Crystal geometry. */
export const PETAL_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${PETAL_VIEWBOX.width} ${PETAL_VIEWBOX.height}'><path d='${CRYSTAL_AXES_PATH}${CRYSTAL_BRANCHES_PATH}' fill='none' stroke='black' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/></svg>`,
)}")`;
