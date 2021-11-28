const {MongoClient} = require('mongodb');
const config        = require('config');

const url = config.get('configDB.HOST');
const client = new MongoClient(url);
const dbName = 'SEC';




module.exports = {client, dbName}