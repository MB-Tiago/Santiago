import React, { useEffect, useState } from 'react';
import { Button, TextField, Modal } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import './TiagoShop.css';

const TiagoShop = () => {
    const [view, setView] = useState('shop');
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [adminProduct, setAdminProduct] = useState({
        productName: '',
        productPrice: '',
        productDescription: '',
        productImage: null,
        productImageUrl: ''
    });
    const [selectedProduct, setSelectedProduct] = useState({
        _id: '',
        productName: '',
        productPrice: '',
        productDescription: '',
        image: null
    });
    const [modalAddOpen, setModalAddOpen] = useState(false);
    const [modalEditOpen, setModalEditOpen] = useState(false);

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
        return cart.reduce((total, product) => total + product.price, 0);
    };

    const handleOpenAddModal = () => {
        setModalAddOpen(true);
    };

    const handleCloseAddModal = () => {
        setModalAddOpen(false);
    };

    const handleOpenEditModal = (product) => {
        setSelectedProduct({
            _id: product._id,
            productName: product.name,
            productDescription: product.description,
            productPrice: product.price,
            image: product.image
        });
        setModalEditOpen(true);
    };

    const handleCloseEditModal = () => {
        setModalEditOpen(false);
        setSelectedProduct({
            _id: '',
            productName: '',
            productDescription: '',
            productPrice: '',
            image: null
        });
    };

    const handleOnChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'productImage' && files && files[0]) {
            const file = files[0];
            const imageUrl = URL.createObjectURL(file);

            setAdminProduct((prev) => ({
                ...prev,
                productImage: file,
                productImageUrl: imageUrl
            }));
        } else {
            setAdminProduct((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleAddProduct = async () => {
        try {
            const { productName, productPrice, productDescription, productImage } = adminProduct;

            if (!productName || !productPrice || !productDescription || !productImage) {
                return alert('Fields must not be empty!');
            }

            const formData = new FormData();
            formData.append('productName', productName);
            formData.append('productPrice', productPrice);
            formData.append('productDescription', productDescription);
            formData.append('image', productImage);

            const response = await axios.post('http://192.168.10.13:3004/addproduct', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setAdminProduct({
                productName: '',
                productPrice: '',
                productDescription: '',
                productImage: null,
                productImageUrl: ''
            });
            fetchProducts();
        } catch (error) {
            alert('Error adding product!', error);
        } finally {
            setModalAddOpen(false);
        }
    };

    const handleDeleteProduct = async () => {
        try {
            await axios.post('http://192.168.10.13:3004/deleteproduct', { productId: selectedProduct._id });
            setProducts((prev) => prev.filter((product) => product._id !== selectedProduct._id));
            handleCloseEditModal();
        } catch (error) {
            alert('Error deleting product!', error);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setSelectedProduct((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateProduct = async () => {
        try {
            const { _id, productName, productDescription, productPrice } = selectedProduct;

            if (!_id || !productName || !productDescription || !productPrice) {
                return alert('Fields must not be empty!');
            }

            const data = {
                productId: _id,
                productName,
                productPrice,
                productDescription
            };

            const response = await axios.post('http://192.168.10.13:3004/editproduct', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                handleCloseEditModal();
                fetchProducts();
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            alert('Error updating product!', error);
        }
    };

    return (
        <div className="app-container">
            <nav className="navbar">
                <Button onClick={() => setView('shop')}>Shop</Button>
                <Button onClick={() => setView('cart')}>Cart ({cart.length})</Button>
                <Button onClick={() => setView('admin')}>Admin Dashboard</Button>
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
                    <Button variant="contained" onClick={() => alert('Checkout functionality not implemented yet')}>Checkout</Button>
                </div>
            )}

            {view === 'admin' && (
                <div className="admin-dashboard-container">
                    <h2>Admin Dashboard</h2>
                    <Button variant="contained" onClick={handleOpenAddModal}>Add Product</Button>

                    <Modal open={modalAddOpen} onClose={handleCloseAddModal}>
                        <div className="view-modal">
                            <h1>Add Product</h1>
                            <div className="modal-forms">
                                <div className="image-container">
                                    {adminProduct.productImageUrl ? (
                                        <img src={adminProduct.productImageUrl} alt="Product" />
                                    ) : (
                                        <h1>No image</h1>
                                    )}
                                </div>
                                <TextField
                                    name="productName"
                                    label="Name"
                                    value={adminProduct.productName}
                                    onChange={handleOnChange}
                                />
                                <TextField
                                    name="productDescription"
                                    label="Description"
                                    value={adminProduct.productDescription}
                                    onChange={handleOnChange}
                                />
                                <TextField
                                    name="productPrice"
                                    label="Price"
                                    type="number"
                                    value={adminProduct.productPrice}
                                    onChange={handleOnChange}
                                />
                                <input
                                    name="productImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleOnChange}
                                />
                                <div className="btn-add">
                                    <Button variant="contained" onClick={handleAddProduct}>Add</Button>
                                    <Button variant="contained" onClick={() => setModalAddOpen(false)}>Cancel</Button>
                                </div>
                            </div>
                        </div>
                    </Modal>

                    <Modal open={modalEditOpen} onClose={handleCloseEditModal}>
                        <div className="view-modal">
                            <h1>Edit Product</h1>
                            <div className="modal-forms">
                                <div className="image-container">
                                    {selectedProduct.image ? (
                                        <img src={`http://192.168.10.13:3004/uploads/${selectedProduct.image}`} alt="Product" />
                                    ) : (
                                        <h1>No image</h1>
                                    )}
                                </div>
                                <TextField
                                    name="productName"
                                    label="Name"
                                    value={selectedProduct.productName}
                                    onChange={handleEditChange}
                                />
                                <TextField
                                    name="productDescription"
                                    label="Description"
                                    value={selectedProduct.productDescription}
                                    onChange={handleEditChange}
                                />
                                <TextField
                                    name="productPrice"
                                    label="Price"
                                    type="number"
                                    value={selectedProduct.productPrice}
                                    onChange={handleEditChange}
                                />
                                <div className="btn-add">
                                    <Button variant="contained" onClick={handleUpdateProduct}>Save Changes</Button>
                                    <Button variant="contained" onClick={handleDeleteProduct} startIcon={<DeleteIcon />}>Delete</Button>
                                    <Button variant="contained" onClick={handleCloseEditModal}>Cancel</Button>
                                </div>
                            </div>
                        </div>
                    </Modal>

                    <div className="edit-menu-container">
                        {products.map((product) => (
                            <div key={product._id} className="card-edit" onClick={() => handleOpenEditModal(product)}>
                                <div className="image-container">
                                    <img src={`http://192.168.10.13:3004/uploads/${product.image}`} alt={product.name} />
                                </div>
                                <div className="label">
                                    <h3>{product.name}</h3>
                                    <h3>₱ {product.price}</h3>
                                </div>
                                <div className="description">
                                    <p>{product.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TiagoShop;
