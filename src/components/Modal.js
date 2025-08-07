import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Modal = ({ title, children, onConfirm, onCancel }) => {
    const showModal = () => {
        MySwal.fire({
            title: title,
            html: children,
            showCancelButton: true,
            confirmButtonText: 'Create',
            cancelButtonText: 'Cancel',
            preConfirm: () => {
                onConfirm();
            },
        });
    };

    return (
        <button onClick={showModal} className="btn btn-primary">
            Create New
        </button>
    );
};

export default Modal;
