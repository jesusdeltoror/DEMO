const express   = require('express');
const jwt       = require('jsonwebtoken');
const config    = require('config');
const verificarToken = require('../middlewares/auth');
const router    = express.Router();




/* GET users listing. */
router.get('/',verificarToken, function(req, res, next) {
    res.render('home')
    //res.send("jalo")
});

module.exports = router;