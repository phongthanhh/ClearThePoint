import { DisplayPoint } from "../App";

export const generateDisplayPoint = (amount: number): DisplayPoint[] => {
  return Array.from({ length: Number(amount) }, (_, i) => ({
    id: "id" + Math.random().toString(16).slice(2),
    number: i + 1,
    fadeOut: false,
    position: {
      top: Math.random() * 90 + "%",
      left: Math.random() * 90 + "%",
    },
    zIndex: Number(amount) - i,
  }));
};