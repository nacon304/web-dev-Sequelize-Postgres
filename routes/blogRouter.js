const express = require("express");
const controller = require("../controllers/blogController.js")
const route = express.Router();

// app.get('/createTables', (req, res) => {
//     let models = require('./models')
//     models.sequelize.sync().then(() => {
//         console.log("table created!");
//     })
// })

route.use("/", controller.init);
route.get("/", controller.showList);
route.get('/:id', controller.showDetails);

module.exports = route;