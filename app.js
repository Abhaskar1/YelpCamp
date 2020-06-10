var express=require("express")
var app=express()
var bodyParser=require("body-parser")
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}))


var campgrounds=[
    {name:"Salmon Creek",image:"https://pixabay.com/get/57e8d1464d53a514f1dc84609620367d1c3ed9e04e507440742a73d69f44c4_340.jpg"},
    {name:"Granite Hill",image:"https://pixabay.com/get/57e8d1454b56ae14f1dc84609620367d1c3ed9e04e507440742a73d69f44c4_340.jpg"},
    {name:"Moutain Goat's Rest",image:"https://cdn.pixabay.com/photo/2019/07/25/17/09/camp-4363073__340.png"}
]
app.get("/",function(req,res){
    res.render("landing")
})

app.get("/campgrounds",function(req,res){ 
    //console.log(campgrounds)
    res.render("campgrounds",{campgrounds:campgrounds})
})
//to add new campgrounds
app.post("/campgrounds",function(req,res){
   //res.send("POST ROUTE")
   var name=req.body.name
   var image=req.body.image
   var newCampground={name:name,image:image}
   campgrounds.push(newCampground)
   res.redirect("/campgrounds")

})
//form to create new campground
app.get("/campgrounds/new",function(req,res){
    res.render("new")
})
app.listen(3000,function(){
    console.log("YelpCamp Server Has Started")
})