const express = require("express");
const { renderCanvas, exportPDF } = require("../services/canvas.service");

const router = express.Router();

router.post("/export", async (req, res) => {
  try {
    const { width, height, elements, backgroundColor } = req.body;

    const canvas = await renderCanvas(
      width,
      height,
      elements,
      backgroundColor
    );

    const pdfBuffer = await exportPDF(canvas);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=canvas.pdf");

    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Export failed" });
  }
});

module.exports = router;