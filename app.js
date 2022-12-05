var createError = require("http-errors");
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser")
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var hbs = require("express-handlebars");
var cookieParser = require("cookie-parser");
var db = require("./config/connection");
var session = require("express-session");
var app = express();
var swal =require('sweetalert')
var Swal =require('sweetalert2')

//router setup
var defaultRouter = require("./routes/default")
var adminRouter = require("./routes/admin");
var usersRouter = require("./routes/users");



let Handlebars = require("handlebars");
Handlebars.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1;
});


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layout/",
    partialsDir: __dirname + "/views/partials/",
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())


Handlebars.registerHelper("ifCheck", function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

//sessionmanagement
app.use(
  session({
    secret: "secret key of arjun",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 10000000000000 },
  })
);

//clear cache
app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    `no-cache, private,no-store,must-revalidate,max-stale=0,pre-check=0`
  );
  next();
});

//connection database
db.connect((err) => {
  if (err) console.log("connection error" + err);
  else console.log("Database connected successfully to the port 27017");
});

//router setting up
app.use("/",defaultRouter)
app.use("/admin", adminRouter);
app.use("/users", usersRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404, { error: true }));
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}
  // render the error page
  res.status(err.status || 500)
  res.render("default/error")
})

module.exports = app;
