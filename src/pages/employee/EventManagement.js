import React, { useState, useEffect } from 'react';
import employeeService from '../../services/employeeService';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import '../../styles/EventManagement.css';

const EventManagement = () => {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        duration: '',
        deadline: '',
        number_of_participant: 0,
    });
    const { user } = useAuth();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const response = await employeeService.getEvents();
            setEvents(response.data);
        } catch (err) {
            setError('Failed to fetch events.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await employeeService.createEvent({ ...newEvent, employee: user.id });
            setNewEvent({
                title: '',
                description: '',
                duration: '',
                deadline: '',
                number_of_participant: 0,
            });
            fetchEvents();
        } catch (err) {
            setError('Failed to create event.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await employeeService.updateEvent(editingEvent.id, { ...editingEvent, employee: user.id });
            setEditingEvent(null);
            fetchEvents();
        } catch (err) {
            setError('Failed to update event.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setIsLoading(true);
        try {
            await employeeService.deleteEvent(id);
            fetchEvents();
        } catch (err) {
            setError('Failed to delete event.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e, formType) => {
        const { name, value } = e.target;
        if (formType === 'new') {
            setNewEvent({ ...newEvent, [name]: value });
        } else {
            setEditingEvent({ ...editingEvent, [name]: value });
        }
    };

    return (
        <div className="event-management-container">
            <h1>Employee Event Management</h1>
            {error && <p className="error-message">{error}</p>}

            <Modal
                title="Create New Event"
                onConfirm={handleCreate}
            >
                <form className="event-form">
                    <input name="title" value={newEvent.title} onChange={(e) => handleInputChange(e, 'new')} placeholder="Title" required className="form-input" />
                    <textarea name="description" value={newEvent.description} onChange={(e) => handleInputChange(e, 'new')} placeholder="Description" required className="form-textarea" />
                    <input name="duration" value={newEvent.duration} onChange={(e) => handleInputChange(e, 'new')} placeholder="Duration" required className="form-input" />
                    <input type="datetime-local" name="deadline" value={newEvent.deadline} onChange={(e) => handleInputChange(e, 'new')} required className="form-input" />
                    <input type="number" name="number_of_participant" value={newEvent.number_of_participant} onChange={(e) => handleInputChange(e, 'new')} placeholder="Number of Participants" required className="form-input" />
                </form>
            </Modal>

            <h2>Existing Events</h2>
            {isLoading && <p>Loading...</p>}
            <table className="event-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Duration</th>
                        <th>Deadline</th>
                        <th>Participants</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event) => (
                        <tr key={event.id}>
                            <td>{event.title}</td>
                            <td>{event.description}</td>
                            <td>{event.duration}</td>
                            <td>{new Date(event.deadline).toLocaleString()}</td>
                            <td>{event.number_of_participant}</td>
                            <td>
                                <button onClick={() => setEditingEvent(event)} className="btn btn-secondary">Edit</button>
                                <button onClick={() => handleDelete(event.id)} disabled={isLoading} className="btn btn-danger">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {editingEvent && (
                <Modal
                    title="Edit Event"
                    onConfirm={handleUpdate}
                >
                    <form className="event-form">
                        <input name="title" value={editingEvent.title} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Title" required className="form-input" />
                        <textarea name="description" value={editingEvent.description} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Description" required className="form-textarea" />
                        <input name="duration" value={editingEvent.duration} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Duration" required className="form-input" />
                        <input type="datetime-local" name="deadline" value={editingEvent.deadline} onChange={(e) => handleInputChange(e, 'edit')} required className="form-input" />
                        <input type="number" name="number_of_participant" value={editingEvent.number_of_participant} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Number of Participants" required className="form-input" />
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default EventManagement;
