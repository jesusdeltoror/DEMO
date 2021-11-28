const express           = require('express');
const {client,dbName}   = require('../config/conectionMongoDB');
const Joi               = require('joi');  
const bcrypt            = require('bcrypt'); 
const jwt               = require('jsonwebtoken');
const config            = require('config');
const router            = express.Router();


router.post('/',function(req,res,next){
    client.connect();
    console.log('Conexion exitosa a SEC registro');
    const db = client.db(dbName);
    const collection = db.collection('Users');
    collection.findOne({email:req.body.email})
        .then(function(dato){
            if(dato){
                const passwordValido = bcrypt.compareSync(req.body.password, dato.password);
                if(!passwordValido){
                    return res.status(400).json({
                        error:'ok',
                        msj:"Ususario o Contraseña Incorrecta."
                    })
                }
                const jwToken = jwt.sign({
                    data: {_id: dato._id, nombre:dato.nombre,email:dato.email,profile:dato.profile}
                }, config.get('configToken.SEED'), { expiresIn: config.get('configToken.expiration') });
                res.json({
                    usuario:{
                        _id:dato._id,
                        nombre:dato.nombre,
                        email:dato.email,
                        profile:dato.profile
                    },
                    jwToken
                });
            }else{
                res.status(400).json({
                    error:'ok',
                    msj:"Ususario o Contraseña Incorrecta."
                })
            }
        })
        .catch(function(err){
            res.status(400).json({
                error:'ok',
                msj:"Erroro en "+err
            })
        })
});


module.exports = router;