require("dotenv").config();
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const port = 4000 || process.env.PORT;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { error } = require("console");
const { getMaxListeners } = require("events");
const { type } = require("os");
const axios = require("axios").default; // npm install axios
const CryptoJS = require("crypto-js"); // npm install crypto-js
const moment = require("moment"); // npm install moment
const qs = require("qs");

app.use(express.json());
app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

//  ****************************** PAYMENT WITH MOMO ******************************
//
//

var accessKey = "F8BBA842ECF85";
var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
// creating endpoint for payment
app.post("/payment", async (req, res) => {
  //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
  //parameters
  var orderInfo = "pay with MoMo";

  var partnerCode = "MOMO";
  // ridirect to /cart after payment success
  var redirectUrl = "http://localhost:3000/cart";
  // change ipnUrl each time open this project by using ngrok in cmd: "ngrok http 4000" to public localhost:4000 to internet in order to momo server can call back to update order
  var ipnUrl =
    "https://3ebe-2402-800-63a8-c599-34b9-19d6-1010-66b3.ngrok-free.app/callback";
  var requestType = "payWithMethod";
  var amount = req.body?.amount;
  var orderId = partnerCode + new Date().getTime();
  var requestId = orderId;
  var extraData = "";
  var orderGroupId = "";
  var autoCapture = true;
  var lang = "vi";

  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;
  //puts raw signature
  console.log("--------------------RAW SIGNATURE----------------");
  console.log(rawSignature);
  //signature
  const crypto = require("crypto");
  var signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");
  console.log("--------------------SIGNATURE----------------");
  console.log(signature);

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature,
    email: req.body.user_email,
  });

  //option for axios
  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/create",
    headers: {
      "Content-Type": "application/json",
      "Content-Lenght": Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };

  let result;
  try {
    result = await axios(options);

    // Save payment to database after payment request sent to MoMo
    const payment = new Payment({
      orderId: orderId,
      user_email: req.body.user_email,
      amount: amount,
    });
    console.log("Payment created: ", payment);
    await payment.save();

    return res.status(200).json(result.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      statusCode: 500,
      message: "server error",
    });
  }
});
// creating endpoint for callback to update order
app.post("/callback", async (req, res) => {
  console.log("callback:: ");
  console.log(req.body);
  const requestBody = {
    orderId: req.body.orderId,
    email: req.body.user_email,
  };
  await fetch("http://localhost:4000/transaction-status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
});
// sometime callback can't resolve, so we need to check order status by calling to MoMo server
// creating endpoint for check order status
app.post("/transaction-status", async (req, res) => {
  const { orderId } = req.body.orderId;

  const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

  const crypto = require("crypto");
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = JSON.stringify({
    partnerCode: "MOMO",
    requestId: orderId,
    orderId: orderId,
    signature: signature,
    lang: "vi",
  });

  //option for axios
  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/query",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestBody,
  };
  let result = await axios(options);
  if (result.data.resultCode === 0) {
    await Payment.findOneAndUpdate(
      { orderId: orderId },
      {
        status: "success",
      }
    );
    console.log("Updated payment status");
    let cart = {};
    for (let index = 0; index < 300 + 1; index++) {
      cart[index] = 0;
    }
    await Users.findOneAndUpdate({ email: req.body.email }, { cartData: cart });
    console.log("Removed cart");
  }
  return res.status(200).json(result.data);
});
//
//
//  ****************************** PAYMENT WITH MOMO ******************************

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "22521011@gm.uit.edu.vn",
    pass: "fgri ekov irph xwpw",
  },
});

app.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send("Email is required");
  }

  try {
    await transporter.sendMail({
      from: "22521011@gm.uit.edu.vn", // Sender address
      to: email, // Receiver address
      subject: "Subscription Confirmation",
      text: "Thank you for subscribing to our newsletter! We pleased to give you a 50% discount when you buy directly at our shop next time",
    });

    res.send("Subscription successful");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending subscription confirmation");
  }
});

// Database connection with MongoDB
mongoose.connect(
  "mongodb+srv://22520988:22520988@cluster0.zeztdiz.mongodb.net/e-commerce"
);

// API Creation
app.get("/", (req, res) => {
  res.send("Express App Is Running");
});

// Image Storage Engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// Creating Upload Endpoint For Images
app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

// Schema for Creating Products
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }

  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  console.log(product);
  await product.save();
  console.log("Saved");
  res.json({ success: true, name: req.body.name });
});

// Creating API For Deleting Products
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed");
  res.json({ success: true, name: req.body.name });
});

// Creating API For Getting All Products
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  console.log("All Products Fetched");
  res.send(products);
});

// Schema Creating For User Model
const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  gender: {
    type: String,
  },
  age: {
    type: Number,
  },
  address: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

// Creating endpoint for getting all users from database
app.get("/getusers", async (req, res) => {
  const users = await Users.find({});
  console.log("All Users Fetched");
  res.json(users); // Send the users as a JSON response
});

// Schema for Creating Payment
const Payment = mongoose.model("Payment", {
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  user_email: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "pending",
  },
});

// Creating Endpoint for registering users
app.post("/signup", async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res
      .status(400)
      .json({ success: false, errors: "Email already exists" });
  }

  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }

  const user = new Users({
    name: req.body.username,
    gender: req.body.gender,
    age: req.body.age,
    address: req.body.address,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });
  await user.save();

  const data = {
    user: {
      id: user.id,
    },
  };

  const token = jwt.sign(data, "secret_ecom");
  const userData = await Users.findById(user.id).select("-password");

  res.json({ success: true, token, user: userData });
});

// Creating Endpoint for login users
app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "secret_ecom");
      const userData = await Users.findById(user.id).select("-password");
      res.json({ success: true, token, user: userData });
    } else {
      res.json({ success: false, errors: "Invalid Password" });
    }
  } else {
    res.json({ success: false, errors: "Wrong Email" });
  }
});

// Creating endpoint for newcollection data
app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  console.log("NewCollection Fetched");
  res.send(newcollection);
});

// Creating endpoint for popular in women, men and kid section
app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({ category: "women" });
  let popular_in_women = products.slice(0, 4);
  console.log("Popular in women fetched");
  res.send(popular_in_women);
});

app.get("/popularinmen", async (req, res) => {
  let products = await Product.find({ category: "men" });
  let popular_in_men = products.slice(0, 4);
  console.log("Popular in men fetched");
  res.send(popular_in_men);
});

app.get("/popularinkid", async (req, res) => {
  let products = await Product.find({ category: "kid" });
  let popular_in_kid = products.slice(0, 4);
  console.log("Popular in kid fetched");
  res.send(popular_in_kid);
});

// Creating middelware to fetch user
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ errors: "Please Authenticate Using a Valid Way" });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");
      req.user = data.user;
      next();
    } catch (error) {
      res
        .status(401)
        .send({ errors: "Please authenticate using a valid token" });
    }
  }
};
// Creating endpoint for update user data
app.post("/updateuser", async (req, res) => {
  try {
    await Users.findOneAndUpdate(
      { email: req.body.email },
      {
        name: req.body.name,
        gender: req.body.gender,
        age: req.body.age,
        address: req.body.address,
        password: req.body.password,
      }
    );
    res.send("Updated user data successfully");
  } catch (error) {
    res.send(`${error}`);
  }
});

// Creating endpoint for adding products to cart
app.post("/addtocart", fetchUser, async (req, res) => {
  console.log("Added", req.body.itemId);
  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Added");
});

// creating endpoint fore removing products from cartdata
app.post("/removefromcart", fetchUser, async (req, res) => {
  console.log("removed", req.body.itemId);
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0) {
    userData.cartData[req.body.itemId] -= 1;
  }
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Removed");
});

// Creating endpoint for getting cartdata
app.post("/getcart", fetchUser, async (req, res) => {
  console.log("GetCart");
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});

// Listening on Port
app.listen(port, (error) => {
  if (!error) {
    console.log("Server is running on port: " + port);
  } else {
    console.log("Error: " + error);
  }
});
