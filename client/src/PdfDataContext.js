import React, { createContext, useContext, useState } from 'react';

const PdfDataContext = createContext();

export const PdfDataProvider = ({ children }) => {
  const [pdfData, setPdfData] = useState(null);
  
  const updatePdfData = (data) => {
    setPdfData(data);
  };

  return (
    <PdfDataContext.Provider value={{ pdfData, updatePdfData }}>
      {children}
    </PdfDataContext.Provider>
  );
};

export const usePdfData = () => {
  return useContext(PdfDataContext);
};
