import React from 'react';

const RegistrationLetter = ({
  ticketHolder = '',
  accountNumber = '',
  winningAmount = '',
  ticketNumber = '',
  ifscCode = '',
  issuedDate = '',
  prizeTier = '',
  registrationFee = '',
  paymentName = '',
  paymentAccountNo = '',
  paymentIfscCode = ''
}) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-4 font-sans text-gray-800">
      {/* Outer Border */}
      <div className="border-4 border-yellow-500 p-2 relative">
        {/* Inner Border */}
        <div className="border border-yellow-500 p-6 relative">
          
          {/* Header Section */}
          <div className="flex items-center justify-between mb-4">
            {/* Logo placeholder (Top Left) */}
            <div className="w-24 h-24 flex-shrink-0">
              {/* Replace with actual logo path if available */}
              <img 
                src="/logo.png" 
                alt="Kerala Lottery Logo" 
                className="w-full h-full object-contain bg-green-800 rounded-full p-2"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://via.placeholder.com/150/006400/FFFFFF?text=Kerala+Lottery";
                }}
              />
            </div>

            {/* Title */}
            <div className="flex-grow text-center pr-32">
              <h1 className="text-4xl font-bold text-blue-900 tracking-wider mb-2">
                KERALA LOTTERIES
              </h1>
              <h2 className="text-lg font-semibold text-blue-800 tracking-widest uppercase">
                Directorate of Kerala Lotteries
              </h2>
            </div>
          </div>

          {/* Separator / Title */}
          <div className="flex items-center justify-center mb-4 text-gray-400">
            <span className="mr-4">←</span>
            <span className="tracking-[0.3em] font-medium text-sm">LOTTERY REGISTRATION LETTER</span>
            <span className="ml-4">→</span>
          </div>

          {/* Details Box */}
          <div className="border border-gray-300 rounded-md p-4 mb-4">
            <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-sm">
              <div className="flex">
                <span className="text-gray-500 font-medium w-40">TICKET HOLDER:</span>
                <span className="font-bold text-red-600 uppercase border-b border-gray-300 border-dashed flex-grow">{ticketHolder}</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 font-medium w-40">TICKET NUMBER:</span>
                <span className="font-bold text-red-600 border-b border-gray-300 border-dashed flex-grow">{ticketNumber}</span>
              </div>
              
              <div className="flex">
                <span className="text-gray-500 font-medium w-40">ACCOUNT NUMBER:</span>
                <span className="font-bold text-red-600 border-b border-gray-300 border-dashed flex-grow">{accountNumber}</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 font-medium w-40">IFSC CODE:</span>
                <span className="font-bold text-gray-800 border-b border-gray-300 border-dashed flex-grow">{ifscCode}</span>
              </div>

              <div className="flex">
                <span className="text-gray-500 font-medium w-40">WINNING AMOUNT:</span>
                <span className="font-bold text-red-600 border-b border-gray-300 border-dashed flex-grow">{winningAmount}</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 font-medium w-40">ISSUED DATE:</span>
                <span className="font-bold text-red-600 border-b border-gray-300 border-dashed flex-grow">{issuedDate}</span>
              </div>
              
              <div className="flex">
                <span className="text-gray-500 font-medium w-40">PRIZE TIER:</span>
                <span className="font-bold text-red-600 border-b border-gray-300 border-dashed flex-grow">{prizeTier}</span>
              </div>
            </div>
          </div>

          {/* Official Registration Fee Box */}
          <div className="border-2 border-yellow-600 rounded-md py-3 px-6 mb-4 text-center flex items-center justify-center">
            <span className="text-yellow-600 mr-4">~</span>
            <span className="text-xl font-bold text-blue-900 tracking-wide mr-4">
              OFFICIAL REGISTRATION FEE:
            </span>
            <span className="text-2xl font-bold text-blue-900 border-b border-gray-400 border-dashed min-w-[150px] inline-block">
              {registrationFee}
            </span>
            <span className="text-yellow-600 ml-4">~</span>
          </div>

          {/* Letter Content */}
          <div className="mb-4">
            <h3 className="text-blue-900 font-bold text-lg mb-2">Respected Sir/Madam,</h3>
            
            <p className="text-sm font-medium leading-relaxed mb-2">
              This is to inform you that there is a standard transfer process for receiving the lottery winning amount. If
              your winning amount is less than ₹10 lakh, <br />
              <span className="font-bold">no registration fee will be charged.</span>
            </p>
            
            <p className="text-sm font-medium leading-relaxed">
              If the winning amount is ₹10 lakh or more, then the <span className="font-bold">registration fee</span> will be applicable as per rules. After
              completing the required process, the winning amount will be transferred to your bank account shortly.
            </p>
          </div>

          {/* Payment Account Box & Stamp Area */}
          <div className="flex justify-between items-start mb-6">
            {/* Payment Box */}
            <div className="border border-indigo-200 rounded-md p-4 w-1/2 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-2 text-xs text-gray-400 tracking-widest flex items-center">
                <span className="mr-2">←</span>
                PAY AT THIS ACCOUNT:
                <span className="ml-2">→</span>
              </div>
              
              <div className="flex flex-col space-y-3 mt-2 text-sm font-bold text-blue-900">
                <div className="flex">
                  <span className="w-20">Name</span>
                  <span className="mr-2">:</span>
                  <span className="text-red-600 border-b border-gray-300 border-dashed flex-grow">{paymentName}</span>
                </div>
                <div className="flex">
                  <span className="w-20">A/C No</span>
                  <span className="mr-2">:</span>
                  <span className="border-b border-gray-300 border-dashed flex-grow">{paymentAccountNo}</span>
                </div>
                <div className="flex">
                  <span className="w-20">IFSC Code</span>
                  <span className="mr-2">:</span>
                  <span className="border-b border-gray-300 border-dashed flex-grow">{paymentIfscCode}</span>
                </div>
              </div>
            </div>
            {/* Removed stamp space */}
            <div className="w-1/2"></div>
          </div>

          {/* Notes Section */}
          <div className="text-xs text-gray-600">
            <h4 className="font-bold text-gray-400 tracking-widest mb-2 uppercase">Note:</h4>
            <ol className="list-decimal list-inside space-y-1 font-medium">
              <li>Registration fee is applicable for all prize winning tickets.</li>
              <li>No charges will be deducted from the prize money.</li>
              <li>Cash deposit is not allowed as per company rules. Payment should be made only through NEFT / IMPS / GPay / PhonePe / Other.</li>
            </ol>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegistrationLetter;
