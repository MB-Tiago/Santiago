import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import './Register.css';
import axios from 'axios';

function Register({ open, onClose }) {
  const [registerID, setRegisterID] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [userAgreement, setUserAgreement] = useState(false);
  const [registerIDErr, setRegisterIDError] = useState('');
  const [registerPasswordErr, setRegisterPasswordError] = useState('');
  const [bankAccountErr, setBankAccountError] = useState('');
  const [userAgreementErr, setUserAgreementError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!userAgreement) {
      setUserAgreementError('You must agree to the user agreement');
      return;
    }
    try {
      const response = await axios.post('http://192.168.10.13:3004/register', {
        registerID,
        registerPassword,
        bankAccount,
        userAgreement,
      });
      if (response.status === 201) {
        onClose();
        navigate('/');
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setRegisterIDError('Invalid registration ID');
        setRegisterPasswordError('Invalid password');
        setBankAccountError('Invalid bank account');
      } else {
        setRegisterIDError('An error occurred');
        setRegisterPasswordError('An error occurred');
        setBankAccountError('An error occurred');
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="register-modal">
        <div className="main-register-form">
          <div className="register-form">
            <h1>Register</h1>
            <div className="register-forms">
              <TextField
                value={registerID}
                onChange={(e) => {
                  setRegisterID(e.target.value);
                  setRegisterIDError('');
                }}
                id="outlined-basic-3"
                label="RegisterID"
                variant="outlined"
                required
                error={!!registerIDErr}
                helperText={registerIDErr ? registerIDErr : ""}
              />
              <TextField
                value={registerPassword}
                onChange={(e) => {
                  setRegisterPassword(e.target.value);
                  setRegisterPasswordError('');
                }}
                id="outlined-basic-4"
                label="Password"
                variant="outlined"
                type='password'
                required
                error={!!registerPasswordErr}
                helperText={registerPasswordErr ? registerPasswordErr : ""}
              />
              <TextField
                value={bankAccount}
                onChange={(e) => {
                  setBankAccount(e.target.value);
                  setBankAccountError('');
                }}
                id="outlined-basic-5"
                label="Bank Account"
                variant="outlined"
                required
                error={!!bankAccountErr}
                helperText={bankAccountErr ? bankAccountErr : ""}
              />
              <FormControlLabel
                control={<Checkbox checked={userAgreement} onChange={(e) => {
                  setUserAgreement(e.target.checked);
                  setUserAgreementError('');
                }} />}
                label="I agree to the User Agreement"
              />
              {userAgreementErr && <p className="error-text">{userAgreementErr}</p>}
              <Button variant="contained" onClick={handleRegister}>Register</Button>
              <Button variant="contained" onClick={onClose}>Cancel</Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default Register;
