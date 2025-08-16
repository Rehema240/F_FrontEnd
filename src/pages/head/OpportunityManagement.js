import React, { useState, useEffect } from 'react';
import headService from '../../services/headService';
import Modal from '../../components/Modal';
import Swal from 'sweetalert2';
import EditIcon from '../../components/EditIcon';
import DeleteIcon from '../../components/DeleteIcon';
import '../../styles/OpportunityManagement.css';

const OpportunityManagement = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [editingOpportunity, setEditingOpportunity] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
            const response = await headService.getOpportunities();
            setOpportunities(response.data);
        } catch (err) {
            setError('Failed to fetch opportunities.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await headService.createOpportunity(newOpportunity);
            setNewOpportunity({
                title: '',
                description: '',
                link: '',
                department: '',
            });
            setIsCreateModalOpen(false);
            fetchOpportunities();
            Swal.fire('Success!', 'Opportunity created successfully.', 'success');
        } catch (err) {
            setError('Failed to create opportunity.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await headService.updateOpportunity(editingOpportunity.id, editingOpportunity);
            setEditingOpportunity(null);
            fetchOpportunities();
            Swal.fire('Success!', 'Opportunity updated successfully.', 'success');
        } catch (err) {
            setError('Failed to update opportunity.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = (id) => {
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
                    await headService.deleteOpportunity(id);
                    fetchOpportunities();
                    Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                    )
                } catch (err) {
                    setError('Failed to delete opportunity.');
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            }
        })
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
            <h1>Head Opportunity Management</h1>
            {error && <p className="error-message">{error}</p>}

            {isCreateModalOpen && (
                <Modal
                    title="Create New Opportunity"
                    onConfirm={handleCreate}
                    onClose={() => setIsCreateModalOpen(false)}
                >
                    <form className="opportunity-form">
                        <input name="title" value={newOpportunity.title} onChange={(e) => handleInputChange(e, 'new')} placeholder="Title" required className="form-input" />
                        <textarea name="description" value={newOpportunity.description} onChange={(e) => handleInputChange(e, 'new')} placeholder="Description" required className="form-textarea" />
                        <input name="link" value={newOpportunity.link} onChange={(e) => handleInputChange(e, 'new')} placeholder="Link" required className="form-input" />
                        <select name="department" value={newOpportunity.department} onChange={(e) => handleInputChange(e, 'new')} className="form-input">
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

            <h2>Existing Opportunities</h2>
            {isLoading && <p>Loading...</p>}
            <table className="opportunity-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Department</th>
                        <th>Link</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {opportunities.map((opportunity) => (
                        <tr key={opportunity.id}>
                            <td>{opportunity.title}</td>
                            <td>{opportunity.department}</td>
                            <td><a href={opportunity.link} target="_blank" rel="noopener noreferrer">{opportunity.link}</a></td>
                            <td>
                                <EditIcon onClick={() => setEditingOpportunity({...opportunity})} />
                                <DeleteIcon onClick={() => handleDelete(opportunity.id)} disabled={isLoading} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {editingOpportunity && (
                <Modal
                    title="Edit Opportunity"
                    onConfirm={handleUpdate}
                    onClose={() => setEditingOpportunity(null)}
                >
                    <form className="opportunity-form">
                        <input name="title" value={editingOpportunity.title} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Title" required className="form-input" />
                        <textarea name="description" value={editingOpportunity.description} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Description" required className="form-textarea" />
                        <input name="link" value={editingOpportunity.link} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Link" required className="form-input" />
                        <select name="department" value={editingOpportunity.department} onChange={(e) => handleInputChange(e, 'edit')} className="form-input">
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
