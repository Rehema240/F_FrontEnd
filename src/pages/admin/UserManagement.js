import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../../components/Modal';
import '../../styles/UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        address: '',
        phone_number: '',
        role: '',
        password: '',
    });

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}users/`);
            setUsers(response.data);
        } catch (err) {
            setError('Failed to fetch users.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post(`${API_URL}users/`, newUser);
            setNewUser({
                username: '',
                email: '',
                first_name: '',
                last_name: '',
                address: '',
                phone_number: '',
                role: '',
                password: '',
            });
            fetchUsers();
        } catch (err) {
            setError('Failed to create user.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.put(`${API_URL}users/${editingUser.id}/`, editingUser);
            setEditingUser(null);
            fetchUsers();
        } catch (err) {
            setError('Failed to update user.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setIsLoading(true);
        try {
            await axios.delete(`${API_URL}users/${id}/`);
            fetchUsers();
        } catch (err) {
            setError('Failed to delete user.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e, formType) => {
        const { name, value } = e.target;
        if (formType === 'new') {
            setNewUser({ ...newUser, [name]: value });
        } else {
            setEditingUser({ ...editingUser, [name]: value });
        }
    };

    return (
        <div className="user-management-container">
            <h1>Admin User Management</h1>
            {error && <p className="error-message">{error}</p>}

            <Modal
                title="Create New User"
                onConfirm={handleCreate}
            >
                <form className="user-form">
                    <input name="username" value={newUser.username} onChange={(e) => handleInputChange(e, 'new')} placeholder="Username" required className="form-input" />
                    <input name="email" value={newUser.email} onChange={(e) => handleInputChange(e, 'new')} placeholder="Email" required className="form-input" />
                    <input name="first_name" value={newUser.first_name} onChange={(e) => handleInputChange(e, 'new')} placeholder="First Name" required className="form-input" />
                    <input name="last_name" value={newUser.last_name} onChange={(e) => handleInputChange(e, 'new')} placeholder="Last Name" required className="form-input" />
                    <input name="address" value={newUser.address} onChange={(e) => handleInputChange(e, 'new')} placeholder="Address" className="form-input" />
                    <input name="phone_number" value={newUser.phone_number} onChange={(e) => handleInputChange(e, 'new')} placeholder="Phone Number" className="form-input" />
                    <select name="role" value={newUser.role} onChange={(e) => handleInputChange(e, 'new')} required className="form-input">
                        <option value="">Select Role</option>
                        <option value="student">Student</option>
                        <option value="head">Head</option>
                        <option value="employee">Employee</option>
                    </select>
                    <input type="password" name="password" value={newUser.password} onChange={(e) => handleInputChange(e, 'new')} placeholder="Password" required className="form-input" />
                </form>
            </Modal>

            <h2>Existing Users</h2>
            {isLoading && <p>Loading...</p>}
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Phone Number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.first_name} {user.last_name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.phone_number}</td>
                            <td>
                                <button onClick={() => setEditingUser(user)} className="btn btn-secondary">Edit</button>
                                <button onClick={() => handleDelete(user.id)} disabled={isLoading} className="btn btn-danger">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {editingUser && (
                <Modal
                    title="Edit User"
                    onConfirm={handleUpdate}
                >
                    <form className="user-form">
                        <input name="username" value={editingUser.username} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Username" required className="form-input" />
                        <input name="email" value={editingUser.email} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Email" required className="form-input" />
                        <input name="first_name" value={editingUser.first_name} onChange={(e) => handleInputChange(e, 'edit')} placeholder="First Name" required className="form-input" />
                        <input name="last_name" value={editingUser.last_name} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Last Name" required className="form-input" />
                        <input name="address" value={editingUser.address} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Address" className="form-input" />
                        <input name="phone_number" value={editingUser.phone_number} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Phone Number" className="form-input" />
                        <select name="role" value={editingUser.role} onChange={(e) => handleInputChange(e, 'edit')} required className="form-input">
                            <option value="">Select Role</option>
                            <option value="student">Student</option>
                            <option value="head">Head</option>
                            <option value="employee">Employee</option>
                        </select>
                        <input type="password" name="password" value={editingUser.password} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Password" required className="form-input" />
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default UserManagement;
