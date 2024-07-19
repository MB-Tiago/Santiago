import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle 
} from '@mui/material';
import SidebarAdmin from './SidebarAdmin';
import './ManageUser.css';

function ManageUser() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    userID: '',
    password: '',
    userRole: 'user',
    bankAccount: '',
    agreedToUserAgreement: false
  });
  const [editingUser, setEditingUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://server-two-blue.vercel.app/api/users');
      console.log('API Response:', response.data); // Debug: Log API response
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        userID: form.userID, 
        password: form.password, 
        userRole: form.userRole, 
        bankAccount: form.bankAccount,
        agreedToUserAgreement: form.agreedToUserAgreement
      };

      console.log('Submitting payload:', payload); // Debug: Log payload
      
      if (editingUser) {
        await axios.patch(`https://server-two-blue.vercel.app/api/users/${editingUser._id}`, payload);
      } else {
        await axios.post('https://server-two-blue.vercel.app/api/users', payload);
      }
      
      setForm({
        userID: '',
        password: '',
        userRole: 'user',
        bankAccount: '',
        agreedToUserAgreement: false
      });
      
      setEditingUser(null);
      setOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };

  const handleEdit = (user) => {
    setForm({
      userID: user.userID,
      password: '', // Clear password field for security
      userRole: user.userRole,
      bankAccount: user.bankAccount,
      agreedToUserAgreement: user.agreedToUserAgreement
    });
    setEditingUser(user);
    setOpen(true);
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`https://server-two-blue.vercel.app/api/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.userID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.bankAccount.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manage-user-page">
      <SidebarAdmin />
      <h2>Manage Users</h2>
      <TextField 
        label="Search users" 
        variant="outlined" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        fullWidth 
        margin="normal" 
      />
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Add User
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="userID"
            label="User ID"
            type="text"
            fullWidth
            value={form.userID}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            value={form.password}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="userRole"
            label="User Role"
            type="text"
            fullWidth
            value={form.userRole}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="bankAccount"
            label="Bank Account"
            type="text"
            fullWidth
            value={form.bankAccount}
            onChange={handleChange}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editingUser ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>User Role</TableCell>
              <TableCell>Bank Account</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.userID}</TableCell>
                  <TableCell>{user.userRole}</TableCell>
                  <TableCell>{user.bankAccount}</TableCell>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      sx={{ backgroundColor: '#333', color: 'white', '&:hover': { backgroundColor: '#345' } }} 
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="contained" 
                      sx={{ backgroundColor: '#ff4c4c', color: 'white', '&:hover': { backgroundColor: '#c80036' } }} 
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>No users found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ManageUser;
