import './ConfirmModal.css';

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Delete', confirmColor = 'danger' }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel} role="dialog" aria-modal="true">
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{title || 'Confirm Action'}</h3>
        <p className="modal-message">{message || 'Are you sure you want to proceed?'}</p>
        <div className="modal-actions">
          <button type="button" className="btn-modal-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className={`btn-modal-confirm btn-${confirmColor}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
