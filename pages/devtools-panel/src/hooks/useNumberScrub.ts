// src/hooks/useNumberScrub.ts
import * as React from 'react';

type WheelMode = 'off' | 'shift' | 'always';

type Options = {
  value: number | undefined;
  onChange: (next: number) => void | Promise<void>;
  step?: number;
  min?: number;
  max?: number;
  /** Show while scrubbing */
  cursor?: string;
  /** When to allow wheel nudging (default: 'shift') */
  wheel?: WheelMode;
  /** Approx. pixels needed to traverse the full [min..max] range (default: 200) */
  pixelsForFullRange?: number;
  /** If true (default), blur the input on scrub start so it won’t keep focus/caret */
  blurOnStart?: boolean;
};

export const useNumberScrub = ({
  value,
  onChange,
  step = 1,
  min,
  max,
  cursor = 'ew-resize',
  wheel = 'shift',
  pixelsForFullRange = 200,
  blurOnStart = true,
}: Options) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const scrubbing = React.useRef(false);
  const startX = React.useRef(0);
  const startVal = React.useRef(0);
  const lastAppliedStep = React.useRef<number | null>(null);
  const raf = React.useRef<number | null>(null);

  // Derived sensitivity
  const range = typeof min === 'number' && typeof max === 'number' ? max - min : undefined;
  const s = Number(step) > 0 ? Number(step) : 1;
  const totalSteps = range != null ? Math.max(1, Math.round(range / s)) : 0;
  const pxPerStep = totalSteps > 0 ? Math.max(1, pixelsForFullRange / totalSteps) : 1; // fallback

  const clamp = React.useCallback(
    (v: number) => {
      let out = v;
      if (typeof min === 'number') out = Math.max(min, out);
      if (typeof max === 'number') out = Math.min(max, out);
      return out;
    },
    [min, max],
  );

  const quantize = React.useCallback(
    (v: number) =>
      // Snap to step grid relative to 0
      Math.round(v / s) * s,
    [s],
  );

  const apply = React.useCallback(
    async (v: number) => {
      const next = clamp(quantize(v));
      if (!Number.isFinite(next)) return;
      await onChange(next);
    },
    [clamp, quantize, onChange],
  );

  const end = React.useCallback((e?: PointerEvent) => {
    if (!scrubbing.current) return;
    scrubbing.current = false;
    if (e && inputRef.current?.hasPointerCapture(e.pointerId)) {
      inputRef.current.releasePointerCapture(e.pointerId);
    }
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', end);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    if (inputRef.current) inputRef.current.style.cursor = '';
    lastAppliedStep.current = null;
  }, []);

  const onPointerMove = React.useCallback(
    (e: PointerEvent) => {
      if (!scrubbing.current) return;
      if (raf.current != null) return;
      raf.current = requestAnimationFrame(async () => {
        raf.current = null;
        const dx = e.clientX - startX.current;

        // convert pixels to steps
        let steps = dx / pxPerStep;
        // modifiers
        if (e.shiftKey) steps *= 10;
        if (e.altKey) steps *= 0.1;

        // only apply if we crossed at least 1 step since last application
        const quantizedSteps = Math.trunc(steps); // whole steps
        if (lastAppliedStep.current === quantizedSteps) return;
        lastAppliedStep.current = quantizedSteps;

        const delta = quantizedSteps * s;
        const next = startVal.current + delta;
        await apply(next);
      });
    },
    [apply, pxPerStep, s],
  );

  const onPointerDown: React.PointerEventHandler<HTMLInputElement> = React.useCallback(
    e => {
      if (e.button !== 0) return;
      scrubbing.current = true;
      startX.current = e.clientX;
      startVal.current = Number(value ?? 0);
      lastAppliedStep.current = 0;

      // stop input focus/caret
      if (blurOnStart) {
        (e.currentTarget as HTMLInputElement).blur();
      }
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', end);

      // visual feedback
      document.body.style.cursor = cursor;
      document.body.style.userSelect = 'none';
      if (inputRef.current) inputRef.current.style.cursor = cursor;

      e.preventDefault();
      e.stopPropagation();
    },
    [value, onPointerMove, end, cursor, blurOnStart],
  );

  const onWheel: React.WheelEventHandler<HTMLInputElement> = React.useCallback(
    async e => {
      if (wheel === 'off') return;
      if (wheel === 'shift' && !e.shiftKey) return;

      const dir = e.deltaY < 0 ? 1 : -1;
      let factor = 1;
      if (e.shiftKey) factor *= 10;
      if (e.altKey) factor *= 0.1;

      const curr = Number(value ?? 0);
      await apply(curr + dir * s * factor);
      e.preventDefault();
    },
    [wheel, value, s, apply],
  );

  React.useEffect(
    () => () => {
      if (raf.current != null) cancelAnimationFrame(raf.current);
      end();
    },
    [end],
  );

  return {
    inputRef,
    inputHandlers: {
      onPointerDown,
      onWheel,
    },
  };
};
