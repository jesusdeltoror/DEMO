const jwt               = require('jsonwebtoken');
const config            = require('config');

let verificarToken = function(req,res,next){
    let token = req.get('Authorization');
    jwt.verify(token, config.get('configToken.SEED'),function(err, decoded){
        if(err){
            return res.status(401).json({
                err,
                msj:"NO tienes token"
            });
        }
        //res.send(token)
        req.usuario = decoded.usuario;
        next();
    })
}

module.exports = verificarToken