var express           = require('express');
var {client,dbName}   = require('../config/conectionMongoDB');
var Joi               = require('joi');  
var bcrypt            = require('bcrypt'); 
var router = express.Router();

//Validacion
const schema = Joi.object({
  nombre: Joi.string()
      .min(3)
      .max(30)
      .required(),

  password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')),

  email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'login'});
});

router.post('/register', function(req,res,next){
  const {error,value} = schema.validate({nombre:req.body.nombre, email:req.body.email, password: req.body.password});
  if(!error){
    resultado = registerUser(req.body.email,req.body.nombre,req.body.password)
    
    resultado
    .then(function(user){
      res.render('home',{user})
    })
    .catch(console.error)
    .finally(() => client.close());
  }else{
    res.render('login',{
      error,
      msj:{
        email:"El email tiene que tener la siguiente estructura *****@*****.***",
        password:"El password tiene que tener una longitud minima de 8 caracteres y maxima de 30, puede contener numeros y letras tanto mayusculas como minisculas"
      } 
    });  
  }



});



//REGISTER USER
async function registerUser(email,nombre,password) {
  await client.connect();
  console.log('Conexion exitosa a SEC registro');
  const db = client.db(dbName);
  const collection = db.collection('Users');
  const User = {email,nombre}
  const buscar  = await collection.findOne({email:email},{projection:{_id:0,email:1,nombre:1}});
  if(buscar===null){
    const usuario = await collection.insertOne({email:email,nombre:nombre,profile:undefined,password:bcrypt.hashSync(password,10)});
    return User;
  }
  return "EL usuario ya existe"
}


module.exports = router;
