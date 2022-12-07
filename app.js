//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");
// const encrypt = require('mongoose-encryption');

const app = express();

console.log(process.env.API_KEY);

app.set('view engine', 'ejs');
mongoose.set('strictQuery', true);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Mongoose Connection URL
mongoose.connect("mongodb://0.0.0.0:27017/userDB");


// Mongoose Schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});



// Secret String Instead of Two Keys
// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password','email'] });       ------- adding multiple field



// Mongoose model
const User = new mongoose.model("User", userSchema);



/////////////////////////////////////////////////----- Get Method -----////////////////////////////////////////////////////////// 




app.get("/", function(req, res){
    res.render("home");
});
app.get("/login", function(req, res){
    res.render("login");
});
app.get("/register", function(req, res){
    res.render("register");
});




/////////////////////////////////////////////////----- Post Method -----////////////////////////////////////////////////////////// 



app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });
    newUser.save(function(err){
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});



app.post("/login", function(req, res){
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email: username}, function(err, foundUser){
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    // console.log(foundUser.password);
                    res.render("secrets");
                }
            }
        }
    });
});







app.listen(3000, function() {
  console.log("Server started on port 3000");
});