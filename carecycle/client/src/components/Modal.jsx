import React from 'react';
import DOMPurify from 'dompurify';

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  children,
  htmlContent,
  showOkButton = true,
  okButtonText = 'OK', // Default OK button text
  showCancelButton = false, // Not showing a cancel button by default
  cancelButtonText = 'Cancel', // Default cancel button text
}) => {
  if (!isOpen) return null;

  const cleanHTML = htmlContent ? DOMPurify.sanitize(htmlContent) : null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose(); // Fallback to onClose if no onConfirm is provided
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-white max-w-lg w-full mx-auto p-6 rounded-lg shadow-xl" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        {cleanHTML ? (
          <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />
        ) : (
          children
        )}
        <div className="text-right mt-4 space-x-2">
          {showCancelButton && (
            <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded transition duration-150 ease-in-out">
              {cancelButtonText}
            </button>
          )}
          {showOkButton && (
            <button onClick={handleConfirm} className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out">
              {okButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
