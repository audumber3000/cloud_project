const express = require('express');
const mongoose = require("mongoose");
const  User    = require("../model/user");
const router = express.Router();


router.get("/courses/class11-12", function(req, res){
    res.render("courses/class11-12" , {CurrentUser:req.user});
});
router.get("/courses/engineering", function(req, res){
    res.render("courses/engineering", {CurrentUser:req.user});
});
router.get("/courses/medical", function(req, res){
    res.render("courses/medical" , {CurrentUser:req.user});
});
router.get("/assistance/volenteer", function(req, res){
    res.render("assistance/volenteer" , {CurrentUser:req.user});
});
router.get("/courses/neet", function(req, res){
    res.render("courses/neet" , {CurrentUser:req.user});
});
router.get("/courses/jee", function(req, res){
    res.render("courses/jee" , {CurrentUser:req.user});
});


const chapters = new mongoose.Schema({
   cls:String,
   subject:  String, // String is shorthand for {type: String}
   chapters: [String],
   links:[String]


 });


const chap = mongoose.model('chap', chapters);

// app.post("/tak" , function(err,res){
//   chap.create({ cls:"class-12",subject:"Maths",
//       chapters:["Chapter 1 :Relations and Functions",
// "Chapter 2 :Algebra",
// "Chapter 3 :Calculus",
// "Chapter 4 :Vectors and Three – Dimensional Geometry",
// "Chapter 5 :Linear Programming",
// "Chapter 6 :Probability"],links:[]}, function (err, small) {
//     if (err) return handleError(err);
//     // saved!
//   });
//
//   console.log("interseted successfully!")
// })


//--getting syllabus
router.get("/courses/syllabus", function(req, res){
res.render("courses/syllabus"  , {CurrentUser:req.user});
});

router.post("/courses/syllabus" , function(req,res){
  var cls_val = req.body.cls
  var subject_val = req.body.subject

  chap.find({ 'cls': cls_val , 'subject': subject_val }, function (err, chap) {
    if (err) return handleError(err);
    // Prints "Space Ghost is a talk show host".

    res.render("courses/syllabus" , {CurrentUser:req.user , chap:chap})
  });

})


router.get("/offer" , function(req,res){

	res.render("offer" , {CurrentUser:req.user})
})



module.exports =router;
