import React from 'react';
import '../styles/Modal.css';

const Modal = ({ children, title, onConfirm, onCancel, show }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className="modal-header">
                    <h4 className="modal-title">{title}</h4>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-footer">
                    <button onClick={onCancel} className="btn btn-secondary">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="btn btn-primary">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
