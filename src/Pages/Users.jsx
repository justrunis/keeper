import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { variables } from '../Variables';
import { makeDeleteRequest, makeGetRequest, makePatchRequest } from '../DatabaseRequests';
import { getUserRole } from '../Auth/Auth';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

const Users = (props) => {
    const { token } = props;
    const [users, setUsers] = useState([]);
    const [sortColumn, setSortColumn] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const role = getUserRole(token);
    if (role !== 'admin') {
        window.location.href = '/home';
    }

    useEffect(() => {
        const getUsers = async () => {
            const URL = variables.API_URL + 'getAllUsers';
            const data = await makeGetRequest(URL);
            setUsers(data);
        };
        if (token) {
            getUsers();
        }
    }, [token]);

    function formatDate(date, needsTime) {
        if (needsTime) {
            return date ? new Date(date).toLocaleString() : '';
        }
        return date ? new Date(date).toLocaleDateString() : '';
    }

    function formatToUpperCase(string) {
        return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
    }

    function handleSort(columnName) {
        if (sortColumn === columnName) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(columnName);
            setSortOrder('asc');
        }
    }

    async function handleEditUser() {
        if (selectedUser) {
            const URL = variables.API_URL + 'updateUser/' + selectedUser.id;
            await makePatchRequest(URL, selectedUser);
            setShowEditModal(false);
            const updatedUsers = await makeGetRequest(variables.API_URL + 'getAllUsers');
            setUsers(updatedUsers);
        }
    }

    async function handleDeleteUser(id) {
        console.log('id', id);
        if(id){
            const URL = variables.API_URL + 'deleteUser/' + id;
            await makeDeleteRequest(URL);
            const updatedUsers = await makeGetRequest(variables.API_URL + 'getAllUsers');
            setUsers(updatedUsers);
            // await makeDeleteRequest(URL);
            // const updatedUsers = await makeGetRequest(variables.API_URL + 'getAllUsers');
            // setUsers(updatedUsers);
        }
    }

    return (
        <div>
            <Header token={token} />
            <h1 className='text-center my-3'>All users</h1>
            <div className='d-flex justify-content-center container'>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('username')}>Username</th>
                            <th onClick={() => handleSort('email')}>Email</th>
                            <th onClick={() => handleSort('gender')}>Gender</th>
                            <th onClick={() => handleSort('role')}>Role</th>
                            <th onClick={() => handleSort('date_of_birth')}>Date of Birth</th>
                            <th onClick={() => handleSort('created_at')}>Created At</th>
                            <th onClick={() => handleSort('updated_at')}>Updated At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{formatToUpperCase(user.gender)}</td>
                                <td>{formatToUpperCase(user.role)}</td>
                                <td>{formatDate(user.date_of_birth)}</td>
                                <td>{formatDate(user.created_at, true)}</td>
                                <td>{formatDate(user.updated_at, true)}</td>
                                <td>
                                    <div className='d-flex justify-content-around'>
                                        <button className='btn btn-primary mx-1' onClick={() => {setSelectedUser(user); setShowEditModal(true)}}>Edit</button>
                                        <button className='btn btn-danger mx-1' onClick={() => {
                                            if (window.confirm(`Are you sure you want to remove the user ${user.username}?`)) {
                                                handleDeleteUser(user.id);
                                            }
                                        }}>Remove</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <Footer />

            {/* Edit User Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <Form>
                            <Form.Group controlId="formUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" name="username" value={selectedUser.username} disabled />
                            </Form.Group>
                            <Form.Group controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" name="email" value={selectedUser.email} disabled />
                            </Form.Group>
                            <Form.Group controlId="formGender">
                                <Form.Label>Gender</Form.Label>
                                <Form.Control as="select" name="gender" value={selectedUser.gender} onChange={(e) => setSelectedUser({ ...selectedUser, gender: e.target.value })}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formDateOfBirth">
                                <Form.Label>Date of Birth</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="date_of_birth"
                                    value={selectedUser.date_of_birth ? selectedUser.date_of_birth.split('T')[0] : ''}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, date_of_birth: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formRole">
                                <Form.Label>Role</Form.Label>
                                <Form.Control as="select" name="role" value={selectedUser.role} onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-secondary' onClick={() => setShowEditModal(false)}>Close</button>
                    <button className='btn btn-primary' onClick={handleEditUser}>Save</button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Users;
