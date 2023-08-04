const express = require('express');

const app = express();

require('dotenv/config');

const api = process.env.API_URL;

//Milddware
//Instancia necesaria para aplicar parseo de json

app.use(express.json())

app.get(`${api}/products`, (req, res)=>{
    const products ={
        id: 1, 
        name: 'Notebook',
        precio:1200,
        iamge:'notebook_url'
    }
res.send(products)
});

app.post(`${api}/products`, (req, res)=>{
    const newProduct = req.body
res.send(newProduct)
});

app.listen(3000,() =>{
    console.log(api)
    console.log('Server is running http://localhost:3000')
});

