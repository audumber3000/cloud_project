const express = require('express');
const mongoose = require("mongoose");
const  User    = require("../model/user");
const router = express.Router();
var Chart = require('chart.js');




router.get("/courses/engineering/questions" , function(err,res){
  res.render("")
})
const questions = new mongoose.Schema({
   question:String,
   concept:  String,
   options:[String],
   answers:String

 });
const questions_en = mongoose.model('questions_en', questions);

 router.post("/courses/engineering/questions" , function(err,res){
   questions_en.create({ cls:"class-12",subject:"Maths",
       chapters:["Chapter 1 :Relations and Functions",
 "Chapter 2 :Algebra",
 "Chapter 3 :Calculus",
 "Chapter 4 :Vectors and Three – Dimensional Geometry",
 "Chapter 5 :Linear Programming",
 "Chapter 6 :Probability"],links:[]}, function (err, small) {
     if (err) return handleError(err);
     // saved!
   });

   console.log("interseted successfully!")
 })


router.get("/courses/class11-12", function(req, res){
    res.render("courses/class11-12" , {CurrentUser:req.user});
});
//-----------------------------------------------------------------
router.get("/courses/engineering/ds", function(req, res){
  var question = [
    {que:"what is your name ?",
  option1:"audu",
  option2:"audumber",
  option3:"chaudhari",
  option4:"chachu"},

  {que:"what is your age ?",
option1:"10",
option2:"15",
option3:"20",
option4:"22"},

{que:"what is chapal size ?",
option1:"6",
option2:"7",
option3:"8",
option4:"9"},

{que:"what is stomach size ?",
option1:"6",
option2:"7",
option3:"8",
option4:"9"},

{que:"what is cbed size ?",
option1:"6",
option2:"7",
option3:"8",
option4:"9"},

{que:"what is hand size ?",
option1:"6",
option2:"7",
option3:"8",
option4:"9"},

{que:"what is leg size ?",
option1:"6",
option2:"7",
option3:"8",
option4:"9"},

{que:"what is face size ?",
option1:"6",
option2:"7",
option3:"8",
option4:"9"},

{que:"what is mouth size ?",
option1:"6",
option2:"7",
option3:"8",
option4:"9"},

{que:"what is fuck size ?",
option1:"6",
option2:"7",
option3:"8",
option4:"9"}
];
let answers = [];
    res.render("courses/engineering/ds", {CurrentUser:req.user , data:question ,answers:answers});
});

router.post("/courses/engineering/ds", function(req, res){
  console.log(typeof req.body.answer);
  let new_ans = req.body.answer.split(",").join("")
  let real_ans = [1,1,1,2,2,2,2,2,2,4];
  let rit = 0;
  let wrong = 0;
  for(let i=0; i<real_ans.length; i++){
    console.log(real_ans[i]);
    console.log(new_ans[i]);
    if(real_ans[i]==new_ans[i]){
      rit = rit+1;
    }else{
      wrong = wrong+1;
    }
  }

  res.render("courses/engineering/dashboard" , {cor:rit , incor:wrong})

});

router.get("/courses/engineering/algo", function(req, res){
res.render("courses/engineering/algo", {CurrentUser:req.user});
});

router.get("/courses/engineering", function(req, res){
  console.log("audumber")
    res.render("courses/engineering/engineering", {CurrentUser:req.user});
});

router.get("/courses/engineering/dashboard", function(req, res){
  console.log("audumber")
    res.render("courses/engineering/dashboard", {CurrentUser:req.user});
});

//---------------------------------------------------------------------
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
