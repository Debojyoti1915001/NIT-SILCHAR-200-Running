const express = require("express");

const Bag = require("../models/bag.model");

const User = require("../models/user.model");

const Product = require("../models/product.model");

const router = express.Router();

router.get("/", (req, res) => {
  return res.render("ejs/emptyBag");
});

router.get("/:userId", async (req, res) => {
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

router.post('/deleteItem/', async (req, res) => {
  let { userId, prodId } = req.body;
  let user = await User.findById(userId).lean().exec();


  let bag = user.bagItems

  let newBag = bag.filter(item => {
    return item.productId != prodId
  })

  user = await User.findByIdAndUpdate(userId, { bagItems: newBag }, { new: true }).lean().exec();
  return res.json(user)

})

router.post('/removeitems/', async (req, res) => {
  let { userId } = req.body;
  let user = await User.findById(userId).lean().exec();


  user = await User.findByIdAndUpdate(userId, { bagItems: [] }, { new: true }).lean().exec();
  return res.json(user)

})

router.post("/addtoCart", async (req, res) => {
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

// router.post("/bag", async (req, res) => {
//   const { productId, quantity, name, price } = req.body;

//   const userId = "5de7ffa74fff640a0491bc4f"; //TODO: the logged in user id

//   try {
//     let bag = await Bag.findOne({ userId });

//     if (bag) {
//       //bag exists for user
//       let itemIndex = bag.products.findIndex((p) => p.productId == productId);

//       if (itemIndex > -1) {
//         //product exists in the bag, update the quantity
//         let productItem = bag.products[itemIndex];
//         productItem.quantity = quantity;
//         bag.products[itemIndex] = productItem;
//       } else {
//         //product does not exists in bag, add new item
//         bag.products.push({ productId, quantity, name, price });
//       }
//       bag = await bag.save();
//       return res.status(201).send(bag);
//     } else {
//       //no bag for user, create new bag
//       const newBag = await Bag.create({
//         userId,
//         products: [{ productId, quantity, name, price }],
//       });

//       return res.status(201).send(newBag);
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Something went wrong");
//   }
// });

module.exports = router;
