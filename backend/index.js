require('dotenv').config()
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const port = 4000 || process.env.PORT
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const cors = require('cors')
const { error } = require('console');
const { getMaxListeners } = require('events');
const { type } = require('os')
// This is your test secret API key.
const stripe = require("stripe")('sk_test_51PP0KJP3vlpoz5z2LKSr05hbfWMFlnFN0WLKu1FSgeQBHjp1JF7hj04rtaFqMGvFAbePsixx4vi3117vGIuIcQRP00JVgwW6gk');
const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

app.use(express.json())
app.use(express.static("public"));
app.use(cors())
app.use(bodyParser.json())

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "sgd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '22521011@gm.uit.edu.vn',
    pass: 'fgri ekov irph xwpw'
  }
})

app.post('/subscribe', async (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).send('Email is required')
  }

  try {
    await transporter.sendMail({
      from: '22521011@gm.uit.edu.vn', // Sender address
      to: email, // Receiver address
      subject: 'Subscription Confirmation',
      text: 'Thank you for subscribing to our newsletter! We pleased to give you a 50% discount when you buy directly at our shop next time'
    })

    res.send('Subscription successful')
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).send('Error sending subscription confirmation')
  }
})

// Database connection with MongoDB
mongoose.connect(
  'mongodb+srv://22520988:22520988@cluster0.zeztdiz.mongodb.net/e-commerce'
)

// API Creation
app.get('/', (req, res) => {
  res.send('Express App Is Running')
})

// Image Storage Engine
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    )
  }
})

const upload = multer({ storage: storage })

// Creating Upload Endpoint For Images
app.use('/images', express.static('upload/images'))

app.post('/upload', upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  })
})

// Schema for Creatin Products
const Product = mongoose.model('Product', {
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  new_price: {
    type: Number,
    required: true
  },
  old_price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  available: {
    type: Boolean,
    default: true
  }
})

app.post('/addproduct', async (req, res) => {
  let products = await Product.find({})
  let id
  if (products.length > 0) {
    let last_product_array = products.slice(-1)
    let last_product = last_product_array[0]
    id = last_product.id + 1
  } else {
    id = 1
  }

  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price
  })

  console.log(product)
  await product.save()
  console.log('Saved')
  res.json({ success: true, name: req.body.name })
})

// Creating API For Deleting Products
app.post('/removeproduct', async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id })
  console.log('Removed')
  res.json({ success: true, name: req.body.name })
})

// Creating API For Getting All Products
app.get('/allproducts', async (req, res) => {
  let products = await Product.find({})
  console.log('All Products Fetched')
  res.send(products)
})

// Schema Creating For User Model
const Users = mongoose.model('Users', {
  name: {
    type: String
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  cartData: {
    type: Object
  },
  date: {
    type: Date,
    default: Date.now
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
})

// Creating Endpoint for registering users
app.post('/signup', async (req, res) => {
  let check = await Users.findOne({ email: req.body.email })
  if (check) {
    return res
      .status(400)
      .json({ success: false, errors: 'Email already exists' })
  }

  let cart = {}
  for (let i = 0; i < 300; i++) {
    cart[i] = 0
  }

  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart
  })
  await user.save()

  const data = {
    user: {
      id: user.id
    }
  }

  const token = jwt.sign(data, 'secret_ecom')
  const userData = await Users.findById(user.id).select('-password')

  res.json({ success: true, token,user: userData })
})

// Creating Endpoint for login users
app.post('/login', async (req, res) => {
  let user = await Users.findOne({ email: req.body.email })
  if (user) {
    const passCompare = req.body.password === user.password
    if (passCompare) {
      const data = {
        user: {
          id: user.id
        }
      }
      const token = jwt.sign(data, 'secret_ecom')
      const userData = await Users.findById(user.id).select('-password')
      res.json({ success: true, token, user: userData })
    } else {
      res.json({ success: false, errors: 'Invalid Password' })
    }
  } else {
    res.json({ success: false, errors: 'Wrong Email' })
  }
})

// Creating endpoint for newcollection data
app.get('/newcollections', async (req, res) => {
  let products = await Product.find({})
  let newcollection = products.slice(1).slice(-8)
  console.log('NewCollection Fetched')
  res.send(newcollection)
})

// Creating endpoint for popular in women, men and kid section
app.get('/popularinwomen', async (req, res) => {
  let products = await Product.find({ category: 'women' })
  let popular_in_women = products.slice(0, 4)
  console.log('Popular in women fetched')
  res.send(popular_in_women)
})

app.get('/popularinmen', async (req, res) => {
  let products = await Product.find({ category: 'men' })
  let popular_in_men = products.slice(0, 4)
  console.log('Popular in men fetched')
  res.send(popular_in_men)
})

app.get('/popularinkid', async (req, res) => {
  let products = await Product.find({ category: 'kid' })
  let popular_in_kid = products.slice(0, 4)
  console.log('Popular in kid fetched')
  res.send(popular_in_kid)
})

// Creating middelware to fetch user
const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token')
  if (!token) {
    res.status(401).send({ errors: 'Please Authenticate Using a Valid Way' })
  } else {
    try {
      const data = jwt.verify(token, 'secret_ecom')
      req.user = data.user
      next()
    } catch (error) {
      res
        .status(401)
        .send({ errors: 'Please authenticate using a valid token' })
    }
  }
}

// Creating endpoint for adding products to cart
app.post('/addtocart', fetchUser, async (req, res) => {
  console.log('Added', req.body.itemId)
  let userData = await Users.findOne({ _id: req.user.id })
  userData.cartData[req.body.itemId] += 1
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  )
  res.send('Added')
})

// creating endpoint fore removing products from cartdata
app.post('/removefromcart', fetchUser, async (req, res) => {
  console.log('removed', req.body.itemId)
  let userData = await Users.findOne({ _id: req.user.id })
  if (userData.cartData[req.body.itemId] > 0) {
    userData.cartData[req.body.itemId] -= 1
  }
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  )
  res.send('Removed')
})

// Creating endpoint for getting cartdata
app.post('/getcart', fetchUser, async (req, res) => {
  console.log('GetCart')
  let userData = await Users.findOne({ _id: req.user.id })
  res.json(userData.cartData)
})

// Listening on Port
app.listen(port, error => {
  if (!error) {
    console.log('Server is running on port: ' + port)
  } else {
    console.log('Error: ' + error)
  }
})
