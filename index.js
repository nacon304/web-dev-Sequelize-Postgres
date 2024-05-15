const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const expressHbs = require('express-handlebars');
const { createPagination } = require('express-handlebars-paginate');
 
// cấu hình public static folder
app.use(express.static(__dirname + "/html"));

// cấu hình sử dụng express-handlebars
app.engine('hbs', expressHbs.engine({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname: 'hbs',
    defaultLayout: 'layout',
    runtimeOptions: {allowProtoPropertiesByDefault: true},
    helpers: {
        createPagination,
        formatDate: (date) => {
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        },
    },
}));
app.set('view engine', 'hbs');

// routes
app.use('/blogs', require('./routes/blogRouter'));
app.get('/', (req, res) => res.redirect("/blogs"));

app.get("/error", (req, res) => {
    throw new Error("error");
})
app.use((req, res) => {
    res.send("Request not found!");
})
app.use((error, req, res, next) => {
    console.error(error);
    res.send("Sever error!");
})

// khởi động web sever
app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
})