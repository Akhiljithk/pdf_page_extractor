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
  const { pdfData } = usePdfData();
  const [numPages, setNumPages] = useState();
  const [selectedNumPages, setSelectedNumPages] = useState();
  const [checkedPages, setCheckedPages] = useState({});
  const [selectedPages, setSelectedPages] = useState([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setCheckedPages({});
  }

  const selectPage = (pageNumber) => {
    setCheckedPages(prevState => {
      const updatedCheckedPages = { ...prevState };
      updatedCheckedPages[pageNumber] = !prevState[pageNumber];

      const selected = Object.keys(updatedCheckedPages).filter(page => updatedCheckedPages[page]);
      setSelectedPages(selected);
      return updatedCheckedPages;
    });
  };

  const mergePdf = async () => {
    setLoading(true)
    setSelectedPages([])
    const formData = new FormData();
    formData.append('pdfFile', pdfData);
    formData.append('selectedPages', JSON.stringify(selectedPages));
    try {
      const response = await axios.post('http://localhost:5000/merge-pdf', formData);
     
      const data = response.data;
      setMergedPdfUrl(data.mergedPdfUrl);
      const checkedPagesArray = Object.values(checkedPages);
      const selectedPages = checkedPagesArray.filter(page => page === true);
      setSelectedNumPages(selectedPages.length);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
  }

  const downloadMergedPdf = async () => {
    const response = await fetch(mergedPdfUrl);
    const blob = await response.blob();

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'merged_pdf.pdf');

    link.click();
  };

  return (
    <>
    {selectedPages.length>0 && <button onClick={mergePdf} className="merge_pdf merge-btn">Merge selected pages</button>}
    {mergedPdfUrl && <button onClick={downloadMergedPdf} className="merge_pdf download-btn">Download <SimCardDownloadOutlinedIcon style={{position:"relative", top:"0px", left:"6px"}}/></button>}
    {loading ? <PorgrassBar/> :
    <div className="pdf-div">
      {mergedPdfUrl ? (
          <MergedPdf numPages={selectedNumPages} mergedPdfUrl={mergedPdfUrl}/>
      ): (
          <Document className="pdf-container" file={pdfData} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => {
            const isChecked = checkedPages[page] || false;

            return (
              <div className="each_pages" onClick={() => selectPage(page)} key={page}>
                <Checkbox
                  onClick={() => selectPage(page)}
                  className="select_page_check_box"
                  checked={isChecked} 
                  onChange={() => selectPage(page)} // Ensure the checkbox state changes with click
                />
                <span>{page}</span>
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
