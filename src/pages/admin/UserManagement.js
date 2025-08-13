import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Modal from '../../components/Modal';
import Swal from 'sweetalert2';
import LoadingSpinner from '../../components/LoadingSpinner';
import EditIcon from '../../components/EditIcon';
import DeleteIcon from '../../components/DeleteIcon';
import '../../styles/UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        full_name: '',
        department: '',
        role: '',
        password: '',
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await adminService.getUsers();
            setUsers(response.data);
        } catch (err) {
            setError('Failed to fetch users.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async () => {
        setIsLoading(true);
        try {
            const userData = { ...newUser };
            if (!userData.department) {
                delete userData.department;
            }
            await adminService.createUser(userData);
            setNewUser({
                username: '',
                email: '',
                full_name: '',
                department: '',
                role: '',
                password: '',
            });
            setShowCreateModal(false);
            fetchUsers();
            Swal.fire('Success!', 'User created successfully.', 'success');
        } catch (err) {
            setError('Failed to create user.');
            console.error(err);
            Swal.fire('Error!', 'Failed to create user.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async () => {
        setIsLoading(true);
        try {
            const { id, username, email, full_name, department, role, password } = editingUser;
            const userData = { username, email, full_name, department, role, password };
            await adminService.updateUser(id, userData);
            setEditingUser(null);
            fetchUsers();
            Swal.fire('Success!', 'User updated successfully.', 'success');
        } catch (err) {
            setError('Failed to update user.');
            console.error(err);
            Swal.fire('Error!', 'Failed to update user.', 'error');
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
                    await adminService.deleteUser(id);
                    fetchUsers();
                    Swal.fire(
                        'Deleted!',
                        'Your user has been deleted.',
                        'success'
                    );
                } catch (err) {
                    setError('Failed to delete user.');
                    console.error(err);
                    Swal.fire(
                        'Error!',
                        'Failed to delete user.',
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
            setNewUser({ ...newUser, [name]: value });
        } else {
            setEditingUser({ ...editingUser, [name]: value });
        }
    };

    return (
        <div className="user-management-container">
            <h1>Admin User Management</h1>
            {error && <p className="error-message">{error}</p>}

            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">Create New User</button>

            <Modal
                title="Create New User"
                show={showCreateModal}
                onConfirm={handleCreate}
                onCancel={() => setShowCreateModal(false)}
            >
                <form className="user-form">
                    <input name="username" value={newUser.username} onChange={(e) => handleInputChange(e, 'new')} placeholder="Username" required className="form-input" />
                    <input name="email" value={newUser.email} onChange={(e) => handleInputChange(e, 'new')} placeholder="Email" required className="form-input" />
                    <input name="full_name" value={newUser.full_name} onChange={(e) => handleInputChange(e, 'new')} placeholder="Full Name" required className="form-input" />
                    <select name="department" value={newUser.department} onChange={(e) => handleInputChange(e, 'new')} className="form-input">
                        <option value="">Select Department</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Health">Health</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Art">Art</option>
                        <option value="Business">Business</option>
                        <option value="Mining">Mining</option>
                        <option value="Other">Other</option>
                    </select>
                    <select name="role" value={newUser.role} onChange={(e) => handleInputChange(e, 'new')} required className="form-input">
                        <option value="">Select Role</option>
                        <option value="student">Student</option>
                        <option value="head">Head</option>
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                    </select>
                    <input type="password" name="password" value={newUser.password} onChange={(e) => handleInputChange(e, 'new')} placeholder="Password" required className="form-input" />
                </form>
            </Modal>

            <h2>Existing Users</h2>
            {isLoading && <LoadingSpinner />}
            {!isLoading && (
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Full Name</th>
                        <th>Department</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.full_name}</td>
                            <td>{user.department}</td>
                            <td>{user.role}</td>
                            <td>
                                <button onClick={() => setEditingUser(user)} className="btn btn-secondary"><EditIcon /></button>
                                <button onClick={() => handleDelete(user.id)} disabled={isLoading} className="btn btn-danger"><DeleteIcon /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
            {editingUser && (
                <Modal
                    title="Edit User"
                    show={!!editingUser}
                    onConfirm={handleUpdate}
                    onCancel={() => setEditingUser(null)}
                >
                    <form className="user-form">
                        <input name="username" value={editingUser.username} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Username" required className="form-input" />
                        <input name="email" value={editingUser.email} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Email" required className="form-input" />
                        <input name="full_name" value={editingUser.full_name} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Full Name" required className="form-input" />
                        <select name="department" value={editingUser.department} onChange={(e) => handleInputChange(e, 'edit')} className="form-input">
                            <option value="">Select Department</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Health">Health</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Art">Art</option>
                            <option value="Business">Business</option>
                            <option value="Mining">Mining</option>
                            <option value="Other">Other</option>
                        </select>
                        <select name="role" value={editingUser.role} onChange={(e) => handleInputChange(e, 'edit')} required className="form-input">
                            <option value="">Select Role</option>
                            <option value="student">Student</option>
                            <option value="head">Head</option>
                            <option value="employee">Employee</option>
                            <option value="admin">Admin</option>
                        </select>
                        <input type="password" name="password" value={editingUser.password || ''} onChange={(e) => handleInputChange(e, 'edit')} placeholder="Password" required className="form-input" />
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default UserManagement;
