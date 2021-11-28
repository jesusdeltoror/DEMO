const express   = require('express');
const jwt       = require('jsonwebtoken');
const config    = require('config');
const router    = express.Router();


let verificarToken = function(req,res,next){
    let token = req.get('Authorization');
    jwt.verify(token, config.get('configToken.SEED'),function(err, decoded){
        if(err){
            return res.status(401).json({
                err
            });
        }
        //res.send(token)
        req.usuario = decoded.usuario;
        next();
    })
}

/* GET users listing. */
router.get('/',verificarToken, function(req, res, next) {
    res.render('home')
    //res.send("jalo")
});

module.exports = router;