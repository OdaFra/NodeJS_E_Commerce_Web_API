const express = require("express");
const app = express();
const morgan = require("morgan");

const mongoose = require("mongoose");

require("dotenv/config");

const api = process.env.API_URL;
const connectMongodb = process.env.CONNECTION_STRING;

//Milddware
//Instancia necesaria para aplicar parseo de json

app.use(express.json());
app.use(morgan("tiny"));

mongoose.connect(connectMongodb).then(() => {
    console.log('Database Connection is ready..!')
}).catch((err)=>{
    console.log(err)
});

app.get(`${api}/products`, (req, res) => {
  const products = {
    id: 1,
    name: "Notebook",
    precio: 1200,
    iamge: "notebook_url",
  };
  res.send(products);
});

app.post(`${api}/products`, (req, res) => {
  const newProduct = req.body;
  res.send(newProduct);
});

app.listen(3000, () => {
  console.log(api);
  console.log("Server is running http://localhost:3000");
});
