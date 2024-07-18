import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import './Login.css';
import axios from 'axios';
import Register from './Register';

function Login() {
  const [ModalStudOpen, setModalStudOpen] = useState(true);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [loginID, setLoginID] = useState('');
  const [password, setPassword] = useState('');
  const [loginIDErr, setLoginIDError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setModalStudOpen(true);
  }, []);

  const handleCloseStudModal = () => {
    setModalStudOpen(false);
    window.location.href = '/';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://192.168.10.13:3004/login', { loginID, password });
      const { token, role, redirectUrl } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      navigate(redirectUrl);
      window.location.reload();
    } catch (err) {
      if (err.response) {
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
    <>
      <Modal open={ModalStudOpen} onClose={handleCloseStudModal}>
        <div className="bg">
          {/* <img src="SSS.png" alt="" /> */}
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
                  label="Username/UserID"
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
                <Button variant="contained" onClick={() => setRegisterModalOpen(true)}>Register</Button>
              </div>
            </div>
          </div>
        </div>
        </div>
        
      </Modal>
      <Register open={registerModalOpen} onClose={() => setRegisterModalOpen(false)} />
    </>
  );
}

export default Login;
