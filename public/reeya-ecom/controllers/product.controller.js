const express = require("express");

const Product = require("../models/product.model");

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.find({}).lean();
  return res.render("ejs/products", {
    products: products,
  });
});

// Routes for Categories

router.get("/type/:id", async (req, res) => {
  const products = await Product.find({ category: req.params.id, gender: "men" }).lean();
  //   res.json(products);
  return res.render("ejs/products", {
    products: products,
  });
});

router.get("/type/:cat/:id", async (req, res) => {
  const products = await Product.find({ category: req.params.cat, brandName: req.params.id, gender: "men" }).lean();
  //   res.json(products);
  return res.render("ejs/products", {
    products: products,
  });
});

router.get("/sortltoh/:category/", async (req, res) => {
  const products = await Product.find({ category: req.params.category, gender: "men" }).lean();
  //   res.json(products);

  products.sort(function (a, b) {
    return (a.price * (100 - a.discount) / 100) - (b.price * (100 - b.discount) / 100)
  })
  return res.render("ejs/products", {
    products: products,
  });
});

router.get("/sort/:category/", async (req, res) => {
  const products = await Product.find({ category: req.params.category, gender: "men" }).sort({ discount: -1 }).lean();
  //   res.json(products);

  // products.sort(function (a, b) {
  //   return (b.price * (100 - b.discount) / 100) - (a.price * (100 - a.discount) / 100)
  // })
  return res.render("ejs/products", {
    products: products,
  });
});

router.get("/sorthtol/:category/", async (req, res) => {
  const products = await Product.find({ category: req.params.category, gender: "men" }).lean();
  //   res.json(products);

  products.sort(function (a, b) {
    return (b.price * (100 - b.discount) / 100) - (a.price * (100 - a.discount) / 100)
  })
  return res.render("ejs/products", {
    products: products,
  });
});

router.get("/color/:color/:category", async (req, res) => {
  const products = await Product.find({ category: req.params.category, color: req.params.color, gender: "men" }).lean();
  //   res.json(products);

  return res.render("ejs/products", {
    products: products,
  });
});


router.get("/price/:x/:y/:category/", async (req, res) => {
  const products = await Product.find({ category: req.params.category, gender: "men" }).lean();
  //   res.json(products);
  let newproducts = products.filter(function (el) {
    return el.price * ((100 - el.discount) / 100) < req.params.x && el.price * ((100 - el.discount)) / 100 > req.params.y;
  });
  return res.render("ejs/products", {
    products: newproducts,
  });
});



router.post("/", async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
});



module.exports = router;
