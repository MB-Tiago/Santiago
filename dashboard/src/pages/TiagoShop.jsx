import React, { useEffect, useState } from 'react';
import { Button, TextField, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import axios from 'axios';
import './TiagoShop.css';
import Navbar from './Navbar';

const TiagoShop = () => {
    const [view, setView] = useState('shop');
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [transactionMode, setTransactionMode] = useState('creditCard');
    const [billingDetails, setBillingDetails] = useState({
        cardNumber: '',
        cardExpiry: '',
        cardCVC: '',
        bankAccountNumber: '',
        bankRoutingNumber: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://192.168.10.13:3004/getallproducts');
            setProducts(response.data.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const addToCart = (product) => {
        setCart((prevCart) => [...prevCart, product]);
    };

    const handleRemoveFromCart = (index) => {
        setCart((prevCart) => prevCart.filter((_, i) => i !== index));
    };

    const getTotalPrice = () => {
        return cart.reduce((total, product) => total + parseInt(product.price), 0);
    };
     

    const handleCheckout = () => {
        setView('billing');
    };

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
        // Submit billing details and process the payment
        alert('Billing details submitted');
    };

    return (
        <div className="app-container">
            {/* <Navbar/> */}
            <nav className="navbar">
                <Button onClick={() => setView('shop')}>Shop</Button>
                <Button onClick={() => setView('cart')}>Cart ({cart.length})</Button>
            </nav>

            {view === 'shop' && (
                <div className="shop-container">
                    <h2>Shop</h2>
                    <div className="products-list">
                        {products.map((product) => (
                            <div key={product._id} className="product-card">
                                <img src={`http://192.168.10.13:3004/uploads/${product.image}`} alt={product.name} />
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>
                                <h4>₱ {product.price}</h4>
                                <Button variant="contained" onClick={() => addToCart(product)}>Add to Cart</Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {view === 'cart' && (
                <div className="cart-container">
                    <h2>Cart</h2>
                    {cart.map((product, index) => (
                        <div key={index} className="cart-item">
                            <h3>{product.name}</h3>
                            <p>₱ {product.price}</p>
                            <Button variant="contained" onClick={() => handleRemoveFromCart(index)}>Remove</Button>
                        </div>
                    ))}
                    <h3>Total: ₱ {getTotalPrice()}</h3>
                    <Button variant="contained" onClick={handleCheckout}>Checkout</Button>
                </div>
            )}

            {view === 'billing' && (
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
                </div>
            )}
        </div>
    );
};

export default TiagoShop;
