const express = require("express");

const Product = require("../models/product.model");

const router = express.Router();

router.get("/", async (req, res) => {
    const products = await Product.find({}).lean();
    return res.render("ejs/products2", {
        products: products,
    });
});

// Routes for Categories

router.get("/ethnic", async (req, res) => {
    const products = await Product.find({ $or: [{ category: "Saree" }, { category: "Kurta" }] }).lean();
    //   res.json(products);
    return res.render("ejs/products2", {
        products: products,
    });
});

router.get("/brand/:id", async (req, res) => {
    const products = await Product.find({ brandName: req.params.id }).lean();
    //   res.json(products);
    return res.render("ejs/products2", {
        products: products,
    });
});

router.get("/sortltoh/ethnic/", async (req, res) => {
    const products = await Product.find({ $or: [{ category: "Saree" }, { category: "Kurta" }] }).lean();
    //   res.json(products);

    products.sort(function (a, b) {
        return (a.price * (100 - a.discount) / 100) - (b.price * (100 - b.discount) / 100)
    })
    return res.render("ejs/products2", {
        products: products,
    });
});

router.get("/sort/ethnic/", async (req, res) => {
    const products = await Product.find({ $or: [{ category: "Saree" }, { category: "Kurta" }] }).sort({ discount: -1 }).lean();
    //   res.json(products);

    // products.sort(function (a, b) {
    //   return (b.price * (100 - b.discount) / 100) - (a.price * (100 - a.discount) / 100)
    // })
    return res.render("ejs/products2", {
        products: products,
    });
});

router.get("/sorthtol/ethnic/", async (req, res) => {
    const products = await Product.find({ $or: [{ category: "Saree" }, { category: "Kurta" }] }).lean();
    //   res.json(products);

    products.sort(function (a, b) {
        return (b.price * (100 - b.discount) / 100) - (a.price * (100 - a.discount) / 100)
    })
    return res.render("ejs/products2", {
        products: products,
    });
});

router.get("/color/:color/ethnic", async (req, res) => {
    const products = await Product.find({ $or: [{ category: "Saree" }, { category: "Kurta" }] }).lean();
    //   res.json(products);

    let items = products.filter(function (el) {
        return el.color == req.params.color;
    })

    return res.render("ejs/products2", {
        products: items,
    });
});


router.get("/price/:x/:y/", async (req, res) => {
    const products = await Product.find({ $or: [{ category: "Saree" }, { category: "Kurta" }] }).lean();
    //   res.json(products);
    let newproducts = products.filter(function (el) {
        return el.price * ((100 - el.discount) / 100) < req.params.x && el.price * ((100 - el.discount)) / 100 > req.params.y;
    });
    return res.render("ejs/products2", {
        products: newproducts,
    });
});



router.post("/", async (req, res) => {
    const product = await Product.create(req.body);
    res.json(product);
});



module.exports = router;
