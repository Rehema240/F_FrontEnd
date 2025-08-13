import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import adminService from '../../services/adminService';
import EditIcon from '../../components/EditIcon';
import DeleteIcon from '../../components/DeleteIcon';
import '../../styles/OpportunityManagement.css';

const OpportunityManagement = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [editingOpportunity, setEditingOpportunity] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newOpportunity, setNewOpportunity] = useState({
        title: '',
        description: '',
        link: '',
        department: '',
    });

    useEffect(() => {
        fetchOpportunities();
    }, []);

    const fetchOpportunities = async () => {
        setIsLoading(true);
        try {
            const response = await adminService.getAllOpportunities();
            setOpportunities(response.data);
        } catch (err) {
            setError('Failed to fetch opportunities.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async () => {
        setIsLoading(true);
        try {
            await adminService.createOpportunity(newOpportunity);
            setNewOpportunity({
                title: '',
                description: '',
                link: '',
                department: '',
            });
            setShowCreateModal(false);
            fetchOpportunities();
            Swal.fire('Success!', 'Opportunity created successfully.', 'success');
        } catch (err) {
            setError('Failed to create opportunity.');
            console.error(err);
            Swal.fire('Error!', 'Failed to create opportunity.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async () => {
        setIsLoading(true);
        try {
            await adminService.updateOpportunity(editingOpportunity.id, editingOpportunity);
            setEditingOpportunity(null);
            fetchOpportunities();
            Swal.fire('Success!', 'Opportunity updated successfully.', 'success');
        } catch (err) {
            setError('Failed to update opportunity.');
            console.error(err);
            Swal.fire('Error!', 'Failed to update opportunity.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsLoading(true);
                try {
                    await adminService.deleteOpportunity(id);
                    fetchOpportunities();
                    Swal.fire(
                        'Deleted!',
                        'The opportunity has been deleted.',
                        'success'
                    );
                } catch (err) {
                    setError('Failed to delete opportunity.');
                    console.error(err);
                    Swal.fire(
                        'Error!',
                        'Failed to delete opportunity.',
                        'error'
                    );
                } finally {
                    setIsLoading(false);
                }
            }
        });
    };

    const handleInputChange = (e, formType) => {
        const { name, value } = e.target;
        if (formType === 'new') {
            setNewOpportunity({ ...newOpportunity, [name]: value });
        } else {
            setEditingOpportunity({ ...editingOpportunity, [name]: value });
        }
    };

    return (
        <div className="opportunity-management-container">
            <h1>Admin Opportunity Management</h1>
            {error && <p className="error-message">{error}</p>}

            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">Create New Opportunity</button>

            <Modal
                title="Create New Opportunity"
                show={showCreateModal}
                onConfirm={handleCreate}
                onCancel={() => setShowCreateModal(false)}
            >
                <form className="opportunity-form">
                    <input name="title" value={newOpportunity.title} onChange={(e) => handleInputChange(e, 'new')} placeholder="Title" required className="form-input" />
                    <textarea name="description" value={newOpportunity.description} onChange={(e) => handleInputChange(e, 'new')} placeholder="Description" required className="form-textarea" />
                    <input name="link" value={newOpportunity.link} onChange={(e) => handleInputChange(e, 'new')} placeholder="Link" required className="form-input" />
                    <select name="department" value={newOpportunity.department} onChange={(e) => handleInputChange(e, 'new')} required className="form-input">
                        <option value="">Select Department</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Health">Health</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Art">Art</option>
                        <option value="Business">Business</option>
                        <option value="Mining">Mining</option>
                        <option value="Other">Other</option>
                    </select>
                </form>
            </Modal>

            <h2>Existing Opportunities</h2>
            {isLoading && <LoadingSpinner />}
            {!isLoading && (
                <>
                    <table className="opportunity-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Department</th>
                                <th>Link</th>
                                <th>Posted By</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {opportunities.map((opportunity) => (
                                <tr key={opportunity.id}>
                                    <td>{opportunity.title}</td>
                                    <td>{opportunity.department}</td>
                                    <td><a href={opportunity.link} target="_blank" rel="noopener noreferrer">{opportunity.link}</a></td>
                                    <td>{opportunity.posted_by_role}</td>
                                    <td>
                                        <button onClick={() => setEditingOpportunity(opportunity)} className="btn btn-secondary"><EditIcon /></button>
                                        <button onClick={() => handleDelete(opportunity.id)} disabled={isLoading} className="btn btn-danger"><DeleteIcon /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
            {editingOpportunity && (
                <Modal
                    title="Edit Opportunity"
                    show={!!editingOpportunity}
                    onConfirm={handleUpdate}
                    onCancel={() => setEditingOpportunity(null)}
                >
                    <form className="opportunity-form">
                        <input name="title" value={editingOpportunity.title} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Title" required className="form-input" />
                        <textarea name="description" value={editingOpportunity.description} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Description" required className="form-textarea" />
                        <input name="link" value={editingOpportunity.link} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Link" required className="form-input" />
                        <select name="department" value={editingOpportunity.department} onChange={(e) => handleInputChange(e, 'edit')} required className="form-input">
                            <option value="">Select Department</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Health">Health</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Art">Art</option>
                            <option value="Business">Business</option>
                            <option value="Mining">Mining</option>
                            <option value="Other">Other</option>
                        </select>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default OpportunityManagement;
