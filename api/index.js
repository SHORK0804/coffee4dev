const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Simplify and correct CORS configuration
const corsConfig = {
  origin: "https://coffee4dev.vercel.app/", 
};

app.use(cors(corsConfig)); 
app.use(express.json()); 

// Optionally, you can remove this manual headers setup if the CORS middleware is configured correctly
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-auth-password");
  next();
});

const connectDB = require("./connectMongo");
connectDB();

const ProductModel = require("./models/product.model");
const OrderModel = require("./models/order.model");

app.get("/api/v1/products", async (req, res) => {
  try {
    const data = await ProductModel.find({});
    const response = data;
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

app.get("/api/v1/products/:id", async (req, res) => {
  try {
    const data = await ProductModel.findById(req.params.id);
    if (data) {
      return res.status(200).json({
        msg: "Ok",
        data,
      });
    }
    return res.status(404).json({
      msg: "Not Found",
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
});

app.post("/api/v1/orders", async (req, res) => {
  try {
    const { productname, productprice, quantity, name, phone, address } = req.body;
    const order = new OrderModel({
      productname,
      productprice,
      quantity,
      name,
      phone,
      address,
    });
    const data = await order.save();
    return res.status(200).json({
      data,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000; // Default to port 5000 if PORT is not set

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
