const express = require('express');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*', // allowing request from all origin
}));
// setting up static folders 
app.use(express.static(path.join(__dirname + "/public")))
app.use('/output', express.static('output'));
app.use('/uploads', express.static('uploads'));
// Define storage for uploaded PDFs
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Uploads will be stored in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename for the uploaded file
  }
});
const upload = multer({ storage: storage }); // Folder where files will be stored

// merge pdf api
app.post('/merge-pdf', upload.single('pdfFile'), async (req, res) => {

  try {
    const pdfPath = req.file.path; // Path to the uploaded PDF file from client
    const selectedPages = JSON.parse(req.body.selectedPages); // Array of selected page numbers

    const pdfBytes = fs.readFileSync(pdfPath); //  reads the file as a binary data
    const pdfDoc = await PDFDocument.load(pdfBytes); // ArrayBuffer to pdf

    const mergedPdf = await PDFDocument.create(); // create an empty pdf
    
    //copy selected pages to mergePdf variable 
    for (const pageNumber of selectedPages) {
      const [copiedPage] = await mergedPdf.copyPages(pdfDoc, [pageNumber - 1]);
      mergedPdf.addPage(copiedPage);  
    }
    
    // save mergedPdf in this path
    const outputPath = `output/${req.file.originalname}`; 
    fs.writeFileSync(outputPath, await mergedPdf.save());
    // adding access control header 
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // sent the url of saved mergedPdf to the client 
    res.json({ mergedPdfUrl: `http://localhost:5000/${outputPath}` });
  } catch (error) {
    res.status(500).send('Error merging PDF: ', error);
  }
});

PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
