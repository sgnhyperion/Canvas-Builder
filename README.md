# 🚀 Rocketium Canvas Builder

A full-stack application that acts as your personal canvas studio. You can easily drag and drop shapes, write text, upload images, tweak your design, and finally export it to a highly-optimized PDF document, cleanly powered by an Express backend.

### Frontend & Interactions

- **Add Shapes:** Drop rectangles and circles onto your canvas.
- **Add Text:** Type custom text elements.
- **Upload Images:** Bring your own graphics into the layout via file upload.
- **Drag & Drop:** Click and hold any element to freely drag it around the canvas workspace.
- **Interactive Selection System:** Click any element to 'select' it (highlighted with a dashed border).
- **Live Property Editing:** Once you select an element, you can tweak it via a sidebar:
  - Adjust **colors** (for shapes and text).
  - Change the **width and height** (for rectangles and images).
  - Tweak the **radius** (for circles).
  - Adjust the **font size** (for text).
- **Delete Elements:** Easily remove anything you don't need by selecting it and hitting delete.
- **Background Styling:** Change the background color of the entire canvas in real-time.
- **Live Rendering:** Uses the HTML5 Canvas API in React to draw the exact layout as you work.

### Backend & Exporting

- **Server-Side Rendering:** When you export, the React app sends the layout data to an Express server. It uses `node-canvas` to recreate your exact design programmatically off-screen.
- **Smart Image Compression:** To keep generated PDFs lightweight, the backend grabs a snapshot of the canvas and uses `sharp` to apply 80% JPEG compression.
- **PDF Generation:** Once compressed, it uses `PDFKit` to wrap the design perfectly into a PDF sized exactly to your canvas dimensions.
- **Instant Downloads:** The final PDF streams directly back from memory to your browser as a downloadable file, never cluttering a hard drive.

## 🛠️ Tech Stack

**Frontend**

- React 19 + TypeScript
- Vite (for crazy fast development)
- Tailwind CSS v4 (styling)
- Lucide React (icons)

**Backend**

- Express.js (REST server)
- Node Canvas (for drawing the canvas server-side)
- PDFKit (PDF builder)
- Sharp (heavy-duty image compressor)

## 🚦 How to run it locally

You'll need two terminal windows open to run both the frontend and backend.

### 1. Start the Backend

The backend server handles the heavy lifting of rendering and creating PDFs. It runs on `localhost:5000`.

```bash
cd backend
npm install
npm run dev
```

### 2. Start the Frontend

The frontend is your interactive canvas studio.

Open a new terminal window:

```bash
cd frontend
npm install
```

Create a quick `.env` file inside the `frontend` folder to link it to your backend:

```env
VITE_API_URL="http://localhost:5000/api/canvas"
```

Start the Vite development server:

```bash
npm run dev
```

_(The UI should now be available at `http://localhost:5173`)_

## 📂 Project Structure

- `/frontend`: The React UI. State is handled here and the visual preview is mapped to a `<canvas>` element using user mouse events to track drag-and-drop.
- `/backend`: The Express server. It intercepts the POST request at `/api/canvas/export` with the layout JSON, renders the canvas, compresses it, and spits back the PDF buffer.
