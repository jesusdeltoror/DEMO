const express = require('express');
const config = require('config');
const passport = require('passport');
const PassportLocal = require('passport-local').Strategy;
const { client, dbName } = require('../config/conectionMongoDB');

const router = express.Router();

passport.serializeUser(function (user, done) {
    done(null, user._id);
})


passport.deserializeUser(async function (id, done) {
    await client.connect();
    //console.log('Conexion exitosa a SEC registro');
    const db = client.db(dbName);
    const collection = db.collection('Users');
    collection.findOne({_id:id}, function (err, user) {
        console.log("======"+user.email);
        done(err, user);
    });
});

/* lOGOUT */
router.get('/logout', function (req, res) {
    
    req.logout();
    res.redirect('/auth/login');
});





/* GET users listing. */
router.get('/',
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    })

);
    

module.exports = router;