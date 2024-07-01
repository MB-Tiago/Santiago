import React, { useState } from 'react';
import { Button, TextField, RadioGroup, FormControlLabel, Radio, Modal, Backdrop, Fade, Paper, Typography } from '@mui/material';
import "./Billing.css"; // Ensure this path is correct

const Billing = ({ cart }) => {
    const [transactionMode, setTransactionMode] = useState('creditCard');
    const [billingDetails, setBillingDetails] = useState({
        cardNumber: '',
        cardExpiry: '',
        cardCVC: '',
        bankAccountNumber: '',
        bankRoutingNumber: ''
    });
    const [openModal, setOpenModal] = useState(false); // State for controlling modal visibility
    const [transactionRecords, setTransactionRecords] = useState([]); // Placeholder for transaction records

    const handleTransactionModeChange = (event) => {
        setTransactionMode(event.target.value);
    };

    const handleBillingChange = (event) => {
        const { name, value } = event.target;
        setBillingDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleBillingSubmit = () => {
        // Placeholder logic to submit billing details
        alert('Billing details submitted');
    };

    const handleViewTransactions = () => {
        // Placeholder logic to fetch transaction records (replace with actual fetching logic)
        const dummyTransactions = [
            { id: 1, amount: 100, date: '2024-06-28' },
            { id: 2, amount: 200, date: '2024-06-27' },
            { id: 3, amount: 150, date: '2024-06-26' }
        ];
        setTransactionRecords(dummyTransactions);
        setOpenModal(true); // Open modal when viewing transactions
    };

    const handleCloseModal = () => {
        setOpenModal(false); // Close modal
    };

    return (
        <div className="billing-container">
            <h2>Billing</h2>
            <RadioGroup
                value={transactionMode}
                onChange={handleTransactionModeChange}
            >
                <FormControlLabel value="creditCard" control={<Radio />} label="Credit Card" />
                <FormControlLabel value="bankAccount" control={<Radio />} label="Bank Account" />
            </RadioGroup>
            {transactionMode === 'creditCard' && (
                <div className="credit-card-form">
                    <TextField
                        name="cardNumber"
                        label="Card Number"
                        value={billingDetails.cardNumber}
                        onChange={handleBillingChange}
                    />
                    <TextField
                        name="cardExpiry"
                        label="Card Expiry"
                        value={billingDetails.cardExpiry}
                        onChange={handleBillingChange}
                    />
                    <TextField
                        name="cardCVC"
                        label="Card CVC"
                        value={billingDetails.cardCVC}
                        onChange={handleBillingChange}
                    />
                </div>
            )}
            {transactionMode === 'bankAccount' && (
                <div className="bank-account-form">
                    <TextField
                        name="bankAccountNumber"
                        label="Bank Account Number"
                        value={billingDetails.bankAccountNumber}
                        onChange={handleBillingChange}
                    />
                    <TextField
                        name="bankRoutingNumber"
                        label="Bank Routing Number"
                        value={billingDetails.bankRoutingNumber}
                        onChange={handleBillingChange}
                    />
                </div>
            )}
            <Button variant="contained" onClick={handleBillingSubmit}>Submit Payment</Button>
            <Button variant="contained" onClick={handleViewTransactions}>View Transaction History</Button>

            {/* Modal for Transaction History */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openModal}>
                    <Paper className="transaction-modal">
                        <Typography variant="h4" gutterBottom>
                            Transaction History
                        </Typography>
                        {transactionRecords.map(transaction => (
                            <div key={transaction.id}>
                                <Typography>{`ID: ${transaction.id}, Amount: ${transaction.amount}, Date: ${transaction.date}`}</Typography>
                            </div>
                        ))}
                    </Paper>
                </Fade>
            </Modal>
        </div>
    );
};

export default Billing;
