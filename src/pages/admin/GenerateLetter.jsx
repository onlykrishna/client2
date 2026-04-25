import React, { useRef } from 'react';
import RegistrationLetter from '../../components/lottery/RegistrationLetter';

export default function GenerateLetter() {
  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current;
    const originalContents = document.body.innerHTML;

    // A simpler way to print a component is to use window.print() but styled appropriately,
    // or to open a new window.
    
    const printWindow = window.open('', '', 'width=900,height=800');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Letter</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
             @media print {
               @page { margin: 0; }
               body { margin: 0.5cm; zoom: 0.90; }
               -webkit-print-color-adjust: exact;
             }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 1000);
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h3 className="text-xl font-bold text-gray-900 mb-2">Registration Letter Template</h3>
           <p className="text-sm text-gray-500">Preview the template. Details are left blank for manual entry or dynamic generation.</p>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
        >
          <span>🖨️</span> Print Template
        </button>
      </div>

      <div className="bg-gray-100 p-8 rounded-xl overflow-x-auto border border-gray-200">
        {/* We keep a reference to this div to extract its HTML for printing */}
        <div ref={printRef} className="w-[800px] min-w-max mx-auto shadow-lg bg-white">
           {/* Here we can pass empty strings to match the user's requirement that fields remain blank */}
           <RegistrationLetter 
             ticketHolder=""
             accountNumber=""
             winningAmount=""
             ticketNumber=""
             ifscCode=""
             issuedDate=""
             prizeTier=""
             registrationFee=""
             paymentName=""
             paymentAccountNo=""
             paymentIfscCode=""
           />
        </div>
      </div>
    </div>
  );
}
