/**
 * Tests for Canvas mock utilities
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  createMockCanvasContext,
  setupCanvasMocks,
} from '../../src/dom/canvas.js';

describe('createMockCanvasContext', () => {
  it('creates a mock context with all drawing methods', () => {
    const ctx = createMockCanvasContext();

    expect(ctx.fillRect).toBeDefined();
    expect(ctx.clearRect).toBeDefined();
    expect(ctx.strokeRect).toBeDefined();
    expect(ctx.fillText).toBeDefined();
    expect(ctx.strokeText).toBeDefined();
    expect(ctx.beginPath).toBeDefined();
    expect(ctx.closePath).toBeDefined();
    expect(ctx.moveTo).toBeDefined();
    expect(ctx.lineTo).toBeDefined();
    expect(ctx.arc).toBeDefined();
    expect(ctx.arcTo).toBeDefined();
    expect(ctx.bezierCurveTo).toBeDefined();
    expect(ctx.quadraticCurveTo).toBeDefined();
    expect(ctx.rect).toBeDefined();
    expect(ctx.fill).toBeDefined();
    expect(ctx.stroke).toBeDefined();
    expect(ctx.clip).toBeDefined();
  });

  it('creates a mock context with transform methods', () => {
    const ctx = createMockCanvasContext();

    expect(ctx.save).toBeDefined();
    expect(ctx.restore).toBeDefined();
    expect(ctx.scale).toBeDefined();
    expect(ctx.rotate).toBeDefined();
    expect(ctx.translate).toBeDefined();
    expect(ctx.transform).toBeDefined();
    expect(ctx.setTransform).toBeDefined();
    expect(ctx.resetTransform).toBeDefined();
  });

  it('creates a mock context with image methods', () => {
    const ctx = createMockCanvasContext();

    expect(ctx.drawImage).toBeDefined();
    expect(ctx.createImageData).toBeDefined();
    expect(ctx.getImageData).toBeDefined();
    expect(ctx.putImageData).toBeDefined();
  });

  it('creates a mock context with gradient/pattern methods', () => {
    const ctx = createMockCanvasContext();

    expect(ctx.createLinearGradient).toBeDefined();
    expect(ctx.createRadialGradient).toBeDefined();
    expect(ctx.createPattern).toBeDefined();
  });

  it('creates a mock context with path methods', () => {
    const ctx = createMockCanvasContext();

    expect(ctx.isPointInPath).toBeDefined();
    expect(ctx.isPointInStroke).toBeDefined();
    expect(ctx.getLineDash).toBeDefined();
    expect(ctx.setLineDash).toBeDefined();
  });

  describe('measureText', () => {
    it('returns width based on text length', () => {
      const ctx = createMockCanvasContext();

      const result = ctx.measureText('Hello');

      expect(result.width).toBe(5 * 8); // 5 chars * 8px
    });

    it('returns different widths for different texts', () => {
      const ctx = createMockCanvasContext();

      expect(ctx.measureText('Hi').width).toBe(16);
      expect(ctx.measureText('Hello World').width).toBe(88);
    });
  });

  describe('createImageData and getImageData', () => {
    it('returns mock ImageData', () => {
      const ctx = createMockCanvasContext();

      const imageData = ctx.createImageData();

      expect(imageData.data).toBeInstanceOf(Uint8ClampedArray);
      expect(imageData.width).toBe(10);
      expect(imageData.height).toBe(10);
    });

    it('getImageData returns mock data', () => {
      const ctx = createMockCanvasContext();

      const imageData = ctx.getImageData();

      expect(imageData.data).toBeInstanceOf(Uint8ClampedArray);
      expect(imageData.data.length).toBe(400); // 10 * 10 * 4
    });
  });

  describe('gradient methods', () => {
    it('createLinearGradient returns gradient with addColorStop', () => {
      const ctx = createMockCanvasContext();

      const gradient = ctx.createLinearGradient();

      expect(gradient.addColorStop).toBeDefined();
      expect(() => gradient.addColorStop()).not.toThrow();
    });

    it('createRadialGradient returns gradient with addColorStop', () => {
      const ctx = createMockCanvasContext();

      const gradient = ctx.createRadialGradient();

      expect(gradient.addColorStop).toBeDefined();
    });

    it('createPattern returns null', () => {
      const ctx = createMockCanvasContext();

      const pattern = ctx.createPattern();

      expect(pattern).toBeNull();
    });
  });

  describe('point checking methods', () => {
    it('isPointInPath returns false', () => {
      const ctx = createMockCanvasContext();

      expect(ctx.isPointInPath()).toBe(false);
    });

    it('isPointInStroke returns false', () => {
      const ctx = createMockCanvasContext();

      expect(ctx.isPointInStroke()).toBe(false);
    });
  });

  describe('line dash methods', () => {
    it('getLineDash returns empty array', () => {
      const ctx = createMockCanvasContext();

      expect(ctx.getLineDash()).toEqual([]);
    });
  });

  describe('default properties', () => {
    it('has default canvas dimensions', () => {
      const ctx = createMockCanvasContext();

      expect(ctx.canvas.width).toBe(300);
      expect(ctx.canvas.height).toBe(150);
    });

    it('has default fill and stroke styles', () => {
      const ctx = createMockCanvasContext();

      expect(ctx.fillStyle).toBe('#000000');
      expect(ctx.strokeStyle).toBe('#000000');
    });

    it('has default line properties', () => {
      const ctx = createMockCanvasContext();

      expect(ctx.lineWidth).toBe(1);
      expect(ctx.lineCap).toBe('butt');
      expect(ctx.lineJoin).toBe('miter');
      expect(ctx.miterLimit).toBe(10);
      expect(ctx.lineDashOffset).toBe(0);
    });

    it('has default text properties', () => {
      const ctx = createMockCanvasContext();

      expect(ctx.font).toBe('10px sans-serif');
      expect(ctx.textAlign).toBe('start');
      expect(ctx.textBaseline).toBe('alphabetic');
    });

    it('has default compositing properties', () => {
      const ctx = createMockCanvasContext();

      expect(ctx.globalAlpha).toBe(1);
      expect(ctx.globalCompositeOperation).toBe('source-over');
    });

    it('has default shadow properties', () => {
      const ctx = createMockCanvasContext();

      expect(ctx.shadowBlur).toBe(0);
      expect(ctx.shadowColor).toBe('rgba(0, 0, 0, 0)');
      expect(ctx.shadowOffsetX).toBe(0);
      expect(ctx.shadowOffsetY).toBe(0);
    });

    it('has image smoothing enabled by default', () => {
      const ctx = createMockCanvasContext();

      expect(ctx.imageSmoothingEnabled).toBe(true);
    });
  });

  describe('all methods are callable', () => {
    it('does not throw when calling drawing methods', () => {
      const ctx = createMockCanvasContext();

      expect(() => {
        ctx.fillRect();
        ctx.clearRect();
        ctx.strokeRect();
        ctx.fillText();
        ctx.strokeText();
        ctx.beginPath();
        ctx.closePath();
        ctx.moveTo();
        ctx.lineTo();
        ctx.arc();
        ctx.arcTo();
        ctx.bezierCurveTo();
        ctx.quadraticCurveTo();
        ctx.rect();
        ctx.fill();
        ctx.stroke();
        ctx.clip();
      }).not.toThrow();
    });

    it('does not throw when calling transform methods', () => {
      const ctx = createMockCanvasContext();

      expect(() => {
        ctx.save();
        ctx.restore();
        ctx.scale();
        ctx.rotate();
        ctx.translate();
        ctx.transform();
        ctx.setTransform();
        ctx.resetTransform();
      }).not.toThrow();
    });

    it('does not throw when calling image methods', () => {
      const ctx = createMockCanvasContext();

      expect(() => {
        ctx.drawImage();
        ctx.putImageData();
      }).not.toThrow();
    });
  });
});

describe('setupCanvasMocks', () => {
  // Note: These tests require a DOM environment (jsdom)
  // They will be skipped if HTMLCanvasElement is not available

  it('does not throw in any environment', () => {
    expect(() => setupCanvasMocks()).not.toThrow();
  });
});
