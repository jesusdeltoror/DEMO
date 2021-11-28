var express           = require('express');
var {client,dbName}   = require('../config/conectionMongoDB');
var Joi               = require('joi');   
var router = express.Router();

//Validacion
const schema = Joi.object({
  nombre: Joi.string()
      .min(3)
      .max(30)
      .required(),

  password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

  email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'login'});
});

router.post('/register', function(req,res,next){
  registerUser(req.body.email,req.body.nombre,req.body.password)
  .then(function(user){
    console.log(user);
    res.render('home',{user})
  })
  .catch(console.error)
  .finally(() => client.close());

});

router.post('/login', function(req,res,next){
  loginUser(req.body.email,req.body.password);
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
    const usuario = await collection.insertOne({email:email,nombre:nombre,password:password});
    return User;
  }
  return "EL usuario ya existe"
}

//LOGIN USER
async function loginUser(email,password){
  await client.connect();
  console.log('Conexion exitosa a SEC registro');
  const db = client.db(dbName);
  const collection = db.collection('Users');

  return
}

module.exports = router;
