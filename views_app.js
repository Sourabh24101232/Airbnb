// import the express library 
const express = require("express");
//require("express") loads the Express module from node_modules and returns a function.
//const express = ... stores that function in the constant express

//express() calls the function you imported above and returns an “app” object
const app = express();
//app represents your web server; you use it to define routes (app.get, app.post), add middleware (app.use), and start listening on a port (app.listen)
//I will tell this "app" how to respond when someone visits certain URLs,

//Imports Mongoose, a library to work with MongoDB.
const mongoose = require("mongoose");
//This loads a helper library that talks to the database(MongoDB) for me
//The constant mongoose gives you access to methods like mongoose.connect(...), mongoose.Schema, and mongoose.model to define schemas and interact with the database.
// “Mongoose is an ODM, i.e., an Object-Document Mapper, which maps my JavaScript objects to MongoDB documents so I can work with the database using objects instead of manual queries.”

//-------------Confusion-------------------------------------------------------
//Express needs 2 lines because its main export is a function that you must call to create the app object. Mongoose's main export is already the object you need
//------------------------------------------------------------------------------

//get from another folder---------------------------------------------------------------------------------
const wrapAsync = require("./utils/wrapasync.js")
const ExpressError = require("./utils/ExpressError.js");
const { validateListing, validateReview } = require("./middleware");

//required for express router
const listings = require("./routes/listing.js");
const reviews=require("./routes/review.js");

//to set up login/signup
const passport=require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User=require("./models/user");
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
const MONGO_URL = ('mongodb://127.0.0.1:27017/wanderlust');
async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("Connected to DB(MongoDB)");
    })
    .catch((err) => {
        console.log(err);
    });

//Because main is async, calling main() returns a Promise.
//That promise:
//fulfills when DB connects successfully 
//rejects if connection throws an error.
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//-------------Error-----------------------------------------------------------------------
//Order and function calls matter more than “copying same code as tutor”
//main is an async function → must be called to get a promise.
//const variables live in TDZ(“temporal dead zone”) → cannot be used before declaration
//------------------------------------------------------------------------------------------

//Defines how your server responds when someone sends a GET request to the root path (/)
app.get("/", (req, res) => {
    res.send("Hi, I am root ");
});

//req (request): object containing data about the incoming request (URL, headers, body, query, etc.).
//res (response): object you use to send back something to the client.

//sessions----------------------------------------------------------------------------
const session = require("express-session");
//session middleware
app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false
}));
//--------------------------------------------------------------------------------------


//login/signup-----------------------------------------------------------------------------
app.use(passport.initialize());//initialise passport before using
app.use(passport.session());//to login/signup only once in a session , not after every request
passport.use(new LocalStrategy(User.authenticate()));//// use static authenticate method of model in LocalStrategy

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
app.use("/listings", listings);
//whenever path route starts from /listings, use listings obtained above by importing listing.js from routes

app.use("/listings/:id/reviews", reviews);
//whenever path route starts from /listings, use listings obtained above by importing listing.js from routes
//-----------------------------------------------------------------------------------------------------------------------------------------------------------


//if none of above path get the request, all will come here
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

//server side error handling like new listing will not be added if abcd is filled in price box
// app.use((err,req,res,next)=>{
//     res.send("Something got wrong");
//     //custom message gets printed when mongoose try to save data and find error
// });

// app.use((err,req,res,next)=>{
//     let {statusCode,message}=err;//extract statusCode and message from error
//     res.status(statusCode).send(message);
// });

//if no message in error given by express, default message will be shown 
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;//extract statusCode and message from error
    // res.status(statusCode).send(message);
    //res.render("error.ejs",{message});
    // res.render("error.ejs",{err});
    res.status(statusCode).render("error.ejs", { err });
});

