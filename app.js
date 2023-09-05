const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");

require("dotenv/config");

const productsRouter = require('./routers/products');

const api = process.env.API_URL;
const connectMongodb = process.env.CONNECTION_STRING;

//Milddware
//Instancia necesaria para aplicar parseo de json

app.use(express.json());
app.use(morgan("tiny"));


//Routers
app.use(`${api}/products`, productsRouter);

mongoose.connect(connectMongodb).then(() => {
  console.log('Database Connection is ready..!')
}).catch((err) => {
  console.log(err)
});


app.listen(3000, () => {
  console.log(api);
  console.log("Server is running http://localhost:3000");
});
