const express = require('express')
const router = express.Router()
const Bag = require("../models/bag.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const Product = require("../models/product.model");

router.get("/address", async (req, res) => {
    return res.render("ejs/address", {});
  });
  router.get("/bag", (req, res) => {
    return res.render('ejs/emptyBag');
  });
  
  router.get("/bag/:userId", async (req, res) => {
    try {
      let user = await User.findById(req.params.userId);
  
      let bag = user.bagItems;
  
      // console.log(bag);
  
      if (bag.length == 0) {
        return res.render("ejs/emptyBag");
      }
  
      let prodArr = [];
  
      // bag.forEach(async function (item) {
      //   console.log(item);
      //   let product = await Product.findById(item.productId);
      //   prodArr.push([1])
      // })
      let total = 0;
      let quantity = 0;
      let actualPrice = 0;
  
      for (let i = 0; i < bag.length; i++) {
        let product = await Product.findById(bag[i].productId);
        prodArr.push([product, bag[i].quantity]);
  
        total +=
          Math.ceil((product.price * (100 - product.discount)) / 100) *
          bag[i].quantity;
        quantity += bag[i].quantity;
  
        actualPrice += product.price * bag[i].quantity;
      }
  
      let dis = actualPrice - total;
  
      return res.render("ejs/bag", { bag: prodArr, total, quantity, dis });
    } catch (err) {
      res.send(err.message);
    }
  });
  
  router.post('/bag/deleteItem/', async (req, res) => {
    let { userId, prodId } = req.body;
    let user = await User.findById(userId).lean().exec();
  
  
    let bag = user.bagItems
  
    let newBag = bag.filter(item => {
      return item.productId != prodId
    })
  
    user = await User.findByIdAndUpdate(userId, { bagItems: newBag }, { new: true }).lean().exec();
    return res.json(user)
  
  })
  
  router.post('/bag/removeitems/', async (req, res) => {
    let { userId } = req.body;
    let user = await User.findById(userId).lean().exec();
  
  
    user = await User.findByIdAndUpdate(userId, { bagItems: [] }, { new: true }).lean().exec();
    return res.json(user)
  
  })
  
  router.post("/bag/addtoCart", async (req, res) => {
    let { userId, prodId } = req.body;
    let user = await User.findById(userId).lean().exec();
  
    let bag = user.bagItems;
  
    for (let i = 0; i < bag.length; i++) {
      if (bag[i].productId == prodId) {
        bag[i].quantity++;
        user = await User.findByIdAndUpdate(
          userId,
          { bagItems: bag },
          { new: true }
        )
          .lean()
          .exec();
  
        return res.json(user);
      }
    }
  
    user = await User.findByIdAndUpdate(
      userId,
      { bagItems: [...bag, { productId: prodId }] },
      { new: true }
    )
      .lean()
      .exec();
    return res.json(user);
  });
  
  router.get("/home", async (req, res) => {
    return res.render("ejs/home", {});
  });
  
  router.get("/home/user/:id", async (req, res) => {
    let user = await User.findById(req.params.id);
    let name = user.name;
    return res.render("ejs/home", { name });
  });
  router.get("/login", async (req, res) => {
    return res.render("ejs/login", {});
  });
  router.get("/mens", async (req, res) => {
    return res.render("ejs/mens", {});
  });
  router.get("/moda/:id", async (req, res) => {
    try {
      const el = await Product.findById(req.params.id).lean().exec();
      return res.render("\ejs/moda", {
        el
      });
    } catch (error) {
      res.send(error.message);
    }
  });
  router.get("/payment", async (req, res) => {
    return res.render("ejs/payment", {});
  });
  
  
  router.get("/payment/process", async (req, res) => {
    return res.render("ejs/successfulPayment");
  });
  router.get("/products", async (req, res) => {
    const products = await Product.find({}).lean();
    return res.render("ejs/products", {
      products: products,
    });
  });
  
  // Routes for Categories
  
  
  router.post("/products", async (req, res) => {
    const product = await Product.create(req.body);
    res.json(product);
  });
  router.get("/product2", async (req, res) => {
    const products = await Product.find({}).lean();
    return res.render("ejs/products2", {
        products: products,
    });
});

// Routes for Categories

router.get("/product2/ethnic", async (req, res) => {
    const products = await Product.find({ $or: [{ category: "Saree" }, { category: "Kurta" }] }).lean();
    //   res.json(products);
    return res.render("ejs/products2", {
        products: products,
    });
});

router.get("/product2/brand/:id", async (req, res) => {
    const products = await Product.find({ brandName: req.params.id }).lean();
    //   res.json(products);
    return res.render("ejs/products2", {
        products: products,
    });
});

router.post("/product2", async (req, res) => {
    const product = await Product.create(req.body);
    res.json(product);
});



  
  router.get("/wishlist", (req, res) => {
    return res.render("ejs/emptyWL");
  });
  
  router.get("/wishlist/:userId", async (req, res) => {
    try {
      let user = await User.findById(req.params.userId);
  
      let bag = user.wishListItems;
  
      if (bag.length === 0) {
        return res.render("ejs/emptyWL");
      }
  
      // console.log(bag);
  
      let prodArr = [];
      for (let i = 0; i < bag.length; i++) {
        let product = await Product.findById(bag[i].productId);
        prodArr.push([product, 1]);
      }
  
      return res.render("ejs/wishlist", { items: prodArr });
    } catch (err) {
      res.send(err.message);
    }
  });
  
  router.post("/wishlist/add", async (req, res) => {
    let { userId, prodId } = req.body;
    let user = await User.findById(userId).lean().exec();
  
    let bag = user.wishListItems;
  
    for (let i = 0; i < bag.length; i++) {
      if (bag[i].productId == prodId) {
        return res.send("Item Already Added");
      }
    }
  
    user = await User.findByIdAndUpdate(
      userId,
      { wishListItems: [...bag, { productId: prodId }] },
      { new: true }
    )
      .lean()
      .exec();
    return res.json(user);
  });
  
  router.post("/wishlist/deleteItem/", async (req, res) => {
    let { userId, prodId } = req.body;
    let user = await User.findById(userId).lean().exec();
  
    let bag = user.wishListItems;
  
    let newBag = bag.filter((item) => {
      return item.productId != prodId;
    });
  
    user = await User.findByIdAndUpdate(
      userId,
      { wishListItems: newBag },
      { new: true }
    )
      .lean()
      .exec();
    return res.json(user);
  });
  
  
  module.exports = router;