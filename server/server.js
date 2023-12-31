const express = require('express');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*',
}));
app.use('/output', express.static('output'));
app.use('/uploads', express.static('uploads'));
const upload = multer({ dest: 'uploads/' }); // Folder where files will be stored

app.get('/', (req, res)=>{
  res.send("Hello World!")
});
app.post('/merge-pdf', upload.single('pdfFile'), async (req, res) => {

  try {
    const pdfPath = req.file.path; // Path to the uploaded PDF file
    const selectedPages = JSON.parse(req.body.selectedPages); // Array of selected page numbers

    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const mergedPdf = await PDFDocument.create();
    for (const pageNumber of selectedPages) {
      const [copiedPage] = await mergedPdf.copyPages(pdfDoc, [pageNumber - 1]);
      mergedPdf.addPage(copiedPage);
    }

    const outputPath = 'output/merged_pdf.pdf'; 
    fs.writeFileSync(outputPath, await mergedPdf.save());
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.json({ mergedPdfUrl: `http://localhost:5000/${outputPath}` });
    // res.json({ mergedPdfUrl: `http://localhost:5000/uploads/1.pdf` });
  } catch (error) {
    res.status(500).send('Error merging PDF');
  }
});

app.get('/output/merged_pdf.pdf', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  const outputPath = 'output/merged_pdf.pdf'; 
  res.json({ mergedPdfUrl: `http://localhost:5000/${outputPath}` });
});

PORT = 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
