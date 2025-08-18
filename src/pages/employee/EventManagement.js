import { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import employeeService from '../../services/employeeService';
import '../../styles/EventManagement.css';

const EventManagement = () => {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        location: '',
        department: '',
        start_time: '',
        end_time: '',
        capacity: 0,
        is_public: true,
    });
    const { user } = useAuth();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            // Use getMyEvents to get only events created by the current employee
            const response = await employeeService.getMyEvents();
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
                location: '',
                department: '',
                start_time: '',
                end_time: '',
                capacity: 0,
                is_public: true,
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
            
            <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary">Create New Event</button>

            <Modal
                title="Create New Event"
                onConfirm={handleCreate}
                show={isCreateModalOpen}
                onCancel={() => setIsCreateModalOpen(false)}
            >
                <form className="event-form">
                    <input name="title" value={newEvent.title} onChange={(e) => handleInputChange(e, 'new')} placeholder="Title" required className="form-input" />
                    <textarea name="description" value={newEvent.description} onChange={(e) => handleInputChange(e, 'new')} placeholder="Description" required className="form-textarea" />
                    <input name="location" value={newEvent.location} onChange={(e) => handleInputChange(e, 'new')} placeholder="Location" required className="form-input" />
                    <select name="department" value={newEvent.department} onChange={(e) => handleInputChange(e, 'new')} required className="form-input">
                        <option value="">Select Department</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Health">Health</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Art">Art</option>
                        <option value="Business">Business</option>
                        <option value="Mining">Mining</option>
                        <option value="Other">Other</option>
                    </select>
                    <input type="datetime-local" name="start_time" value={newEvent.start_time} onChange={(e) => handleInputChange(e, 'new')} required className="form-input" />
                    <input type="datetime-local" name="end_time" value={newEvent.end_time} onChange={(e) => handleInputChange(e, 'new')} required className="form-input" />
                    <input type="number" name="capacity" value={newEvent.capacity} onChange={(e) => handleInputChange(e, 'new')} placeholder="Capacity" required className="form-input" />
                    <label>
                        <input type="checkbox" name="is_public" checked={newEvent.is_public} onChange={(e) => setNewEvent({ ...newEvent, is_public: e.target.checked })} />
                        Public
                    </label>
                </form>
            </Modal>

            <h2>Existing Events</h2>
            {isLoading && <p>Loading...</p>}
            <table className="event-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Department</th>
                        <th>Location</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Capacity</th>
                        <th>Confirmations</th>
                        <th>Public</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event) => (
                        <tr key={event.id}>
                            <td>{event.title}</td>
                            <td>{event.department}</td>
                            <td>{event.location}</td>
                            <td>{new Date(event.start_time).toLocaleString()}</td>
                            <td>{new Date(event.end_time).toLocaleString()}</td>
                            <td>{event.capacity}</td>
                            <td>{event.confirmation_count || 0}</td>
                            <td>{event.is_public ? 'Yes' : 'No'}</td>
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
                    show={!!editingEvent}
                    onCancel={() => setEditingEvent(null)}
                >
                    <form className="event-form">
                        <input name="title" value={editingEvent.title} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Title" required className="form-input" />
                        <textarea name="description" value={editingEvent.description} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Description" required className="form-textarea" />
                        <input name="location" value={editingEvent.location} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Location" required className="form-input" />
                        <select name="department" value={editingEvent.department} onChange={(e) => handleInputChange(e, 'edit')} required className="form-input">
                            <option value="">Select Department</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Health">Health</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Art">Art</option>
                            <option value="Business">Business</option>
                            <option value="Mining">Mining</option>
                            <option value="Other">Other</option>
                        </select>
                        <input type="datetime-local" name="start_time" value={editingEvent.start_time} onChange={(e) => handleInputChange(e, 'edit')} required className="form-input" />
                        <input type="datetime-local" name="end_time" value={editingEvent.end_time} onChange={(e) => handleInputChange(e, 'edit')} required className="form-input" />
                        <input type="number" name="capacity" value={editingEvent.capacity} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Capacity" required className="form-input" />
                        <label>
                            <input type="checkbox" name="is_public" checked={editingEvent.is_public} onChange={(e) => setEditingEvent({ ...editingEvent, is_public: e.target.checked })} />
                            Public
                        </label>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default EventManagement;
