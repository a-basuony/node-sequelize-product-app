const Sequelize = require("sequelize");

const sequelize = new Sequelize("node_complete", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
