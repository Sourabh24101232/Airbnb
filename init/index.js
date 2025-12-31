//init/index.js is a script that connects to MongoDB, deletes old listings, and inserts all the sample listings from data.js

//Imports Mongoose, a library to work with MongoDB.
const mongoose=require("mongoose");
const initData=require("./data.js");//acquire file within same folder(init)
const Listing=require("../models/listing.js");//acquire file from different folder(models)

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

const initDB=async()=>{
    await Listing.deleteMany({});//delete all existing data in DB with no condition
    initData.data=initData.data.map((obj)=>({...obj,owner:'694ac6829160e55dd7fdc530'}));//make same owner for all listings, since map returns new array insted of adding in existing one
    await Listing.insertMany(initData.data);//insert all data(key) from data.js
    console.log("Data was initialised");
}

initDB();// call initDB function to perform deletion and insertion in database

