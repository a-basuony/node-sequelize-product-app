const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");

const Product = require("./models/product");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Set up associations
Product.belongsTo(User); // A product belongs to a user
User.hasMany(Product); // A user can have multiple products

sequelize
  //   .sync({ force: true }) // {force: true} => option drops all tables and recreates them, which can be useful during development but should be used with caution in production as it can lead to data loss.
  .sync()
  .then((result) => {
    return User.findByPk(1);
    // console.log(result);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Ahmed", email: "test@test.com" });
    }
    return user;
  })
  .then((user) => {
    // console.log(user);
    app.listen(3000);
  })
  .catch((err) => console.log(err));

// -------------- Sequelize ---------------------------
// 1- installation : npm install --save sequelize mysql2
//
// 2- connecting to the database in (util) folder  (database.js) file
//              -const Sequelize = require("sequelize");
//               const sequelize = new Sequelize("DataBaseName", "rootUsername", "password", {
//                  host: "localhost",
//                  dialect: "mysql",
//                });
//                module.exports = sequelize;
//
// 3- Defining a Model: (models) folder , (product.js) file
//              -const Sequelize = require("sequelize");

//                 const sequelize = require("../util/database");

//              const Product = sequelize.define("product", {  //=> 'products' is the table name create table if not exists
//                 id: {
//                     type: Sequelize.INTEGER,
//                     autoIncrement: true,
//                     allowNull: false,
//                     primaryKey: true,
//                 },
//                 title: Sequelize.STRING,
//                 price: {
//                     type: Sequelize.DOUBLE,
//                     allowNull: false,
//                 },
//                 imageUrl: {
//                     type: Sequelize.STRING,
//                     allowNull: false,
//                 },
//                 description: {
//                     type: Sequelize.STRING,
//                     allowNull: false,
//                 },
//                 });

//                 module.exports = Product;
//
//
// 4- Syncing  your models with Database : in app.js
//                  - const sequelize = require('./util/database')
//                  - in the end of app file =>
//                        sequelize.sync().then( result =>{ console.log(result); app.listen(3000)}).catch( err => { console.log(err)})
//
//
// 5- inserting Data & creating product
//                                    1- const Product = require('./models/product)
//                                    2- on post to insert data from const {title,price,description} = req.body
//                                      const {title,price,description} = req.body
//                                      Product.create({title,price, description}).then(result=> console.log("created product")).catch(err=> console.log(err))
//                                    3- id, createdAt, updatedAt  will be created automatically by Sequelize
//
//6- Getting all data from database: finding products
//                      - to get all data  you can use .findAll() method which returns a promise that resolves to an array
//                          Product.findAll()
//                          .then((products) => {
//                            res.render("shop/index", {
//                              prods: products,
//                              pageTitle: "Shop",
//                              path: "/",
//                            });
//                          })
//                          .catch((err) => console.log(err));
//
//
// 7- getting single product
//                           1 - use findByPk(id) to get one product instead of findById()
//
//                                 const prodId = req.params.productId;
//                                  Product.findByPk(prodId)
//                                  .then((product) => {
//                                      res.render("shop/product-detail", {
//                                      product: product,
//                                      pageTitle: product.title,
//                                      path: "/products",
//                                      });
//                                  })
//                                  .catch((err) => console.log(err));
//
//
//                  2-    another way for  getting a single product
//                               Product.findAll({
//                                  where: {
//                                       id: prodId,
//                                   },
//                                })
//                                  .then((products) => {
//                                       res.render("shop/product-detail", {
//                                           product: products[0],
//                                          pageTitle: products[0].title,
//                                          path: "/products",
//                                      });
//                                      })
//
//
// 8- edit product (GET)
//                  router.get('/edit-product/:productId', getEditProduct);
//                             getEditProduct = (req, res, next) => {
//                                     const editMode = req.query.edit;
//                                     if (!editMode) {
//                                       return res.redirect("/");
//                                     }
//                                     const prodId = req.params.productId;
//                                     Product.findByPk(prodId)
//                                       .then((product) => {
//                                         if (!product) {
//                                           return res.redirect("/");
//                                         }
//                                         res.render("admin/edit-product", {
//                                           pageTitle: "Edit Product",
//                                           path: "/admin/edit-product",
//                                           editing: editMode,
//                                           product: product,
//                                         });
//                                       })
//                                       .catch((err) => console.log(err));
//                                   };

//    - edit product (POST)
//                  router.post('/edit-product', postEditProduct);
//                     postEditProduct = (req, res, next) => {
//                             const prodId = req.body.productId;
//                             const updatedTitle = req.body.title;
//                             const updatedPrice = req.body.price;
//                             const updatedImageUrl = req.body.imageUrl;
//                             const updatedDesc = req.body.description;

//                             Product.findByPk(prodId)
//                               .then((product) => {
//                                 product.title = updatedTitle;
//                                 product.price = updatedPrice;
//                                 product.imageUrl = updatedImageUrl;
//                                 product.description = updatedDesc;
//                                 return product.save(); // method to  save the changes in database
//                               })
//                               .then((result) =>{
//                                      console.log("updated product")
//                                      res.redirect("/admin/products");
//                                 } )
//                               .catch((err) => console.log(err));
//                                  };
//
//
// 9- delete product (POST)
//
//                 - router.post('/delete-product', postDeleteProduct);
//                 - postDeleteProduct = (req, res, next) => {
//                                const prodId = req.body.productId;
//                                Product.findByPk(prodId)
//                                  .then((product) => {
//                                    return product.destroy();
//                                  })
//                                  .then((result) => {
//                                    console.log("Deleting Success");
//                                    res.redirect("/admin/products");
//                                  })
//                                  .catch((err) => console.log(err));
//                              };
//
//
// 10- Adding one-to-Many Relationship
//   - Associations (relation)  between models: User and Products
//   - Associations define how different models in your application are related to each other.
//                      - where an User can have multiple Products (one-to-many relationship).
//                   1- app.js define all models  then :
//                          const Product = require('./models/product')
//                          const User = require('./models/user')
//
//                          Product.belongsTo(User);  //=> Establishes a one-to-one relationship
//                          User.hasMany(Product); // User HasMany product // =>  Sets up a one-to-many relationship.
//                          sequelize.sync() // if you don't overwrite tables
//                          sequelize.sync({force: true})
//
//
//                           Product.belongsTo(User, {constraints: true, onDelete: "CASCADE"}): This line defines that a Product belongs to a User. The {constraints: true, onDelete: "CASCADE"} options specify that constraints should be enforced on the relationship and that if a User is deleted, all associated Product records should also be deleted (cascade delete).

//                           User.hasMany(Product): This line defines that a User can have many Product instances. This establishes a one-to-many relationship between User and Product.

//                           sequelize.sync({force: true}): This method call synchronizes the models with the database. The {force: true} option drops all tables and recreates them, which can be useful during development but should be used with caution in production as it can lead to data loss.
//
//
//                                    Example :
//                               1- User Model:
//                               Represents a user who writes blog posts.
//                               Each user can have multiple posts.
//                               We’ll use a one-to-many relationship between User and Post.
//                               2-  Post Model:
//                               Represents a blog post.
//                               Each post belongs to a single user.
//                               We’ll use a belongs-to relationship between Post and User.
//                               3- Comment Model:
//                               Represents comments on blog posts.
//                               Each comment is associated with a specific post.
//
//
// 11- we will create a user , add some products to this user , because we don't have authentication yet
//  so create it when  the server starts up.
//
//  sequelize//  //   .sync({ force: true }) // {force: true} => option drops all tables and recreates them, which can be useful during development but should be used with caution in production as it can lead to data loss.
//   .sync()
//   .then((result) => {
//     return User.findByPk(1);
//   })
//   .then((user) => {
//     if (!user) {
//       return User.create({ name: "Ahmed", email: "test@test.com" });
//     }
//     return user;
//   })
//   .then((user) => {
//     // console.log(user);
//     app.listen(3000);
//   })
//   .catch((err) => console.log(err));

//
//
//
//
//
//
