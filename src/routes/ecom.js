const express = require('express')
const router = express.Router()
const Bag = require("../models/bag.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../models/User");
const axios = require("axios");
const { requireAuth, redirectIfLoggedIn } = require('../middleware/userAuth')

const Product = require("../models/product.model");

router.get("/address", async (req, res) => {
    return res.render("ejs/address", {});
  });
  // router.get("/bag", (req, res) => {
  //   return res.render('ejs/emptyBag');
  // });
  
  router.get("/bag",requireAuth, async (req, res) => {
    try {

      const user=req.user
  
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
          Math.ceil((product.price * (100 - 0)) / 100) *
          bag[i].quantity;
        quantity += bag[i].quantity;
  
        actualPrice += product.price * bag[i].quantity;
      }
  
      let dis = actualPrice - total;
  
      return res.render("ejs/bag", { bag: prodArr, total, quantity:1, dis });
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
  
  router.get("/bag/addtoCart/:id",requireAuth, async (req, res) => {
    let  prodId  = req.params.id;
    let user = req.user
    let userId=user._id
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
  
        return res.redirect('/bag');
      }
    }
  
    user = await User.findByIdAndUpdate(
      userId,
      { bagItems: [...bag, { productId: prodId }] },
      { new: true }
    )
      .lean()
      .exec();
      return res.redirect('/bag');
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
  router.get("/moda/:id",requireAuth, async (req, res) => {
    try {
      const el = await Product.findById(req.params.id).lean().exec();
      const user=req.user
      return res.render("\ejs/moda", {
        el
        ,user
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
  router.get("/products",requireAuth, async (req, res) => {
    const products = await Product.find({}).lean();
    const user=req.user
    return res.render("ejs/products", {
      products: products,
      user
    });
  });
  
  // Routes for Categories
  
  
  router.post("/products", async (req, res) => {
    const product = await Product.create(req.body);
    res.json(product);
  });
  router.get("/suggestedProducts",requireAuth, async (req, res) => {
    const products =[]
    const likedPosts=req.user.likedPosts
    // console.log(likedPosts);
    let allpost=[]
    var i=0;
        for(i=0;i<likedPosts.length;i++){
            await axios
            .post('http://127.0.0.1:5000/product', {
                url: likedPosts[i]
            })
            .then(res => {
                console.log(res.data)
                var f=0
                var cur=''
                for(var i=0;i<res.data.length;i++){
                  if(f===0&&res.data[i]=="'"){
                    f=1
                  }
                  else if(f===1&&res.data[i]=="'"){
                    products.push(cur)
                    cur=''
                    f=0
                  }else if(f===1){
                    cur+=res.data[i]
                  } 
                }
                //allpost.push(res.data);
            })
            .catch(error => {
                //console.log('error')
            })
        }

    //const user=req.user
    if(i===likedPosts.length){
      for(var post of products){
        const c=await Product.findOne({images:post})
        if(c!==null){
          allpost.push(c)
        }
      }
      console.log(products)
      return res.render("ejs/products2", {
        products: allpost,
        user
      });
    }
  });

// Routes for Categories

router.get("/product2/ethnic",requireAuth, async (req, res) => {
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



  
  
  
  router.get("/wishlist",requireAuth, async (req, res) => {
    try {
      let user =req.user
  
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
  
      return res.render("ejs/wishlist", { items: prodArr,user });
    } catch (err) {
      res.send(err.message);
    }
  });
  
  router.get("/wishlist/add/:id",requireAuth, async (req, res) => {
    const user=req.user
    const userId=req.user._id
    const prodId=req.params.id
  
    let bag = user.wishListItems;
  
    for (let i = 0; i < bag.length; i++) {
      if (bag[i].productId == prodId) {
        return res.redirect('/wishlist');
      }
    }
  
    user = await User.findByIdAndUpdate(
      userId,
      { wishListItems: [...bag, { productId: prodId }] },
      { new: true }
    )
      .lean()
      .exec();
    return res.redirect('/wishlist')
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