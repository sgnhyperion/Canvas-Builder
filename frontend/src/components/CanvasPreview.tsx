import { useEffect, useRef, useState } from "react";
import type { CanvasElement } from "../types/canvas.types";

interface Props {
  width: number;
  height: number;
  elements: CanvasElement[];
  backgroundColor: string;
  setElements: React.Dispatch<React.SetStateAction<CanvasElement[]>>;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export default function CanvasPreview({
  width,
  height,
  elements,
  backgroundColor,
  setElements,
  selectedId,
  setSelectedId,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [imageCache, setImageCache] = useState<
    Record<string, HTMLImageElement>
  >({});

  useEffect(() => {
    elements.forEach((el) => {
      if (el.type === "image" && !imageCache[el.url]) {
        const img = new window.Image();
        img.src = el.url;
        img.onload = () => {
          setImageCache((prev) => ({ ...prev, [el.url]: img }));
        };
      }
    });
  }, [elements, imageCache]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    elements.forEach((el) => {
      switch (el.type) {
        case "rect":
          ctx.fillStyle = el.color;
          ctx.fillRect(el.x, el.y, el.width, el.height);
          break;
        case "circle":
          ctx.beginPath();
          ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2);
          ctx.fillStyle = el.color;
          ctx.fill();
          break;
        case "text":
          ctx.fillStyle = el.color;
          ctx.font = `${el.fontSize}px Arial`;
          ctx.textBaseline = "top";
          ctx.fillText(el.text, el.x, el.y);
          break;
        case "image":
          const img = imageCache[el.url];
          if (img) {
            ctx.drawImage(img, el.x, el.y, el.width, el.height);
          }
          break;
      }

      if (el.id === selectedId) {
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);

        switch (el.type) {
          case "rect":
            ctx.strokeRect(el.x - 4, el.y - 4, el.width + 8, el.height + 8);
            break;
          case "circle":
            ctx.beginPath();
            ctx.arc(el.x, el.y, el.radius + 4, 0, Math.PI * 2);
            ctx.stroke();
            break;
          case "text":
            ctx.font = `${el.fontSize}px Arial`;
            ctx.textBaseline = "top";
            const textWidth = ctx.measureText(el.text).width;
            ctx.strokeRect(el.x - 4, el.y - 4, textWidth + 8, el.fontSize + 8);
            break;
          case "image":
            ctx.strokeRect(el.x - 4, el.y - 4, el.width + 8, el.height + 8);
            break;
        }
        ctx.setLineDash([]);
      }
    });
  }, [elements, width, height, backgroundColor, imageCache, selectedId]);

  const getMousePos = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const { x, y } = getMousePos(e);

    let isHit = false;
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i];

      if (el.type === "rect") {
        if (
          x >= el.x &&
          x <= el.x + el.width &&
          y >= el.y &&
          y <= el.y + el.height
        ) {
          isHit = true;
          setDragId(el.id);
          setSelectedId(el.id);
          setOffset({ x: x - el.x, y: y - el.y });
          break;
        }
      } else if (el.type === "circle") {
        const dx = x - el.x;
        const dy = y - el.y;
        if (dx * dx + dy * dy <= el.radius * el.radius) {
          isHit = true;
          setDragId(el.id);
          setSelectedId(el.id);
          setOffset({ x: dx, y: dy });
          break;
        }
      } else if (el.type === "text") {
        const ctx = canvasRef.current!.getContext("2d")!;
        ctx.font = `${el.fontSize}px Arial`;
        const metrics = ctx.measureText(el.text);
        const textWidth = metrics.width;
        if (
          x >= el.x &&
          x <= el.x + textWidth &&
          y >= el.y &&
          y <= el.y + el.fontSize
        ) {
          isHit = true;
          setDragId(el.id);
          setSelectedId(el.id);
          setOffset({ x: x - el.x, y: y - el.y });
          break;
        }
      } else if (el.type === "image") {
        if (
          x >= el.x &&
          x <= el.x + el.width &&
          y >= el.y &&
          y <= el.y + el.height
        ) {
          isHit = true;
          setDragId(el.id);
          setSelectedId(el.id);
          setOffset({ x: x - el.x, y: y - el.y });
          break;
        }
      }
    }

    if (!isHit) {
      setSelectedId(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragId) return;

    const { x, y } = getMousePos(e);

    setElements((prev) =>
      prev.map((el) =>
        el.id === dragId ? { ...el, x: x - offset.x, y: y - offset.y } : el,
      ),
    );
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setDragId(null)}
      onMouseLeave={() => setDragId(null)}
      className="bg-white rounded-xl shadow-2xl border border-slate-700 max-w-full h-auto object-contain cursor-move"
    />
  );
}
