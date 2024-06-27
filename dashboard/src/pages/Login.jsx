import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal'; // Ensure Modal is imported
import './Login.css';
import axios from 'axios';

function Login() {
  const [ModalStudOpen, setModalStudOpen] = useState(true); // Modal starts open
  const [loginID, setLoginID] = useState('');
  const [password, setPassword] = useState('');
  const [loginIDErr, setLoginIDError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setModalStudOpen(true);
  }, []);

  useEffect(() => {
    navLogin();
  }, []);

  const navLogin = () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    if (token) {
      navigate('/AdminDashboard');

    }
  }
    const handleCloseStudModal = () => {
      setModalStudOpen(false);
      window.location.href = '/'; 
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        console.log('Sending loginID:', loginID);
        console.log('Sending password:', password);

        const response = await axios.post('http://192.168.10.13:3004/login', { loginID, password });
        const { token } = response.data;
        localStorage.setItem('token', token);
        navigate('/AdminDashboard');
        window.location.reload();
      } catch (err) {
        console.error(err);
        if (err.response) {
          console.error(err.response.data);
          if (err.response.status === 400) {
            setLoginIDError('Invalid login ID');
            setPasswordError('Invalid password');
          } else {
            setLoginIDError('An error occurred');
            setPasswordError('An error occurred');
          }
        } else {
          setLoginIDError('An error occurred');
          setPasswordError('An error occurred');
        }
      }
    };


    return (
      <Modal open={ModalStudOpen} onClose={handleCloseStudModal}>
        <div className="login-modal">
          <div className="main-login-form">
            <div className="login-form">
              <h1>Login</h1>
              <div className="login-forms">
                <TextField
                  value={loginID}
                  onChange={(e) => {
                    setLoginID(e.target.value);
                    setLoginIDError(''); 
                  }}
                  id="outlined-basic-1"
                  label="LoginID"
                  variant="outlined"
                  required
                  error={!!loginIDErr}
                  helperText={loginIDErr ? loginIDErr : ""}
                />
                <TextField
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(''); 
                  }}
                  id="outlined-basic-2"
                  label="Password"
                  variant="outlined"
                  type='password'
                  required
                  error={!!passwordError}
                  helperText={passwordError ? passwordError : ""}
                />

                <Button variant="contained" onClick={handleSubmit}>Login</Button>
                <Button variant="contained" onClick={handleCloseStudModal}>Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  export default Login;
