 var express       = require("express"),
    bodyParser     = require("body-parser"),
    methodOverride = require("method-override"),
    passport       = require("passport"),
	  LocalStrategy  = require("passport-local"),
	  mongoose       = require("mongoose"),
    request        = require('request'),
	  User           = require("./model/user"),
    Volenteer      = require("./model/Volenteer")


var nodemailer = require('nodemailer');

var flash = require("connect-flash");
var app = express();

var cookieParser = require('cookie-parser')
app.use(cookieParser())

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

app.use((req,res,next)=>{
  res.locals.success= req.flash('success')
  res.locals.failed= req.flash('failed')
  res.locals.signup= req.flash('signup')
  res.locals.clear= req.flash('clear')
  res.locals.error_msg= req.flash('error_msg')

  next();
});
//intigrating routes

const noti_routes = require('./routes/notification_routes');
app.use("/" , noti_routes);

const course_routes = require('./routes/course_routes');
app.use("/" , course_routes);

const notes_routes = require('./routes/notes_routes');
app.use("/" , notes_routes);

const auth_routes = require('./routes/authentication');
app.use("/" , auth_routes);

const account_details = require('./routes/account_details');
app.use("/" , account_details);

const payment = require('./routes/payment');
app.use("/" ,payment);



app.get("/", function(req, res){

    request('http://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=7eb307c381f8431baa3202bdeb190932', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

    var data = JSON.parse(body);
    var arti = data['articles'];

    var x = 2;
    var y = 20;
    var ran = Math.floor(x + (y - x) * Math.random());

    res.cookie("name" , "prashant"); //coockie

    res.render("home" , {CurrentUser:req.user ,  arti:arti ,stud:ran});

  });

});


app.get("/assistance/assistance", function(req, res){

    console.log(req.cookies.name ) //retrive back coockie
    res.render("assistance/assistance" , {CurrentUser:req.user});
});


app.get("/index", function(req, res){

    res.render("index" , {CurrentUser:req.user});
});

app.get("/terms" , function(req,res){
	 res.render("terms" );
})


app.get("/oops" , function(req,res){
	 res.render("oops_wring" );
})






















app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/")
		})

//-------------------------------------------------------------------------------------------



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








//-----------------------------------------------------------------intern registartion
var Interninfo = new mongoose.Schema({
	Name:String,
	Gender : String,
	Contact : String,
	Email : String,
	Internship : String,
	College:String,
	Year : String,
	Accepted : String
	
   
 

});

const Interninfo_final = mongoose.model('Interninfo_final', Interninfo);

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hr.education4ol@gmail.com',
    pass: 'Eduol@123'
  }
});





app.get("/intern", function(req, res){

    res.render("intern");
});

app.post("/intern", function(req, res){
    mongoose.connect("mongodb+srv://audumber:Ramdas3000@cluster0-bj3vd.mongodb.net/Dashboard?retryWrites=true&w=majority");
	
	Interninfo_final.create({ Name:req.body.name , Gender:req.body.gender ,Contact:req.body.contact ,Email:req.body.email,Internship:req.body.cars, College:req.body.college , Year:req.body.Year, cost:req.body.cost,class:req.body.class}, function (err, small) {
      console.log(small)
      if (err){
        console.log("somthing went wrong!!")
      }

    });
	
	
	//--------------------------email sending
	
var mailOptions = {
  from: 'hr.education4ol@gmail.com',
  to: req.body.email,
  subject: 'Thankyou for Applying at Education4ol',
  text: 'Hi ' +req.body.name   +'\n Thankyou for  applying on Education4ol career portal . Please make sure that the following details  are Correct for the hassle free  communication. \n 1.Email : ' + req.body.email  +'\n 2.Contact number : ' + req.body.contact + '\n\n Our HR Team will soon contact you for futher Details. \n\n Company Details : www.education4ol.com '
};
	
	
	
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
}); 
	
	
	
    res.render("thankyou");
});














// --------------------------------------------------------------------CONNECTION
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
