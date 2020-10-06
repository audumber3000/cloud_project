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
app.get("/courses/class11-12", function(req, res){
    res.render("courses/class11-12" , {CurrentUser:req.user});
});
app.get("/courses/class8-10", function(req, res){
    res.render("courses/class8-10" , {CurrentUser:req.user});
});
app.get("/courses/engineering", function(req, res){
    res.render("courses/engineering", {CurrentUser:req.user});
});
app.get("/courses/medical", function(req, res){
    res.render("courses/medical" , {CurrentUser:req.user});
});

app.get("/courses/syllabus", function(req, res){
    res.render("courses/syllabus"  , {CurrentUser:req.user});
});

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


//--register
app.get("/register" ,function(req,res){
	res.render("register" , {CurrentUser:req.user})
	})

app.post("/register" ,function(req,res){

	var newUser  = new User({username:req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		console.log(newUser);
		console.log(req.body.password);
		if(err){
			console.log("smthing went wrong")
			 res.render("register")
		}

		passport.authenticate("local")(req,res,function(){
		res.redirect("/offer")
		})

	})
})





app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/")
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
