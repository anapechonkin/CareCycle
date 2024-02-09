import React from 'react';
import DOMPurify from 'dompurify';

const Modal = ({
  isOpen,
  onClose,
  children,
  htmlContent,
  showOkButton = true,
  buttonText = 'OK' // Default button text is "OK"
}) => {
  if (!isOpen) return null;

  // Sanitize the HTML content if present
  const cleanHTML = htmlContent ? DOMPurify.sanitize(htmlContent) : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-white max-w-lg w-full mx-auto p-6 rounded-lg shadow-xl" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        {cleanHTML ? (
          <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />
        ) : (
          children
        )}
        {showOkButton && (
          <div className="text-right mt-4">
            <button onClick={onClose} className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out">
              {buttonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
