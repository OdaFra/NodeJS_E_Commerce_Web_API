const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv/config");

const api = process.env.API_URL;
const connectMongodb = process.env.CONNECTION_STRING;

//Milddware
//Instancia necesaria para aplicar parseo de json

app.use(cors());
app.options("*", cors());


app.use(express.json());
app.use(morgan("tiny"));


//Routers

const categoriesRoutes=require("./routers/categories");
const productsRouter = require("./routers/products");
const userRoutes=require("./routers/users");
const ordersRoutes=require("./routers/ordes");


app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRouter);
app.use(`${api}/users`, userRoutes);
app.use(`${api}/orders`, ordersRoutes);


mongoose.connect(connectMongodb).then(() => {
  console.log('Database Connection is ready..!')
}).catch((err) => {
  console.log(err)
});


app.listen(3000, () => {
  console.log(api);
  console.log("Server is running http://localhost:3000");
});
