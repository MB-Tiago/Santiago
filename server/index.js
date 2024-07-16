const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const app = express();
const Sales = require('./models/Sales.js');

const PORT = process.envPORT || 3004;
const HOST = '192.168.10.13'

const User = require('./models/userData');
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


app.post('/register', async (req, res) => {
    const { registerID, registerPassword, bankAccount, userAgreement } = req.body;
  
    if (!userAgreement) {
      return res.status(400).send({ message: 'You must agree to the user agreement' });
    }
  
    try {
      const newUser = new User({
        userID: registerID,
        password: registerPassword, // Directly using the password
        bankAccount: bankAccount,
        agreedToUserAgreement: userAgreement
      });
  
      await newUser.save();
      res.status(201).send({ message: 'User registered successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'An error occurred during registration' });
    }
  });

  app.post('/login', async (req, res) => {
    const { loginID, password } = req.body;

    try {
        let user = await User.findOne({ userID: loginID });
        let role = 'user';
        let redirectUrl = '/TiagoShop'; 

        if (user.userRole == 'admin') {
            user = await User.findOne({ userID: loginID });
            role = 'admin';
            redirectUrl = '/Dashboard'; 
        }
        if (user.userRole == 'manager') {
          user = await User.findOne({ userID: loginID });
          role = 'manager';
          redirectUrl = '/SalesReport'; 
      }

        if (!user || user.password !== password) {
            return res.status(400).send({ message: 'Invalid login ID or password' });
        }

       
        const token = jwt.sign({ id: user._id, role: role }, 'your_secret_key', { expiresIn: '1h' });

       
        res.status(200).send({ token, role, redirectUrl });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'An error occurred during login' });
    }
});

// // Route to fetch users
// app.get('/api/users', async (req, res) => {
//     try {
//       const users = await User.find();
//       res.json(users);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });


// Create user
app.post('/api/users', async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).send(user);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  // Read users
  app.get('/api/users', async (req, res) => {
    try {
      const users = await User.find({});
      res.send(users);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  // Read user by ID
  app.get('/api/users/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).send();
      }
      res.send(user);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  // Update user
  app.patch('/api/users/:id', async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body);
      if (!user) {
        return res.status(404).send();
      }
      res.send(user);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  // Delete user
  app.delete('/api/users/:id', async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).send();
      }
      res.send(user);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.post('/api/recordSale', async (req, res) => {
    try {
        const sale = new Sales({
            ...req.body,
            date: new Date()
        });
        await sale.save();
        res.status(201).send({ success: true, data: sale });
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
});



app.get('/api/getSales', async (req, res) => {
  try {
      console.log('Incoming request for getSales:', req);
      const sales = await Sales.find();
      res.status(200).send({ success: true, data: sales });
  } catch (error) {
      console.error('Error fetching sales:', error);
      res.status(400).send({ success: false, message: error.message });
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
