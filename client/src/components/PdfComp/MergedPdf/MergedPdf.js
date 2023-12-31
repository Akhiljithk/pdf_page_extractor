import React from "react";
import { Document, Page } from "react-pdf";
import './MergedPdf.css'

function MergedPdf(props) {
  return (
    <div className="pdf-container" style={{background:"#eedcff", padding:"5px 16px", marginTop:"11px", marginBottom:"11px"}}> 
      <Document file={props.mergedPdfUrl}>
          {Array.from({ length: props.numPages }, (_, i) => i + 1).map((page) => {
            return (
              <div className="each_merged_pages" key={page}>
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
    </div>
  );
}

export default MergedPdf;
