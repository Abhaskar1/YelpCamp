var express=require("express")
var app=express()
var bodyParser=require("body-parser")
var mongoose=require("mongoose")
var Campground=require("./models/campground")
var seedDB=require("./seeds")
var Comment=require("./models/comment")
seedDB()
//mongoose.connect("mongodB://localhost:27017/yelp_camp",{useNewUrlParser:true})
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true})
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log("error in connecting to db"))
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}))


// Campground.create({name:"Salmon Creek",
// image:"https://pixabay.com/get/57e8d1464d53a514f1dc84609620367d1c3ed9e04e507440742a73d69f44c4_340.jpg",
// description:"This is a huge hill"
// },
// function(err,campground){
//     //console.log("IN")
//     if(err){
//         console.log(err)
//     }
//     else{
//         console.log("Created a new campground")
//         console.log(campground)
//     }
// }
// )

app.get("/",function(req,res){
    res.render("landing")
})

app.get("/campgrounds",function(req,res){
     //get all campgrounds from db
     //console.log("get")
     Campground.find({},function(err,allCampgrounds){
        //console.log("in");
        if(err){
            console.log(err)
        }
        else{
           // res.send("HI")
            res.render("campgrounds/index",{campgrounds:allCampgrounds})
        }
    })
    //console.log(campgrounds)
    //res.render("campgrounds",{campgrounds:campgrounds})
})
//to add new campgrounds
app.post("/campgrounds",function(req,res){
   //res.send("POST ROUTE")
   var name=req.body.name
   var image=req.body.image
   var description=req.body.description
   var newCampground={name:name,image:image,description:description}
   Campground.create(newCampground,function(err,newlyCreated){
       if(err){
           console.log(err)
       }
       else{
           res.redirect("/campgrounds")
       }
   })

})
//form to create new campground
app.get("/campgrounds/new",function(req,res){
    res.render("campgrounds/new")
})

app.get("/campgrounds/:id",function(req,res){
    //find campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){

        if(err){
            console.log(err)
        }
        else{
            console.log(foundCampground)
            res.render("campgrounds/show",{campground:foundCampground})
        }
    })
    //render show template with that campground
    
})

//=========================//
// COMMENTS ROUTES
//=========================//
app.get("/campgrounds/:id/comments/new",function(req,res){
    //find campground by id
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err)
        }
        else{
            res.render("comments/new",{campground:campground})
        }
    })
})
app.post("/campgrounds/:id/comments",function(req,res){
    //lookup campground using id
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err)
            res.redirect("/campgrounds")
        }else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log("error")
                    res.redirect("/campgrounds")
                }else{
                    campground.comments.push(comment)
                    campground.save()
                    res.redirect("/campgrounds/"+campground._id)
                }
            })
        }
    })
    //create new comment 
    //connect new comment to campground
    //redirect to campground's show page
})
app.listen(3000,function(){
    console.log("YelpCamp Server Has Started")
})