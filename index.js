const express = require('express')
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var createError = require('http-errors')
const mongoose = require("mongoose");
const User = require("./Models/User");
const { authSchema } = require('./helpers/validation_schema');
const {signAccessToken,verifyAccessToken, verifyToken, signToken} = require('./helpers/jwt_helpers');
const connectDB = require('./helpers/connect_db');
const app = express()
const port = process.env.PORT || 7070
app.use(session({ secret: process.env.ACCESS_TOKEN_SECRET }));
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `http://localhost:${port}/api/auth/google/callback`
},
function(accessToken, refreshToken, profile, cb) {
  //below we check if the user exists in our database

  return cb(null, {profile});
}

));
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());


function createVerifyToken() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 10; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/api/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log("google auth success");
    //get the token from the user object
    const token = req.user.token;
    //generate access token
  User.findOne({ googleId: req.user.profile.id }, async function (err, user) {
    if (err) {
      return res.send(err);
    }
    //if the user exists, we return the user
    if (user) {
      const accessToken = await signAccessToken(user.id);
      res.redirect(`http://localhost:3000/?token=${accessToken}`);

      console.log("user exists: " + accessToken)
    } else {

      //if the user does not exist, we create a new user
      const newUser = new User({
        googleId: req.user.profile.id,
        email: req.user.profile.emails[0].value,
        name: req.user.profile.displayName,
        verifyToken: createVerifyToken(),
        isVerified: false
      });
      newUser.save(async function (err) {
        if (err) {
          return res.send(err);
        }
        const accessToken = await signAccessToken(newUser.id);
        res.redirect(`http://localhost:3000/?token=${accessToken}`);
        console.log("user created: " + accessToken)

      });
    }


  });
  });


app.get('/api', (req, res) => {
  res.send('Hello World!')
})
app.post('/api/auth/login', async(req, res,next) => {
    try {
      const result = await authSchema.validateAsync(req.body);
      const user = await User.findOne({email: result.email});
      if(!user) throw createError.NotFound("User not registered");
      const isMatch = await user.isValidPassword(result.password);
      if(!isMatch) throw createError.Unauthorized("Username/password not valid");
      const accessToken = await signAccessToken(user.id);
      res.send({accessToken});
    } catch (error) {
      if(error.isJoi === true) error.status = 422;
      next(error);
    }
})
app.post('/api/auth/register', async(req, res, next) => {

    try{
      const {email,name,password} = req.body;
      const {error} = await authSchema.validateAsync({email,password});
        if(error){
            throw new Error(error);
        }
        const doesExist = await User.findOne({
            email
        });
        if(doesExist){
            throw new Error("User already exists");
        }

        const user = new User({
            email,
            password,
            name,
            verification: createVerifyToken()
        });
        const savedUser = await user.save();
        const accessToken = await signAccessToken(savedUser.id);
        console.log("user has been saved:");
        console.log(savedUser);
        res.send({accessToken});
    }catch(error){
        if(error.isJoi === true) error.status = 422;
        next(error);
    }

})
app.post('/api/user/update',verifyAccessToken, (req, res) => {
    
})

app.get("/api/service/generate",verifyAccessToken, (req, res) =>{
  res.send("you must be logged in to see this");
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})