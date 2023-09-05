const mongoose = require("mongoose");



//Generar schema para mongosee
const productSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: {
      type: Number,
      required: true
    },
  })
  
//En base al schema generado, creamos el modelo a ser exportado
exports.Product = mongoose.model('Products', productSchema);