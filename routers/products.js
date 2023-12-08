const express = require("express");
const { Product } = require("../models/product");
const { Category } = require("../models/category");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

//Validation extension

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

// Add image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error('Invalid image type');

    if (isValid){
      uploadError = null;
    }
    
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {

    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

router.get(`/`, async (req, res) => {
  //Ejemplo de query parameters http://localhost:3000/api/product?category=2345,2345
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }

  const productList = await Product.find(filter).populate("category"); //.select('name image');

  if (!productList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(productList);
});

router.get(`/:id`, async (req, res) => {
  const productList = await Product.findById(req.params.id).populate(
    "category"
  );
  if (!productList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(productList);
});

router.post(`/`, uploadOptions.single("image"), async (req, res) => {
  const category = await Category.findById(req.body.category);

  if (!category) return res.status(400).send("Invalid Category");

  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  var product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`, //full path, example http://localhost:3000/public/uplodas/image-20231208  //req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  product = await product.save();

  if (!product) return res.status(500).send("The product cannot be created");

  res.send(product);
});

router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("Invalid Product Id");
  }

  const category = await Category.findById(req.body.category);

  if (!category) return res.status(400).send("Invalid Category");

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );
  if (!product) return res.status(500).send("The product cannot be update!");

  res.send(product);
});

// Delete
router.delete("/:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        return res.status(200).json({
          success: true,
          message: "The product is delete",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Product not found!!!",
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        success: false,
        error: err,
      });
    });
});

router.get(`/get/count`, async (req, res) => {
  const productCount = await Product.countDocuments({});
  if (!productCount) {
    res.status(500).json({
      success: false,
    });
  }
  res.send({ productCount: productCount });
});

router.get(`/get/featured`, async (req, res) => {
  const products = await Product.find({
    isFeatured: true,
  });
  if (!products) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(products);
});

router.get(`/get/featured/:count`, async (req, res) => {
  const count = req.params.count ? req.params.count : 0;

  const products = await Product.find({
    isFeatured: true,
  }).limit(+count);
  if (!products) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(products);
});

module.exports = router;
