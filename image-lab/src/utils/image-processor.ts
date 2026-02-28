export type ImageFormat = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/avif' | 'image/bmp' | 'image/x-icon';
export type ResizeMode = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FilterOptions {
  brightness?: number; // 0 to 200, default 100
  contrast?: number;   // 0 to 200, default 100
  saturation?: number; // 0 to 200, default 100
  grayscale?: number;  // 0 to 100, default 0
  sepia?: number;      // 0 to 100, default 0
  blur?: number;       // px, default 0
  hueRotate?: number;  // deg, default 0
}

export interface TransformOptions {
  rotate?: number; // 0, 90, 180, 270
  flipH?: boolean;
  flipV?: boolean;
}

export interface WatermarkOptions {
  text: string;
  color?: string;
  size?: number;
  opacity?: number;
  position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  margin?: number;
}

export interface BorderOptions {
  enabled: boolean;
  color: string;
  width: number;
  radius: number; // 0 to 50 (%)
}

export interface ProcessOptions {
  quality?: number; // 0 to 1
  width?: number;
  height?: number;
  resizeMode?: ResizeMode;
  offset?: { x: number; y: number }; // Offset for resize (pan)
  format?: ImageFormat;
  crop?: CropRect;
  maintainAspectRatio?: boolean;
  filters?: FilterOptions;
  transforms?: TransformOptions;
  watermark?: WatermarkOptions;
  border?: BorderOptions;
}

export const loadImage = (src: string | File | Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    if (typeof src === 'string') {
      img.src = src;
    } else {
      img.src = URL.createObjectURL(src);
    }
  });
};

export const renderToCanvas = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  options: ProcessOptions,
  canvasWidth: number,
  canvasHeight: number
) => {
  // Determine source dimensions (crop area or full image)
  const sx = options.crop?.x ?? 0;
  const sy = options.crop?.y ?? 0;
  const sWidth = options.crop?.width ?? img.naturalWidth;
  const sHeight = options.crop?.height ?? img.naturalHeight;

  // Clip Path for Border Radius
  if (options.border && options.border.radius > 0) {
    const radius = Math.min(canvasWidth, canvasHeight) * (options.border.radius / 100);
    ctx.beginPath();
    ctx.roundRect(0, 0, canvasWidth, canvasHeight, radius);
    ctx.clip();
  }

  // Apply filters using CSS filter property (easier and faster than pixel manipulation)
  const filters = options.filters || {};
  const filterString = [
    filters.brightness !== undefined && filters.brightness !== 100 ? `brightness(${filters.brightness}%)` : '',
    filters.contrast !== undefined && filters.contrast !== 100 ? `contrast(${filters.contrast}%)` : '',
    filters.saturation !== undefined && filters.saturation !== 100 ? `saturate(${filters.saturation}%)` : '',
    filters.grayscale ? `grayscale(${filters.grayscale}%)` : '',
    filters.sepia ? `sepia(${filters.sepia}%)` : '',
    filters.blur ? `blur(${filters.blur}px)` : '',
    filters.hueRotate ? `hue-rotate(${filters.hueRotate}deg)` : '',
  ].filter(Boolean).join(' ');

  if (filterString) {
    ctx.filter = filterString;
  }

  // Transform Context
  ctx.save();
  
  // Translate to center for rotation/flip
  ctx.translate(canvasWidth / 2, canvasHeight / 2);

  // Rotate
  const rotate = options.transforms?.rotate || 0;
  if (rotate) {
    ctx.rotate((rotate * Math.PI) / 180);
  }

  // Flip
  const scaleX = options.transforms?.flipH ? -1 : 1;
  const scaleY = options.transforms?.flipV ? -1 : 1;
  ctx.scale(scaleX, scaleY);

  // Calculate draw dimensions based on ResizeMode
  // We need to fit source (sWidth, sHeight) into target (targetWidth, targetHeight)
  // Note: renderToCanvas is passed the final canvas dimensions, which are already swapped if rotated.
  // But our "target" for aspect ratio calculation logic is based on options.width/height, 
  // which might be swapped relative to canvas if rotated.
  // Let's rely on the passed canvasWidth/Height as the box we need to fill.
  
  // However, if rotated 90deg, the "width" of the image content aligns with "height" of canvas.
  // The logic in processImage handled this by swapping targetWidth/Height before setting canvas size.
  // So here canvasWidth/Height IS the bounding box for the content.
  
  const mode = options.resizeMode || (options.maintainAspectRatio === false ? 'fill' : 'contain');
  
  let drawWidth = canvasWidth;
  let drawHeight = canvasHeight;
  
  const srcAspect = sWidth / sHeight;
  const targetAspect = canvasWidth / canvasHeight;

  if (mode === 'contain') {
    if (srcAspect > targetAspect) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / srcAspect;
    } else {
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * srcAspect;
    }
  } else if (mode === 'cover') {
    if (srcAspect > targetAspect) {
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * srcAspect;
    } else {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / srcAspect;
    }
  } else if (mode === 'none') {
    drawWidth = sWidth;
    drawHeight = sHeight;
  } else if (mode === 'scale-down') {
    if (sWidth > canvasWidth || sHeight > canvasHeight) {
      if (srcAspect > targetAspect) {
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / srcAspect;
      } else {
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * srcAspect;
      }
    } else {
      drawWidth = sWidth;
      drawHeight = sHeight;
    }
  } 
  
  // Draw image centered with offset
  const offsetX = options.offset?.x || 0;
  const offsetY = options.offset?.y || 0;

  ctx.drawImage(
    img,
    sx,
    sy,
    sWidth,
    sHeight,
    -drawWidth / 2 + offsetX,
    -drawHeight / 2 + offsetY,
    drawWidth,
    drawHeight
  );

  ctx.restore();

  // Draw Watermark
  if (options.watermark && options.watermark.text) {
    const wm = options.watermark;
    const fontSize = wm.size || 24;
    const margin = wm.margin || 20;
    
    ctx.save();
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.globalAlpha = wm.opacity ?? 0.5;
    ctx.fillStyle = wm.color || '#ffffff';
    ctx.textBaseline = 'middle';
    
    const textMetrics = ctx.measureText(wm.text);
    const textWidth = textMetrics.width;
    const textHeight = fontSize; // Approximate height

    let x = 0;
    let y = 0;

    switch (wm.position) {
      case 'top-left':
        x = margin;
        y = margin + textHeight / 2;
        break;
      case 'top-right':
        x = canvasWidth - textWidth - margin;
        y = margin + textHeight / 2;
        break;
      case 'bottom-left':
        x = margin;
        y = canvasHeight - margin - textHeight / 2;
        break;
      case 'bottom-right':
        x = canvasWidth - textWidth - margin;
        y = canvasHeight - margin - textHeight / 2;
        break;
      case 'center':
      default:
        x = (canvasWidth - textWidth) / 2;
        y = canvasHeight / 2;
        break;
    }

    ctx.fillText(wm.text, x, y);
    ctx.restore();
  }

  // Draw Border
  if (options.border && options.border.enabled && options.border.width > 0) {
    const border = options.border;
    const radius = Math.min(canvasWidth, canvasHeight) * (border.radius / 100);
    
    ctx.save();
    ctx.strokeStyle = border.color;
    ctx.lineWidth = border.width;
    ctx.beginPath();
    const inset = border.width / 2;
    ctx.roundRect(inset, inset, canvasWidth - border.width, canvasHeight - border.width, Math.max(0, radius - inset));
    ctx.stroke();
    ctx.restore();
  }
};

export const processImage = async (
  source: File | Blob | HTMLImageElement | string,
  options: ProcessOptions = {}
): Promise<Blob> => {
  let img: HTMLImageElement;
  let shouldRevoke = false;

  if (source instanceof HTMLImageElement) {
    img = source;
  } else {
    img = await loadImage(source);
    shouldRevoke = typeof source !== 'string';
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context not available');
  }
  
  // Determine source dimensions
  const sWidth = options.crop?.width ?? img.naturalWidth;
  const sHeight = options.crop?.height ?? img.naturalHeight;

  // Determine target dimensions (Canvas Size)
  let targetWidth = options.width;
  let targetHeight = options.height;

  if (!targetWidth && !targetHeight) {
    targetWidth = sWidth;
    targetHeight = sHeight;
  } else if (targetWidth && !targetHeight) {
    targetHeight = (sHeight / sWidth) * targetWidth;
  } else if (!targetWidth && targetHeight) {
    targetWidth = (sWidth / sHeight) * targetHeight;
  }
  
  targetWidth = Math.round(targetWidth!);
  targetHeight = Math.round(targetHeight!);

  // Handle Rotation (Swap width/height for 90/270 degrees)
  const rotate = options.transforms?.rotate || 0;
  const isRotated = rotate === 90 || rotate === 270;
  
  // Canvas dimensions should match target dimensions (swapped if rotated)
  canvas.width = isRotated ? targetHeight : targetWidth;
  canvas.height = isRotated ? targetWidth : targetHeight;

  renderToCanvas(ctx, img, options, canvas.width, canvas.height);

  // Convert to Blob
  const format = options.format || 'image/png';
  const quality = options.quality !== undefined ? options.quality : 0.8;
  
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          // Fallback if toBlob fails
          if (format === 'image/x-icon') {
             canvas.toBlob((b) => {
                if(b) resolve(b);
                else reject(new Error('Canvas to Blob failed'));
             }, 'image/png', quality);
          } else {
             reject(new Error('Canvas to Blob failed'));
          }
        }
        // Cleanup
        if (shouldRevoke && img.src.startsWith('blob:')) {
           URL.revokeObjectURL(img.src);
        }
      },
      format,
      quality
    );
  });
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};