//to use .env variable----------------------------------------------------------------------------

if(process.env.NODE_ENV !="production"){//use .env only in development phase 
require('dotenv').config();
}
// console.log(process.env);
//console.log(process.env.SECRET); //same as console.log(process.env.secret);

//console.log("DB =", process.env.ATLASDB_URL);

//-------------------------------------------------------------------------------------------------------

// import the express library 
const express = require("express");
const app = express();
//app represents your web server; 
const mongoose = require("mongoose");

//get from another folder---------------------------------------------------------------------------------
const wrapAsync = require("./utils/wrapasync.js")
const ExpressError = require("./utils/ExpressError.js");
const { validateListing, validateReview } = require("./middleware");

//required for express router
const listingRouter = require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

//to set up login/signup
const passport=require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User=require("./models/user");
const {isLoggedIn}=require("./middleware");
//--------------------------------------------------------------------------------------------------------

//Method override MUST come before your routes.----------------------------
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
//used to convert POST into put request while updating-----------------------------

const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

const path = require("path");
app.use(express.static(path.join(__dirname, "/public")));//to use static files like style.css from public folder

app.set("view engine", "ejs");//Tells Express that the default template engine is EJS.​
app.set("views", path.join(__dirname, "views"));//Tell Express where my EJS files live.
app.use(express.urlencoded({ extended: true }));
//When a normal HTML form is submitted to your server, the data arrives as a raw string.
//above line automatically converts that raw string into a JavaScript object and puts it in req.body, so you can do req.body.title, req.body.price, etc

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//This code connects your app to the local wanderlust MongoDB database using mongoose.connect
// const MONGO_URL = ('mongodb://127.0.0.1:27017/wanderlust');
// async function main() {
//     await mongoose.connect(MONGO_URL);
// }

const dbURL=process.env.ATLASDB_URL;
async function main() {
    await mongoose.connect(dbURL);
}

main()
    .then(() => {
        console.log("Connected to DB(MongoDB)");
    })
    .catch((err) => {
        console.log(err);
    });
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Defines how your server responds when someone sends a GET request to the root path (/)
// app.get("/", (req, res) => {
//     res.send("Hi, I am root ");
// });

//req (request): object containing data about the incoming request (URL, headers, body, query, etc.).
//res (response): object you use to send back something to the client.

//sessions----------------------------------------------------------------------------
const session = require("express-session");
const MongoStore = require("connect-mongo").default;//to deploy
const flash = require("connect-flash");

//to deploy
const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});

//session middleware
app.use(session({
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  }
}));

app.use(flash());//to flash a message when signup gets succeded

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});
//--------------------------------------------------------------------------------------


//login/signup-----------------------------------------------------------------------------
app.use(passport.initialize());//initialise passport before using
app.use(passport.session());//to login/signup only once in a session , not after every request
passport.use(new LocalStrategy(User.authenticate()));//// use static authenticate method of model in LocalStrategy

//to use to show login/signup/logout at requ time only
app.use((req, res, next) => {
    res.locals.currUser=req.user;
    //if user not logged in, req.user=undefined
    next();
});

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());//serialise means storing user's info in session to avoid login/signup everytime
passport.deserializeUser(User.deserializeUser());//deserialise means deleting user's info from a  session

//demo user
app.get("/demouser",async(req,res)=>{
    let fakeuser=new User({
        email:"student@gmail.com",
        username:"delta-student",
    });

    let RegisteredUser=await User.register(fakeuser,"HelloWorld");//save fakeuser in DB with password="HelloWorld"
    res.send(RegisteredUser);
});
//------------------------------------------------------------------------------------------

// starts the HTTP server and binds it to port 8080. 
// After this, if you visit localhost:8080 in a browser, it will talk to my code.
app.listen(8080, () => {
    console.log("Server is listening to port 8080");//console.log is just a confirmation message for me in the terminal
});


//-------------------------------------------------------------------------------------------------------------
app.use("/listings", listingRouter);
//whenever path route starts from /listings, use listings obtained above by importing listing.js from routes

app.use("/listings/:id/reviews", reviewRouter);
//whenever path route starts from /listings, use listings obtained above by importing listing.js from routes

app.use("/", userRouter);
//whenever path route starts from /user, use listings obtained above by importing listing.js from routes
//-----------------------------------------------------------------------------------------------------------------------------------------------------------


//if none of above path get the request, all will come here
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

//if no message in error given by express, default message will be shown 
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;//extract statusCode and message from error
    res.status(statusCode).render("error.ejs", { err });
});

