const db = require("../models");
const Product = db.product;
const Category = db.category;

exports.listProducts = (req, res) => {
  Product.findAll({
    include: Category,
    order: [["createdAt", "DESC"]],
  })
    .then((products) => {
      res.send(products);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.listCategories = (req, res) => {
  Category.findAll({
    order: [["createdAt", "DESC"]],
  })
    .then((categories) => {
      res.send(categories);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
