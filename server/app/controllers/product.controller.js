const db = require("../models");
const Product = db.product;

exports.listProducts = (req, res) => {
  Product.findAll({
    order: [["createdAt", "DESC"]],
  })
    .then((products) => {
      res.send(products);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
