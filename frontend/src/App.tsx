import { useState, useMemo, useRef } from "react";
import type { CanvasElement } from "./types/canvas.types";
import CanvasPreview from "./components/CanvasPreview";
import { exportCanvas } from "./api";
import {
  MousePointer2,
  Type,
  Square,
  Circle,
  Image as ImageIcon,
  Download,
  Trash2,
  Palette,
} from "lucide-react";

function App() {
  const [width] = useState(900);
  const [height] = useState(600);
  const [backgroundColor, setBackgroundColor] = useState("#f8fafc");

  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [textInput, setTextInput] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedElement = useMemo(
    () => elements.find((el) => el.id === selectedId),
    [elements, selectedId],
  );

  const updateSelectedProperty = (key: string, value: any) => {
    if (!selectedId) return;
    setElements((prev) =>
      prev.map((el) => {
        if (el.id === selectedId) {
          return { ...el, [key]: value } as CanvasElement;
        }
        return el;
      }),
    );
  };

  const addRectangle = () => {
    setElements([
      ...elements,
      {
        id: crypto.randomUUID(),
        type: "rect",
        x: 50,
        y: 50,
        width: 120,
        height: 80,
        color: "#3b82f6",
      },
    ]);
  };

  const addCircle = () => {
    setElements([
      ...elements,
      {
        id: crypto.randomUUID(),
        type: "circle",
        x: 100,
        y: 100,
        radius: 60,
        color: "#10b981",
      },
    ]);
  };

  const addText = () => {
    if (!textInput.trim()) return;

    setElements([
      ...elements,
      {
        id: crypto.randomUUID(),
        type: "text",
        x: 150,
        y: 150,
        text: textInput,
        fontSize: 32,
        color: "#0f172a",
      },
    ]);

    setTextInput("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setElements([
        ...elements,
        {
          id: crypto.randomUUID(),
          type: "image",
          x: 100,
          y: 100,
          width: 200,
          height: 200,
          url: reader.result as string,
        },
      ]);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setElements(elements.filter((e) => e.id !== selectedId));
    setSelectedId(null);
  };

  const handleExport = async () => {
    const res = await exportCanvas(width, height, elements, backgroundColor);

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = "canvas.pdf";
    link.click();
  };

  return (
    <div className="flex h-screen w-full bg-slate-900 text-slate-100 overflow-hidden font-sans selection:bg-blue-500/30">
      <aside className="w-80 bg-slate-800/50 backdrop-blur-xl border-r border-slate-700/50 flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-slate-700/50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Palette className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-indigo-200">
            Canvas Studio
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <section className="space-y-4">
            <h2 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">
              Add Elements
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={addRectangle}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-500/50 hover:bg-slate-700/50 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <Square className="w-6 h-6 text-blue-400" />
                <span className="text-sm font-medium">Rectangle</span>
              </button>
              <button
                onClick={addCircle}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-700/50 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <Circle className="w-6 h-6 text-emerald-400" />
                <span className="text-sm font-medium">Circle</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="col-span-2 flex items-center justify-center gap-2 p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-purple-500/50 hover:bg-slate-700/50 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <ImageIcon className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium">Upload Image</span>
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Enter text..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addText()}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <button
                onClick={addText}
                className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-white cursor-pointer"
                title="Add Text"
              >
                <Type className="w-5 h-5" />
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">
              Canvas
            </h2>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800 border border-slate-700">
              <span className="text-sm text-slate-300">Background Color</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4 min-h-[120px]">
            <h2 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3 flex items-center justify-between">
              Selected Item
              {selectedElement && (
                <span className="bg-blue-500/20 text-blue-400 xs mx-2 text-[10px] px-2 py-0.5 rounded-full capitalize">
                  {selectedElement.type}
                </span>
              )}
            </h2>

            {selectedElement ? (
              <div className="space-y-3 p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                {(selectedElement.type === "rect" ||
                  selectedElement.type === "circle" ||
                  selectedElement.type === "text") && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Color</span>
                    <input
                      type="color"
                      value={selectedElement.color}
                      onChange={(e) =>
                        updateSelectedProperty("color", e.target.value)
                      }
                      className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0"
                    />
                  </div>
                )}

                {(selectedElement.type === "rect" ||
                  selectedElement.type === "image") && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Width</span>
                      <input
                        type="number"
                        value={selectedElement.width}
                        onChange={(e) =>
                          updateSelectedProperty(
                            "width",
                            Number(e.target.value),
                          )
                        }
                        className="w-20 bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                        min={10}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Height</span>
                      <input
                        type="number"
                        value={selectedElement.height}
                        onChange={(e) =>
                          updateSelectedProperty(
                            "height",
                            Number(e.target.value),
                          )
                        }
                        className="w-20 bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                        min={10}
                      />
                    </div>
                  </>
                )}

                {selectedElement.type === "circle" && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Radius</span>
                    <input
                      type="number"
                      value={selectedElement.radius}
                      onChange={(e) =>
                        updateSelectedProperty("radius", Number(e.target.value))
                      }
                      className="w-20 bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                      min={10}
                    />
                  </div>
                )}

                {selectedElement.type === "text" && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Font Size</span>
                    <input
                      type="number"
                      value={selectedElement.fontSize}
                      onChange={(e) =>
                        updateSelectedProperty(
                          "fontSize",
                          Number(e.target.value),
                        )
                      }
                      className="w-20 bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                      min={10}
                    />
                  </div>
                )}

                <button
                  onClick={deleteSelected}
                  className="w-full mt-2 flex items-center justify-center gap-2 p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors border border-red-500/20 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Delete Element</span>
                </button>
              </div>
            ) : (
              <div className="h-24 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-700/50 rounded-xl bg-slate-800/30">
                <MousePointer2 className="w-5 h-5 mb-2 opacity-50" />
                <span className="text-xs">Click an element to edit</span>
              </div>
            )}
          </section>
        </div>

        <div className="p-6 border-t border-slate-700/50">
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 cursor-pointer"
          >
            <Download className="w-5 h-5" />
            Export as PDF
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-slate-700/50 bg-slate-800/30 backdrop-blur-md flex items-center px-8 justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>
              Dimensions: {width} × {height} px
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-slate-300">
              {elements.length} {elements.length === 1 ? "element" : "elements"}
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] relative">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/0 to-purple-600/0 rounded-2xl blur opacity-25 group-hover:from-blue-500/20 group-hover:to-purple-500/20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

            <div className="relative flex items-center justify-center rounded-xl overflow-hidden ring-1 ring-white/10">
              <CanvasPreview
                width={width}
                height={height}
                elements={elements}
                backgroundColor={backgroundColor}
                setElements={setElements}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
