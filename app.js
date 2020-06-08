var express=require("express")
var app=express()
app.set("view engine","ejs")

app.get("/",function(req,res){
    res.render("landing")
})

app.get("/campgrounds",function(req,res){
    var campgrounds=[
        {name:"Salmon Creek",image:"https://pixabay.com/get/57e8d1464d53a514f1dc84609620367d1c3ed9e04e507440742a73d69f44c4_340.jpg"},
        {name:"Granite Hill",image:"https://pixabay.com/get/57e8d1454b56ae14f1dc84609620367d1c3ed9e04e507440742a73d69f44c4_340.jpg"},
        {name:"Moutain Goat's Rest",image:"https://pixabay.com/get/57e8d1454b56ae14f1dc84609620367d1c3ed9e04e507440742a73d69f44c4_340.jpg"}
    ]
    console.log(campgrounds)
    res.render("campgrounds",{campgrounds:campgrounds})
})

app.listen(3000,function(){
    console.log("YelpCamp Server Has Started")
})