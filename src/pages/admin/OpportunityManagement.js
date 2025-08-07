import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import '../../styles/OpportunityManagement.css';

const OpportunityManagement = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [editingOpportunity, setEditingOpportunity] = useState(null);
    const [newOpportunity, setNewOpportunity] = useState({
        title: '',
        opp_type: '',
        organization: '',
        description: '',
        location: '',
        duration: '',
        deadline: '',
        requirements: '',
        benefits: '',
        contact_email: '',
        app_url: '',
        application_process: '',
    });
    const { user } = useAuth();

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetchOpportunities();
    }, []);

    const fetchOpportunities = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}opportunities/`);
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
            await axios.post(`${API_URL}opportunities/`, { ...newOpportunity, employee: user.id });
            setNewOpportunity({
                title: '',
                opp_type: '',
                organization: '',
                description: '',
                location: '',
                duration: '',
                deadline: '',
                requirements: '',
                benefits: '',
                contact_email: '',
                app_url: '',
                application_process: '',
            });
            fetchOpportunities();
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
            await axios.put(`${API_URL}opportunities/${editingOpportunity.id}/`, { ...editingOpportunity, employee: user.id });
            setEditingOpportunity(null);
            fetchOpportunities();
        } catch (err) {
            setError('Failed to update opportunity.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setIsLoading(true);
        try {
            await axios.delete(`${API_URL}opportunities/${id}/`);
            fetchOpportunities();
        } catch (err) {
            setError('Failed to delete opportunity.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
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

            <Modal
                title="Create New Opportunity"
                onConfirm={handleCreate}
            >
                <form className="opportunity-form">
                    <input name="title" value={newOpportunity.title} onChange={(e) => handleInputChange(e, 'new')} placeholder="Title" required className="form-input" />
                    <select name="opp_type" value={newOpportunity.opp_type} onChange={(e) => handleInputChange(e, 'new')} required className="form-input">
                        <option value="">Select Opportunity Type</option>
                        <option value="Internship">Internship</option>
                        <option value="Job">Job</option>
                        <option value="Scholarship">Scholarship</option>
                        <option value="Conference">Conference</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Volunteer">Volunteer</option>
                        <option value="Other">Other</option>
                    </select>
                    <input name="organization" value={newOpportunity.organization} onChange={(e) => handleInputChange(e, 'new')} placeholder="Organization" required className="form-input" />
                    <textarea name="description" value={newOpportunity.description} onChange={(e) => handleInputChange(e, 'new')} placeholder="Description" required className="form-textarea" />
                    <input name="location" value={newOpportunity.location} onChange={(e) => handleInputChange(e, 'new')} placeholder="Location" required className="form-input" />
                    <input name="duration" value={newOpportunity.duration} onChange={(e) => handleInputChange(e, 'new')} placeholder="Duration" required className="form-input" />
                    <input type="datetime-local" name="deadline" value={newOpportunity.deadline} onChange={(e) => handleInputChange(e, 'new')} required className="form-input" />
                    <textarea name="requirements" value={newOpportunity.requirements} onChange={(e) => handleInputChange(e, 'new')} placeholder="Requirements" required className="form-textarea" />
                    <textarea name="benefits" value={newOpportunity.benefits} onChange={(e) => handleInputChange(e, 'new')} placeholder="Benefits" className="form-textarea" />
                    <input name="contact_email" value={newOpportunity.contact_email} onChange={(e) => handleInputChange(e, 'new')} placeholder="Contact Email" required className="form-input" />
                    <input name="app_url" value={newOpportunity.app_url} onChange={(e) => handleInputChange(e, 'new')} placeholder="Application URL" className="form-input" />
                    <textarea name="application_process" value={newOpportunity.application_process} onChange={(e) => handleInputChange(e, 'new')} placeholder="Application Process" className="form-textarea" />
                </form>
            </Modal>

            <h2>Existing Opportunities</h2>
            {isLoading && <p>Loading...</p>}
            <table className="opportunity-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Organization</th>
                        <th>Deadline</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {opportunities.map((opportunity) => (
                        <tr key={opportunity.id}>
                            <td>{opportunity.title}</td>
                            <td>{opportunity.opp_type}</td>
                            <td>{opportunity.organization}</td>
                            <td>{new Date(opportunity.deadline).toLocaleString()}</td>
                            <td>
                                <button onClick={() => setEditingOpportunity(opportunity)} className="btn btn-secondary">Edit</button>
                                <button onClick={() => handleDelete(opportunity.id)} disabled={isLoading} className="btn btn-danger">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {editingOpportunity && (
                <Modal
                    title="Edit Opportunity"
                    onConfirm={handleUpdate}
                >
                    <form className="opportunity-form">
                        <input name="title" value={editingOpportunity.title} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Title" required className="form-input" />
                        <select name="opp_type" value={editingOpportunity.opp_type} onChange={(e) => handleInputChange(e, 'edit')} required className="form-input">
                            <option value="">Select Opportunity Type</option>
                            <option value="Internship">Internship</option>
                            <option value="Job">Job</option>
                            <option value="Scholarship">Scholarship</option>
                            <option value="Conference">Conference</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Volunteer">Volunteer</option>
                            <option value="Other">Other</option>
                        </select>
                        <input name="organization" value={editingOpportunity.organization} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Organization" required className="form-input" />
                        <textarea name="description" value={editingOpportunity.description} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Description" required className="form-textarea" />
                        <input name="location" value={editingOpportunity.location} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Location" required className="form-input" />
                        <input name="duration" value={editingOpportunity.duration} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Duration" required className="form-input" />
                        <input type="datetime-local" name="deadline" value={editingOpportunity.deadline} onChange={(e) => handleInputChange(e, 'edit')} required className="form-input" />
                        <textarea name="requirements" value={editingOpportunity.requirements} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Requirements" required className="form-textarea" />
                        <textarea name="benefits" value={editingOpportunity.benefits} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Benefits" className="form-textarea" />
                        <input name="contact_email" value={editingOpportunity.contact_email} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Contact Email" required className="form-input" />
                        <input name="app_url" value={editingOpportunity.app_url} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Application URL" className="form-input" />
                        <textarea name="application_process" value={editingOpportunity.application_process} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Application Process" className="form-textarea" />
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default OpportunityManagement;
