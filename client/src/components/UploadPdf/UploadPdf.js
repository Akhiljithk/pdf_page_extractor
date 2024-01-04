import { usePdfData } from '../../PdfDataContext'; // Importing context for PDF data
import { pdfjs } from "react-pdf";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import './UploadPdf.css'

// Configuring worker source for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

// Component for uploading PDF files
function UploadPdf() {
  const { updatePdfData } = usePdfData(); // Accessing function to update PDF data from context
  const { pdfData } = usePdfData(); // Accessing PDF data from context

  // Function to submit uploaded PDF file
  const submitPdf = async (file) => {
    const formData = new FormData(); // Creating a new form data object
    formData.append("file", file); 
    updatePdfData(file);
  };
  
  return (
      <div className="upload-pdf-header">
        { pdfData ? 
        // Rendered if PDF data exists
        <a href="/" className="merge_pdf delete-pdf-btn">Delete this PDF <DeleteOutlineOutlinedIcon style={{position:"relative", top:"7px"}}/></a>
        :
        // Rendered if no PDF data exists
        <>
            <h4>Extract pages from PDF</h4>
            <br />
             {/* Input field to upload PDF file */}
            <label htmlFor="pdf-upload" className="select-file-label">
                <input type="file" id="pdf-upload" className="select-file-input" accept="application/pdf" required
                onChange={(e) => submitPdf(e.target.files[0])} // OnChange event handling to submit the uploaded file
                />
                Upload your PDF
            </label>
            <br />
        </>
        }
      </div>
  );
}

export default UploadPdf;