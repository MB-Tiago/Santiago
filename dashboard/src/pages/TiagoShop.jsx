import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import axios from 'axios';
import './TiagoShop.css';
import Billing from './Billing';
import { useNavigate } from 'react-router-dom';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SalesReport from './SalesReport';

const TiagoShop = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('shop');
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [transactionMode, setTransactionMode] = useState('creditCard');
    const [values, setValues] = useState({
        debitAccount: '',
        creditAccount: '',
        amount: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const routingNumber = "000000005";

            const response = await axios.get('https://server-two-blue.vercel.app/getallproducts');
            setProducts(response.data.data);
            setValues((prev) => ({
                ...prev,
                creditAccount: routingNumber
            }));
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };


    const goToShoppingLists = () => {
        navigate('/shoppinglist');
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

    const handleBillingChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({
            ...prev,
            [name]: value
        }));
        setValues((prev) => ({
            ...prev,
            amount: getTotalPrice()
        }));
    };

    const handleBillingSubmit = async () => {
        try {
            const token = "$2b$10$UrrLuNtzp7jnfRiM0hoSpe6rRzarbbtpfVKUmAUd2pKMSLgtsuo/q";
            const debit = values.debitAccount;
            const credit = values.creditAccount;
            const amount = getTotalPrice();

            const response = await axios.post('https://union-bank-server.vercel.app/api/unionbank/transfertransaction', {
                debitAccount: debit,
                creditAccount: credit,
                amount: amount
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data)
            if (response.data.success) {
                alert('Payment successful!');

                // Iterate over cart items to record sales
                for (const product of cart) {
                    const salePayload = {
                        productName: product.name,
                        price: product.price
                    };

                    console.log('Sending sale record:', salePayload);

                    // Send sale record to backend
                    const saleResponse = await axios.post('https://server-two-blue.vercel.app/api/recordSale', salePayload);

                    if (!saleResponse.data.success) {
                        console.error('Failed to record sale:', saleResponse.data.message);
                        // Handle failure to record sale (e.g., retry logic or error handling)
                    }
                }

                // Clear cart and reset view to shop
                setCart([]);
                setView('shop');

            } else {
                alert('Insufficient balance or account does not exist');
            }
        } catch (error) {
            console.error('Error submitting payment:', error);
            alert('Error submitting payment! Please try again.');
        }
    };


    const handleViewChange = (view) => {
        console.log(`Changing view to: ${view}`);
        setView(view);
    };

    const handleLogout = () => {
        window.location.href = '/';
    };

    return (
        <div className="app-container">

            <nav className="navbar">

                <Button onClick={() => handleViewChange('shop')}>Shop</Button>
                <Button onClick={() => handleViewChange('cart')}>Cart ({cart.length})</Button>

                <Button onClick={handleLogout}>Logout</Button>
            </nav>

            {view === 'shop' && (
                <div className="shop-container">
                    <div className="logo2">

                        <div className="tiagoshop">
                            <h2>TiagoShop</h2>

                            <Button onClick={goToShoppingLists} ><StorefrontIcon></StorefrontIcon>Shopping Lists</Button>

                        </div>
                    </div>

                    <div className="edit-menu-container">
                        {products.map((product) => (
                            <div key={product._id} className="card-edit">
                                <div className="image-container">
                                    <img src={`https://server-two-blue.vercel.app/uploads/${product.image}`} alt={product.name} />

                                </div>
                                <div className="product-info">
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>
                                    <h4>₱ {product.price}</h4>
                                    <Button variant="contained" onClick={() => addToCart(product)}>Add to Cart</Button>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>

                //     <div className="edit-menu-container">
                //     {filteredProducts.map((pro) => (
                //         <div
                //             key={pro._id}
                //             className="card-edit"
                //             onClick={() => handleOpenEditModal(pro)}
                //         >
                //             <div className="image-container">
                //                 <img
                //                     src={`http://192.168.10.13:3004/uploads/${pro.image}`}
                //                     alt="Product"
                //                 />
                //             </div>
                //             <div className="product-info">
                //                 <h2>{pro.name}</h2>
                //                 <p>{pro.description}</p>
                //                 <h3>${pro.price}</h3>
                //             </div>
                //         </div>
                //     ))}
                // </div>
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
                <Billing
                    cart={cart}
                    transactionMode={transactionMode}
                    billingDetails={values}
                    handleTransactionModeChange={handleTransactionModeChange}
                    handleBillingChange={handleBillingChange}
                    handleBillingSubmit={handleBillingSubmit}
                />
            )}

        </div>
    );
};

export default TiagoShop;
