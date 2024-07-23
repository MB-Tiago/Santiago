import React, { useEffect, useState } from 'react';
import { Button, TextField, Modal, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import './AdminDashboard.css';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import SidebarAdmin from './SidebarAdmin';
import DisplayImage from './DisplayImage';
const { VITE_HOST } = import.meta.env

const AdminDashboard = () => {
    const [values, setValues] = useState([])
    const [modalType, setModalType] = useState('')
    const [search, setSearch] = useState('')
    const [details, setDetails] = useState({
        productId: '',
        productName: '',
        productDescription: '',
        price: '',
        image: ''
    })

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${VITE_HOST}/getallproducts`)
            setValues(res?.data?.data)
        } catch (error) {
            console.error(error)
        }
    }

    const handleAddProduct = async (e) => {
        try {
            e.preventDefault()
            const cloudinary = new FormData();
            cloudinary.append('file', details?.image);
            cloudinary.append('upload_preset', 'dqh9de7m');

            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/dnw3vru0m/image/upload`,
                cloudinary,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            const url = res?.data?.secure_url

            const AddToDatabase = await axios.post(`${VITE_HOST}/addproduct`, {
                productName: details?.productName,
                productDescription: details?.productDescription,
                price: details?.price,
                image: url
            })

            if (AddToDatabase?.data?.success) return alert(AddToDatabase?.data?.message)
            return alert(AddToDatabase?.data?.message)

        } catch (error) {
            console.error('Error adding product:', error);
        } finally {
            setModalType('');
            setDetails((prev) => ({
                ...prev,
                productId: '',
                productName: '',
                productDescription: '',
                price: '',
                image: ''
            }))
            fetchProducts()
        }
    };

    const handleOnChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image' && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setDetails((prev) => ({
                    ...prev,
                    image: reader.result
                }));
            };
            reader.readAsDataURL(file);
        } else {
            setDetails((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    }

    const handleOnClickAddItem = () => {
        setModalType('AddItem')
        console.log(modalType)
    }

    const handleDeleteProduct = async () => {
        try {
            await axios.post(`${VITE_HOST}/deleteproduct`, { productId: selectedProduct._id });
            setValues((prev) => prev.filter((product) => product._id !== selectedProduct._id));
            handleCloseEditModal();
        } catch (error) {
            alert('Error deleting product!', error);
        }
    };

    const handleModalClose = () => {
        setDetails((prev) => ({
            ...prev,
            productName: '',
            productDescription: '',
            price: '',
            image: ''
        }))
        setModalType('')
    }

    const handleOnClickEditMenu = (e) => {
        setModalType('EditItem')
        setDetails((prev) => ({
            ...prev,
            productId: e?._id,
            productName: e?.name,
            productDescription: e?.description,
            price: e?.price,
            image: e?.imageUrl
        }))
    }

    const handleEditSubmit = async (e) => {
        try {
            e.preventDefault()
            const cloudinary = new FormData();
            cloudinary.append('file', details?.image);
            cloudinary.append('upload_preset', 'dqh9de7m');

            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/dnw3vru0m/image/upload`,
                cloudinary,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            const url = res?.data?.secure_url

            const EditProduct = await axios.post(`${VITE_HOST}/editproduct`,
                {
                    productId: details?.productId,
                    productName: details?.productName,
                    productDescription: details?.productDescription,
                    productPrice: details?.price,
                    image: url
                }
            )

            if (EditProduct?.data?.success) return alert(EditProduct?.data?.message)
            return alert(EditProduct?.data?.message)
        } catch (error) {
            console.error(error)
        } finally {
            setModalType('');
            setDetails((prev) => ({
                ...prev,
                productId: '',
                productName: '',
                productDescription: '',
                price: '',
                image: ''
            }))
            fetchProducts()
        }
    }

    return (
        <div className="admin-dashboard-container">
            <SidebarAdmin />
            <div className="header">
                <TextField
                    id="search"
                    label="Search"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <FormControl variant="outlined">
                    <InputLabel id="search-by-label">Search By</InputLabel>
                    <Select
                        labelId="search-by-label"
                        id="search-by"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        label="Search By"
                    >
                        <MenuItem value="name">Name</MenuItem>
                        <MenuItem value="price">Price</MenuItem>
                        <MenuItem value="description">Description</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" onClick={handleOnClickAddItem}>
                    Add Item
                </Button>
            </div>

            <Modal open={modalType !== ''} onClose={handleModalClose}>
                <form
                    onSubmit={modalType === 'AddItem' ? handleAddProduct : handleEditSubmit}
                    className="view-modal">
                    <h1>Add Item</h1>
                    <div className="modal-forms">
                        <div className="image-container">
                            {details?.image ? (<img src={details?.image} alt="Product" />) : (
                                <h1>No image</h1>
                            )}
                        </div>
                        <TextField
                            name="productName"
                            label="Name"
                            value={details?.productName}
                            onChange={handleOnChange}
                        />
                        <TextField
                            name="productDescription"
                            label="Description"
                            value={details?.productDescription}
                            onChange={handleOnChange}
                        />
                        <TextField
                            name="price"
                            label="Price"
                            type="number"
                            value={details?.price}
                            onChange={handleOnChange}
                        />
                        <input
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={handleOnChange}
                        />
                        <div className="btn-add">
                            <Button type='submit' variant="contained">
                                {modalType === 'AddItem' ? 'ADD ITEM' : 'UPDATE'}
                            </Button>
                            <Button type='button' variant="contained" onClick={handleModalClose}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </form>
            </Modal>
            <div className="edit-menu-container">
                {values.map((pro) => (
                    <div
                        key={pro._id}
                        className="card-edit"
                        onClick={() => handleOnClickEditMenu(pro)}
                    >
                        <div className="image-container">
                            <img
                                src={pro?.imageUrl}
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
