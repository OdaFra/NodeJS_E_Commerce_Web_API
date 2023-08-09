const express = require("express");
const app = express();
const morgan = require("morgan");

const mongoose = require("mongoose");

require("dotenv/config");

const api = process.env.API_URL;
const connectMongodb = process.env.CONNECTION_STRING;

//Generar schema para mongosee

const productSchema = mongoose.Schema({
  name: String,
  image: String,
  countInStock: {
    type: Number,
    required: true
  },
})

//En base al schema generado, creamos el modelo

const Product = mongoose.model('Products', productSchema);

//Milddware
//Instancia necesaria para aplicar parseo de json

app.use(express.json());
app.use(morgan("tiny"));

mongoose.connect(connectMongodb).then(() => {
  console.log('Database Connection is ready..!')
}).catch((err) => {
  console.log(err)
});

app.get(`${api}/products`, async (req, res) =>  {
  const productList = await Product.find()
  if(!productList){
    res.status(500).json({
      success:false
    })
  }
  res.send(productList)
  // const products = {
  //   id: 1,
  //   name: "Notebook",
  //   precio: 1200,
  //   iamge: "notebook_url",
  // };
  //res.send(products);
});

app.post(`${api}/products`, (req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  })
  product.save().then((createdProduct=>{
    res.status(201).json(createdProduct);
  })).catch((err)=>{
    res.status(500).json(
      {
        error: err,
        success: false
      }
    )
  });
  // const newProduct = req.body;
  // res.send(newProduct);
});

app.listen(3000, () => {
  console.log(api);
  console.log("Server is running http://localhost:3000");
});
