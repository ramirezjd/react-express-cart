const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081",
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Role = db.role;
const User = db.user;
const Product = db.product;
const Category = db.category;

//db.sequelize.sync();
// force: true will drop the table if it already exists
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync Database with { force: true }");
  initial();
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Base address is responding, so far so good so what." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/product.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is currently running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "admin",
  });

  User.create({
    id: 1,
    username: "baseuser",
    firstName: "Base",
    lastName: "User",
    email: "base@user.com",
    password: "$2a$08$1yPvEgDGAcOXlG3UE8vrVeUoB5r2R7hODO7UwvSQU.49eK3kqDfQS",
  }).then((user) => {
    user.setRoles([1]);
  });

  User.create({
    id: 2,
    username: "baseadmin",
    firstName: "Admin",
    lastName: "User",
    email: "base@admin.com",
    password: "$2a$08$1yPvEgDGAcOXlG3UE8vrVeUoB5r2R7hODO7UwvSQU.49eK3kqDfQS",
  }).then((user) => {
    user.setRoles([1]);
  });

  Category.create({
    id: 1,
    name: "uncategorized",
  });
  Category.create({
    id: 2,
    name: "mouse",
  });
  Category.create({
    id: 3,
    name: "keyboard",
  });

  Product.create({
    id: 1,
    name: "Sample product",
    price: 123.2,
    stock: 30,
  }).then((product) => {
    product.setCategories([1]);
  });

  Product.create({
    id: 2,
    name: "Sample mouse product",
    price: 25.2,
    stock: 100,
  }).then((product) => {
    product.setCategories([2]);
  });

  Product.create({
    id: 3,
    name: "Sample keyboard product",
    price: 100.1,
    stock: 45,
  }).then((product) => {
    product.setCategories([3]);
  });

}
