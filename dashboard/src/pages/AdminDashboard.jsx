import React, { useEffect, useState } from 'react';
import { Button, TextField, Modal, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import './AdminDashboard.css';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import SidebarAdmin from './SidebarAdmin';

const AdminDashboard = () => {
    const [products, setProducts] = useState({
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
    const [values, setValues] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('name'); // Default search by name

    useEffect(() => {
        fetchMenu();
    }, []);

    const handleOpenAddModal = () => {
        setModalAddOpen(true);
    };

    const handleCloseAddModal = () => {
        setModalAddOpen(false);
    };

    const handleOpenEditModal = (product) => {
        setSelectedProduct({
            _id: product?._id,
            productName: product?.name,
            productDescription: product?.description,
            productPrice: product?.price,
            image: product?.image
        });
        setModalEditOpen(true);
        console.log(product);
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

            setProducts((prev) => ({
                ...prev,
                productImage: file,
                productImageUrl: imageUrl
            }));
        } else {
            setProducts((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleCancel = () => {
        setModalAddOpen(false);
        setProducts({
            productName: '',
            productPrice: '',
            productDescription: '',
            productImageUrl: '',
            productImage: null
        });
    };


const handleAddProduct = async () => {
    try {
        console.log('Before actions');
        const { productName, productPrice, productDescription, productImage } = products;

        // Ensure all required fields are provided
        if (!productName || !productPrice || !productDescription || !productImage) {
            return alert('Fields must not be empty!');
        }

        // Upload image to Cloudinary first
        const cloudinaryData = new FormData();
        cloudinaryData.append('file', productImage);
        cloudinaryData.append('upload_preset', 'products');

        const cloudinaryResponse = await axios.post(
            `https://api.cloudinary.com/v1_1/dnw3vru0m/image/upload`,
            cloudinaryData
        );

        const imageUrl = cloudinaryResponse.data.secure_url;

        // Create data object to send to your server
        const productData = {
            productName,
            productPrice,
            productDescription,
            imageUrl
        };

        // Send POST request to your server
        const addProductResponse = await axios.post('https://server-two-blue.vercel.app/addproduct', productData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('From axios: ', addProductResponse);

        // Reset product state
        setProducts({
            productName: '',
            productPrice: '',
            productDescription: '',
            productImageUrl: '',
            productImage: null
        });

        // Refresh the menu
        fetchMenu();
    } catch (error) {
        console.error('Error adding product:', error);
        alert('Error adding product!');
    } finally {
        setModalAddOpen(false);
    }
};
    
    const handleDeleteProduct = async () => {
        try {
            await axios.post('https://server-two-blue.vercel.app/deleteproduct', { productId: selectedProduct._id });
            setValues((prev) => prev.filter((product) => product._id !== selectedProduct._id));
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
            const response = await axios.post('https://server-two-blue.vercel.app/editproduct', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                handleCloseEditModal();
                fetchMenu();
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Error updating product!');
        }
    };

    const fetchMenu = async () => {
        const menu = await axios.get('https://server-two-blue.vercel.app/getallproducts');
        setValues(menu?.data?.data);
    };

    const filteredProducts = values.filter((product) =>
        product[searchBy].toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-dashboard-container">
            <SidebarAdmin />
            <div className="header">
                <TextField
                    id="search"
                    label="Search"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FormControl variant="outlined">
                    <InputLabel id="search-by-label">Search By</InputLabel>
                    <Select
                        labelId="search-by-label"
                        id="search-by"
                        value={searchBy}
                        onChange={(e) => setSearchBy(e.target.value)}
                        label="Search By"
                    >
                        <MenuItem value="name">Name</MenuItem>
                        <MenuItem value="price">Price</MenuItem>
                        <MenuItem value="description">Description</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" onClick={handleOpenAddModal}>
                    Add Item
                </Button>
            </div>

            <Modal open={modalAddOpen} onClose={handleCloseAddModal}>
                <div className="view-modal">
                    <h1>Add Item</h1>
                    <div className="modal-forms">
                        <div className="image-container">
                            {products.productImageUrl ? (
                                <img src={products.productImageUrl} alt="Product" />
                            ) : (
                                <h1>No image</h1>
                            )}
                        </div>
                        <TextField
                            name="productName"
                            label="Name"
                            value={products.productName}
                            onChange={handleOnChange}
                        />
                        <TextField
                            name="productDescription"
                            label="Description"
                            value={products.productDescription}
                            onChange={handleOnChange}
                        />
                        <TextField
                            name="productPrice"
                            label="Price"
                            type="number"
                            value={products.productPrice}
                            onChange={handleOnChange}
                        />
                        <input
                            name="productImage"
                            type="file"
                            accept="image/*"
                            onChange={handleOnChange}
                        />
                        <div className="btn-add">
                            <Button variant="contained" onClick={handleAddProduct}>
                                Add
                            </Button>
                            <Button variant="contained" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal open={modalEditOpen} onClose={handleCloseEditModal}>
                <div className="view-modal">
                    <h1>Edit</h1>
                    {selectedProduct && (
                        <div className="modal-forms">
                            <div className="image-container">
                                {selectedProduct.image ? (
                                    <img
                                        src={`https://server-two-blue.vercel.app/uploads/${selectedProduct.image}`}
                                        alt="Product"
                                    />
                                ) : (
                                    <h1>No image</h1>
                                )}
                            </div>
                            <TextField
                                name="productName"
                                label="Product Name"
                                value={selectedProduct.productName}
                                onChange={handleEditChange}
                            />
                            <TextField
                                name="productDescription"
                                label="Product Description"
                                value={selectedProduct.productDescription}
                                onChange={handleEditChange}
                            />
                            <TextField
                                name="productPrice"
                                type="number"
                                label="Product Price"
                                value={selectedProduct.productPrice}
                                onChange={handleEditChange}
                            />
                            <div className="btn-add">
                                <Button
                                    variant="contained"
                                    onClick={handleUpdateProduct}
                                >
                                    Save Changes
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleDeleteProduct}
                                    startIcon={<DeleteIcon />}
                                >
                                    Delete
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleCloseEditModal}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>

            <div className="edit-menu-container">
                {filteredProducts.map((pro) => (
                    <div
                        key={pro._id}
                        className="card-edit"
                        onClick={() => handleOpenEditModal(pro)}
                    >
                        <div className="image-container">
                            <img
                                src={`https://server-two-blue.vercel.app/uploads/${pro.image}`}
                                alt="Product"
                            />
                        </div>
                        <div className="product-info">
                            <h2>{pro.name}</h2>
                            <p>{pro.description}</p>
                            <h3>${pro.price}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
