const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground")
const middleware = require("../middleware")
router.get("/", function (req, res) {
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            req.flash("error", "Something went wrong")
            //console.log(err)
            return res.redirect("back")
        }
        else {
            res.render("campgrounds/index", { campgrounds: campgrounds })
        }
    })
});
//NEW FORM
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new")
})
//CREATE CAMPGROUND
router.post("/", middleware.isLoggedIn, function (req, res) {
    const name = req.body.name
    const image = req.body.image
    const description = req.body.description
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = { name: name, image: image, description: description, author: author }


    //SAVE TO DB
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            req.flash("error", "Something went wrong")
            return res.redirect("back")
        }
        else {
            res.redirect("/campgrounds")
        }
    })
})
//SHOW PAGE
router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err || !foundCampground) {
            //!foundCampground means campground is null i.e it doesnt exsist
            req.flash("error", "Campgrounds not found")
            res.redirect("back")
        }
        else {
            res.render("campgrounds/show", { campground: foundCampground })
        }
    })
})
//EDIT CAMPGROUND
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", { campground: foundCampground })
    })
})
//UPDATE CAMPGROUND
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    //find and update the campground
    //console.log(req.params.id)
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err || !updatedCampground) {
            req.flash("error", "Campground not found")
            res.redirect("/campgrounds")
        }
        else {
            // console.log(updatedCampground)
            //redirect to show page
            res.redirect("/campgrounds/" + req.params.id)
        }
    })

})
//DESTROY CAMPGROUND
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            req.flash("error", "Something went wrong")
            res.redirect("/campgrounds")
        } else {


            res.redirect("/campgrounds")
        }
    })
})
module.exports = router