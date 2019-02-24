var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/",function(req,res){
    Campground.find({},function(err,campgrounds){
         if(err){
            console.log(err);
        }else{
            res.render("campgrounds/Index",{campgrounds : campgrounds, currentUser: req.user});
        }
    });
});

router.post("/",middleware.isLoggedIn,function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var discription= req.body.discription;
    var author={
        id : req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image : image, discription : discription, author:author};
    Campground.create(newCampground,function(err,campgrounds){
         if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
        });
});

//Add new Campground

router.get("/new",middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
         if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show",{campground : foundCampground});
        }
    });
});

//EDIT CAMPGROUND ROUTE

router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req, res) {
    Campground.findById(req.params.id,function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/edit",{campground : foundCampground});
        }
    });
});

//UPDATE CAMPGROUND ROUTE


router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
 // req.body.campground.discription = req.sanitize(req.body.campground.discription);
  Campground.findByIdAndUpdate(req.params.id,req.body.campground, function(err, updatedCampground){
     if(err){
         res.redirect("/campgrounds");
     } else{
         res.redirect("/campgrounds/"+req.params.id);
     }
  }); 
})

//DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership,function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
      }
   });
});

module.exports=router;