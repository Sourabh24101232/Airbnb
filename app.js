//---------Updated--------------



// import the express library 
const express=require("express");
//require("express") loads the Express module from node_modules and returns a function.
//const express = ... stores that function in the constant express

//express() calls the function you imported above and returns an “app” object
const app=express();
//app represents your web server; you use it to define routes (app.get, app.post), add middleware (app.use), and start listening on a port (app.listen)
//I will tell this "app" how to respond when someone visits certain URLs,

//Imports Mongoose, a library to work with MongoDB.
const mongoose=require("mongoose");
//This loads a helper library that talks to the database(MongoDB) for me
//The constant mongoose gives you access to methods like mongoose.connect(...), mongoose.Schema, and mongoose.model to define schemas and interact with the database.
// “Mongoose is an ODM, i.e., an Object-Document Mapper, which maps my JavaScript objects to MongoDB documents so I can work with the database using objects instead of manual queries.”

//-------------Confusion-------------------------------------------------------
//Express needs 2 lines because its main export is a function that you must call to create the app object. Mongoose's main export is already the object you need
//------------------------------------------------------------------------------

//get from another folder---------------------------------------------------------------------------------
const Listing=require("./models/listing.js");// here . bcz models and app.js are in same floder
//---------------------------------------------------------------------------------------------------------

const MONGO_URL=('mongodb://127.0.0.1:27017/wanderlust');
async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
.then(()=>{
    console.log("Connected to DB(MongoDB)");
})
.catch((err)=>{
    console.log(err);
});

//Because main is async, calling main() returns a Promise.
//That promise:
//fulfills when DB connects successfully 
//rejects if connection throws an error.

//-------------Error-----------------------------------------------------------------------
//Order and function calls matter more than “copying same code as tutor”
//main is an async function → must be called to get a promise.
//const variables live in TDZ(“temporal dead zone”) → cannot be used before declaration
//------------------------------------------------------------------------------------------

//Defines how your server responds when someone sends a GET request to the root path (/)
app.get("/",(req,res)=>{
    res.send("Hi, I am root ");
});
//req (request): object containing data about the incoming request (URL, headers, body, query, etc.).
//res (response): object you use to send back something to the client.
 
// starts the HTTP server and binds it to port 8080. 
// After this, if you visit localhost:8080 in a browser, it will talk to my code.
app.listen(8080,()=>{
    console.log("Server is listening to port 8080");//console.log is just a confirmation message for me in the terminal
});


app.get("/testListing",async (req,res)=>{
   let samplelisting=new Listing({
   title:"My New Villa",
   description:"Very Large Area",
   price:1500,
   location:"Siwan,Bihar",
   country:"India",
   });

   await samplelisting.save();//first save the list then do any operation
   console.log("Sample save");//You (the developer) see “Sample save” in the terminal.
   res.send("Successfull testing");//The client that hit /testListing gets “Successfull testing” as the HTTP response.

   //-----------confusion-----------------------------------------------------------------------------------
   //if not getting default image link on command prompt, run http://localhost:8080/testlisting again to refresh and then run command prompt
   //--------------------------------------------------------------------------------------------------------
});
