import axios from "axios";
import type { CanvasElement } from "./types/canvas.types";

const API_URL = import.meta.env.VITE_API_URL;

export async function exportCanvas(
  width: number,
  height: number,
  elements: CanvasElement[],
  backgroundColor: string,
) {
  return axios.post(
    `${API_URL}/api/canvas/export`,
    { width, height, elements, backgroundColor },
    { responseType: "blob" },
  );
}
