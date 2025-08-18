import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import DeleteIcon from '../../components/DeleteIcon';
import EditIcon from '../../components/EditIcon';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService';
import '../../styles/EventManagement.css';

const EventManagement = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [editingEvent, setEditingEvent] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showOnlyMine, setShowOnlyMine] = useState(false);
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
    
    // Filter events based on the showOnlyMine setting
    useEffect(() => {
        if (!events.length) {
            setFilteredEvents([]);
            return;
        }
        
        if (showOnlyMine && user) {
            setFilteredEvents(events.filter(event => event.creator_id === user.id));
        } else {
            setFilteredEvents(events);
        }
    }, [events, showOnlyMine, user]);

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const response = await adminService.getAllEvents();
            setEvents(response.data);
        } catch (err) {
            setError('Failed to fetch events.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async () => {
        setIsLoading(true);
        try {
            await adminService.createEvent(newEvent);
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
            setShowCreateModal(false);
            fetchEvents();
            Swal.fire('Success!', 'Event created successfully.', 'success');
        } catch (err) {
            setError('Failed to create event.');
            console.error(err);
            Swal.fire('Error!', 'Failed to create event.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async () => {
        setIsLoading(true);
        try {
            await adminService.updateEvent(editingEvent.id, editingEvent);
            setEditingEvent(null);
            fetchEvents();
            Swal.fire('Success!', 'Event updated successfully.', 'success');
        } catch (err) {
            setError('Failed to update event.');
            console.error(err);
            Swal.fire('Error!', 'Failed to update event.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        // Find the event to be deleted
        const eventToDelete = events.find(event => event.id === id);
        
        // Since admins can now delete any event, we don't need to check if they are the creator
        // The isCreator check is just used for UI highlighting purposes now
        const isCreator = user && eventToDelete && user.id === eventToDelete.creator_id;
        
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
                    console.log(`Attempting to delete event with ID: ${id}`);
                    await adminService.deleteEvent(id);
                    fetchEvents();
                    Swal.fire(
                        'Deleted!',
                        'The event has been deleted.',
                        'success'
                    );
                } catch (err) {
                    console.error('Delete error details:', err);
                    let errorMessage = 'Failed to delete event.';
                    
                    if (err.response) {
                        console.log('Error response:', err.response);
                        if (err.response.status === 403) {
                            errorMessage = 'An unexpected permission error occurred. Please contact the system administrator.';
                        } else if (err.response.data && typeof err.response.data === 'string') {
                            errorMessage = err.response.data;
                        } else if (err.response.data && err.response.data.detail) {
                            errorMessage = err.response.data.detail;
                        }
                    }
                    
                    setError(errorMessage);
                    Swal.fire(
                        'Error!',
                        errorMessage,
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
            setNewEvent({ ...newEvent, [name]: value });
        } else {
            setEditingEvent({ ...editingEvent, [name]: value });
        }
    };

    return (
        <div className="event-management-container">
            <h1>Admin Event Management</h1>
            {error && <p className="error-message">{error}</p>}
            
            

            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">Create New Event</button>

            <Modal
                title="Create New Event"
                show={showCreateModal}
                onConfirm={handleCreate}
                onCancel={() => setShowCreateModal(false)}
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h2>Existing Events</h2>
                <div>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input 
                            type="checkbox" 
                            checked={showOnlyMine} 
                            onChange={(e) => setShowOnlyMine(e.target.checked)}
                            style={{ marginRight: '5px' }}
                        />
                        Show only my events
                    </label>
                </div>
            </div>
            {isLoading && <LoadingSpinner />}
            {!isLoading && filteredEvents.length === 0 && (
                <p>No events found. {showOnlyMine ? "You haven't created any events yet." : ""}</p>
            )}
            {!isLoading && filteredEvents.length > 0 && (
            <table className="event-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Department</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Capacity</th>
                        <th>Public</th>
                        <th>Creator</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEvents.map((event) => {
                        const isCreator = user && user.id === event.creator_id;
                        return (
                            <tr key={event.id} style={isCreator ? {background: 'rgba(200, 255, 200, 0.1)'} : {}}>
                                <td>{event.title}</td>
                                <td>{event.department}</td>
                                <td>{new Date(event.start_time).toLocaleString()}</td>
                                <td>{new Date(event.end_time).toLocaleString()}</td>
                                <td>{event.capacity}</td>
                                <td>{event.is_public ? 'Yes' : 'No'}</td>
                                <td>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                                        {event.creator_role}
                                        {isCreator && 
                                            <span style={{
                                                background: '#28a745', 
                                                color: 'white', 
                                                padding: '1px 5px', 
                                                borderRadius: '3px',
                                                fontSize: '0.7em'
                                            }}>
                                                You
                                            </span>
                                        }
                                    </div>
                                    {event.creator_id && 
                                        <span 
                                            title={`Creator ID: ${event.creator_id}`} 
                                            style={{fontSize: '0.8em', display: 'block', color: isCreator ? '#28a745' : 'inherit'}}
                                        >
                                            ID: {event.creator_id.substring(0, 8)}...
                                        </span>
                                    }
                                </td>
                                <td>
                                    <button onClick={() => setEditingEvent(event)} className="btn btn-secondary" title="Edit event">
                                        <EditIcon />
                                    </button>
                                    {/* Check if current user is the creator or has same role as creator */}
                                    <button 
                                        onClick={() => handleDelete(event.id)} 
                                        disabled={isLoading} 
                                        className="btn btn-danger"
                                        title={isCreator ? "Delete your event" : "Delete this event (admin privilege)"}
                                    >
                                        <DeleteIcon />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            )}
            {editingEvent && (
                <Modal
                    title="Edit Event"
                    show={!!editingEvent}
                    onConfirm={handleUpdate}
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
