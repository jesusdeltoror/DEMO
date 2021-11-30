
const { client, dbName } = require('../config/conectionMongoDB');
const passport = require('passport');
const PassportLocal = require('passport-local').Strategy;

passport.use(new PassportLocal(
    async function (email, password, done) {
        await client.connect();
        //console.log('Conexion exitosa a SEC registro');
        const db = client.db(dbName);
        const collection = db.collection('Users');
        collection.findOne({ email: email }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.verifyPassword(password)) { return done(null, false); }
            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});