var express=require("express")
var app=express()
var bodyParser=require("body-parser")
var mongoose=require("mongoose")
//mongoose.connect("mongodB://localhost:27017/yelp_camp",{useNewUrlParser:true})
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true})
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log("error in connecting to db"))
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}))

//SCHECMA SETUP
var campgroundSchema=new mongoose.Schema({
    name:String,
    image:String,
    description:String
})
var Campground=mongoose.model("Campground",campgroundSchema)
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
         console.log("in");
        if(err){
            console.log(err)
        }
        else{
           // res.send("HI")
            res.render("index",{campgrounds:allCampgrounds})
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
    res.render("new")
})

app.get("/campgrounds/:id",function(req,res){
    //find campground with provided id
    Campground.findById(req.params.id,function(err,foundCampground){

        if(err){
            console.log(err)
        }
        else{
            res.render("show",{campground:foundCampground})
        }
    })
    //render show template with that campground
    
})
app.listen(3000,function(){
    console.log("YelpCamp Server Has Started")
})