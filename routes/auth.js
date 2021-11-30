const express = require('express');
const { client, dbName } = require('../config/conectionMongoDB');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const passport = require('passport');
const PassportLocal = require('passport-local').Strategy;
const config = require('config');
const router = express.Router();

passport.use(new PassportLocal(
    async function (username, password, done) {
        await client.connect();
        //console.log('Conexion exitosa a SEC registro');
        const db = client.db(dbName);
        const collection = db.collection('Users');
        collection.findOne({ email: username ,password: password}, function (err, user) {
            if (!user.email) {
                return done(null, false, { message: 'Incorrect username.'});
            }
            if (!user.password) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
    await client.connect();
    //console.log('Conexion exitosa a SEC registro');
    const db = client.db(dbName);
    const collection = db.collection('Users');
    collection.findOne({_id:id}, function (err, user) {
        done(err, user);
    });
});


router.post('/login', 
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/auth',
        //failureFlash: true
    }))


module.exports = router;