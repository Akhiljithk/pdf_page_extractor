import React from 'react';
import PdfComp from './components/PdfComp/PdfComp';
import UploadPdf from './components/UploadPdf/UploadPdf';
import { PdfDataProvider } from './PdfDataContext';
import './App.css';

function App() {
  return (
    <div className="App">
      <PdfDataProvider>
        <UploadPdf />
        <PdfComp />
      </PdfDataProvider>
    </div>
  );
}

export default App;
