const express = require("express");
const app = express();
const mongoose = require("mongoose")
const PORT = process.env.PORT || 4000;
const bodyParser = require("body-parser")
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const seedDB = require("./seed")
const User = require("./models/user")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const commentRoutes = require("./routes/comments")
const indexRoutes = require("./routes/index")
const campgroundRoutes = require("./routes/campgrounds")
const methodOverride = require("method-override")
const flash = require("connect-flash")

//DB CONNECTION
mongoose.connect("mongodb://localhost:27017/yelp_camp_v2", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to db"))
  .catch(() => console.log("DB connection failed"))
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs");
app.use(methodOverride("_method"))
app.use(express.static(__dirname + "/public"))
app.use(flash())

//PASSPORT CONFIG
app.use(require("express-session")({
  secret: "Random Text Here",
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use(function (req, res, next) {
  res.locals.currentUser = req.user
  res.locals.error = req.flash("error")
  res.locals.success = req.flash("success")
  next()
})
app.use("/", indexRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/comments", commentRoutes)
//seedDB()
//LISTEN
app.listen(PORT, function () {
  console.log("Server Started");
});
