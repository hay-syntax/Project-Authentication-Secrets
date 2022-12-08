//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");



// ----------------------------------------------------------------------------------------------------------------------
// Using bcryptjs (Level-4 Security)
// const bcrypt = require('bcryptjs');
// const salt = bcrypt.genSaltSync(10); 
// ----------------------------------------------------------------------------------------------------------------------
// const md5 = require("md5");
// ----------------------------------------------------------------------------------------------------------------------
// const encrypt = require('mongoose-encryption');
// ----------------------------------------------------------------------------------------------------------------------



const app = express();

// console.log(process.env.API_KEY);

app.set('view engine', 'ejs');
mongoose.set('strictQuery', true);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Mongoose Connection URL
mongoose.connect("mongodb://0.0.0.0:27017/userDB");


// Mongoose Schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

// ----------------------------------------------------------------------------------------------------------------------

// Secret String Instead of Two Keys
// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password','email'] });       ------- adding multiple field

// ----------------------------------------------------------------------------------------------------------------------

// Mongoose model
const User = new mongoose.model("User", userSchema);

// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


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

app.get("/secrets", function(req, res){
    if (req.isAuthenticated()){
        res.render("secrets");
    } else {
        res.redirect("/login");
    }
});

app.get("/logout", function(req, res){
    req.logout(function(err){
        if (err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});




/////////////////////////////////////////////////----- Post Method -----////////////////////////////////////////////////////////// 



app.post("/register", function(req, res){

    User.register({username: req.body.username}, req.body.password, function(err, user){
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/secrets");
            });
        }
    });

});



app.post("/login", function(req, res){

    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.logIn(user, function(err){
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/secrets");
            });
        }
    });

});







app.listen(3000, function() {
  console.log("Server started on port 3000");
});