 var express               = require("express"),
    bodyParser            = require("body-parser"),
    methodOverride  =       require("method-override"),
    passport  =             require("passport"),
	LocalStrategy =        require("passport-local"),
	mongoose    = require("mongoose"),
   request = require('request'),
	User = require("./model/user")

var flash = require("connect-flash");

var indexRouter    = require("./routes/index.js");


var app = express();
mongoose.connect("mongodb+srv://audumber:Ramdas3000@cluster0-bj3vd.mongodb.net/test?retryWrites=true&w=majority");
// mongoose.connect("mongodb://127.0.0.1:27017/yoso")
app.use(methodOverride("_method"));//using method-override + what to look for in url *the parentheses as above*

app.use(flash())
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true})); //required for forms that post data via request
app.use(require("express-session")({ //require inline exp session
    secret: "be rich forever", //used to encode and decode data during session (it's encrypted)
    resave: false,          // required
    saveUninitialized: false   //required
}));


//passport
//passport----------------------
app.use(require("express-session")({
	secret : "Once again Rusty wins cutest doh!",
	resavae : false,
	saveUnitialization :false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//--------------------------------------


app.use(express.static("public"));


app.get("/", function(req, res){



  request('http://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=7eb307c381f8431baa3202bdeb190932', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', (body['totalResults'])); // Print the HTML for the Google homepage.
    var data = JSON.parse(body);
    var arti = data['articles'];
res.render("home" , {CurrentUser:req.user ,  arti:arti});

  });



});
app.get("/assistance/assistance", function(req, res){
    res.render("assistance/assistance" , {CurrentUser:req.user});
});
app.get("/courses/class8-10", function(req, res){
    res.render("courses/class8-10" , {CurrentUser:req.user});
	});
app.get("/courses/class11-12", function(req, res){
    res.render("courses/class11-12" , {CurrentUser:req.user});

});
app.get("/courses/engineering", function(req, res){
    res.render("courses/engineering", {CurrentUser:req.user});
});
app.get("/courses/medical", function(req, res){
    res.render("courses/medical" , {CurrentUser:req.user});
});
app.get("/assistance/volenteer", function(req, res){
    res.render("assistance/volenteer" , {CurrentUser:req.user});
});

//--gitting syllabus
app.get("/courses/syllabus", function(req, res){
res.render("courses/syllabus"  , {CurrentUser:req.user});
});

app.post("/courses/syllabus" , function(req,res){
  var cls_val = req.body.cls
  var subject_val = req.body.subject

  chap.find({ 'cls': cls_val , 'subject': subject_val }, function (err, chap) {
    if (err) return handleError(err);
    // Prints "Space Ghost is a talk show host".

    res.render("courses/syllabus" , {CurrentUser:req.user , chap:chap})
  });

})


app.get("/offer" , function(req,res){

	res.render("offer" , {CurrentUser:req.user})
})

//--authenticaton---------------------------------------------------------------------------

//--login
app.get("/login" , function(req,res){
	res.render("login" , {CurrentUser:req.user})
})

app.post("/login",passport.authenticate("local",{

	successRedirect : "/offer",
	failureRedirect : "/login"
}),function(req,res){

})




app.get("/wel",function(req, res){
res.render("welcome" , {CurrentUser:req.user})
})
app.get("/not-wel",function(req, res){
res.render("not-welcome" , {CurrentUser:req.user})
})

app.get("/incorrect-otp",function (req, res){
  res.render("incorrect-otp" , {CurrentUser:req.user})
})
//--register
app.get("/register" ,function(req,res){
	res.render("register" , {CurrentUser:req.user})
	})

app.post("/register" ,function(req,res){



   console.log(req.body.username);
   console.log(req.body.otp);
   var user_otp = req.body.dig1+req.body.dig2+req.body.dig3+req.body.dig4;
   console.log(user_otp);
if(user_otp==req.body.otp){

  var newUser  = new User({username:req.body.username});
  User.register(newUser,req.body.password,function(err,user){
    console.log(newUser);
    console.log(req.body.password);
    if(err){
      console.log("smthing went wrong")
       res.render("register")
    }


    passport.authenticate("local")(req,res,function(){
    res.redirect("/wel")
    })

  })


}
else{
  console.log("Sorry incorrect-otp")
  res.redirect("/incorrect-otp")
}

})





app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/")
		})

//-------------------------------------------------------------------------------------------


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

//-OTP
var unirest = require("unirest");




app.post("/verification-otp" , function (req,res){
  var pass = req.body.password;
  var user = req.body.username;
  var cont =req.body.contact;
console.log(pass);
console.log(user);
console.log(cont);

  var x = 1000;
  var y = 9999;
  var otp = Math.floor(x + (y - x) * Math.random());


  var otp_req = unirest("POST", "https://www.fast2sms.com/dev/bulk");
  otp_req.headers({
    "authorization": "tl4vJzuUZL7cYe90DNgKoRFqynaP6X2WpTshmQdkxbSwAHC5iEEQ4WOiKhnoeqjIHdZkgBNR2PXL19ra"
  });

  otp_req.form({
    "sender_id": "SMSIND",
    "message": " Dear "+user+", Welcome to Education4ol. Your verification code is: "+otp+" (Do not share your OTP with anyone.)",
    "language": "english",
    "route": "p",
    "numbers":cont,
  });

  otp_req.end(function (res) {
    if (res.error) throw new Error(res.error);

    console.log(res.body);
    console.log("OTP SEND successfully")
  console.log(otp)
  });

  console.log(otp)
res.render("otp_valid", {CurrentUser : req.user , pass:pass , user:user, cont:cont , otp:otp})

})











// app.listen(3000,function(err){
// 	if(err){
// 		console.log("server connection error!!")
// 		console.log("Reconnecting . . . ")
// 	}else{
// 		console.log("connecting . . . ")
// 		console.log("connected successfully")
// 	}
// })

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started...")
});
