# Canvas Builder API

## Features

- Add rectangles, circles, text, images
- Drag and drop elements
- Undo / Redo
- Layer ordering
- Background color customization
- PDF export with compression
- Save project as JSON

## Tech Stack

Frontend: React + TypeScript
Backend: Express + Node Canvas
PDF: PDFKit
Compression: Sharp

## Architecture

React manages element state.
Backend re-renders elements and exports PDF.

## Deployment

Frontend hosted on Vercel.
Backend hosted on Render.

## Optimization

PDF images compressed using Sharp at 70% JPEG quality.

## Future Improvements

- Resize handles
- Text editing inline
- Multi-page PDF support
