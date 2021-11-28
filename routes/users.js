var express           = require('express');
var {client,dbName}   = require('../config/conectionMongoDB');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;
