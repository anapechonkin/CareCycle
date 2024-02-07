const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {children}
          <div className="text-right mt-4">
            <button
              onClick={onClose}
              className="bg-black hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default Modal;