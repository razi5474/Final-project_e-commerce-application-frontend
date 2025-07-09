import React from 'react';

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-base-100 p-6 rounded-lg w-80 text-center space-y-4 shadow-xl">
        <h3 className="text-lg font-semibold">Confirm</h3>
        <p className="text-sm">{message}</p>
        <div className="flex justify-center gap-3 pt-2">
          <button onClick={onCancel} className="btn btn-sm btn-outline">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-sm btn-error text-white">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
