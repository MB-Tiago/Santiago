const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const app = express();

const PORT = process.envPORT || 3004;
const HOST = '192.168.10.13'

const adminModel = require('./models/adminData.js');
const Products = require('./models/productModel.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const ConnectToDatabase = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/Tiagoshop")
        console.log('Connected to the database!')
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

app.listen(3004, '192.168.10.13', () => {
    console.log(`Listening: http://192.168.10.13:3004`);
})

ConnectToDatabase()

app.post('/login', async (req, res) => {
    try {
        const { loginID, password } = req.body;

        console.log('Received loginID:', loginID);
        console.log('Received password:', password);

        if (!loginID || !password) {
            return res.status(400).json({ message: "Login ID and password are required" });
        }

        const user = await adminModel.findOne({ adminID: loginID, password });
        if (!user) {
            return res.status(400).json({ message: "Invalid login ID or password" });
        }

        const token = jwt.sign({ Adm: user._id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1h' });
        res.json({ token, userId: user._id });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post('/adduser', upload.single('image'), async (req, res) => {
    try {
        const values = req.body

        await adminModel.create(values)
        res.json({ success: true, message: 'User added successfully!' })
    } catch (error) {
        res.json({ success: false, message: `Error adding user controller: ${error}` })
    }
});

app.post('/addproduct', upload.single('image'), async (req, res) => {
    try {
        const { productName, productDescription,productPrice } = req.body;
        const productImage = req.file.filename;
        const productId = Math.floor(Math.random() * 100000);
        console.log(productImage)

        const newProduct = new Products({
            productId: productId,
            name: productName,
            description: productDescription,
            price:productPrice,
            image: productImage
        });

        const savedProduct = await newProduct.save();

        res.json({ success: true, message: 'Product added successfully!', data: savedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: `Product failed to add: ${error.message}` });
    }
});

app.get('/getallproducts', async (req, res) => {
    try {
        const data = await Products.find()

        res.json({ success: true, message: 'All products fetched successfully!', data: data })
    } catch (error) {
        res.json({ success: false, message: `Error fetching products: ${error}` })
    }
})

app.post('/deleteproduct', async (req, res) => {
    try {
        const { productId } = req.body;

        const data = await Products.findByIdAndDelete(productId);
        if (data) {
            res.json({ success: true, message: 'Product deleted successfully!' });
        } else {
            res.json({ success: false, message: 'Failed to delete product!' });
        }
    } catch (error) {
        res.json({ success: false, message: `Error deleting product: ${error}` })
    }
})

app.post('/editproduct', async (req, res) => {
    try {
        const { productId, productName, productDescription,productPrice } = req.body;

        console.log('Received data for updating product:', productId, productName, productDescription,productPrice);

        const updatedProduct = await Products.findByIdAndUpdate(productId, {
            name: productName,
            description: productDescription,
            price:productPrice
        }, { new: true });

        if (updatedProduct) {
            res.json({ success: true, message: 'Product updated successfully!', data: updatedProduct });
        } else {
            res.json({ success: false, message: 'Failed to update product!' });
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
