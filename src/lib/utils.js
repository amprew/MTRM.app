export const clampInt = (min, max, value) => (
  Math.min(Math.max(+value, min), max)
);

export const bpmToTickRate = (bpm) => (
  (60/bpm)*1000
);
