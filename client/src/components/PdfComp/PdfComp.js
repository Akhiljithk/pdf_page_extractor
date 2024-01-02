import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import Checkbox from '@mui/material/Checkbox';
import MergedPdf from './MergedPdf/MergedPdf';
import { usePdfData } from '../../PdfDataContext';
import SimCardDownloadOutlinedIcon from '@mui/icons-material/SimCardDownloadOutlined';
import PorgrassBar from '../ProgressBars/PorgrassBar'
import axios from 'axios';
import './PdfComp.css';

function PdfComp() {
  const { pdfData } = usePdfData(null); // pdf file data from user input 
  const [numPages, setNumPages] = useState(null); // number of total pages in uploaded pdf  
  const [selectedPages, setSelectedPages] = useState([]); // all user selected pages
  const [selectedNumPages, setSelectedNumPages] = useState(null); // total number of user selected pages 
  const [checkedPages, setCheckedPages] = useState({}); // controlling true false in checkboxes
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null); // pdf url of merged pages from server 
  const [loading, setLoading] = useState(false); // progress bar status 

  // number of pages will be stored on document loading
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setCheckedPages({}); // emptying the user selected pages on new document selection 
  }
  // fucntion to store selected pages from the user 
  const selectPage = (pageNumber) => {
    setCheckedPages(prevState => {
      const updatedCheckedPages = { ...prevState }; // taking all current state of selcetd checked pages 
      updatedCheckedPages[pageNumber] = !prevState[pageNumber]; // updating the state 
      //creates a new array "selected" containing only those page numbers for which the corresponding value in the updatedCheckedPages object is true
      const selected = Object.keys(updatedCheckedPages).filter(page => updatedCheckedPages[page]);
      setSelectedPages(selected); // updating selected pages
      return updatedCheckedPages;
    });
  };
  // merge api call
  const mergePdf = async () => {
    setLoading(true) // enabiling progress bar 
    setSelectedPages([]) 
    // creating a form data of {"pdfFile": ..., "selectedPages": ... }
    const formData = new FormData(); 
    formData.append('pdfFile', pdfData);
    formData.append('selectedPages', JSON.stringify(selectedPages));
    try {
      // api call
      const response = await axios.post('http://localhost:5000/merge-pdf', formData);
      const data = response.data; 
      setMergedPdfUrl(data.mergedPdfUrl); // mergedPdfUrl containing the link of new merged pdf
      const checkedPagesArray = Object.values(checkedPages);
      const selectedPages = checkedPagesArray.filter(page => page === true);
      setSelectedNumPages(selectedPages.length); // setting merged pdf length 
      setLoading(false) // disabiling progress bar 
    } catch (error) {
      console.log(error);
    }
  }

  // function enabling downlading the merged pdf 
  const downloadMergedPdf = async () => {
    const response = await fetch(mergedPdfUrl); //fetches the content of the PDF file from the mergedPdfUrl
    const blob = await response.blob(); // extract binary data from resposne 
    const link = document.createElement('a'); // create new anchor element in the DOM. This element will be used to simulate a click to download the file.
    link.href = window.URL.createObjectURL(blob); // set to a URL created from the Blob to href in <a>
    link.setAttribute('download', 'merged_pdf.pdf'); // setting filename when the file is downloaded
    link.click(); // triggers a click event on the anchor element and start download process 
  };

  return (
    <>
    {/* if there is a selected page */}
    {selectedPages.length>0 && <button onClick={mergePdf} className="merge_pdf merge-btn">Merge selected pages</button>}
    {/* if there is merged pdf */}
    {mergedPdfUrl && <button onClick={downloadMergedPdf} className="merge_pdf download-btn">Download <SimCardDownloadOutlinedIcon style={{position:"relative", top:"0px", left:"6px"}}/></button>}
    {loading ? <PorgrassBar/> :
    <div className="pdf-div">
      {mergedPdfUrl ? (
          // page to disaply merged pages 
          <MergedPdf numPages={selectedNumPages} mergedPdfUrl={mergedPdfUrl}/>
      ): (
          // displaying user selected pdf 
          <Document className="pdf-container" file={pdfData} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => {
            const isChecked = checkedPages[page] || false; // assigning value for check box
            return (
              <div className="each_pages" onClick={() => selectPage(page)} key={page}>
                <Checkbox
                  onClick={() => selectPage(page)}
                  className="select_page_check_box"
                  checked={isChecked} 
                  onChange={() => selectPage(page)} // function to change check box state 
                />
                {/* page number in span tag */}
                <span>{page}</span> 
                {/* displaying each pages  */}
                <Page
                  className="pdf-image"
                  pageNumber={page}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>
            );
          })}
        </Document>
      )
      }
    </div>
    }
   </>
  );
}

export default PdfComp;
