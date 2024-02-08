const Modal = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-white max-w-lg w-full mx-auto p-6 rounded-lg shadow-xl" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        <div className="text-right mt-4">
          <button
            onClick={onClose}
            className="bg-black hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
