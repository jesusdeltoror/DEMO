var express = require('express');
var {client,dbName}   = require('../config/conectionMongoDB');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'login'});
});

router.post('/register', function(req,res,next){
  registerUser(req.body.email,req.body.nombre,req.body.password)
  .then(function(user){
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
  const buscar  = await collection.findOne({email:email},{projection:{_id:0,email:1,nombre:1}});
  if(buscar===null){
    const usuario = collection.insertOne({email:email,nombre:nombre,password:password});
    return usuario;
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
