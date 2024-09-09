import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-200 p-8 rounded-2xl shadow-neumorph max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Confirm Action</h2>
        <p className="mb-8 text-gray-600">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl shadow-neumorph hover:shadow-neumorph-inset-hover transition-shadow duration-300 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-red-500 text-white rounded-xl shadow-neumorph hover:shadow-neumorph-hover transition-shadow duration-300 focus:outline-none"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};