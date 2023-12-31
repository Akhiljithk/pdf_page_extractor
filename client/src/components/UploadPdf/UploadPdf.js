import { usePdfData } from '../../PdfDataContext';
import { pdfjs } from "react-pdf";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import './UploadPdf.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

function UploadPdf() {
  const { updatePdfData } = usePdfData();
  const { pdfData } = usePdfData();

  // useEffect(() => {
  //   getPdf();
  // }, []);
  // const getPdf = async () => {
  //   const result = await axios.get("http://localhost:5000/get-files");
  //   console.log(result.data.data);
  //   setAllImage(result.data.data);
  // };
  const submitPdf = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    updatePdfData(file);
    // const result = await axios.post(
    //   "http://localhost:5000/upload-files",
    //   formData,
    //   {
    //     headers: { "Content-Type": "multipart/form-data" },
    //   }
    // );
    // console.log(result);
    // if (result.data.status == "ok") {
    //   alert("Uploaded Successfully!!!");
    //   getPdf();
    // }
  };
  // const showPdf = (pdf) => {
  //   window.open(`http://localhost:5000/files/${pdf}`, "_blank", "noreferrer");
  //   setPdfFile(`http://localhost:5000/files/${pdf}`)
  // };
  
  return (
      <div className="upload-pdf-header">
        { pdfData ? 
        <a href="/" className="merge_pdf delete-pdf-btn">Delete this PDF <DeleteOutlineOutlinedIcon style={{position:"relative", top:"7px"}}/></a>
        :
        <>
            <h4>Extract pages from PDF</h4>
            <br />
            <label htmlFor="pdf-upload" className="select-file-label">
                <input type="file" id="pdf-upload" className="select-file-input" accept="application/pdf" required
                onChange={(e) => submitPdf(e.target.files[0])}
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