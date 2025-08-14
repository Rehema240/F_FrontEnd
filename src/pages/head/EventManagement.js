import React, { useState, useEffect } from 'react';
import headService from '../../services/headService';
import Modal from '../../components/Modal';
import Swal from 'sweetalert2';
import EditIcon from '../../components/EditIcon';
import DeleteIcon from '../../components/DeleteIcon';
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

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const response = await headService.getEvents();
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
            await headService.createEvent(newEvent);
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
            setIsCreateModalOpen(false);
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
            await headService.updateEvent(editingEvent.id, editingEvent);
            setEditingEvent(null);
            fetchEvents();
        } catch (err) {
            setError('Failed to update event.');
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
                    await headService.deleteEvent(id);
                    fetchEvents();
                    Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                    )
                } catch (err) {
                    setError('Failed to delete event.');
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            }
        })
    };

    const handleInputChange = (e, formType) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        if (formType === 'new') {
            setNewEvent({ ...newEvent, [name]: val });
        } else {
            setEditingEvent({ ...editingEvent, [name]: val });
        }
    };

    return (
        <div>
            <h1>Head Event Management</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button onClick={() => setIsCreateModalOpen(true)}>Create New Event</button>

            {isCreateModalOpen && (
                <Modal
                    title="Create New Event"
                    onConfirm={handleCreate}
                    onClose={() => setIsCreateModalOpen(false)}
                >
                    <form className="event-form">
                        <input name="title" value={newEvent.title} onChange={(e) => handleInputChange(e, 'new')} placeholder="Title" required className="form-input" />
                        <textarea name="description" value={newEvent.description} onChange={(e) => handleInputChange(e, 'new')} placeholder="Description" required className="form-textarea" />
                        <input name="location" value={newEvent.location} onChange={(e) => handleInputChange(e, 'new')} placeholder="Location" required className="form-input" />
                        <input name="department" value={newEvent.department} onChange={(e) => handleInputChange(e, 'new')} placeholder="Department" required className="form-input" />
                        <input type="datetime-local" name="start_time" value={newEvent.start_time} onChange={(e) => handleInputChange(e, 'new')} required className="form-input" />
                        <input type="datetime-local" name="end_time" value={newEvent.end_time} onChange={(e) => handleInputChange(e, 'new')} required className="form-input" />
                        <input type="number" name="capacity" value={newEvent.capacity} onChange={(e) => handleInputChange(e, 'new')} placeholder="Capacity" required className="form-input" />
                        <label>
                            <input type="checkbox" name="is_public" checked={newEvent.is_public} onChange={(e) => handleInputChange(e, 'new')} />
                            Public
                        </label>
                    </form>
                </Modal>
            )}

            <h2>Existing Events</h2>
            {isLoading && <p>Loading...</p>}
            <table className="event-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Location</th>
                        <th>Department</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Capacity</th>
                        <th>Public</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event) => (
                        <tr key={event.id}>
                            <td>{event.title}</td>
                            <td>{event.location}</td>
                            <td>{event.department}</td>
                            <td>{new Date(event.start_time).toLocaleString()}</td>
                            <td>{new Date(event.end_time).toLocaleString()}</td>
                            <td>{event.capacity}</td>
                            <td>{event.is_public ? 'Yes' : 'No'}</td>
                            <td>
                                <EditIcon onClick={() => setEditingEvent({
                                    ...event,
                                    start_time: new Date(event.start_time).toISOString().slice(0, 16),
                                    end_time: new Date(event.end_time).toISOString().slice(0, 16)
                                })} />
                                <DeleteIcon onClick={() => handleDelete(event.id)} disabled={isLoading} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {editingEvent && (
                <Modal
                    title="Edit Event"
                    onConfirm={handleUpdate}
                    onClose={() => setEditingEvent(null)}
                >
                    <form className="event-form">
                        <input name="title" value={editingEvent.title} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Title" required className="form-input" />
                        <textarea name="description" value={editingEvent.description} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Description" required className="form-textarea" />
                        <input name="location" value={editingEvent.location} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Location" required className="form-input" />
                        <input name="department" value={editingEvent.department} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Department" required className="form-input" />
                        <input type="datetime-local" name="start_time" value={editingEvent.start_time} onChange={(e) => handleInputChange(e, 'edit')} required className="form-input" />
                        <input type="datetime-local" name="end_time" value={editingEvent.end_time} onChange={(e) => handleInputChange(e, 'edit')} required className="form-input" />
                        <input type="number" name="capacity" value={editingEvent.capacity} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Capacity" required className="form-input" />
                        <label>
                            <input type="checkbox" name="is_public" checked={editingEvent.is_public} onChange={(e) => handleInputChange(e, 'edit')} />
                            Public
                        </label>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default EventManagement;
