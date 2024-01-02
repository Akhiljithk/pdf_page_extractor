import React from 'react';
import PdfComp from './components/PdfComp/PdfComp';
import UploadPdf from './components/UploadPdf/UploadPdf';
import { PdfDataProvider } from './PdfDataContext';
import './App.css';

function App() {
  return (
    <div className="App">
      <PdfDataProvider>
        {/* input field to upload pdf  */}
        <UploadPdf /> 
        {/* display uploaded and merged pdf  */}
        <PdfComp />
      </PdfDataProvider>
    </div>
  );
}

export default App;
